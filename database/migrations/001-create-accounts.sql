-- Up
CREATE TABLE accounts (
  id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  uuid VARCHAR(255) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(50) NOT NULL,
  stripe_connected_account_id VARCHAR(255) UNIQUE,
  stripe_customer_id VARCHAR(255) UNIQUE,
  created_at DATETIME,
  updated_at DATETIME
);

-- Down
DROP TABLE accounts;
