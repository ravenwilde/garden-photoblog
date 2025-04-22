-- Add timestamp_taken column to images table
ALTER TABLE public.images ADD COLUMN IF NOT EXISTS timestamp_taken timestamptz;

-- Update custom type image_insert_data to include timestamp_taken
DROP TYPE IF EXISTS public.image_insert_data CASCADE;
CREATE TYPE public.image_insert_data AS (
    post_id uuid,
    url text,
    alt text,
    width integer,
    height integer,
    timestamp_taken timestamptz
);

-- Update insert_images function to use new type
CREATE OR REPLACE FUNCTION public.insert_images(image_data public.image_insert_data[]) RETURNS SETOF uuid
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
AS $function$
DECLARE
  v_id uuid;
BEGIN
  IF image_data IS NULL OR array_length(image_data, 1) = 0 THEN
    RAISE EXCEPTION 'No image data provided';
  END IF;

  FOR v_id IN
    INSERT INTO public.images (
      post_id,
      url,
      alt,
      width,
      height,
      timestamp_taken,
      created_at
    )
    SELECT
      d.post_id,
      d.url,
      COALESCE(d.alt, ''),
      d.width,
      d.height,
      d.timestamp_taken,
      NOW()
    FROM unnest(image_data) d
    RETURNING id
  LOOP
    RETURN NEXT v_id;
  END LOOP;
END;
$function$;
