import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  ArrowUpRight,
  CheckCircle2,
  Users,
  User,
  Mail,
  Phone,
  CreditCard,
  IdCard,
  Download,
  Copy,
  Check,
  Loader2,
  ChevronRight,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Diya } from "@/components/luminous/Diya";
import { logo, event } from "@/data/luminous";
import {
  submitRegistration,
  registrationSchema,
  type RegistrationData,
} from "@/lib/registration-api";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Register — LUMINOUS 10.0 | EDC NIT Durgapur" },
      {
        name: "description",
        content:
          "Register your team for the Luminous Rangoli Competition at LUMINOUS 10.0 by EDC NIT Durgapur. Entry ₹100.",
      },
    ],
  }),
  component: RegisterPage,
});

type Step = "form" | "payment" | "success";

function RegisterPage() {
  if (!event.registrationOpen) {
    return <RegistrationClosedState />;
  }

  return <RegistrationForm />;
}

function RegistrationClosedState() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <div className="grain pointer-events-none fixed inset-0 z-50" aria-hidden="true" />
      <div
        className="pointer-events-none fixed inset-0 z-0"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% -10%, oklch(0.7 0.16 50 / 0.18) 0%, transparent 70%)",
        }}
      />

      <header className="relative z-10 border-b border-border/40 px-6 py-4 sm:py-5">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <ArrowLeft className="size-4 text-muted-foreground transition-colors group-hover:text-foreground" />
            <img
              src={logo.src}
              alt={logo.alt}
              className="h-7 w-auto object-contain"
              loading="eager"
            />
          </Link>
          <span className="font-brand text-sm font-semibold uppercase tracking-widest text-gold">
            {event.name}
          </span>
        </div>
      </header>

      <main className="relative z-10 flex min-h-[calc(100vh-73px)] items-center justify-center px-6 py-16">
        <div className="w-full max-w-xl text-center">
          <p className="chapter-label text-gold">Luminous Rangoli Competition</p>
          <h1 className="mt-4 font-brand text-4xl font-bold uppercase tracking-[0.06em] sm:text-5xl">
            Registration closed
          </h1>
          <p className="mx-auto mt-5 max-w-md font-serif text-xl italic text-gold">
            Thank you for your interest in Luminous.
          </p>
          <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-muted-foreground">
            Registrations for the rangoli competition are no longer being accepted.
          </p>
          <Link
            to="/"
            className="mt-9 inline-flex items-center border-b border-gold/60 pb-1 text-sm font-semibold uppercase tracking-[0.16em] text-gold transition-colors hover:border-gold hover:text-foreground"
          >
            Return home
          </Link>
        </div>
      </main>
    </div>
  );
}

function RegistrationForm() {
  const [step, setStep] = useState<Step>("form");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const successRef = useRef<HTMLDivElement>(null);

  const step1Fields: (keyof RegistrationData)[] = [
    "team_name",
    "team_leader",
    "team_leader_reg_no",
    "team_leader_email",
    "team_leader_whatsapp",
    "member1_name",
    "member1_number",
    "member2_name",
    "member2_number",
    "member3_name",
    "member3_number",
  ];

  const {
    register,
    setValue,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm<RegistrationData>({
    resolver: zodResolver(registrationSchema),
    mode: "onTouched",
    shouldUnregister: false,
  });

  const onFormNext = async (e: React.FormEvent) => {
    e.preventDefault();
    const isValid = await trigger(step1Fields);
    if (isValid) {
      setStep("payment");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const onPaymentSubmit = handleSubmit(async (data) => {
    setIsSubmitting(true);
    setServerError(null);
    try {
      await submitRegistration({ data });
      setStep("success");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setServerError(
        err instanceof Error ? err.message : "Something went wrong. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  });

  useEffect(() => {
    if (step === "success" && successRef.current) {
      successRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [step]);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      {/* Grain overlay */}
      <div className="grain pointer-events-none fixed inset-0 z-50" aria-hidden="true" />

      {/* Warm ambient glow */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% -10%, oklch(0.7 0.16 50 / 0.18) 0%, transparent 70%)",
        }}
      />

      {/* Header */}
      <header className="relative z-10 border-b border-border/40 px-6 py-4 sm:py-5">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <ArrowLeft className="size-4 text-muted-foreground group-hover:text-foreground transition-colors" />
            <img
              src={logo.src}
              alt={logo.alt}
              className="h-7 w-auto object-contain"
              loading="eager"
            />
          </Link>
          <div className="flex items-center gap-2.5">
            <div className="relative flex items-center justify-center pt-2">
              <Diya className="w-7 shrink-0" glowClass="h-10 w-10" />
            </div>
            <span className="font-brand text-sm font-semibold uppercase tracking-widest text-gold">
              {event.name}
            </span>
          </div>
        </div>
      </header>

      {/* Step progress */}
      {step !== "success" && (
        <div className="relative z-10 border-b border-border/30 bg-slate/50 backdrop-blur-sm">
          <div className="mx-auto max-w-4xl px-6 py-3">
            <div className="flex items-center gap-2 text-sm">
              <StepPill
                active={step === "form"}
                done={step === "payment"}
                n={1}
                label="Team Details"
              />
              <ChevronRight className="size-3.5 text-muted-foreground/50" />
              <StepPill active={step === "payment"} done={false} n={2} label="Payment" />
            </div>
          </div>
        </div>
      )}

      {/* Main */}
      <main className="relative z-10 px-4 py-12 sm:px-6">
        <div className="mx-auto max-w-2xl">
          {step === "success" ? (
            <SuccessState divRef={successRef} />
          ) : step === "payment" ? (
            <PaymentStep
              onSubmit={onPaymentSubmit}
              onBack={() => setStep("form")}
              isSubmitting={isSubmitting}
              serverError={serverError}
              register={register}
              setValue={setValue}
              errors={errors}
            />
          ) : (
            <FormStep onNext={onFormNext} register={register} errors={errors} />
          )}
        </div>
      </main>
    </div>
  );
}

/* ---------- Step Pill ---------- */
function StepPill({
  active,
  done,
  n,
  label,
}: {
  active: boolean;
  done: boolean;
  n: number;
  label: string;
}) {
  return (
    <div className="flex items-center gap-1.5">
      <span
        className={[
          "flex size-5 items-center justify-center rounded-full text-[10px] font-bold transition-all",
          active
            ? "bg-gold text-plum"
            : done
              ? "bg-gold/40 text-gold"
              : "bg-muted text-muted-foreground",
        ].join(" ")}
      >
        {done ? "✓" : n}
      </span>
      <span
        className={[
          "text-xs font-medium transition-colors",
          active ? "text-foreground" : "text-muted-foreground",
        ].join(" ")}
      >
        {label}
      </span>
    </div>
  );
}

/* ---------- Field ---------- */
function Field({
  label,
  icon,
  error,
  children,
}: {
  label: string;
  icon?: React.ReactNode;
  error?: string | undefined;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        {icon}
        {label}
      </Label>
      {children}
      {error && (
        <p className="flex items-center gap-1 text-xs text-destructive">
          <AlertCircle className="size-3 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}

/* ---------- Luminous Input ---------- */
function LuminousInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <Input
      {...props}
      className={[
        "h-11 rounded-md border border-border bg-input/80 px-4 text-sm text-foreground placeholder:text-muted-foreground/50",
        "focus-visible:border-gold/70 focus-visible:ring-1 focus-visible:ring-gold/30 transition-all",
        props.className ?? "",
      ].join(" ")}
    />
  );
}

/* ---------- Section Heading ---------- */
function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-6 flex items-center gap-3">
      <span className="h-px flex-1 bg-border/60" />
      <span className="chapter-label shrink-0 text-gold">{children}</span>
      <span className="h-px flex-1 bg-border/60" />
    </div>
  );
}

/* ---------- Form Step ---------- */
function FormStep({
  onNext,
  register,
  errors,
}: {
  onNext: (e: React.FormEvent) => void;
  register: ReturnType<typeof useForm<RegistrationData>>["register"];
  errors: ReturnType<typeof useForm<RegistrationData>>["formState"]["errors"];
}) {
  return (
    <form id="reg-form" onSubmit={onNext} className="space-y-10" noValidate>
      <div className="text-center">
        <p className="chapter-label text-gold">Luminous Rangoli Competition</p>
        <h1 className="mt-3 font-brand text-4xl font-bold uppercase tracking-[0.06em] sm:text-5xl">
          Register
        </h1>
        <p className="mt-3 font-serif text-lg italic text-gold">{event.tagline}</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Team of 2–4 members · Member 3 &amp; 4 are optional · Entry ₹100
        </p>
      </div>

      {/* Team */}
      <div>
        <SectionHeading>Team</SectionHeading>
        <Field
          label="Team Name"
          icon={<Users className="size-3" />}
          error={errors.team_name?.message}
        >
          <LuminousInput
            {...register("team_name")}
            id="team_name"
            placeholder="Your team's creative name"
            autoComplete="off"
          />
        </Field>
      </div>

      {/* Leader */}
      <div>
        <SectionHeading>Team Leader</SectionHeading>
        <div className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              label="Full Name"
              icon={<User className="size-3" />}
              error={errors.team_leader?.message}
            >
              <LuminousInput
                {...register("team_leader")}
                id="team_leader"
                placeholder="Leader's full name"
                autoComplete="name"
              />
            </Field>
            <Field
              label="Registration No."
              icon={<IdCard className="size-3" />}
              error={errors.team_leader_reg_no?.message}
            >
              <LuminousInput
                {...register("team_leader_reg_no")}
                id="team_leader_reg_no"
                placeholder="e.g. 22U10xxx or Reg No."
                autoComplete="off"
              />
            </Field>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              label="Email ID"
              icon={<Mail className="size-3" />}
              error={errors.team_leader_email?.message}
            >
              <LuminousInput
                {...register("team_leader_email")}
                id="team_leader_email"
                type="email"
                placeholder="leader@example.com"
                autoComplete="email"
              />
            </Field>
            <Field
              label="WhatsApp Number"
              icon={<Phone className="size-3" />}
              error={errors.team_leader_whatsapp?.message}
            >
              <LuminousInput
                {...register("team_leader_whatsapp")}
                id="team_leader_whatsapp"
                type="tel"
                placeholder="10-digit number"
                maxLength={10}
                autoComplete="tel"
              />
            </Field>
          </div>
        </div>
      </div>

      {/* Members */}
      <div>
        <SectionHeading>Team Members</SectionHeading>
        <div className="space-y-6">
          {[
            {
              id: "member1",
              nameKey: "member1_name" as const,
              numberKey: "member1_number" as const,
              label: "Member 2",
              optional: false,
              namePlaceholder: "Member 2's full name",
            },
            {
              id: "member2",
              nameKey: "member2_name" as const,
              numberKey: "member2_number" as const,
              label: "Member 3",
              optional: true,
              namePlaceholder: "Member 3's full name (optional)",
            },
            {
              id: "member3",
              nameKey: "member3_name" as const,
              numberKey: "member3_number" as const,
              label: "Member 4",
              optional: true,
              namePlaceholder: "Member 4's full name (optional)",
            },
          ].map((m) => (
            <div key={m.id} className="rounded-lg border border-border/50 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <p className="chapter-label !text-[0.65rem] text-muted-foreground">
                  {m.label}{" "}
                  {m.optional && <span className="text-gold font-normal">(Optional)</span>}
                </p>
                {m.optional && (
                  <span className="text-[0.68rem] text-muted-foreground/70">Optional</span>
                )}
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  label={m.optional ? "Full Name (Optional)" : "Full Name"}
                  icon={<User className="size-3" />}
                  error={errors[m.nameKey]?.message}
                >
                  <LuminousInput
                    {...register(m.nameKey)}
                    id={m.nameKey}
                    placeholder={m.namePlaceholder}
                  />
                </Field>
                <Field
                  label={m.optional ? "Phone Number (Optional)" : "Phone Number"}
                  icon={<Phone className="size-3" />}
                  error={errors[m.numberKey]?.message}
                >
                  <LuminousInput
                    {...register(m.numberKey)}
                    id={m.numberKey}
                    type="tel"
                    placeholder={m.optional ? "10-digit number (optional)" : "10-digit number"}
                    maxLength={10}
                  />
                </Field>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Button
        type="submit"
        size="lg"
        id="reg-next-btn"
        className="w-full h-13 sm:h-14 bg-gold text-plum font-semibold text-sm sm:text-base uppercase tracking-widest hover:bg-gold/90 transition-all hover:shadow-[0_0_32px_oklch(0.82_0.13_75/0.5)] cursor-pointer"
      >
        Continue to Payment <ArrowUpRight className="size-4.5" />
      </Button>
    </form>
  );
}

/* ---------- Payment Step ---------- */
function PaymentStep({
  onSubmit,
  onBack,
  isSubmitting,
  serverError,
  register,
  setValue,
  errors,
}: {
  onSubmit: (e: React.FormEvent) => void;
  onBack: () => void;
  isSubmitting: boolean;
  serverError: string | null;
  register: ReturnType<typeof useForm<RegistrationData>>["register"];
  setValue: ReturnType<typeof useForm<RegistrationData>>["setValue"];
  errors: ReturnType<typeof useForm<RegistrationData>>["formState"]["errors"];
}) {
  const [copied, setCopied] = useState(false);
  const upiId = "8637053650-2@ybl";
  const upiName = "Debraj Mukherjee";
  const upiPaymentUrl =
    "upi://pay?pa=8637053650-2@ybl&pn=Debraj%20%20Mukherjee&mc=0000&mode=02&purpose=00";

  const handleCopy = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadQr = async (e: React.MouseEvent) => {
    try {
      const res = await fetch("/images/upi-qr.png");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "upi.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch {
      // Direct navigation fallback
      window.open("/images/upi-qr.png", "_blank");
    }
  };

  return (
    <form id="payment-form" onSubmit={onSubmit} className="space-y-10" noValidate>
      <div className="text-center">
        <p className="chapter-label text-gold">Step 2 of 2</p>
        <h1 className="mt-3 font-brand text-4xl font-bold uppercase tracking-[0.06em] sm:text-5xl">
          Payment
        </h1>
        <p className="mt-3 font-serif text-lg italic text-gold">One spark, one entry.</p>
      </div>

      <div className="rounded-xl border border-gold/30 bg-gold/5 p-6 space-y-5">
        <SectionHeading>Pay ₹100 via UPI</SectionHeading>
        <div className="flex flex-col items-center gap-4">
          {/* QR Code image */}
          <div className="relative flex size-44 items-center justify-center rounded-xl border border-gold/40 bg-white p-2.5 shadow-lg">
            <img
              src="/images/upi-qr.png"
              alt="PhonePe UPI QR Code - Debraj Mukherjee"
              className="size-full object-contain"
            />
          </div>

          {/* Download QR Button & Mobile UPI app trigger */}
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            <a
              href="/images/upi-qr.png"
              download="upi.png"
              onClick={handleDownloadQr}
              id="download-upi-btn"
              className="inline-flex items-center gap-2 rounded-md border border-gold/50 bg-gold/15 px-4 py-2 text-xs font-semibold text-gold transition-all hover:bg-gold/25 hover:text-gold active:scale-95"
            >
              <Download className="size-3.5" /> Download QR Code (upi.png)
            </a>
            <a
              href={upiPaymentUrl}
              className="inline-flex items-center gap-1.5 rounded-md border border-border/80 bg-slate/60 px-3.5 py-2 text-xs font-medium text-foreground transition-all hover:bg-slate sm:hidden"
            >
              Pay via UPI App <ArrowUpRight className="size-3" />
            </a>
          </div>

          <div className="text-center space-y-1">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">UPI ID</p>
            <div className="flex items-center justify-center gap-2">
              <span className="font-mono text-lg font-bold text-gold select-all">{upiId}</span>
              <button
                type="button"
                onClick={handleCopy}
                title="Copy UPI ID"
                className="inline-flex size-7 items-center justify-center rounded border border-gold/30 bg-gold/10 text-gold transition-colors hover:bg-gold/20"
              >
                {copied ? (
                  <Check className="size-3.5 text-emerald-400" />
                ) : (
                  <Copy className="size-3.5" />
                )}
              </button>
            </div>
            <p className="text-xs text-muted-foreground">
              Name: <span className="font-medium text-foreground">{upiName}</span> · Pay exactly{" "}
              <strong className="text-foreground">₹100</strong>
            </p>
          </div>
        </div>
        <div className="rounded-lg bg-slate/60 border border-border/40 px-4 py-3 space-y-1">
          <p className="font-semibold text-foreground text-xs uppercase tracking-wider">
            Instructions
          </p>
          <ul className="list-disc list-inside space-y-0.5 text-xs leading-relaxed text-muted-foreground">
            <li>Download the QR code image above or scan it directly from another device</li>
            <li>
              In your UPI app (GPay, PhonePe, Paytm, BHIM), choose{" "}
              <strong className="text-foreground">Scan QR</strong> →{" "}
              <strong className="text-foreground">Upload from gallery</strong> and select{" "}
              <span className="font-mono text-gold">upi.png</span>
            </li>
            <li>
              Or manually pay using the UPI ID <span className="font-mono text-gold">{upiId}</span>{" "}
              ({upiName})
            </li>
            <li>
              Pay exactly <strong className="text-foreground">₹100</strong>
            </li>
            <li>Take a screenshot of the successful payment confirmation</li>
            <li>Upload the screenshot below and submit your registration</li>
          </ul>
        </div>
      </div>

      <div>
        <SectionHeading>Payment Confirmation</SectionHeading>
        <Field
          label="Payment Screenshot"
          icon={<CreditCard className="size-3" />}
          error={errors.payment_screenshot?.message}
        >
          <input type="hidden" {...register("payment_screenshot")} />
          <input
            id="payment_screenshot"
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="block w-full rounded-md border border-border/60 bg-background/40 px-3 py-2 text-sm text-foreground file:mr-3 file:rounded file:border-0 file:bg-gold file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-plum"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (!file) return;
              if (file.size > 5 * 1024 * 1024) {
                setValue("payment_screenshot", "", { shouldValidate: true });
                return;
              }
              const reader = new FileReader();
              reader.onload = () => {
                setValue("payment_screenshot", String(reader.result), { shouldValidate: true });
              };
              reader.readAsDataURL(file);
            }}
          />
        </Field>
        <p className="mt-2 text-xs text-muted-foreground">
          Upload a clear screenshot of the successful payment. PNG, JPG, or WebP up to 5 MB.
        </p>
      </div>

      {serverError && (
        <div className="flex items-start gap-2 rounded-lg border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          <p>{serverError}</p>
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button
          type="button"
          variant="outline"
          size="lg"
          id="payment-back-btn"
          className="h-13 sm:h-14 flex-1 border-border/60 text-muted-foreground hover:text-foreground text-sm sm:text-base cursor-pointer"
          onClick={onBack}
          disabled={isSubmitting}
        >
          <ArrowLeft className="size-4.5" /> Back
        </Button>
        <Button
          type="submit"
          size="lg"
          id="payment-submit-btn"
          disabled={isSubmitting}
          className="h-13 sm:h-14 flex-[2] bg-gold text-plum font-semibold text-sm sm:text-base uppercase tracking-widest hover:bg-gold/90 transition-all hover:shadow-[0_0_32px_oklch(0.82_0.13_75/0.5)] disabled:opacity-60 cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin" /> Submitting…
            </>
          ) : (
            <>
              Submit Registration <ArrowUpRight className="size-4" />
            </>
          )}
        </Button>
      </div>
    </form>
  );
}

/* ---------- Success State ---------- */
function SuccessState({ divRef }: { divRef: React.RefObject<HTMLDivElement | null> }) {
  return (
    <div ref={divRef} className="flex flex-col items-center gap-8 py-8 text-center">
      <div className="relative">
        <div
          className="absolute inset-0 rounded-full blur-3xl"
          style={{ background: "var(--glow-gold)" }}
          aria-hidden="true"
        />
        <div className="relative flex size-24 items-center justify-center rounded-full border border-gold/40 bg-gold/10">
          <CheckCircle2 className="size-12 text-gold" />
        </div>
      </div>

      <Diya className="w-16 opacity-80" />

      <div className="space-y-3 max-w-sm">
        <h1 className="font-brand text-3xl font-bold uppercase tracking-[0.06em] sm:text-4xl">
          You're Registered!
        </h1>
        <p className="font-serif text-xl italic text-gold">Welcome to LUMINOUS 10.0</p>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Your team's registration for the Luminous Rangoli Competition has been received. We'll
          reach out via <strong className="text-foreground">your team leader's WhatsApp</strong>{" "}
          with confirmation and further details.
        </p>
      </div>

      <dl className="grid w-full max-w-sm grid-cols-2 divide-x divide-y divide-border rounded-xl border border-border/50 overflow-hidden text-left">
        {[
          { k: "Date", v: event.date },
          { k: "Time", v: event.time },
          { k: "Venue", v: event.venue },
          { k: "Entry Fee", v: "₹100" },
        ].map((d) => (
          <div key={d.k} className="px-4 py-3">
            <dt className="chapter-label !text-[0.58rem] text-muted-foreground">{d.k}</dt>
            <dd className="mt-1 text-sm font-medium text-foreground">{d.v}</dd>
          </div>
        ))}
      </dl>

      <div className="flex flex-col items-center gap-3">
        <Link to="/">
          <Button
            variant="outline"
            id="success-home-btn"
            className="border-gold/40 text-gold hover:bg-gold/10 hover:text-gold"
          >
            <ArrowLeft className="size-3.5" /> Back to LUMINOUS
          </Button>
        </Link>
        <p className="text-xs text-muted-foreground">
          Follow{" "}
          <a
            href="https://www.instagram.com/edc_nitd/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-foreground transition-colors"
          >
            @edc_nitd
          </a>{" "}
          for updates
        </p>
      </div>
    </div>
  );
}
