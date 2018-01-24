/**
 * meta middleware, should be the first middleware
 */

'use strict';

module.exports = (options, app) => {
  if (options.logging) {
    app.deprecate('please listen on request event and logging');
  }

  return async function meta(ctx, next) {
    if (options.logging) {
      ctx.coreLogger.info('[meta] request started, host: %s, user-agent: %s', ctx.host, ctx.header['user-agent']);
    }
    app.emit('request', ctx);
    await next();
    // total response time header
    ctx.set('x-readtime', Date.now() - ctx.starttime);
    app.emit('response', ctx);
  };
};
