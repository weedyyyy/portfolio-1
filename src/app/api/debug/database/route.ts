import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    // Fetch all data from the database
    const [
      personalInfo,
      skills,
      workExperience,
      education,
      projects,
      hackathons,
      languages,
      messages
    ] = await Promise.all([
      prisma.personalInfo.findFirst(),
      prisma.skill.findMany(),
      prisma.workExperience.findMany(),
      prisma.education.findMany(),
      prisma.project.findMany(),
      prisma.hackathon.findMany(),
      prisma.language.findMany(),
      prisma.message.findMany()
    ]);

    // Return all the data
    return NextResponse.json({
      personalInfo,
      counts: {
        skills: skills.length,
        workExperience: workExperience.length,
        education: education.length,
        projects: projects.length,
        hackathons: hackathons.length,
        languages: languages.length,
        messages: messages.length
      },
      skills,
      workExperience,
      education,
      projects,
      hackathons,
      languages,
      messages
    });
  } catch (error) {
    console.error("Error fetching database data:", error);
    return NextResponse.json(
      { error: "Failed to fetch database data", details: String(error) },
      { status: 500 }
    );
  }
} 