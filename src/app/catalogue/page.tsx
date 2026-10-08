import type { Metadata } from "next";
import CatalogueGallery from "@/components/CatalogueGallery";

export const metadata: Metadata = {
  title: "Catalogue",
  description:
    "Explore the full catalogue of projects by Danish Syazwan — an interactive 3D museum gallery experience.",
};

export default function CataloguePage() {
  return <CatalogueGallery />;
}
