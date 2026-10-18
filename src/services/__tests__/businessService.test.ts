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

  it("normalizes an optional Twilio inbound number", () => {
    expect(
      normalizeBusinessInput({
        userId: "user-123",
        businessName: "Northside Plumbing",
        phone: "5553334444",
        service: "plumbing",
        twilioNumber: "+1 (555) 777-8888",
      }).twilioNumber
    ).toBe("15557778888");
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

    expect(() =>
      normalizeBusinessInput({
        userId: "user-123",
        businessName: "Northside Plumbing",
        phone: "",
        service: "plumbing",
      })
    ).toThrow("Business phone is required");

    expect(() =>
      normalizeBusinessInput({
        userId: "user-123",
        businessName: "Northside Plumbing",
        phone: "5553334444",
        service: "   ",
      })
    ).toThrow("Business service is required");
  });
});
