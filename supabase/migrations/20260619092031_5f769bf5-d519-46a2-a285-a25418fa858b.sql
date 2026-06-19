
-- Add phone + location fields to profiles, image_url to produce
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS phone text,
  ADD COLUMN IF NOT EXISTS country_code text,
  ADD COLUMN IF NOT EXISTS location_label text,
  ADD COLUMN IF NOT EXISTS location_lat numeric,
  ADD COLUMN IF NOT EXISTS location_lng numeric;

ALTER TABLE public.produce
  ADD COLUMN IF NOT EXISTS image_url text,
  ADD COLUMN IF NOT EXISTS slug text;

-- Backfill slugs
UPDATE public.produce SET slug = lower(regexp_replace(name,'\s+','-','g')) WHERE slug IS NULL;

-- Update handle_new_user to capture phone fields
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_role public.app_role;
BEGIN
  v_role := COALESCE((NEW.raw_user_meta_data ->> 'role')::public.app_role, 'farmer');
  INSERT INTO public.profiles (id, name, email, role, phone, country_code)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'name', split_part(COALESCE(NEW.email,''),'@',1), 'AgriPrice user'),
    COALESCE(NEW.email, ''),
    v_role,
    NEW.raw_user_meta_data ->> 'phone',
    NEW.raw_user_meta_data ->> 'country_code'
  )
  ON CONFLICT (id) DO NOTHING;
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, v_role) ON CONFLICT DO NOTHING;
  RETURN NEW;
END;
$function$;

-- Ensure trigger exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
