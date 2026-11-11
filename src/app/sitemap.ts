import type { MetadataRoute } from "next";
import { site } from "@/content/site";

export const dynamic = "force-static";

const routes = ["", "new-here", "about", "clergy", "worship", "events", "resources", "give", "contact"];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((r) => ({
    url: `${site.url}/${r ? `${r}/` : ""}`,
    changeFrequency: r === "events" ? "weekly" : "monthly",
    priority: r === "" ? 1 : 0.7,
  }));
}
