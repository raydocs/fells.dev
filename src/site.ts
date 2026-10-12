// Deployment-specific settings. Fill these in before launch.
export const site = {
  // POST {email} as JSON (e.g. Formspree, a Cloudflare Worker). Empty = mailto fallback.
  waitlistEndpoint: "",
  // TODO(launch): hosted payment page (Stripe Payment Link / Lemon Squeezy checkout…).
  // {sku}, {period}, {amount}, {email}, {method} (alipay|card) and {code} are filled in by /checkout. Empty = payments not open yet:
  // the order is sent to the waitlist instead.
  checkoutUrl: "",
  // TODO: confirm the real inbox.
  contactEmail: "hello@fells.dev",
  lodyRepo: "https://github.com/LodyAI/Lody",
};
