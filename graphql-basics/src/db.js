const users = [{
    id: '1',
    name: 'Christian',
    email: 'me@me.com',
    age: 24
}, {
    id: '2',
    name: 'Chris',
    email: 'me@me2.com'
}, {
    id: '3',
    name: 'Christina',
    email: 'me@me3.com',
    age: 27
}];

const posts = [{
    id: '11',
    body: 'body 1',
    title: 'title 1',
    published: true,
    author: '1'
}, {
    id: '12',
    body: 'body 2',
    title: 'title 2',
    published: true,
    author: '1'
}, {
    id: '13',
    body: 'body 3',
    title: 'title 3',
    published: true,
    author: '2'
}]

const comments = [{
    id: '33',
    comment: 'this is my first comment',
    author: '3',
    post: '12'
}, {
    id: '34',
    comment: 'this is my second comment',
    author: '1',
    post: '12'
}, {
    id: '35',
    comment: 'this is my third comment',
    author: '1',
    post: '13'
}, {
    id: '36',
    comment: 'this is my fourth comment',
    author: '2',
    post: '11'
}];

const db = {
    users,
    posts,
    comments
};

export {
    db as
    default
};