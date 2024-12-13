import { Context } from "koa";
import { asCreateOrUpdateCustomerBody, asUUID, CreateOrUpdateCustomerBody, Customer, InvalidCustomerError, InvalidEmailError, InvalidPhoneNumberError, InvalidUUIDError, UUID } from "../types/customer";
import { createCustomer, CustomerNotFoundError, deleteCustomerById, DeletionFailedError, getCustomerById, updateCustomer } from "../repository/customer-repository";

export async function createCustomerHandler(ctx: Context) {
  try {
    const validatedCustomer = asCreateOrUpdateCustomerBody(ctx.body);

    const createdCustomer: Customer = await createCustomer(validatedCustomer);

    ctx.status = 201;
    ctx.body = createdCustomer;
  } catch (error: unknown) {
    if (error instanceof InvalidCustomerError || error instanceof InvalidPhoneNumberError || error instanceof InvalidEmailError) {
      ctx.status = 400;
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
    ctx.status = 200;
    ctx.body = customer;
  } catch (error: unknown) {
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


export async function deleteCustomerHandler(ctx: Context) {
  const unvalidatedId = ctx.params.id;
  try {
    const validatedId: UUID = asUUID(unvalidatedId);
    const customer = await deleteCustomerById(validatedId);
    ctx.status = 204;
    ctx.body = customer;
  } catch (error: unknown) {
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
    const validatedUpdateBody: CreateOrUpdateCustomerBody = asCreateOrUpdateCustomerBody(ctx.body);

    const updatedCustomer: Customer = await updateCustomer(validatedId, validatedUpdateBody);

    ctx.status = 204;
    ctx.body = updatedCustomer;
  } catch (error: unknown) {
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
