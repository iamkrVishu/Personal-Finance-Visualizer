/*
  # Add category field to transactions table

  1. Changes
    - Add category column to transactions table
    - Make category field required
    - Add check constraint to ensure category is not empty

  2. Security
    - No changes to RLS policies needed
*/

ALTER TABLE transactions 
ADD COLUMN IF NOT EXISTS category text NOT NULL DEFAULT 'Other'
CHECK (category <> '');

-- Update existing rows to have a default category
UPDATE transactions 
SET category = 'Other' 
WHERE category IS NULL;