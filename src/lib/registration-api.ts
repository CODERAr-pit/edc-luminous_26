import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";

// Server-side supabase with service role key (if available) or anon key
function getSupabase() {
  const url = process.env["VITE_SUPABASE_URL"] ?? process.env["SUPABASE_URL"] ?? "";
  const key =
    process.env["SUPABASE_SERVICE_ROLE_KEY"] ??
    process.env["VITE_SUPABASE_ANON_KEY"] ??
    process.env["SUPABASE_ANON_KEY"] ??
    "";
  if (!url || !key) {
    throw new Error(
      "Backend database is not configured yet. Please add your VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.",
    );
  }
  return createClient(url, key);
}

export const registrationSchema = z
  .object({
    team_name: z.string().trim().min(1, "Team name is required").max(100),
    team_leader: z.string().trim().min(1, "Team leader name is required").max(100),
    team_leader_reg_no: z.string().trim().min(1, "Registration number is required").max(50),
    team_leader_email: z.string().trim().email("Invalid email address"),
    team_leader_whatsapp: z
      .string()
      .trim()
      .length(10, "WhatsApp number must be 10 digits")
      .regex(/^\d+$/, "Must contain only digits"),
    member1_name: z.string().trim().min(1, "Member 2 name is required").max(100),
    member1_number: z
      .string()
      .trim()
      .length(10, "Member 2 number must be 10 digits")
      .regex(/^\d+$/, "Must contain only digits"),
    member2_name: z.string().trim().max(100).optional(),
    member2_number: z.string().trim().optional(),
    member3_name: z.string().trim().max(100).optional(),
    member3_number: z.string().trim().optional(),
    payment_screenshot: z
      .string()
      .min(1, "Payment screenshot is required")
      .regex(/^data:image\/(jpeg|png|webp);base64,/, "Please upload a valid image")
      .max(7_000_000, "Screenshot must be 5 MB or smaller"),
  })
  .superRefine((data, ctx) => {
    // Member 3 validation (optional unless partially filled)
    const hasM2Name = Boolean(data.member2_name && data.member2_name.trim().length > 0);
    const hasM2Num = Boolean(data.member2_number && data.member2_number.trim().length > 0);
    if (hasM2Name && !hasM2Num) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["member2_number"],
        message: "Phone number is required for Member 3",
      });
    } else if (hasM2Num && !hasM2Name) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["member2_name"],
        message: "Full name is required for Member 3",
      });
    }
    if (hasM2Num) {
      const trimmed = data.member2_number!.trim();
      if (trimmed.length !== 10 || !/^\d+$/.test(trimmed)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["member2_number"],
          message: "Member 3 number must be 10 digits",
        });
      }
    }

    // Member 4 validation (optional unless partially filled)
    const hasM3Name = Boolean(data.member3_name && data.member3_name.trim().length > 0);
    const hasM3Num = Boolean(data.member3_number && data.member3_number.trim().length > 0);
    if (hasM3Name && !hasM3Num) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["member3_number"],
        message: "Phone number is required for Member 4",
      });
    } else if (hasM3Num && !hasM3Name) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["member3_name"],
        message: "Full name is required for Member 4",
      });
    }
    if (hasM3Num) {
      const trimmed = data.member3_number!.trim();
      if (trimmed.length !== 10 || !/^\d+$/.test(trimmed)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["member3_number"],
          message: "Member 4 number must be 10 digits",
        });
      }
    }
  });

export type RegistrationData = z.infer<typeof registrationSchema>;

// In-memory rate limit store (per server process)
const rateLimitStore: Record<string, { count: number; firstRequestTime: number }> = {};
const RATE_LIMIT = 5;
const TIME_FRAME = 60 * 1000;

async function syncRegistrationToGoogleSheets(data: RegistrationData, screenshotPath: string) {
  const webhookUrl = process.env["GOOGLE_SHEETS_WEBHOOK_URL"];
  const webhookSecret = process.env["GOOGLE_SHEETS_WEBHOOK_SECRET"];
  if (!webhookUrl || !webhookSecret) return;

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      secret: webhookSecret,
      registration: {
        team_name: data.team_name,
        team_leader: data.team_leader,
        team_leader_reg_no: data.team_leader_reg_no,
        team_leader_email: data.team_leader_email,
        team_leader_whatsapp: data.team_leader_whatsapp,
        member1_name: data.member1_name.trim(),
        member1_number: data.member1_number.trim(),
        member2_name: data.member2_name?.trim() || "",
        member2_number: data.member2_number?.trim() || "",
        member3_name: data.member3_name?.trim() || "",
        member3_number: data.member3_number?.trim() || "",
        payment_screenshot_path: screenshotPath,
        submitted_at: new Date().toISOString(),
      },
    }),
  });
  if (!response.ok) throw new Error(`Google Sheets sync failed (${response.status})`);
}

export const submitRegistration = createServerFn({ method: "POST" })
  .validator(registrationSchema)
  .handler(async ({ data }) => {
    // Simple in-memory rate limiting (resets on server restart)
    const currentTime = Date.now();
    const ipKey = "global"; // IP not easily accessible here; edge-level rate limiting preferred

    if (!rateLimitStore[ipKey]) {
      rateLimitStore[ipKey] = { count: 1, firstRequestTime: currentTime };
    } else {
      const { count, firstRequestTime } = rateLimitStore[ipKey]!;
      if (currentTime - firstRequestTime < TIME_FRAME) {
        if (count >= RATE_LIMIT) {
          throw new Error("Rate limit exceeded. Please try again later.");
        }
        rateLimitStore[ipKey]!.count = count + 1;
      } else {
        rateLimitStore[ipKey] = { count: 1, firstRequestTime: currentTime };
      }
    }

    const supabase = getSupabase();

    const match = data.payment_screenshot.match(/^data:image\/(jpeg|png|webp);base64,(.+)$/);
    if (!match) throw new Error("Please upload a valid payment screenshot.");
    const extension = match[1];
    const encodedImage = match[2];
    if (!extension || !encodedImage) throw new Error("Please upload a valid payment screenshot.");
    const image = Buffer.from(encodedImage, "base64");
    if (image.length > 5 * 1024 * 1024) throw new Error("Screenshot must be 5 MB or smaller.");
    const screenshotPath = `${crypto.randomUUID()}.${extension}`;
    const { error: uploadError } = await supabase.storage
      .from("payment-screenshots")
      .upload(screenshotPath, image, { contentType: `image/${extension}`, upsert: false });
    if (uploadError) throw new Error(`Could not save payment screenshot: ${uploadError.message}`);

    const { error } = await supabase.from("luminous_registrations").insert([
      {
        team_name: data.team_name,
        team_leader: data.team_leader,
        team_leader_reg_no: data.team_leader_reg_no,
        team_leader_email: data.team_leader_email,
        team_leader_whatsapp: data.team_leader_whatsapp,
        member1_name: data.member1_name.trim(),
        member1_number: data.member1_number.trim(),
        member2_name: data.member2_name?.trim() || "",
        member2_number: data.member2_number?.trim() || "",
        member3_name: data.member3_name?.trim() || "",
        member3_number: data.member3_number?.trim() || "",
        payment_screenshot_path: screenshotPath,
        submitted_at: new Date().toISOString(),
      },
    ]);

    if (error) throw new Error(error.message);

    try {
      await syncRegistrationToGoogleSheets(data, screenshotPath);
    } catch (syncError) {
      // Supabase remains the source of truth; a temporary Sheets outage should
      // not make the registration appear to fail after it was saved.
      console.error(syncError);
    }

    return { success: true, message: "Registration submitted successfully!" };
  });
