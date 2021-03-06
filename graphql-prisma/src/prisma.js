import { Prisma } from 'prisma-binding';

import { fragmentReplacements } from './resolvers';

const prisma = new Prisma({
    typeDefs: 'src/generated/prisma.graphql',
    endpoint: 'http://192.168.99.100:4466',
    secret: 'thisismysupersecrettext',
    fragmentReplacements
});

export {
    prisma as
    default
};

const createPost = async (authorId, data) => {
    const userExists = await prisma.exists.User({
        id: authorId
    });

    if (!userExists)
        throw new Error('User not found')

    const post = await prisma.mutation.createPost({
        data: {
            ...data,
            author: {
                connect: {
                    id: authorId
                }
            }
        }
    }, '{ id author { id name email posts { id title published }}}');
    return post.author;
}

const updatePost = async (postId, data) => {
    const postExists = prisma.exists.Post({
        id: 'postId'
    });

    if (!postExists)
        throw new Error('Post not found');

    const post = await prisma.mutation.updatePost({
        where: {
            id: postId
        },
        data
    }, '{ author { id posts { id title published } } }');
    return post.author;
}