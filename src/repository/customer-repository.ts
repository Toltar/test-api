import { createDbClient } from "../dbclient";
import { CreateOrUpdateCustomerBody, Customer, UUID } from "../types/customer";
import env from "../env";
import logger from "../logger";

export const CustomerTableName = env.CUSTOMER_TABLE_NAME;

export async function createCustomer(customer: CreateOrUpdateCustomerBody): Promise<Customer> {
  const client = createDbClient();

  logger.info("Creating Customer in the database");
  await client.connect();
  const newCustomerQueryResult = await client.query(
    `INSERT INTO customer (first, middle, last, email, phone_number) 
      VALUES (\'${customer.first}\', \'${customer.middle}\', \'${customer.last}\', \'${customer.email}\', \'${customer.phone_number}\') 
      RETURNING *;`
  );
  await client.end();
  const newCustomer: Customer = newCustomerQueryResult.rows[0];

  return newCustomer;
};

export async function getCustomerById(id: UUID): Promise<Customer> {
  const client = createDbClient();

  await client.connect();
  const customerQueryResult = await client.query(`SELECT * FROM ${CustomerTableName} WHERE id = \'${id}\';`);
  await client.end();

  const customer: Customer = customerQueryResult.rows[0];
  if (customerQueryResult.rows.length === 1) {
    return customer;
  }

  throw new CustomerNotFoundError(id);
};

export async function getAllCustomers(): Promise<Customer[]> {
  const client = createDbClient();

  client.connect();
  const customerQueryResult = await client.query(`SELECT * FROM ${CustomerTableName};`);
  client.end();

  const customers: Customer[] = customerQueryResult.rows;

  return customers;
};

export async function deleteCustomerById(id: UUID): Promise<void> {
  const client = createDbClient();

  client.connect();
  await client.query(`DELETE FROM ${CustomerTableName} WHERE id = \'${id}\'`);
  client.end();
};


export async function updateCustomer(id: UUID, customer: CreateOrUpdateCustomerBody): Promise<void> {
  const client = createDbClient();

  client.connect();
  await client.query(
    `UPDATE ${CustomerTableName} 
    SET first = \'${customer.first}\', last = \'${customer.last}\', middle = \'${customer.middle}\', email = \'${customer.email}\', phone_number = \'${customer.phone_number}\' 
    WHERE id = \'${id}\';`
  );
  client.end()
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

