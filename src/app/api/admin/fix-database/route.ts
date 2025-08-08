import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    // Fix projects issues
    const projects = await prisma.project.findMany();
    
    let fixedCount = 0;
    
    // Process each project to fix any data issues
    for (const project of projects) {
      const updates: any = {};
      
      // Fix technologies array
      if (!project.technologies || !Array.isArray(project.technologies)) {
        updates.technologies = [];
        fixedCount++;
      } else if (typeof project.technologies === 'string') {
        try {
          updates.technologies = JSON.parse(project.technologies);
          fixedCount++;
        } catch {
          updates.technologies = [];
          fixedCount++;
        }
      }
      
      // Fix links
      if (project.links && typeof project.links === 'string') {
        try {
          updates.links = JSON.parse(project.links);
          fixedCount++;
        } catch {
          updates.links = null;
          fixedCount++;
        }
      }
      
      // Update if needed
      if (Object.keys(updates).length > 0) {
        await prisma.project.update({
          where: { id: project.id },
          data: updates
        });
      }
    }
    
    // Fix work experience issues
    const workExperiences = await prisma.workExperience.findMany();
    
    for (const work of workExperiences) {
      const updates: any = {};
      
      // Fix badges array
      if (!work.badges || !Array.isArray(work.badges)) {
        updates.badges = [];
        fixedCount++;
      } else if (typeof work.badges === 'string') {
        try {
          updates.badges = JSON.parse(work.badges);
          fixedCount++;
        } catch {
          updates.badges = [];
          fixedCount++;
        }
      }
      
      // Update if needed
      if (Object.keys(updates).length > 0) {
        await prisma.workExperience.update({
          where: { id: work.id },
          data: updates
        });
      }
    }
    
    // Fix hackathons issues
    const hackathons = await prisma.hackathon.findMany();
    
    for (const hackathon of hackathons) {
      const updates: any = {};
      
      // Fix links
      if (hackathon.links && typeof hackathon.links === 'string') {
        try {
          updates.links = JSON.parse(hackathon.links);
          fixedCount++;
        } catch {
          updates.links = null;
          fixedCount++;
        }
      }
      
      // Update if needed
      if (Object.keys(updates).length > 0) {
        await prisma.hackathon.update({
          where: { id: hackathon.id },
          data: updates
        });
      }
    }
    
    return NextResponse.json({
      success: true,
      message: `Database fixed successfully. Fixed ${fixedCount} issues.`,
      fixedCount
    });
  } catch (error) {
    console.error("Error fixing database:", error);
    return NextResponse.json(
      { error: "Failed to fix database", details: String(error) },
      { status: 500 }
    );
  }
} 