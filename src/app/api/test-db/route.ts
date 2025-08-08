import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    // Test connection by running a simple query
    const personalInfo = await prisma.personalInfo.findFirst();
    
    return NextResponse.json({ 
      success: true, 
      message: "Database connection successful", 
      data: personalInfo || null
    });
  } catch (error: any) {
    console.error('Database connection error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: "Database connection failed", 
        error: error.message 
      },
      { status: 500 }
    );
  }
} 