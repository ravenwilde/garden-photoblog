-- Add updated_at to images table if it doesn't exist
DO $$ 
BEGIN 
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'images' 
        AND column_name = 'updated_at'
    ) THEN
        ALTER TABLE public.images 
        ADD COLUMN updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

        -- Create trigger for automatic updated_at
        CREATE TRIGGER update_images_updated_at
            BEFORE UPDATE ON public.images
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;
