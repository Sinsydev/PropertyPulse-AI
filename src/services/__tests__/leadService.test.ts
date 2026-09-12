import { describe, expect, it } from "vitest";
import { normalizeLeadInput, normalizeLeadStatus } from "../leadService";

describe("normalizeLeadInput", () => {
  it("trims and normalizes a valid lead payload", () => {
    expect(
      normalizeLeadInput({
        name: "  John Doe  ",
        phone: "+1 (555) 123-4567",
        service: " Plumbing ",
        businessId: " abc ",
        status: "new",
      })
    ).toEqual({
      name: "John Doe",
      phone: "15551234567",
      service: "plumbing",
      businessId: "abc",
      status: "new",
    });
  });

  it("defaults status to new and rejects empty critical values", () => {
    expect(() =>
      normalizeLeadInput({
        name: "   ",
        phone: "5551234567",
        service: "plumbing",
        businessId: "business-1",
      })
    ).toThrow("Lead name is required");

    expect(
      normalizeLeadInput({
        name: "Jane Doe",
        phone: "5551234567",
        service: "   ",
        businessId: "business-1",
      })
    ).toMatchObject({
      status: "new",
      service: "",
    });
  });

  it("normalizes lifecycle statuses into the supported production values", () => {
    expect(
      normalizeLeadInput({
        name: "Jane Doe",
        phone: "5551234567",
        service: "plumbing",
        businessId: "business-1",
        status: "QUALIFIED",
      }).status
    ).toBe("qualified");

    expect(normalizeLeadStatus("BOOKED")).toBe("booked");

    expect(() =>
      normalizeLeadInput({
        name: "Jane Doe",
        phone: "5551234567",
        service: "plumbing",
        businessId: "business-1",
        status: "ghost",
      })
    ).toThrow("Unsupported lead status");

    expect(() => normalizeLeadStatus("ghost")).toThrow("Unsupported lead status");
  });
});
