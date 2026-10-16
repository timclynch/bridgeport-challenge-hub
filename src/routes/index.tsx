import { createFileRoute } from "@tanstack/react-router";
import { HomeExperience } from "@/components/next/home-experience";
import { Shell } from "@/components/next/shell";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Next Step — University of Bridgeport" },
      { name: "description", content: "Turn a need into one clear next step at the University of Bridgeport." },
      { property: "og:title", content: "Next Step — University of Bridgeport" },
      { property: "og:description", content: "Turn a need into one clear next step at UB." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Start,
});

function Start() {
  return (
    <Shell>
      <HomeExperience />
    </Shell>
  );
}
