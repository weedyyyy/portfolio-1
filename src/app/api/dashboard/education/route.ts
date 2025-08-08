import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const educations = await prisma.education.findMany({
      orderBy: {
        order: "asc",
      },
    });
    
    return NextResponse.json(educations);
  } catch (error) {
    console.error("Error fetching education records:", error);
    return NextResponse.json(
      { error: "Failed to fetch education records" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Validate required fields
    if (!data.school || !data.degree || !data.start || !data.end) {
      return NextResponse.json(
        { error: "School, degree, start date, and end date are required" },
        { status: 400 }
      );
    }
    
    // Get the highest order to add the new item at the end
    const lastItem = await prisma.education.findFirst({
      orderBy: {
        order: 'desc',
      },
    });
    
    const order = lastItem ? lastItem.order + 1 : 0;
    
    // Create new education record
    const education = await prisma.education.create({
      data: {
        school: data.school,
        degree: data.degree,
        logoUrl: data.logoUrl || null,
        href: data.href || null,
        start: data.start,
        end: data.end,
        order: order,
      }
    });
    
    return NextResponse.json(education);
  } catch (error) {
    console.error("Error creating education record:", error);
    return NextResponse.json(
      { error: "Failed to create education record" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const data = await request.json();
    
    // Validate required fields
    if (!data.id || !data.school || !data.degree || !data.start || !data.end) {
      return NextResponse.json(
        { error: "ID, school, degree, start date, and end date are required" },
        { status: 400 }
      );
    }
    
    // Update education
    const education = await prisma.education.update({
      where: { id: data.id },
      data: {
        school: data.school,
        degree: data.degree,
        logoUrl: data.logoUrl || null,
        href: data.href || null,
        start: data.start,
        end: data.end,
        order: data.order !== undefined ? data.order : undefined
      }
    });
    
    return NextResponse.json(education);
  } catch (error) {
    console.error("Error updating education:", error);
    return NextResponse.json(
      { error: "Failed to update education" },
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
        { error: "Education ID is required" },
        { status: 400 }
      );
    }
    
    // Delete education
    await prisma.education.delete({
      where: { id: parseInt(id) }
    });
    
    return NextResponse.json(
      { message: "Education deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting education:", error);
    return NextResponse.json(
      { error: "Failed to delete education" },
      { status: 500 }
    );
  }
} 