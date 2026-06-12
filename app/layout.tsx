import type { Metadata } from "next";
import "./globals.css";
import { draftMode, headers } from "next/headers";
import { VisualEditing } from "next-sanity/visual-editing";
import CalEmbed from "./components/CalEmbed";
import ClientScripts from "./components/ClientScripts";
import CookieConsent from "./components/CookieConsent";
import IntroPhotoDock from "./components/IntroPhotoDock";
import SiteChrome from "./components/SiteChrome";
import SiteFooter from "./components/SiteFooter";
import { sanityFetch, SanityLive } from "@/sanity/live";
import { SITE_SETTINGS_QUERY } from "@/sanity/queries";

export const metadata: Metadata = {
  title: "Éliane — Entraîneure personnelle privée · Montréal",
  description:
    "Un accompagnement personnalisé en présentiel à Montréal pour t'aider à progresser avec confiance, constance et clarté.",
  openGraph: {
    type: "website",
    locale: "fr_CA",
    title: "Éliane — Entraîneure personnelle privée · Montréal",
    description:
      "Un accompagnement personnalisé en présentiel à Montréal pour t'aider à progresser avec confiance, constance et clarté.",
    siteName: "Éliane Larre",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = (await headers()).get("x-pathname") ?? "";
  const isStudio = pathname.startsWith("/studio");

  if (isStudio) {
    return (
      <html lang="fr">
        <body>{children}</body>
      </html>
    );
  }

  const isDraftMode = (await draftMode()).isEnabled;
  const { data: siteSettings } = await sanityFetch({ query: SITE_SETTINGS_QUERY });
  const calBookingUrl =
    siteSettings?.bookingUrl ??
    siteSettings?.calBookingUrl ??
    "https://cal.com/elianelarre/appel-decouverte";
  const calLinkNamespace = (() => {
    try {
      const url = new URL(calBookingUrl);
      return url.hostname === "cal.com" ? url.pathname.replace(/^\/+/, "") : "";
    } catch {
      return "";
    }
  })();
  const contactEmail = siteSettings?.contactEmail ?? "info@elianelarre.com";
  const instagramUrl =
    siteSettings?.instagramUrl ??
    "https://www.instagram.com/eliane.au.naturel";

  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=Poppins:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
        <link rel="preconnect" href="https://app.cal.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://cal.com" crossOrigin="anonymous" />
        <link rel="preload" as="script" href="https://app.cal.com/embed/embed.js" crossOrigin="anonymous" />
      </head>
      <body>
        <a className="skip-link" href="#contenu-principal">
          Passer au contenu
        </a>

        <SiteChrome
          calBookingUrl={calBookingUrl}
          calLinkNamespace={calLinkNamespace}
        />

        {children}

        <SiteFooter
          calBookingUrl={calBookingUrl}
          calLinkNamespace={calLinkNamespace}
          contactEmail={contactEmail}
          instagramUrl={instagramUrl}
        />

        <ClientScripts />
        <CalEmbed />
        <CookieConsent />
        <IntroPhotoDock />
        <SanityLive />
        {isDraftMode && <VisualEditing />}
      </body>
    </html>
  );
}
