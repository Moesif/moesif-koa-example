const koa = require('koa');
const superagent = require('superagent');
const moesif = require('moesif-nodejs');
const koaBody = require('koa-body');

var port = process.env.PORT || 5000

// Set the options, the only required field is applicationId.
var moesifOptions = {

  applicationId: process.env.MOESIF_APPLICATION_ID || 'Your Moesif Application Id',

  debug: true,

  identifyUser: function (req, res) {
    if (req.state && req.state.user) {
      return req.state.user.sub;
    }
    return undefined;
  },

  identifyCompany: function (req, res) {
    if (req.headers['my-company-id']) {

      return req.headers['my-company-id'];
    }
    return undefined;
  },

  getSessionToken: function (req, res) {
    return req.headers['Authorization'];
  },

  getMetadata: function (req, res) {
    return {
      foo: 'koa',
      bar: 'example'
    }
  },

  disableBatching: true,

  logBody: true,

  callback: function (error, data) {
    console.log('inside call back');
    console.log('error: ' + JSON.stringify(error));
  }
};

const app = module.exports = new koa();

app.use(koaBody({
  jsonLimit: '1kb'
}));

var moesifMiddleware = moesif(moesifOptions);
app.use(moesifMiddleware);

app.use(async function(ctx) {
  ctx.body = 'Hello World';
});

app.listen(port, function() {
  console.log('Example app is listening on port ' + port);
});
