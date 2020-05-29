import getUserId from '../utils/getUserId';

const USER_ID_FRAG = 'fragment userId on User { id }';

const User = {
    email: {
        fragment: USER_ID_FRAG,
        resolve(parent, args, {
            request
        }, info) {
            const userId = getUserId(request, false);
            if (userId && parent.id === userId) {
                return parent.email;
            }
            return null;
        }
    },
    posts: {
        fragment: USER_ID_FRAG,
        resolve(parent, args, {
            request,
            prisma
        }, info) {
            return prisma.query.posts({
                where: {
                    published: true,
                    author: {
                        id: parent.id
                    }
                }
            });
        }
    }
};

export {
    User as
    default
};