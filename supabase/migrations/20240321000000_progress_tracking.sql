-- Create progress status enum type
CREATE TYPE progress_status AS ENUM ('not_started', 'in_progress', 'completed');

-- Create progress table
CREATE TABLE IF NOT EXISTS public.progress (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    module_id TEXT NOT NULL,
    status progress_status DEFAULT 'not_started',
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(user_id, module_id)
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.progress ENABLE ROW LEVEL SECURITY;

-- Progress policies
CREATE POLICY "Users can view their own progress"
    ON public.progress FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress"
    ON public.progress FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress"
    ON public.progress FOR UPDATE
    USING (auth.uid() = user_id);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS progress_user_id_idx ON public.progress(user_id);
CREATE INDEX IF NOT EXISTS progress_module_id_idx ON public.progress(module_id);
CREATE INDEX IF NOT EXISTS progress_status_idx ON public.progress(status);

-- Add comments for documentation
COMMENT ON TABLE public.progress IS 'Tracks user progress through learning modules';
COMMENT ON COLUMN public.progress.id IS 'Unique identifier for the progress entry';
COMMENT ON COLUMN public.progress.user_id IS 'Reference to the user';
COMMENT ON COLUMN public.progress.module_id IS 'Reference to the learning module';
COMMENT ON COLUMN public.progress.status IS 'Current status of the module completion';
COMMENT ON COLUMN public.progress.completed_at IS 'Timestamp when the module was completed';
COMMENT ON COLUMN public.progress.created_at IS 'Timestamp when the progress entry was created';
COMMENT ON COLUMN public.progress.updated_at IS 'Timestamp when the progress entry was last updated';

-- Create trigger for updating timestamps
CREATE TRIGGER update_progress_updated_at
    BEFORE UPDATE ON public.progress
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 