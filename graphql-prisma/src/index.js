import { GraphQLServer, PubSub } from 'graphql-yoga';

import db from './db';
import prisma from './prisma';
import Comment from './resolvers/Comment';
import Mutation from './resolvers/Mutation';
import Post from './resolvers/Post';
import Query from './resolvers/Query';
import Subscription from './resolvers/Subscription';
import User from './resolvers/User';

const pubsub = new PubSub();

const server = new GraphQLServer({
    typeDefs: './src/schema.graphql',
    resolvers: {
        Query,
        Mutation,
        Subscription,
        Post,
        User,
        Comment
    },
    context(request) {
        return {
            db,
            pubsub,
            prisma,
            request
        }
    }
});

server.start(() => {
    console.log('running')
});