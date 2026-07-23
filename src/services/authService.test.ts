import { describe, expect, it } from "vitest";
import { getAuthErrorMessage } from "./authService";

describe("getAuthErrorMessage", () => {
  it("returns a friendly message for invalid credentials", () => {
    expect(getAuthErrorMessage({ code: "auth/invalid-credential" })).toBe(
      "Invalid email or password."
    );
  });

  it("falls back to a generic message for unknown errors", () => {
    expect(getAuthErrorMessage("boom")).toBe("Something went wrong");
  });
});
