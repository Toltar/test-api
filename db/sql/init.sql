CREATE TYPE phone_number as (
  country_code VARCHAR(4)
  number VARCHAR(15)
)

CREATE TABLE Customer (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  first VARCHAR(255) NOT NULL,
  middle VARCHAR(255),
  last VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE
  phone phone_number
);
