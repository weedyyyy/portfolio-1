import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const workExperiences = await prisma.workExperience.findMany({
      orderBy: {
        order: "asc",
      },
    });
    
    return NextResponse.json(workExperiences);
  } catch (error) {
    console.error("Error fetching work experiences:", error);
    return NextResponse.json(
      { error: "Failed to fetch work experiences" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Validate required fields
    if (!data.company || !data.title || !data.description || !data.start) {
      return NextResponse.json(
        { error: "Company, title, description, and start date are required" },
        { status: 400 }
      );
    }
    
    // Get the highest order to add the new item at the end
    const lastItem = await prisma.workExperience.findFirst({
      orderBy: {
        order: 'desc',
      },
    });
    
    const order = lastItem ? lastItem.order + 1 : 0;
    
    // Create new work experience
    const workExperience = await prisma.workExperience.create({
      data: {
        company: data.company,
        title: data.title,
        logoUrl: data.logoUrl || null,
        href: data.href || null,
        description: data.description,
        start: data.start,
        end: data.end || null,
        badges: data.badges || [],
        order: order,
      }
    });
    
    return NextResponse.json(workExperience);
  } catch (error) {
    console.error("Error creating work experience:", error);
    return NextResponse.json(
      { error: "Failed to create work experience" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const data = await request.json();
    
    // Validate required fields
    if (!data.id || !data.company || !data.title || !data.description || !data.start) {
      return NextResponse.json(
        { error: "ID, company, title, description, and start date are required" },
        { status: 400 }
      );
    }
    
    // Update work experience
    const work = await prisma.workExperience.update({
      where: { id: data.id },
      data: {
        company: data.company,
        title: data.title,
        logoUrl: data.logoUrl || null,
        href: data.href || null,
        description: data.description,
        start: data.start,
        end: data.end || null,
        badges: data.badges || [],
        order: data.order !== undefined ? data.order : undefined
      }
    });
    
    return NextResponse.json(work);
  } catch (error) {
    console.error("Error updating work experience:", error);
    return NextResponse.json(
      { error: "Failed to update work experience" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    
    if (!id) {
      return NextResponse.json(
        { error: "Work experience ID is required" },
        { status: 400 }
      );
    }
    
    // Delete work experience
    await prisma.workExperience.delete({
      where: { id: parseInt(id) }
    });
    
    return NextResponse.json(
      { message: "Work experience deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting work experience:", error);
    return NextResponse.json(
      { error: "Failed to delete work experience" },
      { status: 500 }
    );
  }
} 