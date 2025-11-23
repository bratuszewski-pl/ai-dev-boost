import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import z from 'zod';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const authRoutes: FastifyPluginAsync = async (server) => {
    const app = server.withTypeProvider<ZodTypeProvider>();

    // Register
    app.post(
        '/register',
        {
            schema: {
                body: z.object({
                    username: z.string().min(3),
                    password: z.string().min(8),
                }),
            },
        },
        async (request, reply) => {
            const { username, password } = request.body;

            const existingUser = await server.prisma.user.findUnique({
                where: { username },
            });

            if (existingUser) {
                return reply.code(409).send({ message: 'Username already exists' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const user = await server.prisma.user.create({
                data: {
                    username,
                    password: hashedPassword,
                },
            });

            return reply.code(201).send({
                message: 'User registered successfully',
                user: { id: user.id, username: user.username, createdAt: user.createdAt },
            });
        }
    );

    // Login
    app.post(
        '/login',
        {
            schema: {
                body: z.object({
                    username: z.string(),
                    password: z.string(),
                }),
            },
        },
        async (request, reply) => {
            const { username, password } = request.body;

            const user = await server.prisma.user.findUnique({
                where: { username },
            });

            if (!user) {
                return reply.code(401).send({ message: 'Invalid credentials' });
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);

            if (!isPasswordValid) {
                return reply.code(401).send({ message: 'Invalid credentials' });
            }

            const token = jwt.sign(
                { id: user.id, username: user.username },
                process.env.JWT_SECRET || 'supersecretkey',
                { expiresIn: '24h' }
            );

            return {
                message: 'Login successful',
                token,
                user: { id: user.id, username: user.username },
            };
        }
    );

    // Me
    app.get(
        '/me',
        {
            onRequest: [server.authenticate],
        },
        async (request, reply) => {
            const user = (request as any).user;
            return { user };
        }
    );
};

export default authRoutes;
