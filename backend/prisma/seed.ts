import { PrismaClient, RoleType, ProductStatus, PriorityLevel, TenderStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Brihaspathi Product Intelligence Database Seed...');

  // 1. Seed Roles & Permissions
  console.log('🔐 Seeding Roles...');
  const roles = [
    { name: RoleType.ADMIN, description: 'Super Administrator with complete system access' },
    { name: RoleType.PRODUCT_MANAGER, description: 'Product Development & Roadmap Manager' },
    { name: RoleType.RESEARCHER, description: 'Market & Competitor Intelligence Specialist' },
    { name: RoleType.ANALYST, description: 'Analytics & Financial Feasibility Analyst' },
    { name: RoleType.SALES, description: 'Tender Bidding & Government Sales Lead' },
    { name: RoleType.VENDOR_MANAGER, description: 'OEM Sourcing & Vendor Procurement Officer' },
    { name: RoleType.USER, description: 'Standard Engineering Staff' }
  ];

  for (const r of roles) {
    await prisma.role.upsert({
      where: { name: r.name },
      update: { description: r.description },
      create: r
    });
  }

  // 2. Seed Default Admin & Engineering Users
  console.log('👤 Seeding Users...');
  const passwordHash = await bcrypt.hash('Brihaspathi@2026', 10);

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@brihaspathi.com' },
    update: {},
    create: {
      email: 'admin@brihaspathi.com',
      passwordHash,
      fullName: 'Kamutam Venu Madhav',
      department: 'Product Development Leadership',
      role: RoleType.ADMIN,
      isActive: true,
      emailVerified: true
    }
  });

  const pmUser = await prisma.user.upsert({
    where: { email: 'pm@brihaspathi.com' },
    update: {},
    create: {
      email: 'pm@brihaspathi.com',
      passwordHash,
      fullName: 'Senior Product Manager',
      department: 'Hardware Engineering & Homologation',
      role: RoleType.PRODUCT_MANAGER,
      isActive: true,
      emailVerified: true
    }
  });

  // 3. Seed Product Categories
  console.log('📦 Seeding Product Categories...');
  const categories = [
    { id: 'cat-cctv', name: 'CCTV & Surveillance', icon: 'Camera', description: 'STQC Certified IP Cameras, NVRs, and AI Analytics' },
    { id: 'cat-iot', name: 'Smart City Infrastructure', icon: 'Cpu', description: 'Smart Poles, Environmental Sensors, and Gateways' },
    { id: 'cat-solar', name: 'Solar & Renewable Energy', icon: 'Sun', description: 'Solar Inverters, Charge Controllers, and PV Modules' },
    { id: 'cat-transit', name: 'Intelligent Transit Systems', icon: 'Bus', description: 'AIS-140 GPS Trackers, Vehicle Cameras, and Panic Buttons' },
    { id: 'cat-access', name: 'Access Control & Biometrics', icon: 'Lock', description: 'STQC UIDAI Biometric Terminals, RFID, and Flap Barriers' }
  ];

  for (const c of categories) {
    await prisma.productCategory.upsert({
      where: { name: c.name },
      update: { description: c.description, icon: c.icon },
      create: c
    });
  }

  // 4. Seed OEM Vendors
  console.log('🏢 Seeding OEM Vendors...');
  const vendors = [
    {
      name: 'Aditya Infotech Ltd (CP PLUS)',
      oemCategory: 'CCTV / Surveillance',
      country: 'India',
      website: 'https://www.cpplusworld.com',
      rating: 4.8,
      tier: 'TIER_1'
    },
    {
      name: 'Banovision India Private Limited',
      oemCategory: 'CCTV & DeepinView AI',
      country: 'India',
      website: 'https://banovision.in',
      rating: 4.6,
      tier: 'TIER_1'
    },
    {
      name: 'Brihaspathi Technologies OEM Labs',
      oemCategory: 'Smart City & Transit Systems',
      country: 'India',
      website: 'https://brihaspathi.com',
      rating: 5.0,
      tier: 'TIER_1'
    }
  ];

  for (const v of vendors) {
    await prisma.vendor.upsert({
      where: { name: v.name },
      update: { rating: v.rating, tier: v.tier },
      create: v
    });
  }

  // 5. Seed Core Products
  console.log('🔬 Seeding Products & Specifications...');
  const products = [
    {
      name: 'CP Plus 4MP Motorized Varifocal Bullet Camera',
      sku: 'CP-UNC-TA41ZL6C-VMD',
      vendorName: 'Aditya Infotech Ltd (CP PLUS)',
      price: 12500,
      status: ProductStatus.CERTIFIED,
      specs: {
        resolution: '4 MP (2560x1440)',
        sensor: '1/2.8" CMOS',
        lens: '2.7mm–13.5mm Motorized Varifocal',
        stqcCertified: true,
        irDistance: '50m Smart IR',
        ipRating: 'IP67 Weatherproof',
        onvif: 'Profile S/G/T'
      },
      certifications: ['STQC TAC', 'MeiTY', 'BIS CRS', 'CE', 'FCC', 'RoHS']
    },
    {
      name: 'Banovision 8MP 4K AI DeepinView Bullet Camera',
      sku: 'BANO-IPC-HFW7842',
      vendorName: 'Banovision India Private Limited',
      price: 32500,
      status: ProductStatus.CERTIFIED,
      specs: {
        resolution: '8 MP 4K Ultra HD',
        sensor: '1/1.8" Low-Light CMOS',
        lens: '2.8mm–12mm Motorized',
        stqcCertified: true,
        anprEnabled: true,
        ipRating: 'IP67 / IK10'
      },
      certifications: ['STQC TAC', 'MeiTY', 'BIS CRS', 'ISO 9001/27001']
    },
    {
      name: 'Brihaspathi Smart City Multi-Sensor IoT Node',
      sku: 'BTL-IOT-ENV-NODE-4.0',
      vendorName: 'Brihaspathi Technologies OEM Labs',
      price: 14500,
      status: ProductStatus.ACTIVE,
      specs: {
        sensors: 'PM2.5, PM10, CO2, Temperature, Humidity, Ambient Noise',
        communication: 'RS485 Modbus / 4G LTE / LoRaWAN',
        enclosure: 'IP66 Industrial Aluminum'
      },
      certifications: ['CE', 'FCC', 'RoHS', 'Make in India Class-I']
    }
  ];

  for (const p of products) {
    await prisma.product.upsert({
      where: { sku: p.sku },
      update: { price: p.price, specs: p.specs, certifications: p.certifications },
      create: p
    });
  }

  // 6. Seed Sample Tenders
  console.log('📑 Seeding Tender Intelligence Records...');
  await prisma.tender.upsert({
    where: { tenderRefNo: 'GAIL/NDA26028VK/C&P/SECURITY' },
    update: {},
    create: {
      tenderRefNo: 'GAIL/NDA26028VK/C&P/SECURITY',
      gemBidId: 'GEM/2026/B/7881442',
      title: 'Turnkey CCTV & Security Surveillance System Implementation with 3-Year Warranty/FMS & 4-Year CAMC',
      organisationName: 'GAIL (India) Limited',
      department: 'Corporate Contracts & Procurement',
      tenderDomain: 'surveillance',
      estimatedValue: 24500000,
      emdAmount: 495000,
      emdMode: 'Bank Guarantee / RTGS / MSME Exempted',
      status: TenderStatus.HOMOLOGATED,
      totalPages: 345,
      creatorId: adminUser.id,
      statutoryDossier: {
        point1_tenderNumber: 'GAIL/NDA26028VK/C&P/SECURITY',
        point2_name: 'Turnkey CCTV & Security Surveillance System',
        point3_orgName: 'GAIL (India) Limited',
        point4_emdModeAndValue: '₹4,95,000 / BG / RTGS (MSME Exempted)',
        point9_eligibility: 'Turnover min ₹126 Lakhs + STQC MeiTY TAC Mandate',
        point10_warranty: '36 Months Comprehensive On-site OEM Warranty',
        point11_paymentTerms: '60% Supply, 20% Installation, 20% Final SAT; Bill paid in 15 days'
      }
    }
  });

  // 7. Seed Initial Analytics Snapshot
  console.log('📊 Seeding Analytics Telemetry Snapshot...');
  await prisma.analyticsSnapshot.create({
    data: {
      totalProducts: 48,
      activeProjects: 4,
      totalTenders: 12,
      totalVendors: 8,
      bomSpendTotal: 18450000,
      homologationRate: 98.5,
      pipelineGrowth: 14.8,
      metricsPayload: {
        activeCategories: 5,
        monthlyVerifiedComponents: 34,
        avgComplianceScore: 492
      }
    }
  });

  console.log('✅ Database Seed Completed Successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Database Seed Failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
