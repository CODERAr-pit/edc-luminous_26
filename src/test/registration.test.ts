import { describe, expect, it } from "vitest";
import { registrationHref } from "@/lib/registration";

describe("Registration availability", () => {
  it("does not create a destination before a real registration link is supplied", () => {
    expect(registrationHref({ registrationOpen: false, registrationUrl: "" })).toBeNull();
    expect(registrationHref({ registrationOpen: true, registrationUrl: "" })).toBeNull();
  });
  it("keeps registration closed until organisers open it", () => {
    expect(
      registrationHref({
        registrationOpen: false,
        registrationUrl: "https://example.com/register",
      }),
    ).toBeNull();
    expect(
      registrationHref({ registrationOpen: true, registrationUrl: "https://example.com/register" }),
    ).toBe("https://example.com/register");
  });
});
