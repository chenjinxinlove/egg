'use strict';

const assert = require('assert');
const mm = require('egg-mock');
const fs = require('mz/fs');
const pedding = require('pedding');
const utils = require('../../utils');

describe('test/app/middleware/meta.test.js', () => {
  afterEach(mm.restore);

  describe('default config', () => {
    let app;
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

  describe('meta.logging = true', () => {
    let app;
    before(() => {
      app = utils.app('apps/meta-logging-app');
      return app.ready();
    });
    after(() => app.close());

    it('should get X-Readtime header', async () => {
      await app.httpRequest()
        .get('/?foo=bar')
        .expect('X-Readtime', /\d+/)
        .expect('hello world')
        .expect(200);
      const content = (await fs.readFile(app.coreLogger.options.file, 'utf8')).split('\n').slice(-2, -1)[0];
      assert(content.includes('[meta] request started, host: '));
    });
  });
});
