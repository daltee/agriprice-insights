
-- Enum for roles
CREATE TYPE public.app_role AS ENUM ('farmer','vendor','admin');

-- Profiles
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text NOT NULL,
  role public.app_role NOT NULL DEFAULT 'farmer',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles_select_all" ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

-- user_roles
CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "user_roles_self_select" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

-- Markets
CREATE TABLE public.markets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  location text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.markets TO anon, authenticated;
GRANT ALL ON public.markets TO service_role;
ALTER TABLE public.markets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "markets_public_read" ON public.markets FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "markets_admin_write" ON public.markets FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- Produce
CREATE TABLE public.produce (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.produce TO anon, authenticated;
GRANT ALL ON public.produce TO service_role;
ALTER TABLE public.produce ENABLE ROW LEVEL SECURITY;
CREATE POLICY "produce_public_read" ON public.produce FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "produce_admin_write" ON public.produce FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- Price entries
CREATE TABLE public.price_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  produce_id uuid NOT NULL REFERENCES public.produce(id) ON DELETE CASCADE,
  market_id uuid NOT NULL REFERENCES public.markets(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  price numeric(10,2) NOT NULL CHECK (price > 0),
  unit text NOT NULL DEFAULT 'kg',
  date_submitted timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.price_entries TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.price_entries TO authenticated;
GRANT ALL ON public.price_entries TO service_role;
ALTER TABLE public.price_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "price_entries_public_read" ON public.price_entries FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "price_entries_insert_own" ON public.price_entries FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "price_entries_update_own" ON public.price_entries FOR UPDATE TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "price_entries_delete_own" ON public.price_entries FOR DELETE TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(),'admin'));

CREATE INDEX idx_price_entries_produce ON public.price_entries(produce_id);
CREATE INDEX idx_price_entries_market ON public.price_entries(market_id);
CREATE INDEX idx_price_entries_date ON public.price_entries(date_submitted DESC);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_role public.app_role;
BEGIN
  v_role := COALESCE((NEW.raw_user_meta_data ->> 'role')::public.app_role, 'farmer');
  INSERT INTO public.profiles (id, name, email, role)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data ->> 'name', split_part(NEW.email,'@',1)), NEW.email, v_role);
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, v_role) ON CONFLICT DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Seed markets + produce
INSERT INTO public.markets (name, location) VALUES
  ('Mbarara Central Market','Mbarara'),
  ('Kakoba Market','Mbarara'),
  ('Nyamitanga Market','Mbarara'),
  ('Masaka Central Market','Masaka'),
  ('Kijjabwemi Market','Masaka'),
  ('Nyendo Market','Masaka');

INSERT INTO public.produce (name) VALUES
  ('Matoke'),('Beans'),('Maize'),('Cassava'),('Sweet Potatoes'),
  ('Irish Potatoes'),('Tomatoes'),('Onions'),('Groundnuts'),('Rice'),
  ('Millet'),('Sorghum'),('Cabbage'),('Carrots'),('Avocado'),('Pineapple');
