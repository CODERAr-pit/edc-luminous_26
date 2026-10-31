export function registrationHref(event: { registrationOpen: boolean; registrationUrl: string }) {
  return event.registrationOpen && event.registrationUrl.trim() ? event.registrationUrl : null;
}
