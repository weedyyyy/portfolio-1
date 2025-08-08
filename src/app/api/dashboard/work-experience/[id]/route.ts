import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(
  request: Request, 
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const id = parseInt(idParam);
    const data = await request.json();
    
    // Check if the work experience exists
    const existingWork = await prisma.workExperience.findUnique({
      where: { id },
    });
    
    if (!existingWork) {
      return NextResponse.json(
        { error: "Work experience not found" },
        { status: 404 }
      );
    }
    
    // Validate required fields
    if (!data.company || !data.title || !data.description || !data.start) {
      return NextResponse.json(
        { error: "Company, title, description, and start date are required" },
        { status: 400 }
      );
    }
    
    // Update the work experience
    const updatedWork = await prisma.workExperience.update({
      where: { id },
      data: {
        company: data.company,
        title: data.title,
        logoUrl: data.logoUrl || null,
        href: data.href || null,
        description: data.description,
        start: data.start,
        end: data.end || null,
        badges: data.badges || [],
        order: data.order !== undefined ? data.order : existingWork.order,
      }
    });
    
    return NextResponse.json(updatedWork);
  } catch (error) {
    console.error("Error updating work experience:", error);
    return NextResponse.json(
      { error: "Failed to update work experience" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request, 
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const id = parseInt(idParam);
    
    // Check if the work experience exists
    const existingWork = await prisma.workExperience.findUnique({
      where: { id },
    });
    
    if (!existingWork) {
      return NextResponse.json(
        { error: "Work experience not found" },
        { status: 404 }
      );
    }
    
    // Delete the work experience
    await prisma.workExperience.delete({
      where: { id },
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