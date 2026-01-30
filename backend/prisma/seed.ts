import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

interface RawIncident {
  _id: { $oid: string };
  id: string;
  __v: number;
  action_cause?: string;
  behavior_type?: string;
  company_type?: string;
  craft_code?: string;
  createdAt: number;
  day_of_year: number;
  gbu?: string;
  incident_date: number;
  incident_number: string;
  is_lcv: boolean;
  job?: string;
  lastUpdated: number;
  location?: string;
  month: number;
  near_miss_sub_category?: string;
  primary_category?: string;
  region?: string;
  severity_level: number;
  unsafe_condition_or_behavior?: string;
  violation_probability_level: number;
  violation_risk_severity_level: number;
  violation_severity_level: number;
  week: number;
  year: number;
}

async function main() {
  console.log('🌱 Starting seed...');

  // Read JSON file
  const dataPath = path.join(__dirname, '../data/db.dashboard_incidents.json');
  const rawData = fs.readFileSync(dataPath, 'utf-8');
  const incidents: RawIncident[] = JSON.parse(rawData);

  console.log(`📊 Found ${incidents.length} incidents to seed`);

  // Clear existing data
  console.log('🗑️  Clearing existing incidents...');
  await prisma.incident.deleteMany();

  // Batch insert for performance
  const batchSize = 500;
  let seeded = 0;

  for (let i = 0; i < incidents.length; i += batchSize) {
    const batch = incidents.slice(i, i + batchSize);

    await prisma.incident.createMany({
      data: batch.map((inc) => ({
        incidentNumber: inc.incident_number,
        incidentDate: new Date(inc.incident_date),
        severityLevel: inc.severity_level || 0,
        actionCause: inc.action_cause || null,
        behaviorType: inc.behavior_type || null,
        gbu: inc.gbu || null,
        region: inc.region || null,
        primaryCategory: inc.primary_category || null,
        nearMissSubCategory: inc.near_miss_sub_category || null,
        unsafeConditionOrBehavior: inc.unsafe_condition_or_behavior || null,
        companyType: inc.company_type || null,
        location: inc.location || null,
        job: inc.job || null,
        craftCode: inc.craft_code || null,
        year: inc.year,
        month: inc.month,
        week: inc.week,
        dayOfYear: inc.day_of_year,
        isLcv: inc.is_lcv || false,
      })),
      skipDuplicates: true,
    });

    seeded += batch.length;
    console.log(`✅ Seeded ${seeded}/${incidents.length} incidents`);
  }

  console.log('🎉 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
