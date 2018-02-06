const Koa = require("koa");
const bodyParser = require("koa-bodyparser");
const logger = require("koa-logger");

const app = new Koa();
app.use(logger());
app.use(bodyParser());

app.use(async ctx => {
  ctx.body = ctx.request.body;
});

app.listen(process.env.PORT || 3000);
