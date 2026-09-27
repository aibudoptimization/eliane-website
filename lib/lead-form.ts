/**
 * The Everdesk lead form is the single door into the funnel: every call to action on the site
 * opens it in the LeadForm popup. The URL is deliberately not in Sanity — it changes with the
 * Everdesk form, not with the site's copy.
 */
export const LEAD_FORM_URL = "https://api.everdesk.ca/widget/form/xR1hhTzSlyzXhGL6fxcu";

/**
 * Props for a link that opens the lead form. `data-lead-form` names the button for analytics and
 * tells LeadForm to intercept the click; without JavaScript the link still reaches the form.
 */
export function leadFormLink(source: string) {
  return { href: LEAD_FORM_URL, "data-lead-form": source } as const;
}
