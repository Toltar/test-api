import { describe, test, expect } from 'vitest'
import { v4 } from 'uuid';
import { Customer, Email, isCustomer, isEmail, isPhoneNumber, isUUID, PhoneNumber, UUID } from './customer';
import fc from 'fast-check';

describe('Type Validation', () => {
  describe('isUUID()', () => {
    test('validates a valid UUID', () => {
      const validUUID = v4();
      expect(isUUID(validUUID)).toBeTruthy();
    });

    test('validates a invalid UUID', () => {
      fc.assert(
        fc.property(fc.string(), (invalidUUID: string) => {
          expect(isUUID(invalidUUID)).toBeFalsy();
        })
      );
    });
  });

  describe('isPhoneNumber()', () => {
    test.each([
      '+13738889847',
      '+23239348493',
      '+38493827476'
    ])('Validates valid phone numbers', (phoneNumber) => {
      expect(isPhoneNumber(phoneNumber)).toBeTruthy();
    });

    test('Validates invalid phone numbers', () => {
      fc.assert(
        fc.property(fc.string(), (invalidPhoneNumber: string) => {
          expect(isPhoneNumber(invalidPhoneNumber)).toBeFalsy()
        })
      );
    });
  });

  describe('isEmail()', () => {
    test.each([
      'matthew@matthewdickens.com',
      'myemail@gmail.com',
      'jack@mydomain.net'
    ])('Validates valid emails', (email) => {
      expect(isEmail(email)).toBeTruthy();
    });


    test('Validates invalid emails', () => {
      fc.assert(
        fc.property(fc.string(), (invalidEmail: string) => {
          expect(isEmail(invalidEmail)).toBeFalsy();
        })
      );
    });
  });

  describe('isCustomer()', () => {
    const validCustomers: Customer[] = [
      { id: v4() as UUID, first: 'Matt', middle: undefined, last: 'Dickens', email: 'matthew@matthewdickens.com' as Email, phoneNumber: '+18326381032' as PhoneNumber } as unknown as Customer,
      { id: v4() as UUID, first: 'Ray', middle: 'Brenan', last: 'Moris', email: 'raybans@gmail.com' as Email, phoneNumber: '+32837498' as PhoneNumber } as unknown as Customer, // Testing support for internation phone numbers
      { id: v4() as UUID, first: 'Jenny', middle: null, last: 'Raine', email: 'myemail@email.net', phoneNumber: '+129383948' } as unknown as Customer
    ];
    test.each(validCustomers)('Validates valid customer objects', (customer) => {
      expect(isCustomer(customer)).toBeTruthy();
    });


    const invalidCustomers: Customer[] = [
      { id: 'invalidUUID', first: 'Matt', middle: undefined, last: 'Dickens', email: 'matthew@matthewdickens.com' as Email, phoneNumber: ' + 18326381032' as PhoneNumber } as unknown as Customer,
      { id: v4(), first: '', middle: undefined, last: 'Dickens', email: 'matthew@matthewdickens.com' as Email, phoneNumber: ' + 18326381032' as PhoneNumber } as unknown as Customer,
      { id: v4(), first: 'Matt', middle: undefined, last: 'Dickens', email: 'matthew@matthewdickens.com' as Email, phoneNumber: ' + 18326381032' as PhoneNumber } as unknown as Customer,
      { id: v4(), first: 'Matt', middle: undefined, last: '', email: 'matthew@matthewdickens.com' as Email, phoneNumber: ' + 18326381032' as PhoneNumber } as unknown as Customer,
      { id: v4(), first: 'Matt', middle: undefined, last: 'Dickens', email: 'matthew@matthewdickens.com' as Email, phoneNumber: ' + 18326381032' as PhoneNumber } as unknown as Customer,
      { id: v4(), first: null, middle: undefined, last: undefined, email: 'matthew@matthewdickens.com' as Email, phoneNumber: ' + 18326381032' as PhoneNumber } as unknown as Customer,
      { id: v4() as UUID, first: 'Ray', middle: 'Brenan', last: 'Moris', email: 'fsdjklfjdslkfj' as Email, phoneNumber: '+32837498' as PhoneNumber } as unknown as Customer, // Testing support for internation phone numbers
      { id: v4(), first: 'Jenny', middle: null, last: 'Raine', email: 'myemail@email.net', phoneNumber: '+dsfjlkdsjfnofenfo' } as unknown as Customer
    ]

    test.each(invalidCustomers)('Validates invalid customer objects', (customer) => {
      expect(isCustomer(customer)).toBeFalsy();
    });
  });

});
