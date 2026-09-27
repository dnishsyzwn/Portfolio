import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Pricing — Rates & Retainers",
  description:
    "Predictable software engineering pricing, monthly evolving maintenance retainers, and bespoke full-stack web applications by Danish Syazwan.",
  alternates: {
    canonical: "/pricing",
  },
  openGraph: {
    title: "My Pricing — Rates & Retainers | Danish Syazwan",
    description:
      "Predictable software engineering pricing, monthly evolving maintenance retainers, and bespoke full-stack web applications by Danish Syazwan.",
    url: "/pricing",
  },
};

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
