import { Context } from "koa";
import { asCreateOrUpdateCustomerBody, asUUID, CreateOrUpdateCustomerBody, Customer, InvalidCustomerError, InvalidEmailError, InvalidPhoneNumberError, InvalidUUIDError, UUID } from "../types/customer";
import { createCustomer, CustomerNotFoundError, deleteCustomerById, getAllCustomers, getCustomerById, updateCustomer } from "../repository/customer-repository";
import logger from "../logger";

export async function createCustomerHandler(ctx: Context) {
  try {
    logger.info(`Trying to create customer ${JSON.stringify(ctx.request.body)}`);
    const validatedCustomer = asCreateOrUpdateCustomerBody(ctx.request.body);

    const createdCustomer: Customer = await createCustomer(validatedCustomer);

    ctx.response.status = 201;
    ctx.response.body = createdCustomer;
  } catch (error: unknown) {
    if (error instanceof InvalidCustomerError || error instanceof InvalidPhoneNumberError || error instanceof InvalidEmailError) {
      logger.error(`Bad Request Error: ${error}`);
      ctx.response.status = 400;
      ctx.response.body = 'Bad Request';
      return;
    }
    ctx.respone.status = 500;
    ctx.response.body = 'Server Error';
  }
};

export async function getCustomerHandler(ctx: Context) {
  const unvalidatedId = ctx.params.id;
  try {
    const validatedId: UUID = asUUID(unvalidatedId);
    const customer = await getCustomerById(validatedId);
    ctx.response.status = 200;
    ctx.response.body = customer;
  } catch (error: unknown) {
    logger.error(`Error on Get Customer: ${error}`);
    if (error instanceof InvalidUUIDError) {
      ctx.response.status = 400;
      ctx.response.body = 'Bad Request';
    }
    if (error instanceof CustomerNotFoundError) {
      ctx.respone.status = 404;
      ctx.response.body = 'Not Found';
      return;
    }

    ctx.respone.status = 500;
    ctx.response.body = 'Server Error';
  }
};

export async function listCustomers(ctx: Context) {
  try {
    const customers = await getAllCustomers();

    ctx.response.status = 200;
    ctx.response.body = customers;
  } catch (error: unknown) {
    logger.error(`Error on List All Customers: ${error}`);
    ctx.respone.status = 500;
    ctx.response.body = 'Server Error';
  }
};


export async function deleteCustomerHandler(ctx: Context) {
  const unvalidatedId = ctx.params.id;
  try {
    const validatedId: UUID = asUUID(unvalidatedId);
    const customer = await deleteCustomerById(validatedId);
    ctx.response.status = 204;
    ctx.response.body = customer;
  } catch (error: unknown) {
    logger.error(`Error on Delete Customer: ${error}`);
    if (error instanceof InvalidUUIDError) {
      ctx.response.status = 400;
      ctx.response.body = 'Bad Request';
      return;
    }
    ctx.respone.status = 500;
    ctx.response.body = 'Server Error';
  }
};

export async function updateCustomerHandler(ctx: Context) {
  const unvalidatedId = ctx.params.id;
  try {
    const validatedId: UUID = asUUID(unvalidatedId);
    const validatedUpdateBody: CreateOrUpdateCustomerBody = asCreateOrUpdateCustomerBody(ctx.request.body);

    await updateCustomer(validatedId, validatedUpdateBody);

    ctx.response.status = 204;
  } catch (error: unknown) {
    logger.error(`Error on Update Customer: ${error}`);
    if (error instanceof InvalidUUIDError) {
      ctx.response.status = 400;
      ctx.response.body = 'Bad Request';
    }
    if (error instanceof InvalidCustomerError || error instanceof InvalidPhoneNumberError || error instanceof InvalidEmailError) {
      ctx.status = 400;
      ctx.response.body = 'Bad Request';
      return;
    }
    ctx.respone.status = 500;
    ctx.response.body = 'Server Error';
  }
};
