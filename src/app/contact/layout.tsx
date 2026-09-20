import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Danish Syazwan for engineering inquiries, software architecture discussions, or collaboration opportunities.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact Danish Syazwan — Full-Stack Developer",
    description:
      "Get in touch with Danish Syazwan for engineering inquiries, software architecture discussions, or collaboration opportunities.",
    url: "/contact",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
