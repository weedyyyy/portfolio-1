import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Add this GET function to your existing file
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const id = parseInt(idParam);

    const education = await prisma.education.findUnique({
      where: { id },
    });

    if (!education) {
      return NextResponse.json(
        { error: "Education record not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(education);
  } catch (error) {
    console.error("Error fetching education record:", error);
    return NextResponse.json(
      { error: "Failed to fetch education record" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request, 
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const data = await request.json();
    
    // Check if the education record exists
    const existingEducation = await prisma.education.findUnique({
      where: { id },
    });
    
    if (!existingEducation) {
      return NextResponse.json(
        { error: "Education record not found" },
        { status: 404 }
      );
    }
    
    // Validate required fields
    if (!data.school || !data.degree || !data.start || !data.end) {
      return NextResponse.json(
        { error: "School, degree, start date, and end date are required" },
        { status: 400 }
      );
    }
    
    // Update the education record
    const updatedEducation = await prisma.education.update({
      where: { id },
      data: {
        school: data.school,
        degree: data.degree,
        logoUrl: data.logoUrl || null,
        href: data.href || null,
        start: data.start,
        end: data.end,
        order: data.order !== undefined ? data.order : existingEducation.order,
      }
    });
    
    return NextResponse.json(updatedEducation);
  } catch (error) {
    console.error("Error updating education record:", error);
    return NextResponse.json(
      { error: "Failed to update education record" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request, 
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    
    // Check if the education record exists
    const existingEducation = await prisma.education.findUnique({
      where: { id },
    });
    
    if (!existingEducation) {
      return NextResponse.json(
        { error: "Education record not found" },
        { status: 404 }
      );
    }
    
    // Delete the education record
    await prisma.education.delete({
      where: { id },
    });
    
    return NextResponse.json(
      { message: "Education record deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting education record:", error);
    return NextResponse.json(
      { error: "Failed to delete education record" },
      { status: 500 }
    );
  }
} 