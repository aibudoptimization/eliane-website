import type { Metadata } from "next";
import "./globals.css";
import { draftMode, headers } from "next/headers";
import { VisualEditing } from "next-sanity/visual-editing";
import { Playfair_Display, Poppins } from "next/font/google";
import ClientScripts from "./components/ClientScripts";
import CookieConsent from "./components/CookieConsent";
import IntroPhotoDock from "./components/IntroPhotoDock";
import LeadForm from "./components/LeadForm";
import SiteChrome from "./components/SiteChrome";
import SiteFooter from "./components/SiteFooter";
import { sanityFetch, SanityLive } from "@/sanity/live";
import { SITE_SETTINGS_QUERY } from "@/sanity/queries";
import { urlFor } from "@/sanity/imageUrl";
import { siteIconsMetadata } from "@/lib/site-icons";
import { siteColorCssVars } from "@/lib/site-colors";

import { SITE_URL, DEFAULT_OG_IMAGE_PATH } from "@/lib/site-config";

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

const DEFAULT_META_TITLE = "Éliane Larre — Entraîneure personnelle privée · Montréal";
const DEFAULT_META_DESCRIPTION =
  "Éliane Larre, entraîneure personnelle à Montréal. Accompagnement hybride et personnalisé : deux rencontres en présentiel et un appel chaque semaine pour progresser avec confiance.";

export { SITE_URL, DEFAULT_OG_IMAGE_PATH };

export async function generateMetadata(): Promise<Metadata> {
  const { data: siteSettings } = await sanityFetch({ query: SITE_SETTINGS_QUERY });
  const title = (siteSettings?.metaTitle as string | undefined)?.trim() || DEFAULT_META_TITLE;
  const description =
    (siteSettings?.metaDescription as string | undefined)?.trim() || DEFAULT_META_DESCRIPTION;

  const sanityOgImageUrl =
    (siteSettings?.ogImage as { asset?: unknown } | undefined)?.asset != null
      ? urlFor(siteSettings.ogImage as Parameters<typeof urlFor>[0])
          .width(1200)
          .height(630)
          .url()
      : undefined;

  const ogImageUrl = sanityOgImageUrl ?? `${SITE_URL}${DEFAULT_OG_IMAGE_PATH}`;

  const ogImages = [{ url: ogImageUrl, width: 1200, height: 630, alt: title }];

  return {
    metadataBase: new URL(SITE_URL),
    alternates: { canonical: "/" },
    title,
    description,
    // Agency signature: visible in the page source (view-source), not on the page.
    generator: "Everdesk",
    authors: [{ name: "Everdesk", url: "https://everdesk.ca/" }],
    ...siteIconsMetadata(siteSettings),
    openGraph: {
      type: "website",
      locale: "fr_CA",
      title,
      description,
      siteName: "Éliane Larre",
      url: SITE_URL,
      images: ogImages,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl],
    },
    other: {
      "theme-color": "#552772",
      designer: "Everdesk — https://everdesk.ca/",
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
  const contactEmail = siteSettings?.contactEmail ?? "info@elianelarre.com";
  const instagramUrl =
    siteSettings?.instagramUrl ??
    "https://www.instagram.com/eliane.au.naturel";
  const colorVars = siteColorCssVars(siteSettings);

  return (
    <html
      lang="fr-CA"
      className={`${playfairDisplay.variable} ${poppins.variable}`}
      style={colorVars}
    >
      <head>
        <link rel="preconnect" href="https://api.everdesk.ca" crossOrigin="anonymous" />
      </head>
      <body>
        <a className="skip-link" href="#contenu-principal">
          Passer au contenu
        </a>

        <SiteChrome />

        {children}

        <SiteFooter contactEmail={contactEmail} instagramUrl={instagramUrl} />

        <ClientScripts />
        <CookieConsent />
        <IntroPhotoDock />
        <LeadForm />
        <SanityLive />
        {isDraftMode && <VisualEditing />}
      </body>
    </html>
  );
}
