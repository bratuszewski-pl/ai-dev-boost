import Fastify, { FastifyRequest, FastifyReply } from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import dotenv from 'dotenv';
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';
import prismaPlugin from './plugins/prisma';
import jwtPlugin from './plugins/jwt';
import authRoutes from './routes/auth';
import notesRoutes from './routes/notes';

dotenv.config();

const server = Fastify({
    logger: true,
});

// Add schema validator and serializer
server.setValidatorCompiler(validatorCompiler);
server.setSerializerCompiler(serializerCompiler);

// Register plugins
server.register(cors, {
    origin: '*', // Configure this for production
});
server.register(helmet);
server.register(prismaPlugin);
server.register(jwtPlugin);

server.register(authRoutes, { prefix: '/api/auth' });
server.register(notesRoutes, { prefix: '/api/notes' });

// Register routes (placeholder)
server.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
    return { status: 'ok', message: 'NoteFow API is running' };
});

const start = async () => {
    try {
        const port = parseInt(process.env.PORT || '3001');
        await server.listen({ port, host: '0.0.0.0' });
        console.log(`Server listening on port ${port}`);
    } catch (err) {
        server.log.error(err);
        process.exit(1);
    }
};

start();
