import { ArrowUpRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { event } from "@/data/luminous";
import { registrationHref } from "@/lib/registration";

export function RegisterButton({
  className,
  size,
}: {
  className?: string;
  size?: "default" | "sm" | "lg" | "icon";
}) {
  const href = registrationHref(event);
  if (href) {
    const isInternal = href.startsWith("/");
    return (
      <Button asChild size={size} className={className}>
        {isInternal ? (
          <Link to={href}>
            Register <ArrowUpRight className="size-4 sm:size-4.5 shrink-0" />
          </Link>
        ) : (
          <a href={href}>
            Register <ArrowUpRight className="size-4 sm:size-4.5 shrink-0" />
          </a>
        )}
      </Button>
    );
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size={size} className={className}>
          Register <ArrowUpRight className="size-4 sm:size-4.5 shrink-0" />
        </Button>
      </DialogTrigger>
      <DialogContent className="section-light max-w-[calc(100%-2rem)] sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Registration period over</DialogTitle>
          <DialogDescription>
            The registration period for LUMINOUS 10.0 is over. Registrations are no longer being
            accepted.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
