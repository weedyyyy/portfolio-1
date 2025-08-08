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
    
    // Check if the skill exists
    const existingSkill = await prisma.skill.findUnique({
      where: { id },
    });
    
    if (!existingSkill) {
      return NextResponse.json(
        { error: "Skill not found" },
        { status: 404 }
      );
    }
    
    // Validate required fields
    if (!data.name || !data.icon) {
      return NextResponse.json(
        { error: "Name and icon are required" },
        { status: 400 }
      );
    }
    
    // Update the skill
    const updatedSkill = await prisma.skill.update({
      where: { id },
      data: {
        name: data.name,
        icon: data.icon,
        category: data.category || null,
      }
    });
    
    return NextResponse.json(updatedSkill);
  } catch (error) {
    console.error("Error updating skill:", error);
    return NextResponse.json(
      { error: "Failed to update skill" },
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
    
    // Check if the skill exists
    const existingSkill = await prisma.skill.findUnique({
      where: { id },
    });
    
    if (!existingSkill) {
      return NextResponse.json(
        { error: "Skill not found" },
        { status: 404 }
      );
    }
    
    // Delete the skill
    await prisma.skill.delete({
      where: { id },
    });
    
    return NextResponse.json(
      { message: "Skill deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting skill:", error);
    return NextResponse.json(
      { error: "Failed to delete skill" },
      { status: 500 }
    );
  }
} 