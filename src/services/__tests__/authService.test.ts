import { describe, expect, it } from "vitest";

describe("auth service contract", () => {
  it("exports the expected auth helpers", async () => {
    const { signup, login, logout } = await import("../authService");

    expect(typeof signup).toBe("function");
    expect(typeof login).toBe("function");
    expect(typeof logout).toBe("function");
  });
});
