import axios from 'axios';

const config = {
    url: 'http://localhost:4000/graphql',
    method: 'post'
};

const query = (query, options) => {
    return new Promise((resolve, reject) => {
        axios(Object.assign({}, {data: {query: 'query ' + query}}, config, options))
            .then(res => {
                resolve(res.data.data);
            }).catch(err => {
            reject(err);
        });
    });
};

const mutation = (query, options) => {
    return new Promise((resolve, reject) => {
        axios(Object.assign({}, {data: {query: 'mutation ' + query}}, config, options))
            .then(res => {
                resolve(res.data.data);
            }).catch(err => {
            reject(err);
        });
    });
};

export {query, mutation};