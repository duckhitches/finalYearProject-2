-- Create drawings storage bucket if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM storage.buckets WHERE id = 'drawings'
    ) THEN
        INSERT INTO storage.buckets (id, name, public)
        VALUES ('drawings', 'drawings', true);
    END IF;
END $$;

-- Create the drawings table
CREATE TABLE IF NOT EXISTS public.drawings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    module_id TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.drawings ENABLE ROW LEVEL SECURITY;

-- Create drawings policies if they don't exist
DO $$
BEGIN
    -- Drawings table policies
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'drawings' 
        AND policyname = 'Users can view their own drawings'
    ) THEN
        CREATE POLICY "Users can view their own drawings"
            ON public.drawings FOR SELECT
            USING (auth.uid() = user_id);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'drawings' 
        AND policyname = 'Users can insert their own drawings'
    ) THEN
        CREATE POLICY "Users can insert their own drawings"
            ON public.drawings FOR INSERT
            WITH CHECK (auth.uid() = user_id);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'drawings' 
        AND policyname = 'Users can delete their own drawings'
    ) THEN
        CREATE POLICY "Users can delete their own drawings"
            ON public.drawings FOR DELETE
            USING (auth.uid() = user_id);
    END IF;

    -- Storage policies
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' 
        AND policyname = 'Public Access'
    ) THEN
        CREATE POLICY "Public Access"
            ON storage.objects FOR SELECT
            USING (bucket_id = 'drawings');
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' 
        AND policyname = 'Authenticated users can upload drawings'
    ) THEN
        CREATE POLICY "Authenticated users can upload drawings"
            ON storage.objects FOR INSERT
            WITH CHECK (
                bucket_id = 'drawings'
                AND auth.role() = 'authenticated'
            );
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' 
        AND policyname = 'Users can delete their own drawings'
    ) THEN
        CREATE POLICY "Users can delete their own drawings"
            ON storage.objects FOR DELETE
            USING (
                bucket_id = 'drawings'
                AND auth.uid()::text = (storage.foldername(name))[1]
            );
    END IF;
END $$;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS drawings_user_id_idx ON public.drawings(user_id);
CREATE INDEX IF NOT EXISTS drawings_module_id_idx ON public.drawings(module_id);
CREATE INDEX IF NOT EXISTS drawings_created_at_idx ON public.drawings(created_at);

-- Add comments for documentation
COMMENT ON TABLE public.drawings IS 'Stores information about user-uploaded drawings';
COMMENT ON COLUMN public.drawings.id IS 'Unique identifier for the drawing';
COMMENT ON COLUMN public.drawings.user_id IS 'Reference to the user who uploaded the drawing';
COMMENT ON COLUMN public.drawings.module_id IS 'Reference to the learning module where the drawing was uploaded';
COMMENT ON COLUMN public.drawings.file_path IS 'Path to the drawing file in storage';
COMMENT ON COLUMN public.drawings.file_url IS 'Public URL to access the drawing';
COMMENT ON COLUMN public.drawings.created_at IS 'Timestamp when the drawing was uploaded'; 