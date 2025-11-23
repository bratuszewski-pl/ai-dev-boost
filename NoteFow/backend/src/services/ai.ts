import OpenAI from 'openai';
import { QdrantClient } from '@qdrant/js-client-rest';
import { v4 as uuidv4 } from 'uuid';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const qdrant = new QdrantClient({
    url: process.env.QDRANT_URL,
    apiKey: process.env.QDRANT_API_KEY,
});

const COLLECTION_NAME = 'notes';

export async function initQdrant() {
    try {
        const collections = await qdrant.getCollections();
        const exists = collections.collections?.some((c) => c.name === COLLECTION_NAME);

        if (!exists) {
            await qdrant.createCollection(COLLECTION_NAME, {
                vectors: {
                    size: 1536, // OpenAI text-embedding-3-small size
                    distance: 'Cosine',
                },
            });
        }
    } catch (error) {
        console.error('Error initializing Qdrant:', error);
    }
}

export async function generateEmbedding(text: string) {
    const response = await openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: text,
    });
    return response.data[0].embedding;
}

export async function analyzeContent(text: string) {
    const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
            {
                role: 'system',
                content: `Analyze the following note content. Return a JSON object with:
        - keywords: array of 5-10 relevant keywords (strings)
        - categoryName: a suggested category name (string)
        `,
            },
            {
                role: 'user',
                content: text,
            },
        ],
        response_format: { type: 'json_object' },
    });

    const content = response.choices[0].message.content;
    if (!content) throw new Error('No content from OpenAI');
    return JSON.parse(content) as { keywords: string[]; categoryName: string };
}

export async function indexNote(noteId: string, text: string, userId: string, metadata: any) {
    const embedding = await generateEmbedding(text);
    const vectorId = uuidv4();

    await qdrant.upsert(COLLECTION_NAME, {
        points: [
            {
                id: vectorId,
                vector: embedding,
                payload: {
                    noteId,
                    userId,
                    ...metadata,
                },
            },
        ],
    });

    return vectorId;
}

export async function searchNotes(query: string, userId: string, limit = 10) {
    const embedding = await generateEmbedding(query);

    const results = await qdrant.search(COLLECTION_NAME, {
        vector: embedding,
        filter: {
            must: [
                {
                    key: 'userId',
                    match: {
                        value: userId,
                    },
                },
            ],
        },
        limit,
    });

    return results;
}
