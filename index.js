// A multi-tenant application is customized for every group of users (so-called tenants) 
// while the entire architecture and core functionality remain the same.
// multi-tenant апликација е кога сме најавени и системот има податоци за нас
// примери за multi-tenant апликации се социјалните мрежи
const express = require('express');
const authors = require('./handlers/authors');
const posts = require('./handlers/posts');
const db = require('./pkg/db');
const config = require('./pkg/config');
const {expressjwt : jwt} = require('express-jwt');
require('dotenv').config();

db.init();

const api = express();

api.use(express.json());
api.use(jwt({
    algorithms: ['HS256'],
    secret: config.get('service').jwt_secret
}));

api.get('/authors', authors.getAll);
api.get('/posts', posts.getAll);
api.get('/posts/me', posts.getMine);
api.get('/posts/:handle', posts.getUsers);

api.post('/posts', posts.create);
api.put('/posts/:id', posts.update);
api.delete('/posts/:id', posts.remove);

api.use(function (err, req, res, next) {
    if(err.name === "UnauthorizedError") {
        res.status(401).send("Invalid token...");
    } else {
        next(err);
    }
});

api.listen(process.env.PORT, err => {
    if(err) {
        return console.log(err);
    }
    console.log(`Service authentication successfully started on port ${process.env.PORT}!`);
});

// за дома - преку update и remove да можам само моите постови да ги ажурирам и бришам, да не може туѓите постови
