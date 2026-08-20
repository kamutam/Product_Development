if (typeof globalThis.WebSocket === 'undefined') {
  globalThis.WebSocket = class DummyWebSocket {};
}

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { CATEGORIES, INITIAL_PROJECTS, INITIAL_PRODUCTS } from './src/data/initialData.js';

dotenv.config({ path: './.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: false },
  realtime: { enabled: false }
});

const INITIAL_REQUIREMENTS = [
  {
    id: 'req-1',
    title: '4MP Motorized Varifocal Bullet Camera for Rail Station CCTV',
    category: 'CCTV & Surveillance',
    solution: 'IP Bullet Camera',
    techSpecs: '4MP, 1/2.8" CMOS, 2.7-13.5mm Lens, 50m IR, IP67, STQC Lab Certified, ONVIF Profile S/G/T',
    quantity: '250 Units',
    location: 'Northern Railway Loco Shed / Station',
    project: 'Northern Railway STQC Locomotive CCTV',
    priority: 'Critical',
    requiredCertifications: 'STQC Certified, ONVIF',
    timeline: '15 Days',
    status: 'Researching',
    createdDate: '2026-08-10'
  },
  {
    id: 'req-2',
    title: 'Smart Pole Multi-Sensor IoT Node & Environmental Sensor Hub',
    category: 'Smart City Infrastructure',
    solution: 'Smart Pole IoT Node',
    techSpecs: 'AQI Sensor, Temperature, Humidity, Noise Monitoring, RS485/Modbus, IP66 Enclosure',
    quantity: '100 Units',
    location: 'Amaravati Capital Region',
    project: 'AP-CRDA Amaravati Smart City Smart Pole Project',
    priority: 'High',
    requiredCertifications: 'CE, FCC, RoHS',
    timeline: '30 Days',
    status: 'OEM Contacted',
    createdDate: '2026-08-12'
  }
];

const INITIAL_EMAILS = [
  {
    id: 'email-1',
    date: '2026-08-12',
    oemName: 'Aditya Infotech Ltd (CP PLUS)',
    oemEmail: 'gov.sales@cpplusworld.com',
    requirementTitle: '4MP Motorized Varifocal Bullet Camera STQC Certified',
    subject: 'Business Requirement: 4MP Motorized Varifocal Bullet Camera STQC Certified – Brihaspathi Technologies Limited',
    body: `Dear CP PLUS Team,\n\nWe are writing to you from Brihaspathi Technologies Limited...`,
    status: 'Sent'
  }
];

async function seedData() {
  console.log('Seeding Categories...');
  const catData = CATEGORIES.map(c => ({ 
    id: c.id, 
    name: c.name, 
    fields: JSON.stringify(c.fields) 
  }));
  const { error: catErr } = await supabase.from('categories').upsert(catData);
  if (catErr) console.error('Error seeding categories:', catErr.message || catErr);

  console.log('Seeding Projects...');
  const projData = INITIAL_PROJECTS.map(p => ({ 
    id: p.id,
    name: p.name,
    status: p.status
  }));
  const { error: projErr } = await supabase.from('projects').upsert(projData);
  if (projErr) console.error('Error seeding projects:', projErr.message || projErr);

  console.log('Seeding Products...');
  const catIds = CATEGORIES.map(c => c.id);
  const chunkSize = 50;
  for (let i = 0; i < INITIAL_PRODUCTS.length; i += chunkSize) {
    const chunk = INITIAL_PRODUCTS.slice(i, i + chunkSize).map(p => ({
      id: p.id,
      name: p.name,
      sku: p.sku,
      vendor: p.vendor,
      categoryId: catIds.includes(p.categoryId) ? p.categoryId : null,
      specs: JSON.stringify(p.specs || {})
    }));
    const { error: prodErr } = await supabase.from('products').upsert(chunk);
    if (prodErr) console.error(`Error seeding products chunk ${i}:`, prodErr.message || prodErr);
  }

  console.log('Seeding Requirements...');
  const { error: reqErr } = await supabase.from('requirements').upsert(INITIAL_REQUIREMENTS);
  if (reqErr) console.error('Error seeding requirements:', reqErr);

  console.log('Seeding Email History...');
  const { error: emailErr } = await supabase.from('email_history').upsert(INITIAL_EMAILS);
  if (emailErr) console.error('Error seeding emails:', emailErr);

  console.log('Seeding Auth Profiles...');
  const initialProfiles = [
    {
      email: 'venu@brihaspathi.com',
      full_name: 'Venu Madhav',
      role: 'Product_Engineer',
      department: 'Product Engineering & Homologation'
    },
    {
      email: 'admin@brihaspathi.com',
      full_name: 'Engineering Director',
      role: 'Admin',
      department: 'Executive Management'
    }
  ];
  const { error: profErr } = await supabase.from('auth_profiles').upsert(initialProfiles, { onConflict: 'email' });
  if (profErr) console.warn('Note on seeding auth_profiles:', profErr.message || profErr);

  console.log('Seeding Complete!');
}

seedData();
