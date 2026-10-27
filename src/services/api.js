const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

export async function getFlights(search) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/flights/search`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        origin: search.origin.code,
        destination: search.destination.code,
        departDate: search.departDate,
        returnDate: search.tripType === "round-trip" ? search.returnDate : "",
        adults: search.adults || 1,
        children: search.children || 0,
        cabin: search.cabin || "Economy",
      }),
      signal: AbortSignal.timeout(50_000),
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(payload.error || `Flight search failed (${response.status}).`);
    return { data: payload.data || [], source: payload.source || "demo", message: payload.message || "" };
  } catch (error) {
    console.error("Flight API request failed:", error);
    return { data: [], source: "demo", message: error.message || "Could not reach the flight API." };
  }
}
