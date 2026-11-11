/** Formats an ISO yyyy-mm-dd date without timezone drift. */
export function formatDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d, 12));
  const fmt = (o: Intl.DateTimeFormatOptions) =>
    new Intl.DateTimeFormat("en-US", { timeZone: "UTC", ...o }).format(date);
  return {
    month: fmt({ month: "short" }),
    day: String(d),
    weekday: fmt({ weekday: "long" }),
    long: fmt({ weekday: "long", month: "long", day: "numeric", year: "numeric" }),
  };
}
