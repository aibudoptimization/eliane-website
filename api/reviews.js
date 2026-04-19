const GOOGLE_PLACES_BASE_URL = "https://places.googleapis.com/v1/places";
const GOOGLE_FIELD_MASK =
  "id,displayName,rating,userRatingCount,reviews,googleMapsUri";
const REQUEST_TIMEOUT_MS = 10_000;

function setCommonHeaders(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=21600, stale-while-revalidate=86400",
  );
  res.setHeader("Content-Type", "application/json; charset=utf-8");
}

function getReviewText(review) {
  const originalText = review?.originalText?.text;
  const originalTextLang = review?.originalText?.languageCode;
  const reviewTextLang = review?.textLanguageCode;
  const translatedText = review?.text?.text;

  if (
    originalText &&
    ((!originalTextLang && !reviewTextLang) ||
      (typeof originalTextLang === "string" && originalTextLang.startsWith("fr")) ||
      (typeof reviewTextLang === "string" && reviewTextLang.startsWith("fr")))
  ) {
    return originalText;
  }

  return translatedText || originalText || "";
}

function sanitizeResponse(placePayload) {
  const reviews = Array.isArray(placePayload?.reviews) ? placePayload.reviews : [];

  return {
    rating: placePayload?.rating ?? null,
    reviewCount: placePayload?.userRatingCount ?? 0,
    googleMapsUrl: placePayload?.googleMapsUri ?? null,
    reviews: reviews.map((review) => ({
      authorName: review?.authorAttribution?.displayName || "",
      authorPhotoUrl: review?.authorAttribution?.photoUri || null,
      rating: review?.rating ?? null,
      text: getReviewText(review),
      relativeTime: review?.relativePublishTimeDescription || "",
      publishedAt: review?.publishTime || null,
    })),
  };
}

export default async function handler(req, res) {
  setCommonHeaders(res);

  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method Not Allowed. Use GET." });
  }

  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;

  if (!apiKey || !placeId) {
    return res.status(500).json({
      error:
        "Server configuration error: missing GOOGLE_PLACES_API_KEY or GOOGLE_PLACE_ID.",
    });
  }

  const redactedKey = `${apiKey.slice(0, 6)}...`;

  const requestUrl = new URL(`${GOOGLE_PLACES_BASE_URL}/${encodeURIComponent(placeId)}`);
  requestUrl.searchParams.set("languageCode", "fr");

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(requestUrl, {
      method: "GET",
      headers: {
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": GOOGLE_FIELD_MASK,
      },
      signal: controller.signal,
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("[GOOGLE ERROR] Status:", response.status);
      console.error("[GOOGLE ERROR] Body:", errorBody);
      console.error(
        "[GOOGLE ERROR] Headers:",
        Object.fromEntries(response.headers.entries()),
      );
      return res.status(502).json({ error: "Upstream Google Places API error." });
    }

    const placePayload = await response.json();
    const transformed = sanitizeResponse(placePayload);

    return res.status(200).json(transformed);
  } catch (error) {
    if (error?.name === "AbortError") {
      return res.status(504).json({ error: "Google Places request timed out." });
    }

    console.error("Unexpected reviews endpoint error:", {
      message: error?.message,
      keyPrefix: redactedKey,
    });
    return res.status(502).json({ error: "Failed to fetch Google reviews." });
  } finally {
    clearTimeout(timeoutId);
  }
}
