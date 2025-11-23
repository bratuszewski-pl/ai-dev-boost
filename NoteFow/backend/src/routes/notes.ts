import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import z from 'zod';
import { analyzeContent, indexNote, searchNotes } from '../services/ai';

const notesRoutes: FastifyPluginAsync = async (server) => {
    const app = server.withTypeProvider<ZodTypeProvider>();

    // Create Note
    app.post(
        '/',
        {
            onRequest: [server.authenticate],
            schema: {
                body: z.object({
                    content: z.object({
                        text: z.string().max(2000),
                        links: z.array(z.string().url()).optional(),
                        images: z.array(z.any()).optional(), // Placeholder for image metadata
                    }),
                    categoryId: z.string().optional(),
                    tags: z.array(z.string()).optional(),
                }),
            },
        },
        async (request, reply) => {
            const { content, categoryId, tags } = request.body;
            const user = (request as any).user;

            // 1. Create Note in DB
            const note = await server.prisma.note.create({
                data: {
                    userId: user.id,
                    content: {
                        text: content.text,
                        links: content.links || [],
                        images: content.images || [],
                    },
                    title: content.text.split('\n')[0].substring(0, 100), // Simple title extraction
                    categoryId,
                    tags: tags || [],
                    aiAnalysisStatus: 'pending',
                },
            });

            // 2. Trigger AI Analysis (Async)
            // In a real app, use a queue. Here we just fire and forget or await if fast enough.
            // We'll do it in background to not block response.
            (async () => {
                try {
                    const analysis = await analyzeContent(content.text);

                    // Handle Category
                    let finalCategoryId = categoryId;
                    let categoryName = analysis.categoryName;

                    if (!categoryId && categoryName) {
                        // Find or create category
                        let category = await server.prisma.category.findUnique({
                            where: {
                                userId_name: {
                                    userId: user.id,
                                    name: categoryName,
                                },
                            },
                        });

                        if (!category) {
                            category = await server.prisma.category.create({
                                data: {
                                    userId: user.id,
                                    name: categoryName,
                                },
                            });
                        }
                        finalCategoryId = category.id;
                    }

                    // Index in Qdrant
                    const vectorId = await indexNote(note.id, content.text, user.id, {
                        categoryId: finalCategoryId,
                        tags: tags || [],
                    });

                    // Update Note
                    await server.prisma.note.update({
                        where: { id: note.id },
                        data: {
                            keywords: analysis.keywords,
                            categoryId: finalCategoryId,
                            categoryName: categoryName,
                            vectorId,
                            aiAnalysisStatus: 'completed',
                        },
                    });
                } catch (err) {
                    console.error('AI Analysis failed for note', note.id, err);
                    await server.prisma.note.update({
                        where: { id: note.id },
                        data: { aiAnalysisStatus: 'failed' },
                    });
                }
            })();

            return reply.code(201).send({ message: 'Note created', note });
        }
    );

    // Get Notes
    app.get(
        '/',
        {
            onRequest: [server.authenticate],
            schema: {
                querystring: z.object({
                    page: z.coerce.number().default(1),
                    limit: z.coerce.number().default(20),
                    categoryId: z.string().optional(),
                    search: z.string().optional(), // Simple keyword search
                }),
            },
        },
        async (request, reply) => {
            const { page, limit, categoryId, search } = request.query;
            const user = (request as any).user;
            const skip = (page - 1) * limit;

            const where: any = { userId: user.id };
            if (categoryId) where.categoryId = categoryId;
            if (search) {
                where.OR = [
                    { title: { contains: search, mode: 'insensitive' } },
                    { keywords: { has: search } },
                ];
            }

            const [notes, total] = await Promise.all([
                server.prisma.note.findMany({
                    where,
                    skip,
                    take: limit,
                    orderBy: { createdAt: 'desc' },
                }),
                server.prisma.note.count({ where }),
            ]);

            return { notes, pagination: { page, limit, total, hasMore: skip + notes.length < total } };
        }
    );

    // Get Single Note
    app.get(
        '/:id',
        {
            onRequest: [server.authenticate],
            schema: {
                params: z.object({
                    id: z.string(),
                }),
            },
        },
        async (request, reply) => {
            const { id } = request.params;
            const user = (request as any).user;

            const note = await server.prisma.note.findUnique({
                where: { id },
            });

            if (!note || note.userId !== user.id) {
                return reply.code(404).send({ message: 'Note not found' });
            }

            return { note };
        }
    );

    // Semantic Search
    app.get(
        '/search/semantic',
        {
            onRequest: [server.authenticate],
            schema: {
                querystring: z.object({
                    query: z.string(),
                    limit: z.coerce.number().default(10),
                }),
            },
        },
        async (request, reply) => {
            const { query, limit } = request.query;
            const user = (request as any).user;

            try {
                const results = await searchNotes(query, user.id, limit);

                // Fetch full notes from DB
                const noteIds = results.map((r) => r.payload?.noteId as string).filter(Boolean);
                const notes = await server.prisma.note.findMany({
                    where: {
                        id: { in: noteIds },
                    },
                });

                // Map back to preserve order/score
                const searchResults = results.map((r) => {
                    const note = notes.find((n) => n.id === r.payload?.noteId);
                    return { ...note, score: r.score };
                }).filter((r) => r.id); // Filter out any missing notes

                return { results: searchResults };
            } catch (err) {
                server.log.error(err);
                return reply.code(500).send({ message: 'Search failed' });
            }
        }
    );
};

export default notesRoutes;
