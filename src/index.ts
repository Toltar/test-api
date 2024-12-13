import Koa from 'koa';
import logger from './logger';
import env from './env';
import customerRoutes from './routes/customer-routes';
import { bodyParser } from '@koa/bodyparser';

const app = new Koa();
app.use(bodyParser());

app.use(customerRoutes.routes())
  .use(customerRoutes.allowedMethods());

app.listen(env.PORT, function () {
  logger.info(`Server running on http://localhost:${env.PORT}`);
});
