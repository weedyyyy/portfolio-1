import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    // Get the first personal info record (there should only be one)
    const personalInfo = await prisma.personalInfo.findFirst();
    
    if (!personalInfo) {
      return NextResponse.json(
        { error: "Personal information not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(personalInfo);
  } catch (error) {
    console.error("Error fetching personal info:", error);
    return NextResponse.json(
      { error: "Failed to fetch personal information" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const data = await request.json();
    
    // Validate required fields
    if (!data.name || !data.initials || !data.url || !data.location || !data.description || !data.summary) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    
    // Get the first record or create if it doesn't exist
    const existingInfo = await prisma.personalInfo.findFirst();
    
    let personalInfo;
    
    if (existingInfo) {
      // Update existing record
      personalInfo = await prisma.personalInfo.update({
        where: { id: existingInfo.id },
        data: {
          name: data.name,
          initials: data.initials,
          url: data.url,
          location: data.location,
          locationLink: data.locationLink,
          description: data.description,
          summary: data.summary,
          avatarUrl: data.avatarUrl
        }
      });
    } else {
      // Create new record
      personalInfo = await prisma.personalInfo.create({
        data: {
          name: data.name,
          initials: data.initials,
          url: data.url,
          location: data.location,
          locationLink: data.locationLink,
          description: data.description,
          summary: data.summary,
          avatarUrl: data.avatarUrl
        }
      });
    }
    
    return NextResponse.json(personalInfo);
  } catch (error) {
    console.error("Error updating personal info:", error);
    return NextResponse.json(
      { error: "Failed to update personal information" },
      { status: 500 }
    );
  }
} 