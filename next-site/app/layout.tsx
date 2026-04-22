import type { Metadata } from "next";
import "./globals.css";
import CalEmbed from "./components/CalEmbed";
import ClientScripts from "./components/ClientScripts";
import CookieConsent from "./components/CookieConsent";
import IntroPhotoDock from "./components/IntroPhotoDock";
import SiteChrome from "./components/SiteChrome";
import SiteFooter from "./components/SiteFooter";

export const metadata: Metadata = {
  title: "Éliane — Entraîneure personnelle privée · Montréal",
  description:
    "Éliane — Entraîneure personnelle privée à Montréal. Accompagnement sur mesure, technique et nutrition alignées. Réserve ton appel découverte.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
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

        <SiteChrome />

        {children}

        <SiteFooter />

        <ClientScripts />
        <CalEmbed />
        <CookieConsent />
        <IntroPhotoDock />
      </body>
    </html>
  );
}
