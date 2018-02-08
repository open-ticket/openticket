const Koa = require("koa");
const Router = require("koa-router");

const app = new Koa();

const heartbeat = async ctx => {
  ctx.body = { ok: true };
};

const router = new Router();

router.get("/heartbeat", heartbeat);

app.use(router.routes());
app.use(router.allowedMethods());

module.exports = app;
