const koa = require("koa");
const router = require("koa-router");
const superagent = require("superagent");
const moesif = require("moesif-nodejs");
const koaBody = require("koa-body");

var port = process.env.PORT || 6050;

// Set the options, the only required field is applicationId.
var moesifOptions = {
  applicationId:
    process.env.MOESIF_APPLICATION_ID || "Your Moesif Application Id",

  debug: true,

  identifyUser: function (req, res) {
    if (req.state && req.state.user) {
      return req.state.user.sub;
    }
    if (req.headers["x-user-id"]) {
      return req.headers["x-user-id"];
    }
    return undefined;
  },

  identifyCompany: function (req, res) {
    if (req.headers["x-company-id"]) {
      return req.headers["x-company-id"];
    }
    if (req.headers["my-company-id"]) {
      return req.headers["my-company-id"];
    }
    return undefined;
  },

  getSessionToken: function (req, res) {
    return req.headers["Authorization"];
  },

  getMetadata: function (req, res) {
    return {
      foo: "koa",
      bar: "example"
    };
  },

  disableBatching: true,

  logBody: true,

  callback: function (error, data) {
    console.log("inside call back");
    console.log("error: " + JSON.stringify(error));
  }
};

const app = (module.exports = new koa());

app.use(
  koaBody({
    jsonLimit: "1kb"
  })
);

var moesifMiddleware = moesif(moesifOptions);
app.use(moesifMiddleware);

var gov = router(); //Instantiate the router

gov.get("/gov/no_italy", (ctx, next) => {
  ctx.body = { success: true};
});

gov.get("/gov/company1", (ctx, next) => {
  ctx.body = { success: true};
});

gov.get("/gov/canada", (ctx, next) => {
  ctx.body = { success: true};
});

gov.get("/gov/cairo", (ctx, next) => {
  ctx.body = { success: true};
});

gov.get("/gov/for_companies_in_japan_only", (ctx, next) => {
  ctx.body = { success: true};
});

gov.get("/gov/random", (ctx, next) => {
  ctx.body = { success: true};
});

app.use(gov.routes());

app.listen(port, function () {
  console.log("Example app is listening on port " + port);
});
