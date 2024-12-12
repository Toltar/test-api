import Koa from 'koa';
import Router from '@koa/router';
import logger from './logger';
import env from './env';

const app = new Koa();
const router = new Router();

app.use(async ctx => {
  ctx.body = 'Hello world';
});

app.use(router.routes())
  .use(router.allowedMethods());

app.listen(env.PORT, function () {
  logger.info(`Server running on http://localhost:${env.PORT}`);
});
