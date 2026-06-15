import type { Metadata } from "next";
import "./globals.css";
import { draftMode, headers } from "next/headers";
import { VisualEditing } from "next-sanity/visual-editing";
import { Playfair_Display, Poppins } from "next/font/google";
import CalEmbed from "./components/CalEmbed";
import ClientScripts from "./components/ClientScripts";
import CookieConsent from "./components/CookieConsent";
import IntroPhotoDock from "./components/IntroPhotoDock";
import SiteChrome from "./components/SiteChrome";
import SiteFooter from "./components/SiteFooter";
import { sanityFetch, SanityLive } from "@/sanity/live";
import { SITE_SETTINGS_QUERY } from "@/sanity/queries";
import { urlFor } from "@/sanity/imageUrl";

export const SITE_URL = "https://elianelarre.com";

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "600"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-sans",
  display: "swap",
});

const DEFAULT_META_TITLE = "Éliane — Entraîneure personnelle privée · Montréal";
const DEFAULT_META_DESCRIPTION =
  "Un accompagnement personnalisé en présentiel à Montréal pour t'aider à progresser avec confiance, constance et clarté.";

export async function generateMetadata(): Promise<Metadata> {
  const { data: siteSettings } = await sanityFetch({ query: SITE_SETTINGS_QUERY });
  const title = (siteSettings?.metaTitle as string | undefined)?.trim() || DEFAULT_META_TITLE;
  const description =
    (siteSettings?.metaDescription as string | undefined)?.trim() || DEFAULT_META_DESCRIPTION;

  const ogImageUrl =
    (siteSettings?.ogImage as { asset?: unknown } | undefined)?.asset != null
      ? urlFor(siteSettings.ogImage as Parameters<typeof urlFor>[0])
          .width(1200)
          .height(630)
          .url()
      : undefined;

  const ogImages = ogImageUrl
    ? [{ url: ogImageUrl, width: 1200, height: 630, alt: title }]
    : undefined;

  return {
    metadataBase: new URL(SITE_URL),
    alternates: { canonical: "/" },
    title,
    description,
    openGraph: {
      type: "website",
      locale: "fr_CA",
      title,
      description,
      siteName: "Éliane Larre",
      url: SITE_URL,
      ...(ogImages ? { images: ogImages } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(ogImages ? { images: [ogImageUrl!] } : {}),
    },
    other: {
      "theme-color": "#552772",
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = (await headers()).get("x-pathname") ?? "";
  const isStudio = pathname.startsWith("/studio");

  if (isStudio) {
    return (
      <html lang="fr-CA">
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
    <html lang="fr-CA" className={`${playfairDisplay.variable} ${poppins.variable}`}>
      <head>
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
