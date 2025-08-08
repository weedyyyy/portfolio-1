import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    // Get personal info
    const personalInfo = await prisma.personalInfo.findFirst();
    
    // Get skills ordered by name
    const skills = await prisma.skill.findMany({
      orderBy: { name: "asc" }
    });
    
    // Get work experience ordered by order
    const work = await prisma.workExperience.findMany({
      orderBy: { order: "asc" }
    });
    
    // Get education ordered by order
    const education = await prisma.education.findMany({
      orderBy: { order: "asc" }
    });
    
    // Get projects ordered by order
    const projects = await prisma.project.findMany({
      orderBy: { order: "asc" }
    });
    
    // Get languages
    const languages = await prisma.language.findMany();
    
    // Get hackathons
    const hackathons = await prisma.hackathon.findMany({
      orderBy: { order: "asc" }
    });
    
    // Return all data
    return NextResponse.json({
      personalInfo: personalInfo || {},
      skills,
      work,
      education,
      projects,
      languages,
      hackathons
    });
  } catch (error) {
    console.error("Error fetching portfolio data:", error);
    return NextResponse.json(
      { error: "Failed to fetch portfolio data" },
      { status: 500 }
    );
  }
} 