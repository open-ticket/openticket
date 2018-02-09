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

app.context.error = "";

if (process.env.NODE_ENV === "test") {
  const knex = require("./testdb");
  objection.Model.knex(knex);
} else {
  const knex = Knex(knexConfig);
  objection.Model.knex(knex);
}

app.use(async (ctx, next) => {
  await next();
  ctx.body = { error: ctx.error, content: ctx.body };
});

// catch errors and add to context
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    ctx.error = err.message || "An error occured";
    ctx.status = err.status || 500;
  }
});

app.use(mount("/.well-known", wellKnown));
app.use(mount("/users", users));

// route not found
app.use(async ctx => {
  ctx.status = 404;
});

if (process.env.NODE_ENV !== "test") {
  app.listen(process.env.PORT || 3000);
}
module.exports = app;
