import { describe, expect, it } from "vitest";
import { getAuthErrorMessage } from "../authService";

describe("auth service contract", () => {
  it("exports the expected auth helpers", () => {
    expect(typeof getAuthErrorMessage).toBe("function");
  });
});
