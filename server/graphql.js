const { makeExecutableSchema } = require('graphql-tools');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const uuid = require('uuid/v4');
const fs = require('fs');
const db = require('./db.json');
const secrets = require('../secrets');

const typeDefs = `
    type Query {
        users: [User],
        posts: [Post],
        me: User
    }
    type Mutation {
        register(name: String!, username: String!, password: String!, email: String!): User
        login(username: String!, password: String!): LoginUserResult
        setSessionId(token: String!): SetSessionIdResult 
    }
    type LoginUserResult { token: String }
    type SetSessionIdResult { isSaved: Boolean, id: String, name: String, username: String, email: String }
    type User { id: String, name: String, username: String, email: String, posts: [Post] }
    type Post { id: Int, title: String, user: User!}
`;

// The resolvers
const resolvers = {
    Query: {
        users: () => db.users,
        me: (root, args, context, resolverData) => {
            return new Promise((resolve, reject) => {
                // context should have id
                console.log(context);
            // find user with this is
            });
        },
        posts: () => db.posts
    },
    Mutation: {
        register: (root, args, context, resolverData) => {
            return new Promise ((resolve, reject) => {
                const {name, username, password, email} = args;
                // validate
                if (name && username && password && email) {
                    // hash password
                    bcrypt.hash(password, 10, (err, hash) => {
                        // create uuid
                        const user = {
                            id: uuid(),
                            password: hash,
                            name: name,
                            username: username,
                            email: email
                        };
                    // add to db
                    db.users.push(user);
                    fs.writeFileSync('db.json', JSON.stringify(db, null, "\t"), 'utf-8');
                    // return user
                    resolve(user);
                });
            } else {
                reject(new Error ("cannot create user"));
            }
        });
        },
        login: (root, args, context, resolverData) => {
            return new Promise((resolve, reject) => {
                const {username, password} = args;
                // find user
                if (user = db.users.find(x => x.username === username)) {
                    // compare password
                    bcrypt.compare(password, user.password, (err, passwordMatch) => {
                        if (passwordMatch) {
                            // create jwt with user id
                            const token = jwt.sign({id: user.id}, secrets.jwt);
                            // return jwt
                            resolve({token});
                        } else {
                            reject(new Error ("username or password mismatch"));
                        }
                    });
                } else {
                    reject(new Error ("username or password mismatch"));
                }
            });
        },
        setSessionId: (root, {token}, context) => {
            return new Promise((resolve, reject) => {
                const userSessionData = jwt.verify(token, secrets.jwt);
                // find user
                if (user = db.users.find(x => x.id === userSessionData.userId)) {
                    // compare password
                    user.session = userSessionData.sessionId;
                    fs.writeFileSync('db.json', JSON.stringify(db, null, "\t"), 'utf-8');
                    resolve({isSaved: true, id: user.id, name: user.name, username: user.username, email: user.email});
                } else {
                    reject(new Error ("no user found"));
                }
            });
        }
    }
};

// Put together a schema
module.exports = makeExecutableSchema({
    typeDefs,
    resolvers,
});