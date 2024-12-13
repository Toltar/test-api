import Koa from 'koa';
import logger from './logger';
import env from './env';
import customerRoutes from './routes/customer-routes';

const app = new Koa();

app.use(customerRoutes.routes())
  .use(customerRoutes.allowedMethods());

app.listen(env.PORT, function () {
  logger.info(`Server running on http://localhost:${env.PORT}`);
});
