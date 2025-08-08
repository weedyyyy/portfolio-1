import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const languages = await prisma.language.findMany({
      orderBy: { name: "asc" }
    });
    
    return NextResponse.json(languages);
  } catch (error) {
    console.error("Error fetching languages:", error);
    return NextResponse.json(
      { error: "Failed to fetch languages" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Validate required fields
    if (!data.name || !data.level) {
      return NextResponse.json(
        { error: "Name and level are required" },
        { status: 400 }
      );
    }
    
    // Create new language
    const language = await prisma.language.create({
      data: {
        name: data.name,
        level: data.level,
        flagIcon: data.flagIcon || null
      }
    });
    
    return NextResponse.json(language, { status: 201 });
  } catch (error) {
    console.error("Error creating language:", error);
    return NextResponse.json(
      { error: "Failed to create language" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const data = await request.json();
    
    // Validate required fields
    if (!data.id || !data.name || !data.level) {
      return NextResponse.json(
        { error: "ID, name, and level are required" },
        { status: 400 }
      );
    }
    
    // Update language
    const language = await prisma.language.update({
      where: { id: data.id },
      data: {
        name: data.name,
        level: data.level,
        flagIcon: data.flagIcon || null
      }
    });
    
    return NextResponse.json(language);
  } catch (error) {
    console.error("Error updating language:", error);
    return NextResponse.json(
      { error: "Failed to update language" },
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
        { error: "Language ID is required" },
        { status: 400 }
      );
    }
    
    // Delete language
    await prisma.language.delete({
      where: { id: parseInt(id) }
    });
    
    return NextResponse.json(
      { message: "Language deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting language:", error);
    return NextResponse.json(
      { error: "Failed to delete language" },
      { status: 500 }
    );
  }
} 