const Query = {
    users(parent, args, {
        db
    }, info) {
        if (!args.query)
            return db.users;

        return db.users.filter(user => user.name.toLowerCase().includes(args.query.toLowerCase()))
    },
    me() {
        return {
            id: '123123',
            name: 'Christian Angelo',
            email: 'ca123@msn.com',
            age: 24
        }
    },
    posts(parent, args, {
        db
    }, info) {
        if (!args.query)
            return db.posts;
        return db.posts.filter(post => (post.body + post.title).toLowerCase().includes(args.query.toLowerCase()));
    }
}

export {
    Query as
    default
};