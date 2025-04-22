-- Update insert_images function to fix multi-row RETURNING bug (returns all IDs)
CREATE OR REPLACE FUNCTION public.insert_images(image_data public.image_insert_data[]) RETURNS SETOF uuid
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
AS $function$
DECLARE
  v_id uuid;
BEGIN
  -- Validate input
  IF image_data IS NULL OR array_length(image_data, 1) = 0 THEN
    RAISE EXCEPTION 'No image data provided';
  END IF;

  -- Insert images and return their IDs
  FOR v_id IN
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
    RETURNING id
  LOOP
    RETURN NEXT v_id;
  END LOOP;
END;
$function$;
