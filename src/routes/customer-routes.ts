import Router from '@koa/router';
import { createCustomerHandler, deleteCustomerHandler, getCustomerHandler, listCustomers, updateCustomerHandler } from './customer-handlers';

const customerRoutes = new Router();

customerRoutes.post('/customers', createCustomerHandler);

customerRoutes.get('/customers', listCustomers);

customerRoutes.put('/customers/:id', updateCustomerHandler);

customerRoutes.get('/customers/:id', getCustomerHandler);

customerRoutes.delete('/customers/:id', deleteCustomerHandler);

export default customerRoutes;
