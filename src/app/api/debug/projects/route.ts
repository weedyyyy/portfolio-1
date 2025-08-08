import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    // Fetch all projects
    const projects = await prisma.project.findMany({
      orderBy: {
        order: "asc",
      },
    });

    // Process each project to check for JSON parsing issues
    const processedProjects = projects.map(project => {
      let processedLinks;
      try {
        processedLinks = project.links ? JSON.parse(JSON.stringify(project.links)) : null;
      } catch (error) {
        processedLinks = { error: `Failed to parse links: ${String(error)}` };
      }

      let processedTechnologies;
      try {
        processedTechnologies = project.technologies ? 
          (Array.isArray(project.technologies) ? project.technologies : JSON.parse(JSON.stringify(project.technologies))) : 
          [];
      } catch (error) {
        processedTechnologies = { error: `Failed to parse technologies: ${String(error)}` };
      }

      return {
        ...project,
        links: project.links,
        processedLinks,
        technologies: project.technologies,
        processedTechnologies,
        rawLinks: typeof project.links === 'object' ? JSON.stringify(project.links) : project.links,
        rawTechnologies: typeof project.technologies === 'object' ? JSON.stringify(project.technologies) : project.technologies,
      };
    });

    return NextResponse.json({
      count: projects.length,
      projects: processedProjects,
    });
  } catch (error) {
    console.error("Error fetching projects data:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects data", details: String(error) },
      { status: 500 }
    );
  }
} 