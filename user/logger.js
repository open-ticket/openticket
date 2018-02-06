const moment = require("moment");
/**
 * Logs the current request.
 * @param {Koa.ctx} ctx
 * @param {Function} next
 */
module.exports = async (ctx, next) => {
  await next();
  console.log(
    `${moment().toISOString()}: ${ctx.method} ${ctx.url} => ${ctx.status}`,
  );
  // TODO: Send to remote logger
};
