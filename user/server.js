const Koa = require("koa");
const objection = require("objection");
const Knex = require("knex");
const bodyParser = require("koa-bodyparser");
const mount = require("koa-mount");
const logger = require("koa-logger");
const wellKnown = require("./handlers/well-known");
const users = require("./handlers/users");
const knexConfig = require("./knexfile");

const app = new Koa();
app.use(logger());
app.use(bodyParser());

if (process.env.NODE_ENV === "test") {
  const knex = require("./testdb");
  objection.Model.knex(knex);
} else {
  const knex = Knex(knexConfig);
  objection.Model.knex(knex);
}

app.use(async (ctx, next) => {
  await next();
  ctx.body = { error: "", content: ctx.body };
});

app.use(mount("/.well-known", wellKnown));
app.use(mount("/users", users));

// route not found
app.use(async ctx => {
  ctx.status = 404;
});

const server = app.listen(process.env.PORT || 3000);
module.exports = { app, server };
