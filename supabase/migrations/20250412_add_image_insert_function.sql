-- Drop existing function and type if they exist
DROP FUNCTION IF EXISTS public.insert_images(image_insert_data[]);
DROP TYPE IF EXISTS public.image_insert_data;

-- Create a custom type for image data
DO $$ 
BEGIN
  CREATE TYPE public.image_insert_data AS (
    post_id uuid,
    url text,
    alt text,
    width integer,
    height integer
  );
EXCEPTION 
  WHEN duplicate_object THEN
    NULL;
END $$;

-- Create function to insert images with timestamps
CREATE OR REPLACE FUNCTION public.insert_images(image_data image_insert_data[])
RETURNS SETOF uuid  -- Return the IDs of inserted images
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_id uuid;
BEGIN
  -- Validate input
  IF image_data IS NULL OR array_length(image_data, 1) = 0 THEN
    RAISE EXCEPTION 'No image data provided';
  END IF;

  -- Insert images and return their IDs
  INSERT INTO public.images (
    post_id,
    url,
    alt,
    width,
    height,
    created_at
  )
  SELECT
    d.post_id,
    d.url,
    COALESCE(d.alt, ''),  -- Ensure alt is never NULL
    d.width,
    d.height,
    NOW()
  FROM unnest(image_data) d
  RETURNING id INTO v_id;

  -- Return the IDs
  RETURN NEXT v_id;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.insert_images(image_insert_data[]) TO authenticated;

-- Add helpful comment
COMMENT ON FUNCTION public.insert_images(image_insert_data[]) IS 'Inserts multiple images with automatic timestamp handling and returns their IDs';
