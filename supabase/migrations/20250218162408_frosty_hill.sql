/*
  # Authentication and Transactions Schema

  1. Authentication Setup
    - Enable email/password authentication
    - Configure auth settings

  2. Tables
    - `transactions` table with user relationship
      - `id` (uuid, primary key)
      - `amount` (decimal)
      - `description` (text)
      - `date` (timestamptz)
      - `user_id` (uuid, references auth.users)
      - `created_at` (timestamptz)

  3. Security
    - Enable RLS on transactions table
    - Add policies for CRUD operations
*/

-- Enable the email provider
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create the transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  amount decimal NOT NULL,
  description text NOT NULL,
  date timestamptz NOT NULL,
  user_id uuid REFERENCES auth.users NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own transactions"
  ON transactions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own transactions"
  ON transactions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own transactions"
  ON transactions
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own transactions"
  ON transactions
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);