import { createDbClient } from "../dbclient";
import { CreateOrUpdateCustomerBody, Customer, UUID } from "../types/customer";
import env from "../env";

export const CustomerTableName = env.CUSTOMER_TABLE_NAME;

export async function createCustomer(customer: CreateOrUpdateCustomerBody): Promise<Customer> {
  const client = createDbClient();

  const newCustomerQueryResult = await client.query(`INSERT INTO ${CustomerTableName} as customer ('${customer.first}', '${customer.middle}', '${customer.last}', '${customer.email}', '${customer.number}') RETURNING *;`);

  const newCustomer: Customer = newCustomerQueryResult.rows[0];

  return newCustomer;
};

export async function getCustomerById(id: UUID): Promise<Customer> {
  const client = createDbClient();

  const customerQueryResult = await client.query(`SELECT * FROM ${CustomerTableName} WHERE id = ${id};`);

  const customer: Customer = customerQueryResult.rows[0];
  if (customerQueryResult.rows.length === 1) {
    return customer;
  }

  throw new CustomerNotFoundError(id);
};

export async function deleteCustomerById(id: UUID): Promise<void> {
  const client = createDbClient();

  try {
    await client.query(`DELETE FROM ${CustomerTableName} WHERE id = ${id}`);
  } catch (error: unknown) {
    throw new Error(`Failed to delete record with id ${id}`);
  }
};


export async function updateCustomer(id: UUID, customer: CreateOrUpdateCustomerBody): Promise<Customer> {
  const client = createDbClient();

  const updatedCustomerQueryResult = await client.query(
    `UPDATE ${CustomerTableName} SET first = ${customer.first}, last = ${customer.last}, middle = ${customer.middle}, email = ${customer.email}, number = ${customer.number} WHERE id = ${id} RETURNING *;`
  );

  const updatedCustomer = updatedCustomerQueryResult.rows[0];
  if (updatedCustomer) {
    return updatedCustomer;
  }

  throw new UpdateFailedError(id);
};



export class CustomerNotFoundError extends Error {
  constructor(id: UUID) {
    super(`Customer not found with id ${id}`);
    this.name = 'CustomerNotFoundError';
  }
};

export class UpdateFailedError extends Error {
  constructor(id: UUID) {
    super(`Customer not updated with id ${id}`);
    this.name = 'UpdateFailedError';
  }
};

export class DeletionFailedError extends Error {
  constructor(id: UUID) {
    super(`Customer not delete with id ${id}`);
    this.name = 'DeletionFailedError';
  }
};
