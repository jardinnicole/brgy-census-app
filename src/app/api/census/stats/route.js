import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Census from '@/models/Census';

export async function GET() {
  try {
    await dbConnect();

    const censuses = await Census.find();

    let pwd = 0, soloParent = 0, seniorCitizen = 0, pregnant = 0;
    const incomeDistribution = {};
    const educationDistribution = {};

    censuses.forEach((entry) => {
      // Family Head demographics
      if (entry.familyHeadSector === 'PWD') pwd++;
      if (entry.familyHeadSector === 'Solo Parent') soloParent++;
      if (entry.familyHeadSector === 'Senior Citizen') seniorCitizen++;
      if (entry.familyHeadSector === 'Pregnant') pregnant++;

      // Income distribution (assuming you have a monthlyIncome field)
      if (entry.monthlyIncome) {
        const income = entry.monthlyIncome;
        incomeDistribution[income] = (incomeDistribution[income] || 0) + 1;
      }

      // Education distribution (assuming you have an education field for family head)
      if (entry.familyHeadEducation || entry.education) {
        const education = entry.familyHeadEducation || entry.education;
        educationDistribution[education] = (educationDistribution[education] || 0) + 1;
      }

      // Household Members demographics
      if (Array.isArray(entry.householdMembers)) {
        entry.householdMembers.forEach((member) => {
          if (member.sector === 'PWD') pwd++;
          if (member.sector === 'Solo Parent') soloParent++;
          if (member.sector === 'Senior Citizen') seniorCitizen++;
          if (member.sector === 'Pregnant') pregnant++;

          // Education distribution for household members
          if (member.education) {
            educationDistribution[member.education] = (educationDistribution[member.education] || 0) + 1;
          }
        });
      }
    });

    // Convert distribution objects to arrays for charts
    const incomeDistributionArray = Object.entries(incomeDistribution).map(([income, count]) => ({
      income,
      count
    }));

    const educationDistributionArray = Object.entries(educationDistribution).map(([education, count]) => ({
      education,
      count
    }));

    return NextResponse.json({
      pwd,
      soloParent,
      seniorCitizen,
      pregnant,
      households: censuses.length, // This was missing!
      incomeDistribution: incomeDistributionArray,
      educationDistribution: educationDistributionArray,
    });

  } catch (error) {
    console.error('Error fetching census stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch census statistics' },
      { status: 500 }
    );
  }
}