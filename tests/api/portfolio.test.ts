import { describe, it, expect, vi, beforeEach } from "vitest";
import prisma from "@/lib/prisma";
import { GET as portfolioGET } from "@/app/api/portfolio/route";

describe("/api/portfolio", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("GET aggregates data and returns 200", async () => {
    vi.spyOn(prisma.personalInfo, "findFirst").mockResolvedValue({} as any);
    vi.spyOn(prisma.skill, "findMany").mockResolvedValue([] as any);
    vi.spyOn(prisma.workExperience, "findMany").mockResolvedValue([] as any);
    vi.spyOn(prisma.education, "findMany").mockResolvedValue([] as any);
    vi.spyOn(prisma.project, "findMany").mockResolvedValue([] as any);
    vi.spyOn(prisma.language, "findMany").mockResolvedValue([] as any);
    vi.spyOn(prisma.hackathon, "findMany").mockResolvedValue([] as any);

    const res = await portfolioGET();
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data).toHaveProperty("skills");
    expect(data).toHaveProperty("projects");
  });
});


