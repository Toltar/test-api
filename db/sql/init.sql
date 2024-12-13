CREATE TABLE customer (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  first VARCHAR(255) NOT NULL,
  middle VARCHAR(255),
  last VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE,
  phone_number VARCHAR(16)
);
