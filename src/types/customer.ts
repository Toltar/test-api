import { validate } from "uuid";

export type UUID = string & { __brand: 'UUID' };

export class InvalidUUIDError extends Error {
  invalidUUID: unknown;
  constructor(uuid: unknown) {
    super(`Invalid UUID of: ${uuid}`);
    this.name = 'InvalidUUIDError';
    this.invalidUUID = uuid;
  }
};

export function isUUID(uuid: unknown): uuid is UUID {
  return validate(uuid);
};

export function asUUID(uuid: unknown): UUID {
  if (isUUID(uuid)) {
    return uuid;
  }
  throw new Error(`UUID of ${uuid} is invalid`);
};

export type PhoneNumber = string & { _brand: 'PhoneNumber' };

export class InvalidPhoneNumberError extends Error {
  invalidPhoneNumber: unknown;
  constructor(phoneNumber: unknown) {
    super(`Invalid Phone Number of: ${phoneNumber}`);
    this.name = 'InvalidPhoneNumberError';
    this.invalidPhoneNumber = phoneNumber;
  }
};

export function isPhoneNumber(phoneNumber: unknown): phoneNumber is PhoneNumber {
  const phoneNumberRegex = /^\+(?:[0-9] ?){6,14}[0-9]$/;
  return phoneNumber !== undefined
    && phoneNumber !== null
    && typeof phoneNumber === 'string'
    && phoneNumberRegex.test(phoneNumber);
};

export type Email = string & { _brand: 'Email' };

export class InvalidEmailError extends Error {
  invalidEmail: unknown;
  constructor(email: unknown) {
    super(`Invalid Email of: ${email}`);
    this.name = 'InvalidEmailError';
    this.invalidEmail = email;
  }
};

export function isEmail(email: unknown): email is Email {
  const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  return email !== undefined
    && email !== null
    && typeof email === 'string'
    && emailRegex.test(email);
};

export type Customer = {
  id: UUID;
  first: string;
  middle: null | undefined | string;
  last: string;
  email: string;
  phoneNumber: PhoneNumber;
} & { brand: 'Customer' }


export class InvalidCustomerError extends Error {
  invalidCustomer: unknown;
  constructor(customer: unknown) {
    super(`Invalid Customer of: ${JSON.stringify(customer)}`);
    this.name = 'InvalidCustomerError';
    this.invalidCustomer = customer;
  }
};

export function isCustomer(customer: unknown): customer is Customer {
  return customer !== undefined
    && customer !== null
    && typeof customer === 'object'
    && 'id' in customer
    && 'first' in customer
    && 'last' in customer
    && 'email' in customer
    && 'phoneNumber' in customer
    && typeof customer.first === 'string'
    && typeof customer.last === 'string'
    && customer.first.length > 0
    && customer.last.length > 0
    && isEmail(customer.email)
    && isPhoneNumber(customer.phoneNumber)
    && isUUID(customer.id);
};

export function asCustomer(customer: unknown): Customer {
  if (isCustomer(customer)) {
    return customer;
  } else {
    // Find out why the customer record here is invalid so we can throw the right error
    if (customer !== undefined && customer !== null && typeof customer === 'object') {
      if ('email' in customer && !isEmail(customer.email)) {
        throw new InvalidEmailError(customer.email);
      }

      if ('phoneNumber' in customer && !isPhoneNumber(customer.phoneNumber)) {
        throw new InvalidPhoneNumberError(customer.phoneNumber);
      }

      if ('id' in customer && !isUUID(customer.id)) {
        throw new InvalidUUIDError(customer.id);
      }
    }

    throw new InvalidCustomerError(customer);
  }
};

export type CreateCustomerBody = {
  first: string;
  middle: null | undefined | string;
  last: string;
  email: string;
  number: PhoneNumber;
} & { __brand: 'CreateCustomerBody' };

export function isCreateCustomerBody(createCustomerBody: unknown) {
  return createCustomerBody !== undefined
    && createCustomerBody !== null
    && typeof createCustomerBody === 'object'
    && 'first' in createCustomerBody
    && ('middle' in createCustomerBody ? 'middle' in createCustomerBody && typeof createCustomerBody.middle === 'string' && createCustomerBody.middle.length > 0 : true) // Since middle is optional we validate it optionally
    && 'last' in createCustomerBody
    && 'email' in createCustomerBody
    && 'phoneNumber' in createCustomerBody
    && typeof createCustomerBody.first === 'string'
    && typeof createCustomerBody.last === 'string'
    && createCustomerBody.first.length > 0
    && createCustomerBody.last.length > 0
    && isEmail(createCustomerBody.email)
    && isPhoneNumber(createCustomerBody.phoneNumber);
};

export function asCreateCustomerBody(createCustomerBody: unknown) {
  if (isCreateCustomerBody(createCustomerBody)) {
    return createCustomerBody;
  } else {
    if (createCustomerBody !== undefined && createCustomerBody !== null && typeof createCustomerBody === 'object') {
      if ('email' in createCustomerBody && !isEmail(createCustomerBody.email)) {
        throw new InvalidEmailError(createCustomerBody.email);
      }

      if ('phoneNumber' in createCustomerBody && !isPhoneNumber(createCustomerBody.phoneNumber)) {
        throw new InvalidPhoneNumberError(createCustomerBody.phoneNumber);
      }
    }
  }
  throw new InvalidCustomerError(createCustomerBody);
};

export type DeleteCustomerByIdBody = {
  id: UUID;
} & { __brand: 'DeleteCustoemrById' };

export class InvalidDeleteCustomerByIdBodyError extends Error {
  invalidDeleteCustomerByIdBody: unknown;
  constructor(deleteCustomerByIdBody: unknown) {
    super(`Invalid DeleteCustomerByIdBody: ${JSON.stringify(deleteCustomerByIdBody)}`);
    this.name = 'InvalidDeleteCustomerByIdBodyError';
    this.invalidDeleteCustomerByIdBody = deleteCustomerByIdBody;
  }
};

export function isDeleteCustomerByIdBody(deleteCustomerByIdBody: unknown): deleteCustomerByIdBody is DeleteCustomerByIdBody {
  return deleteCustomerByIdBody !== undefined
    && deleteCustomerByIdBody !== null
    && typeof deleteCustomerByIdBody === 'object'
    && 'id' in deleteCustomerByIdBody
    && isUUID(deleteCustomerByIdBody.id);
};

export function asDeleteCustomerByIdBody(deleteCustomerByIdBody: unknown): DeleteCustomerByIdBody {
  if (isDeleteCustomerByIdBody(deleteCustomerByIdBody)) {
    return deleteCustomerByIdBody;
  }
  throw new InvalidDeleteCustomerByIdBodyError(deleteCustomerByIdBody);
};


