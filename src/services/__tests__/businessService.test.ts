import { describe, expect, it } from "vitest";
import { normalizeBusinessInput } from "../businessService";

describe("normalizeBusinessInput", () => {
  it("cleans and validates a business profile before saving", () => {
    expect(
      normalizeBusinessInput({
        userId: "  user-123  ",
        businessName: "  Northside Plumbing  ",
        phone: "+1 (555) 333-4444",
        service: " Plumbing ",
      })
    ).toEqual({
      userId: "user-123",
      businessName: "Northside Plumbing",
      phone: "15553334444",
      service: "plumbing",
    });
  });

  it("rejects incomplete business profiles", () => {
    expect(() =>
      normalizeBusinessInput({
        userId: "user-123",
        businessName: "   ",
        phone: "5553334444",
        service: "plumbing",
      })
    ).toThrow("Business name is required");

    expect(() =>
      normalizeBusinessInput({
        userId: "",
        businessName: "Northside Plumbing",
        phone: "5553334444",
        service: "plumbing",
      })
    ).toThrow("User ID is required");
  });
});
