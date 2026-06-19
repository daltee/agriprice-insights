import matoke from "@/assets/produce-matoke.jpg";
import tomatoes from "@/assets/produce-tomatoes.jpg";
import beans from "@/assets/produce-beans.jpg";
import maize from "@/assets/produce-maize.jpg";
import sukuma from "@/assets/produce-sukuma.jpg";
import sweet from "@/assets/produce-sweetpotato.jpg";

const map: Record<string, string> = {
  matoke,
  tomatoes,
  beans,
  maize,
  "sweet-potatoes": sweet,
  cabbage: sukuma,
  sukuma,
};

export function produceImage(slugOrName: string | null | undefined): string | null {
  if (!slugOrName) return null;
  const k = slugOrName.toLowerCase().replace(/\s+/g, "-");
  return map[k] ?? null;
}

export const PRODUCE_GALLERY: { name: string; slug: string; src: string; blurb: string }[] = [
  { name: "Matoke", slug: "matoke", src: matoke, blurb: "Mbarara's daily staple" },
  { name: "Tomatoes", slug: "tomatoes", src: tomatoes, blurb: "Volatile, watch weekly" },
  { name: "Beans", slug: "beans", src: beans, blurb: "Dry season demand" },
  { name: "Maize", slug: "maize", src: maize, blurb: "Post-harvest movement" },
  { name: "Sukuma wiki", slug: "sukuma", src: sukuma, blurb: "Greens, always trading" },
  { name: "Sweet potatoes", slug: "sweet-potatoes", src: sweet, blurb: "Masaka basket favourite" },
];