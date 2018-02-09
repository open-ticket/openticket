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
    }
    if (err.message.includes("users_email_unique")) {
      ctx.throw("This email is already being used. Please try another.", 400);
    }
    ctx.throw(err.message, 500);
  }
};

const getUsers = async ctx => {
  const { limit = 10, offset = 0 } = ctx.query;
  ctx.body = await User.query()
    .limit(parseInt(limit, 10))
    .offset(parseInt(offset, 10));
};

const getUser = id => User.query().findById(id);

const getUserById = async ctx => {
  const { id } = ctx.params;
  const user = await getUser(id);
  if (!user) {
    ctx.throw("User not found", 404);
  }
  ctx.body = user.toJSON();
};

const validatePassword = async ctx => {
  ctx.assert(ctx.request.body.password, "You need to supply a password");
  const { id } = ctx.params;
  const user = await getUser(id);
  if (!user) {
    ctx.throw("User not found", 404);
  }
  const valid = await user.checkPassword(ctx.request.body.password);
  ctx.body = { valid };
};

const router = new Router();

router.get("/", getUsers);
router.post("/", createUser);
router.get("/:id", getUserById);
router.put("/:id/validatePassword", validatePassword);

app.use(router.routes());
app.use(router.allowedMethods());

module.exports = app;
