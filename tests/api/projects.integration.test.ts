import { describe, it, expect, vi, beforeEach } from "vitest";
import prisma from "@/lib/prisma";
import { POST as projectsPOST, PUT as projectsPUT } from "@/app/api/dashboard/projects/route";
import { GET as portfolioGET } from "@/app/api/portfolio/route";

type Project = {
  id: number;
  title: string;
  slug: string;
  description: string;
  dates?: string | null;
  image?: string | null;
  video?: string | null;
  technologies: string[];
  links?: any | null;
  featured: boolean;
  order: number;
};

describe("Dashboard -> Portfolio integration (mocked Prisma)", () => {
  let projectsStore: Project[];
  let nextId: number;

  beforeEach(() => {
    vi.restoreAllMocks();
    projectsStore = [];
    nextId = 1;

    // Projects mocks
    vi.spyOn(prisma.project, "findMany").mockImplementation(async (args?: any) => {
      if (args?.orderBy?.order === "asc") {
        return [...projectsStore].sort((a, b) => a.order - b.order) as any;
      }
      if (args?.orderBy?.order === "desc") {
        return [...projectsStore].sort((a, b) => b.order - a.order) as any;
      }
      return projectsStore as any;
    });

    vi.spyOn(prisma.project, "findUnique").mockImplementation(async ({ where }: any) => {
      if (where?.slug) {
        return projectsStore.find(p => p.slug === where.slug) as any;
      }
      if (where?.id != null) {
        return projectsStore.find(p => p.id === where.id) as any;
      }
      return null as any;
    });

    vi.spyOn(prisma.project, "findFirst").mockImplementation(async (args?: any) => {
      // Handle uniqueness check used in PUT when slug is being changed
      if (args?.where?.slug) {
        const slug: string = args.where.slug;
        const notId: number | undefined = args.where.id?.not;
        const found = projectsStore.find(p => p.slug === slug && (notId == null || p.id !== notId));
        return (found ?? null) as any;
      }
      if (args?.orderBy?.order === "desc") {
        const sorted = [...projectsStore].sort((a, b) => b.order - a.order);
        return (sorted[0] ?? null) as any;
      }
      return (projectsStore[0] ?? null) as any;
    });

    vi.spyOn(prisma.project, "create").mockImplementation(async ({ data }: any) => {
      const project: Project = {
        id: nextId++,
        title: data.title,
        slug: data.slug,
        description: data.description,
        dates: data.dates ?? null,
        image: data.image ?? null,
        video: data.video ?? null,
        technologies: data.technologies ?? [],
        links: data.links ?? null,
        featured: data.featured ?? false,
        order: data.order ?? projectsStore.length,
      };
      projectsStore.push(project);
      return project as any;
    });

    vi.spyOn(prisma.project, "update").mockImplementation(async ({ where, data }: any) => {
      const idx = projectsStore.findIndex(p => p.id === where.id);
      if (idx === -1) throw new Error("Not found");
      const current = projectsStore[idx];
      const updated: Project = {
        ...current,
        title: data.title ?? current.title,
        slug: data.slug ?? current.slug,
        description: data.description ?? current.description,
        dates: data.dates ?? current.dates,
        image: data.image ?? current.image,
        video: data.video ?? current.video,
        technologies: data.technologies ?? current.technologies,
        links: data.links ?? current.links,
        featured: data.featured ?? current.featured,
        order: data.order ?? current.order,
      };
      projectsStore[idx] = updated;
      return updated as any;
    });

    vi.spyOn(prisma.project, "delete").mockImplementation(async ({ where }: any) => {
      const idx = projectsStore.findIndex(p => p.id === where.id);
      if (idx !== -1) projectsStore.splice(idx, 1);
      return {} as any;
    });

    // Other models used by /api/portfolio
    vi.spyOn(prisma.personalInfo, "findFirst").mockResolvedValue({} as any);
    vi.spyOn(prisma.skill, "findMany").mockResolvedValue([] as any);
    vi.spyOn(prisma.workExperience, "findMany").mockResolvedValue([] as any);
    vi.spyOn(prisma.education, "findMany").mockResolvedValue([] as any);
    vi.spyOn(prisma.language, "findMany").mockResolvedValue([] as any);
    vi.spyOn(prisma.hackathon, "findMany").mockResolvedValue([] as any);
  });

  it("POST creates a project that appears in portfolio GET", async () => {
    const postReq = new Request("http://localhost/api/dashboard/projects", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ title: "T1", slug: "t1", description: "d1" }),
    });
    const postRes = await projectsPOST(postReq);
    expect(postRes.status).toBe(201);

    const portfolioRes = await portfolioGET();
    expect(portfolioRes.status).toBe(200);
    const data = await portfolioRes.json();
    expect(Array.isArray(data.projects)).toBe(true);
    expect(data.projects.find((p: any) => p.slug === "t1")).toBeTruthy();
  });

  it("PUT updates a project and portfolio GET reflects the change", async () => {
    // Seed one via POST
    const postReq = new Request("http://localhost/api/dashboard/projects", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ title: "T2", slug: "t2", description: "d2" }),
    });
    await projectsPOST(postReq);

    // Find created project's id
    const created = projectsStore.find(p => p.slug === "t2")!;

    // Update
    const putReq = new Request("http://localhost/api/dashboard/projects", {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ id: created.id, title: "T2-upd", description: "d2-upd", slug: "t2" }),
    });
    const putRes = await projectsPUT(putReq);
    expect(putRes.status).toBe(200);

    const portfolioRes = await portfolioGET();
    const data = await portfolioRes.json();
    const found = data.projects.find((p: any) => p.slug === "t2");
    expect(found.title).toBe("T2-upd");
    expect(found.description).toBe("d2-upd");
  });
});


