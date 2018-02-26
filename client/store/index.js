const Vuex = require('vuex');
const axios = require('axios');
const gql = require('graphql-tag');
const graphClient = require('../graphClient');

// TODO: login user if session cookie exists

const createStore = () => {
    return new Vuex.Store({
        state: {
            counter: 0,
            user: null
        },
        mutations: {
            SET_USER (state, {user}) {
                state.user = user;
            }
        },
        actions: {
            // nuxtServerInit is called by Nuxt.js before server-rendering every page
            nuxtServerInit({commit}, {req}) {
                if (req.session && req.session.auth) {
                    commit('SET_USER', req.session.auth)
                }
            },
            login (store, payload) {
                // call internal login API and pass payload
                axios.post('/api/login', payload).then(res => {
                    store.commit('SET_USER', {user: res.data});
                });
            },
            register (store, payload) {
                let {name, email, username, password} = payload;
                graphClient.mutation(`{
                    register(name:"${name}",username:"${username}",email:"${email}",password:"${password}") {
                        id
                        name
                        username
                        email
                    }
                }`).then(res => console.log(res));
                /*
                let client = this.app.apolloProvider.defaultClient;
                // call graphql mutation
                client.mutate({
                    mutation: gql`mutation ($name: String!, $username: String!, $password: String!, $email: String!) {
                                    register(name: $name, email: $email, username: $username, password: $password) {
                                      name
                                    }
                                  }`,
                    variables: {name, email, username, password},
                    optimisticResponse: {
                        __typename: 'Mutation',
                        login: {
                            __typename: 'User',
                            token: 'null',
                        },
                    },
                })
                .then(res => {
                    // Result
                    let data = res.data;
                    console.log(data);
                    if (data && data.login && data.login.token) {
                        commit('SET_TOKEN', {token: data.login.token});
                        // set cookie with token
                    }
                })
                .catch((error) => {
                    // Error
                    console.error(error);
                    // We restore the initial user input
                    //this.newTag = newTag
                });
                */
            }
        }
    })
};

export default createStore