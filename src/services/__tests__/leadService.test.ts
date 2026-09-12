import { describe, expect, it } from "vitest";
import {
  normalizeLeadInput,
  normalizeLeadStatus,
  summarizeLeadStatuses,
} from "../leadService";

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
        status: "qualified",
      }).status
    ).toBe("qualified");

    expect(normalizeLeadStatus("BOOKED")).toBe("booked");

    expect(() => normalizeLeadStatus("ghost")).toThrow("Unsupported lead status");
  });

  it("summarizes lead lifecycle counts for the business dashboard", () => {
    expect(
      summarizeLeadStatuses([
        { status: "new" },
        { status: "contacted" },
        { status: "booked" },
        { status: "booked" },
        { status: "closed" },
      ])
    ).toEqual({
      new: 1,
      contacted: 1,
      qualified: 0,
      booked: 2,
      closed: 1,
    });
  });
});
