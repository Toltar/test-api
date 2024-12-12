export type UUID = string;

export type PhoneNumber = {
  country_code: string;
  number: string;
};
export type Customer = {
  id: UUID;
  first: string;
  middle: null | undefined | string;
  last: string;
  email: string;
  number: PhoneNumber;
}

export type CreateCustomerBody = {
  first: string;
  middle: null | undefined | string;
  last: string;
  email: string;
  number: PhoneNumber;
};

export type DeleteCustomerById = {
  id: UUID;
};

export type UpdateCustomerBody = {
  id: UUID;
  middle: null | undefined | string;
  last: string;
  email: string;
  number: PhoneNumber;
};

