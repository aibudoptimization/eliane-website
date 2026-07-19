import type { Metadata } from "next";
import Script from "next/script";
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
  "Éliane Larre est entraîneure personnelle privée à Montréal. Accompagnement en présentiel, personnalisé et sur mesure pour progresser avec confiance et constance.";

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
  const tallyUrl = siteSettings?.tallyUrl ?? "https://tally.so/r/Pdg1Bd";
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
        <link rel="preconnect" href="https://app.cal.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://cal.com" crossOrigin="anonymous" />
        <link rel="preload" as="script" href="https://app.cal.com/embed/embed.js" crossOrigin="anonymous" />
        <Script
          id="gtm-head"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-KDN3TRHV');`,
          }}
        />
      </head>
      <body>
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-KDN3TRHV"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <a className="skip-link" href="#contenu-principal">
          Passer au contenu
        </a>

        <SiteChrome
          calBookingUrl={calBookingUrl}
          calLinkNamespace={calLinkNamespace}
          tallyUrl={tallyUrl}
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
