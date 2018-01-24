'use strict';

const assert = require('assert');
const mm = require('egg-mock');
const pedding = require('pedding');
const utils = require('../../utils');

describe('test/app/middleware/meta.test.js', () => {
  let app;
  afterEach(mm.restore);
  after(() => app.close());

  before(() => {
    app = utils.app('apps/middlewares');
    return app.ready();
  });
  after(() => app.close());

  it('should get X-Readtime header', () => {
    return app.httpRequest()
      .get('/')
      .expect('X-Readtime', /\d+/)
      .expect(200);
  });

  it('should emit request event and response event', done => {
    done = pedding(3, done);
    app.once('request', ctx => {
      assert(ctx);
      assert(ctx.status === 404);
      done();
    });
    app.once('response', ctx => {
      assert(ctx);
      assert(ctx.status === 200);
      done();
    });
    app.httpRequest()
      .get('/')
      .expect('X-Readtime', /\d+/)
      .expect(200, done);
  });
});
