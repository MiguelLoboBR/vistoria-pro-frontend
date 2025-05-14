
-- Create the inspections table for storing real inspection data
CREATE TABLE IF NOT EXISTS public.inspections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  address TEXT NOT NULL,
  date TEXT NOT NULL, -- Store as text to maintain formatting
  time TEXT, -- Optional time field
  status TEXT NOT NULL CHECK (status IN ('pending', 'in_progress', 'completed', 'canceled')) DEFAULT 'pending',
  inspector_id UUID REFERENCES public.profiles(id),
  type TEXT NOT NULL,
  company_id UUID NOT NULL REFERENCES public.companies(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index on company_id for faster lookup
CREATE INDEX IF NOT EXISTS inspections_company_id_idx ON public.inspections (company_id);

-- Index on inspector_id for faster lookup
CREATE INDEX IF NOT EXISTS inspections_inspector_id_idx ON public.inspections (inspector_id);

-- Enable Row Level Security
ALTER TABLE public.inspections ENABLE ROW LEVEL SECURITY;

-- Company admins can view all inspections for their company
CREATE POLICY "Company admins can view all company inspections"
  ON public.inspections
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
      AND profiles.company_id = inspections.company_id
    )
  );

-- Inspectors can view inspections assigned to them
CREATE POLICY "Inspectors can view their assigned inspections"
  ON public.inspections
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'inspector'
      AND (
        profiles.company_id = inspections.company_id 
        OR profiles.id = inspections.inspector_id
      )
    )
  );

-- Company admins can create inspections for their company
CREATE POLICY "Company admins can create inspections"
  ON public.inspections
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
      AND profiles.company_id = inspections.company_id
    )
  );

-- Company admins can update inspections for their company
CREATE POLICY "Company admins can update inspections"
  ON public.inspections
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
      AND profiles.company_id = inspections.company_id
    )
  );

-- Assigned inspectors can update their inspections
CREATE POLICY "Assigned inspectors can update their inspections"
  ON public.inspections
  FOR UPDATE
  USING (
    auth.uid() = inspector_id
  );

-- Company admins can delete inspections for their company
CREATE POLICY "Company admins can delete inspections"
  ON public.inspections
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
      AND profiles.company_id = inspections.company_id
    )
  );

-- Create a trigger to update the updated_at timestamp
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_inspections_updated_at
BEFORE UPDATE ON public.inspections
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();
