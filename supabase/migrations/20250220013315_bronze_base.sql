/*
  # Add category field to transactions table

  1. Changes
    - Add category column to transactions table with NOT NULL constraint
    - Set default value for new and existing records
    - Add check constraint to prevent empty categories

  2. Security
    - No changes to RLS policies needed as existing policies cover the new column
*/

DO $$ 
BEGIN
  -- Add category column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'transactions' 
    AND column_name = 'category'
  ) THEN
    ALTER TABLE transactions 
    ADD COLUMN category text NOT NULL DEFAULT 'Other'
    CHECK (category <> '');
  END IF;

  -- Update any NULL categories to 'Other'
  UPDATE transactions 
  SET category = 'Other' 
  WHERE category IS NULL;
END $$;