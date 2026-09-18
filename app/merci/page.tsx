import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Merci — Éliane Larre",
  description: "Confirmation de ta demande d'appel découverte avec Éliane Larre.",
  alternates: { canonical: "/merci" },
  robots: { index: false, follow: false },
};

function CtaArrow() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

export default function MerciPage() {
  return (
    <main id="contenu-principal" className="merci-main">
      <div className="merci-inner">
        <Image
          className="merci-logo"
          src="/images/logo-eliane-larre.png"
          alt=""
          width={176}
          height={176}
          priority
        />
        <p className="eyebrow">Appel découverte</p>
        <h1 className="merci-title">
          Merci, c&apos;est <em className="text-accent">bien reçu!</em>
        </h1>
        <p className="merci-text">
          Le lien vers mon questionnaire t&apos;attend dans ta boîte courriel (vérifie tes indésirables au besoin).
          Remplis-le avant notre appel découverte.
        </p>
        <p className="merci-signature">
          À bientôt,
          <em>Éliane</em>
        </p>
        <Link className="btn btn-primary" href="/">
          Retour à l&apos;accueil
          <CtaArrow />
        </Link>
        <p className="merci-help">
          Tu ne trouves pas le courriel? Écris-moi à{" "}
          <a href="mailto:info@elianelarre.com">info@elianelarre.com</a>
        </p>
      </div>
    </main>
  );
}
