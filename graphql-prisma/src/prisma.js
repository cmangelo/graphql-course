import { Prisma } from 'prisma-binding';

const prisma = new Prisma({
    typeDefs: 'src/generated/prisma.graphql',
    endpoint: 'http://192.168.99.100:4466'
});

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

// createPost('ckane0nv0004y0719wmtpa1b3', {
//     title: 'Great books to read',
//     body: "the ware of are",
//     published: true
// }).then(user => {
//     console.log(JSON.stringify(user, undefined, 4));
// }).catch(err => {
//     console.log(err)
// });

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

updatePost('ckao5q9mr006q0719sebhk2n5', {
    published: false
}).then(user => {
    console.log(JSON.stringify(user, undefined, 4))
}).catch(err => {
    console.log(err)
})