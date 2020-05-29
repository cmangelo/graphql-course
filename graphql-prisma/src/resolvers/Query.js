import getUserId from '../utils/getUserId';

const Query = {
    users(parent, args, {
        prisma
    }, info) {
        const opArgs = {};

        if (args.query) {
            opArgs.where = {
                OR: [{
                    name_contains: args.query
                }]
            }
        }

        return prisma.query.users(opArgs, info); //info is the set of scalar types that you want to grab for this user
    },
    posts(parent, args, {
        prisma
    }, info) {
        const opArgs = {
            where: {
                published: true
            }
        };
        if (args.query) {
            opArgs.where.OR = [{
                title_contains: args.query
            }, {
                body_contains: args.query
            }];
        }
        return prisma.query.posts(opArgs, info);
    },
    myPosts(parent, args, {
        prisma,
        request
    }, info) {
        const userId = getUserId(request);
        const opArgs = {
            where: {
                author: {
                    id: userId
                }
            }
        };

        if (args.query) {
            opArgs.where.OR = [{
                title_contains: args.query
            }, {
                body_contains: args.query
            }];
        }
        return prisma.query.posts(opArgs, info)
    },
    comments(parent, args, {
        prisma
    }, info) {
        const opArgs = {};
        if (args.query) {
            opArgs.where = {
                text_contains: args.query
            }
        }
        return prisma.query.comments(opArgs, info);
    },
    async post(parent, args, {
        request,
        prisma
    }, info) {
        const userId = getUserId(request, false);
        const posts = await prisma.query.posts({
            where: {
                id: args.id,
                OR: [{
                    published: true
                }, {
                    author: {
                        id: userId
                    }
                }]
            }
        }, info);
        if (posts.length === 0)
            throw new Error('Post not found')
        return posts[0];
    },
    me(parent, args, {
        request,
        prisma
    }, info) {
        const userId = getUserId(request);
        return prisma.query.users({
            id: userId
        }, info);
    }
}

export {
    Query as
    default
};