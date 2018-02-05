const Koa = require("koa");
const bodyparser = require("koa-bodyparser");

const app = new Koa();
app.use(bodyparser());

app.use(async ctx => {
  ctx.body = ctx.request.body;
});

app.listen(process.env.PORT || 3000);
