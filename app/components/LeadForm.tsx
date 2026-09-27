"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { LEAD_FORM_URL } from "@/lib/lead-form";

const LEAD_FORM_SELECTOR = "[data-lead-form]";

function trackOpen(source: string) {
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({ event: "lead_form_open", lead_form_source: source });
}

/**
 * The lead form popup, plus the "Commence ici" tab on the home page. Any link carrying
 * `data-lead-form` (see lib/lead-form.ts) opens the same popup, so the whole site has one door.
 */
export default function LeadForm() {
  const pathname = usePathname();
  const dialogRef = useRef<HTMLDialogElement>(null);
  // The iframe is only created on first open, then kept so a visitor who closes the popup doesn't lose their answers.
  const [hasOpened, setHasOpened] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const open = useCallback((source: string) => {
    const dialog = dialogRef.current;
    if (!dialog || dialog.open) return;
    setHasOpened(true);
    dialog.showModal();
    document.documentElement.classList.add("lead-form-open");
    trackOpen(source);
  }, []);

  const close = () => dialogRef.current?.close();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const onClose = () => document.documentElement.classList.remove("lead-form-open");
    dialog.addEventListener("close", onClose);
    return () => dialog.removeEventListener("close", onClose);
  }, []);

  // One listener for every call to action on the page, whichever component rendered it.
  // A modified click (new tab, etc.) is left alone: the link then reaches the form directly.
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = (event.target as Element | null)?.closest<HTMLElement>(LEAD_FORM_SELECTOR);
      if (!link) return;
      event.preventDefault();
      open(link.dataset.leadForm || "lien");
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [open]);

  // The tab is the home page's door; every other page reaches the popup through its own buttons.
  const showTab = pathname === "/";

  return (
    <>
      {showTab && (
        <button type="button" className="lead-tab" onClick={() => open("onglet")} aria-haspopup="dialog">
          <span className="lead-tab-dot" aria-hidden="true" />
          <span className="lead-tab-label">Commence ici</span>
        </button>
      )}

      <dialog
        ref={dialogRef}
        className="lead-dialog"
        aria-labelledby="lead-dialog-title"
        onClick={(event) => {
          // A click that lands on the <dialog> itself is on the backdrop, outside the panel.
          if (event.target === event.currentTarget) close();
        }}
      >
        <div className="lead-dialog-panel">
          <header className="lead-dialog-header">
            <p id="lead-dialog-title" className="lead-dialog-title">
              Premi&egrave;re &eacute;tape
            </p>
            <button type="button" className="lead-dialog-close" onClick={close} aria-label="Fermer le formulaire">
              <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </button>
          </header>

          <div className="lead-dialog-body">
            {!isLoaded && (
              <p className="lead-dialog-loading" aria-hidden="true">
                Chargement du formulaire…
              </p>
            )}
            {hasOpened && (
              <iframe
                className="lead-dialog-frame"
                src={LEAD_FORM_URL}
                title="Formulaire initial"
                onLoad={() => setIsLoaded(true)}
              />
            )}
          </div>
        </div>
      </dialog>
    </>
  );
}
