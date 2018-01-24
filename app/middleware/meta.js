/**
 * meta middleware, should be the first middleware
 */

'use strict';

module.exports = (_, app) => {
  return function* meta(next) {
    app.emit('request', this);
    yield next;

    // total response time header
    this.set('x-readtime', Date.now() - this.starttime);
    app.emit('response', this);
  };
};
