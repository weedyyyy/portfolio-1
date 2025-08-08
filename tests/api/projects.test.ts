import { describe, it, expect, vi, beforeEach } from "vitest";
import prisma from "@/lib/prisma";
import { GET as projectsGET, POST as projectsPOST, PUT as projectsPUT, DELETE as projectsDELETE } from "@/app/api/dashboard/projects/route";

describe("/api/dashboard/projects", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("GET returns list of projects", async () => {
    const projects = [{ id: 1, title: "P1", order: 0 }];
    vi.spyOn(prisma.project, "findMany").mockResolvedValue(projects as any);

    const res = await projectsGET();
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(Array.isArray(data)).toBe(true);
  });

  it("POST validates required fields", async () => {
    const req = new Request("http://localhost/api/dashboard/projects", {
      method: "POST",
      body: JSON.stringify({}),
      headers: { "content-type": "application/json" },
    });
    const res = await projectsPOST(req);
    expect(res.status).toBe(400);
  });

  it("POST creates a project", async () => {
    vi.spyOn(prisma.project, "findUnique").mockResolvedValue(null as any);
    vi.spyOn(prisma.project, "findFirst").mockResolvedValue({ order: 0 } as any);
    vi.spyOn(prisma.project, "create").mockResolvedValue({ id: 2 } as any);

    const req = new Request("http://localhost/api/dashboard/projects", {
      method: "POST",
      body: JSON.stringify({ title: "T", slug: "t", description: "d" }),
      headers: { "content-type": "application/json" },
    });
    const res = await projectsPOST(req);
    expect(res.status).toBe(201);
  });

  it("PUT validates required fields", async () => {
    const req = new Request("http://localhost/api/dashboard/projects", {
      method: "PUT",
      body: JSON.stringify({}),
      headers: { "content-type": "application/json" },
    });
    const res = await projectsPUT(req);
    expect(res.status).toBe(400);
  });

  it("DELETE validates id param", async () => {
    const req = new Request("http://localhost/api/dashboard/projects?id=", { method: "DELETE" });
    const res = await projectsDELETE(req);
    expect(res.status).toBe(400);
  });
});


