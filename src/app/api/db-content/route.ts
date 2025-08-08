import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    // Fetch data from all tables
    const [
      personalInfo,
      skills,
      projects,
      workExperience,
      education,
      languages,
      hackathons,
      messages
    ] = await Promise.all([
      prisma.personalInfo.findMany(),
      prisma.skill.findMany(),
      prisma.project.findMany(),
      prisma.workExperience.findMany(),
      prisma.education.findMany(),
      prisma.language.findMany(),
      prisma.hackathon.findMany(),
      prisma.message.findMany()
    ]);
    
    return NextResponse.json({ 
      success: true, 
      data: {
        personalInfo,
        skills,
        projects,
        workExperience,
        education,
        languages,
        hackathons,
        messages
      }
    });
  } catch (error: any) {
    console.error('Error fetching database content:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: "Failed to fetch database content", 
        error: error.message 
      },
      { status: 500 }
    );
  }
} 