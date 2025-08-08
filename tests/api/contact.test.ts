import { describe, it, expect, vi, beforeEach } from "vitest";
import prisma from "@/lib/prisma";
import { POST as contactPOST } from "@/app/api/contact/route";

describe("/api/contact", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("returns 400 when required fields are missing", async () => {
    const request = new Request("http://localhost/api/contact", {
      method: "POST",
      body: JSON.stringify({}),
      headers: { "content-type": "application/json" },
    });

    const res = await contactPOST(request);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data).toHaveProperty("error");
  });

  it("creates a message and returns success", async () => {
    const createSpy = vi
      .spyOn(prisma.message, "create")
      .mockResolvedValue({ id: 1, name: "A", email: "a@b.com", message: "hi" } as any);

    const request = new Request("http://localhost/api/contact", {
      method: "POST",
      body: JSON.stringify({ name: "A", email: "a@b.com", message: "hi" }),
      headers: { "content-type": "application/json" },
    });

    const res = await contactPOST(request);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(createSpy).toHaveBeenCalledOnce();
  });
});


