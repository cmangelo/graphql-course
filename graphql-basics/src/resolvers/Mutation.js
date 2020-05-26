import { v4 as uuid } from 'uuid';

const Mutation = {
    createUser(parent, args, {
        db
    }, info) {
        const emailTaken = db.users.some(user => user.email.toLowerCase() === args.data.email.toLowerCase());

        if (emailTaken)
            throw new Error('Email already in use')

        const user = {
            ...args.data,
            id: uuid()
        };
        db.users.push(user);
        return user;
    },
    updateUser(parent, args, {
        db
    }, info) {
        const {
            id,
            data
        } = args;
        const user = db.users.find(user => user.id === id);
        if (!user)
            throw new Error('User not found');

        if (typeof data.email === 'string') {
            const emailTaken = db.users.some(user => user.email === data.email);
            if (emailTaken)
                throw new Error('Email taken')

            user.email = data.email;
        }

        if (typeof data.name === 'string') {
            user.name = data.name;
        }

        if (typeof data.age !== 'undefined') {
            user.age = data.age;
        }

        return user;
    },
    createPost(parent, args, {
        db,
        pubsub
    }, info) {
        const userExists = db.users.some(user => user.id === args.data.author);

        if (!userExists)
            throw new Error('User does not exist')

        const post = {
            ...args.data,
            id: uuid()
        };
        db.posts.push(post);

        if (args.data.published)
            pubsub.publish('post', {
                post: {
                    mutation: 'CREATED',
                    data: post
                }
            });
        return post;
    },
    updatePost(parent, args, {
        db,
        pubsub
    }, info) {
        const {
            id,
            data
        } = args;
        const post = db.posts.find(post => post.id === id);
        const originalPost = {
            ...post
        };

        if (!post)
            throw new Error('Post not found');

        if (typeof data.title === 'string') {
            post.title = data.title;
        }
        if (typeof data.body === 'string') {
            post.body = data.body;
        }
        if (typeof data.published === 'boolean') {
            post.published = data.published;

            if (originalPost.published && !post.published) {
                pubsub.publish('post', {
                    post: {
                        mutation: 'DELETED',
                        data: originalPost
                    }
                });
            } else if (!originalPost.published && post.published) {
                pubsub.publish('post', {
                    post: {
                        mutation: 'CREATED',
                        data: post
                    }
                });
            }
        } else if (post.published) {
            pubsub.publish('post', {
                post: {
                    mutation: 'UPDATED',
                    data: post
                }
            });
        }


        return post;
    },
    createComment(parent, args, {
        db,
        pubsub
    }, info) {
        const postExists = db.posts.find(post => post.id === args.data.post && post.published);
        const authorExists = db.users.some(user => user.id === args.data.author);

        if (!postExists || !authorExists)
            throw new Error('Post or author does not exist');

        const comment = {
            ...args.data,
            id: uuid()
        };

        db.comments.push(comment);
        pubsub.publish(`comment ${args.data.post}`, {
            comment: {
                mutation: 'CREATED',
                data: comment
            }
        });
        return comment;
    },
    updateComment(parent, args, {
        db,
        pubsub
    }, info) {
        const {
            id,
            data
        } = args;
        const comment = db.comments.find(comment => comment.id === id);

        if (!comment)
            throw new Error('Comment not found')

        if (typeof data.comment === 'string') {
            comment.comment = data.comment;
        }

        pubsub.publish(`comment ${comment.post}`, {
            comment: {
                mutation: 'UPDATED',
                data: comment
            }
        });

        return comment;
    },
    deleteUser(parent, args, {
        db
    }, info) {
        const userIndex = db.users.findIndex(user => user.id === args.id);
        if (userIndex === -1)
            throw new Error('User not found');

        const deleted = db.users.splice(userIndex, 1)[0];
        db.posts = db.posts.filter(post => {
            const toDelete = post.author === args.id;
            if (toDelete)
                db.comments = db.comments.filter(comment => comment.post !== post.id);

            return !toDelete;
        });
        db.comments = db.comments.filter(comment => comment.author !== args.id);

        return deleted;
    },
    deletePost(parent, args, {
        db,
        pubsub
    }, info) {
        const postIndex = db.posts.findIndex(post => post.id === args.id);
        if (postIndex === -1)
            throw new Error('Post not found');

        const [deleted] = db.posts.splice(postIndex, 1);
        db.comments = db.comments.filter(comment => comment.post !== args.id);

        if (deleted.published)
            pubsub.publish('post', {
                post: {
                    mutation: 'DELETED',
                    data: deleted
                }
            });

        return deleted;
    },
    deleteComment(parent, args, {
        db,
        pubsub
    }, info) {
        const commentIndex = db.comments.findIndex(comment => comment.id === args.id);

        if (commentIndex === -1)
            throw new Error('Comment not found');

        const [deleted] = db.comments.splice(commentIndex, 1);
        pubsub.publish(`comment ${deleted.post}`, {
            comment: {
                mutation: 'DELETED',
                data: comment
            }
        });
        return deleted;
    }
};

export {
    Mutation as
    default
};