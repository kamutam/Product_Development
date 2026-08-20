-- ==============================================================================
-- BRIHASPATHI TECHNOLOGIES - ENTERPRISE DATABASE SCHEMA
-- PRODUCT DEVELOPMENT & AGENTIC AI TENDER HOMOLOGATION ARCHITECTURE
-- ==============================================================================

-- 1. Auth Profiles Table (RBAC: Engineering, Procurement, Bid Director, Admin)
CREATE TABLE IF NOT EXISTS public.auth_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT UNIQUE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT DEFAULT 'Product_Engineer', -- 'Product_Engineer' | 'Procurement_Lead' | 'Bid_Director' | 'Admin'
  department TEXT DEFAULT 'Product Engineering & Homologation',
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Projects & Tenders Master
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  authority TEXT,
  status TEXT DEFAULT 'Active',
  budget TEXT,
  progress INTEGER DEFAULT 0,
  bomCount INTEGER DEFAULT 0,
  requirements JSONB DEFAULT '[]'::jsonb,
  itemsQuantity JSONB DEFAULT '[]'::jsonb,
  savedBom JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Products Master Catalog (STQC / ARAI Certified Hardware)
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  sku TEXT,
  vendor TEXT,
  price NUMERIC DEFAULT 0,
  category TEXT,
  specs JSONB DEFAULT '{}'::jsonb,
  certifications JSONB DEFAULT '["STQC TAC", "MeiTY", "CE", "FCC", "RoHS"]'::jsonb,
  stqc_pdf_url TEXT,
  datasheet_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Categories Master
CREATE TABLE IF NOT EXISTS public.categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  fields JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Structured Tender RFPs Master
CREATE TABLE IF NOT EXISTS public.tender_rfps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tender_ref_no TEXT UNIQUE NOT NULL,
  gem_bid_id TEXT,
  organisation_name TEXT NOT NULL,
  tender_title TEXT NOT NULL,
  tender_domain TEXT DEFAULT 'surveillance', -- 'surveillance' | 'transit' | 'solar' | 'networking' | 'access_control' | 'general'
  estimated_cost TEXT,
  emd_amount TEXT,
  submission_deadline TEXT,
  pre_bid_date TEXT,
  technical_opening_date TEXT,
  status TEXT DEFAULT 'Evaluated', -- 'Evaluated' | 'Approved' | 'Deviated' | 'Submitted'
  raw_file_name TEXT,
  raw_file_url TEXT,
  created_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Normalized 4-Module Tender Intelligence Store
CREATE TABLE IF NOT EXISTS public.tender_modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tender_ref_no TEXT REFERENCES public.tender_rfps(tender_ref_no) ON DELETE CASCADE,
  gem_administrative JSONB NOT NULL DEFAULT '{}'::jsonb,
  technical_specifications JSONB NOT NULL DEFAULT '{}'::jsonb,
  master_boq JSONB NOT NULL DEFAULT '{}'::jsonb,
  atc_and_sow JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Form-4 Technical Deviation Records & Homologation Remarks
CREATE TABLE IF NOT EXISTS public.form4_deviations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tender_ref_no TEXT REFERENCES public.tender_rfps(tender_ref_no) ON DELETE CASCADE,
  item_name TEXT NOT NULL,
  tender_clause TEXT NOT NULL,
  proposed_spec TEXT NOT NULL,
  variance_reason TEXT NOT NULL,
  engineering_remedy TEXT NOT NULL,
  compliance_status TEXT DEFAULT 'APPROVED_WITH_UPGRADE',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. Technical Requirements & SOW Clauses
CREATE TABLE IF NOT EXISTS public.requirements (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT,
  solution TEXT,
  techSpecs TEXT,
  quantity TEXT,
  location TEXT,
  project TEXT,
  priority TEXT,
  requiredCertifications TEXT,
  timeline TEXT,
  status TEXT,
  createdDate TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. OEM Directory & Automated Dispatch History
CREATE TABLE IF NOT EXISTS public.email_history (
  id TEXT PRIMARY KEY,
  date TEXT,
  oemName TEXT,
  oemEmail TEXT,
  requirementTitle TEXT,
  subject TEXT,
  body TEXT,
  status TEXT DEFAULT 'Sent',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 10. Audit Logs Table (Full Traceability)
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  performed_by TEXT,
  details JSONB DEFAULT '{}'::jsonb,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 11. AI Tender Dossiers Legacy Table (Backward Compatibility)
CREATE TABLE IF NOT EXISTS public.tender_dossiers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gem_id TEXT UNIQUE NOT NULL,
  organisation_name TEXT,
  tender_name TEXT,
  ecv_value TEXT,
  emd_amount TEXT,
  last_date TEXT,
  pre_bid_date TEXT,
  dossier_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.auth_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tender_rfps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tender_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.form4_deviations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.requirements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tender_dossiers ENABLE ROW LEVEL SECURITY;

-- Clean existing policies safely
DROP POLICY IF EXISTS "Allow public read-write on auth_profiles" ON public.auth_profiles;
DROP POLICY IF EXISTS "Allow public read-write on projects" ON public.projects;
DROP POLICY IF EXISTS "Allow public read-write on products" ON public.products;
DROP POLICY IF EXISTS "Allow public read-write on categories" ON public.categories;
DROP POLICY IF EXISTS "Allow public read-write on tender_rfps" ON public.tender_rfps;
DROP POLICY IF EXISTS "Allow public read-write on tender_modules" ON public.tender_modules;
DROP POLICY IF EXISTS "Allow public read-write on form4_deviations" ON public.form4_deviations;
DROP POLICY IF EXISTS "Allow public read-write on requirements" ON public.requirements;
DROP POLICY IF EXISTS "Allow public read-write on email_history" ON public.email_history;
DROP POLICY IF EXISTS "Allow public read-write on audit_logs" ON public.audit_logs;
DROP POLICY IF EXISTS "Allow public read-write on tender_dossiers" ON public.tender_dossiers;

-- Apply permissive read-write policies for development
CREATE POLICY "Allow public read-write on auth_profiles" ON public.auth_profiles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read-write on projects" ON public.projects FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read-write on products" ON public.products FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read-write on categories" ON public.categories FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read-write on tender_rfps" ON public.tender_rfps FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read-write on tender_modules" ON public.tender_modules FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read-write on form4_deviations" ON public.form4_deviations FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read-write on requirements" ON public.requirements FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read-write on email_history" ON public.email_history FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read-write on audit_logs" ON public.audit_logs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read-write on tender_dossiers" ON public.tender_dossiers FOR ALL USING (true) WITH CHECK (true);
