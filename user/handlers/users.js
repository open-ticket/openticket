const Koa = require("koa");
const Router = require("koa-router");
const User = require("../models/User");

const app = new Koa();

const getUsers = async ctx => {
  const { limit = 10, offset = 0 } = ctx.query;
  ctx.body = await User.query()
    .limit(parseInt(limit, 10))
    .offset(parseInt(offset, 10));
};

const router = new Router();

router.get("/", getUsers);

app.use(router.routes());
app.use(router.allowedMethods());

module.exports = app;
