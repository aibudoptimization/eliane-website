"use client";

import { useEffect } from "react";

const WIDGET_SRC = "https://api.everdesk.ca/widget/booking/uvtSpwtwKKUVBhWwPyE7";
const WIDGET_IFRAME_ID = "uvtSpwtwKKUVBhWwPyE7_1789754107467";
const EMBED_SCRIPT_SRC = "https://api.everdesk.ca/js/form_embed.js";

export default function BookingWidget() {
  // The embed script sizes the iframes it finds when it executes and never looks again. next/script would run it
  // once per session, so coming back to this page would leave the calendar at its default height: inject it per mount.
  useEffect(() => {
    const script = document.createElement("script");
    script.src = EMBED_SCRIPT_SRC;
    script.async = true;
    document.body.appendChild(script);
    return () => {
      script.remove();
    };
  }, []);

  return (
    <div className="booking-widget">
      <p className="booking-widget-loading" aria-hidden="true">
        Chargement du calendrier…
      </p>
      <iframe
        className="booking-widget-frame"
        src={WIDGET_SRC}
        id={WIDGET_IFRAME_ID}
        title="Calendrier de réservation de l'appel découverte"
        allow="payment"
        scrolling="no"
      />
    </div>
  );
}
