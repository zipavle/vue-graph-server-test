require('source-map-support/register')
module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

var express = __webpack_require__(1);
var bodyParser = __webpack_require__(2);
var session = __webpack_require__(3);

var _require = __webpack_require__(4),
    Nuxt = _require.Nuxt,
    Builder = _require.Builder;

var jwt = __webpack_require__(5);
var graphClient = __webpack_require__(6);
var secrets = __webpack_require__(8);

// setup up server variables
var app = express();
var host = process.env.HOST || 'localhost';
var port = process.env.PORT || 3000;

/*
** Express
 */
// set up server
app.set('port', port);

// set middleware
app.use(bodyParser.json());
app.use(session({
    secret: secrets.jwt,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60000 }
}));

/*
** API
 */
app.post('/api/login', function (req, res, next) {
    console.log(req.session);
    // TODO: send session id in header
    var _req$body = req.body,
        username = _req$body.username,
        password = _req$body.password;

    var user = {};
    // call login mutation and get token with user ID
    graphClient.mutation('{\n        login(username:"' + username + '", password:"' + password + '") {\n            token\n        }\n    }', { header: { authorization: 'Bearer ' + req.session.id } })
    // regenerate session and return new token with session id and user id
    .then(function (loginData) {
        return new Promise(function (resolve, reject) {
            var token = jwt.verify(loginData.login.token, secrets.jwt);
            req.session.regenerate(function (err) {
                resolve(jwt.sign({ userId: token.id, sessionId: req.session.id }, secrets.jwt));
            });
        });
    })
    // call setSessionId mutation to save session id to user db
    .then(function (newToken) {
        return graphClient.mutation('{\n            setSessionId(token:"' + newToken + '") {\n                isSaved\n                id\n                name\n                username\n                email\n            }\n        }', { header: { authorization: 'Bearer ' + req.session.id } });
    })
    // return user to client
    .then(function (setSessionIdData) {
        if (setSessionIdData.setSessionId.isSaved) {
            var _setSessionIdData$set = setSessionIdData.setSessionId,
                id = _setSessionIdData$set.id,
                name = _setSessionIdData$set.name,
                _username = _setSessionIdData$set.username,
                email = _setSessionIdData$set.email;

            res.json({ id: id, name: name, username: _username, email: email });
        }
    })
    // catch errors
    .catch(function (err) {
        res.json({ s: 'error', msg: 'No user found' });
    });
});

/*
** NUXT
 */
// Import and Set Nuxt.js options
var config = __webpack_require__(9);
config.dev = !("development" === 'production');

// Init Nuxt.js
var nuxt = new Nuxt(config);

// Build only in dev mode
if (config.dev) {
    var builder = new Builder(nuxt);
    builder.build();
}

// Give nuxt middleware to express
app.use(nuxt.render);

// Listen the server
app.listen(port, host);
console.log('Server listening on ' + host + ':' + port);

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = require("express");

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = require("body-parser");

/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = require("express-session");

/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = require("nuxt");

/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = require("jsonwebtoken");

/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "query", function() { return query; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mutation", function() { return mutation; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_axios__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_axios___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_axios__);


var config = {
    url: 'http://localhost:4000/graphql',
    method: 'post'
};

var query = function query(_query, options) {
    return new Promise(function (resolve, reject) {
        __WEBPACK_IMPORTED_MODULE_0_axios___default()(Object.assign({}, { data: { query: 'query ' + _query } }, config, options)).then(function (res) {
            resolve(res.data.data);
        }).catch(function (err) {
            reject(err);
        });
    });
};

var mutation = function mutation(query, options) {
    return new Promise(function (resolve, reject) {
        __WEBPACK_IMPORTED_MODULE_0_axios___default()(Object.assign({}, { data: { query: 'mutation ' + query } }, config, options)).then(function (res) {
            resolve(res.data.data);
        }).catch(function (err) {
            reject(err);
        });
    });
};



/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = require("axios");

/***/ }),
/* 8 */
/***/ (function(module, exports) {

module.exports = {
    jwt: 'sdk397ehsfG3$T',
    jwtAlgorithm: 'RS256'
};

/***/ }),
/* 9 */
/***/ (function(module, exports) {

module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    title: 'starter',
    meta: [{ charset: 'utf-8' }, { name: 'viewport', content: 'width=device-width, initial-scale=1' }, { hid: 'description', name: 'description', content: 'Nuxt.js project' }],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
  },
  /*
  ** Global CSS
  */
  css: ['~/assets/css/main.css'],
  /*
  ** Add axios globally
  */
  build: {
    vendor: ['axios']
  },
  /*
  ** Modules
  */
  modules: ['@nuxtjs/apollo'],
  apollo: {
    clientConfigs: {
      default: '~/apollo-client.js'
    }
  }
};

/***/ })
/******/ ]);
//# sourceMappingURL=main.map