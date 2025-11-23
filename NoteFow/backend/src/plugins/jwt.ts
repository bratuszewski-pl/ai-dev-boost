import fp from 'fastify-plugin';
import { FastifyPluginAsync, FastifyReply, FastifyRequest } from 'fastify';
import jwt from 'jsonwebtoken';

declare module 'fastify' {
    interface FastifyInstance {
        authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
    }
}

const jwtPlugin: FastifyPluginAsync = fp(async (server, options) => {
    server.decorate('authenticate', async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const authHeader = request.headers.authorization;
            if (!authHeader) {
                throw new Error('No token provided');
            }

            const token = authHeader.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecretkey');
            (request as any).user = decoded;
        } catch (err) {
            reply.code(401).send({ message: 'Unauthorized' });
        }
    });
});

export default jwtPlugin;
