const Koa = require("koa");
const Router = require("koa-router");
const { ValidationError } = require("objection");
const User = require("../models/User");

const app = new Koa();

const createUser = async ctx => {
  try {
    const user = await User.query().insert(ctx.request.body);
    ctx.body = user;
    ctx.status = 201;
  } catch (err) {
    ctx.body = {};
    if (err instanceof ValidationError) {
      ctx.throw(
        typeof err.message === "object"
          ? JSON.stringify(err.message)
          : err.message,
        400,
      );
    } else {
      ctx.throw(err.message, 500);
    }
  }
};

const getUsers = async ctx => {
  const { limit = 10, offset = 0 } = ctx.query;
  ctx.body = await User.query()
    .limit(parseInt(limit, 10))
    .offset(parseInt(offset, 10));
};

const router = new Router();

router.get("/", getUsers);
router.post("/", createUser);

app.use(router.routes());
app.use(router.allowedMethods());

module.exports = app;
