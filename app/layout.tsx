import type { Metadata, Viewport } from "next";
import {
  Fira_Sans,
  Inter_Tight,
  Libre_Baskerville,
  Space_Grotesk,
} from "next/font/google";
import "mapbox-gl/dist/mapbox-gl.css";

import "@/app/globals.css";

import { APP_DESCRIPTION, APP_NAME } from "@/lib/constants";

import { ServiceWorkerRegistration } from "@/components/service-worker-registration";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const libreBaskerville = Libre_Baskerville({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-libre-baskerville",
  display: "swap",
});

const interDisplay = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-inter-display",
  display: "swap",
});

const firaSans = Fira_Sans({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-fira-sans",
  display: "swap",
});

const ACTIVE_FONT_PRESET = "space-grotesk";

export const metadata: Metadata = {
  metadataBase: new URL("https://fleafinder.app"),
  applicationName: APP_NAME,
  title: {
    default: APP_NAME,
    template: `%s | ${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/flea-logo.png",
    apple: "/flea-logo.png",
  },
  appleWebApp: {
    title: APP_NAME,
    capable: true,
    statusBarStyle: "black-translucent",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#335405",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-font-preview={ACTIVE_FONT_PRESET}
      className={`${spaceGrotesk.variable} ${libreBaskerville.variable} ${interDisplay.variable} ${firaSans.variable}`}
    >
      <body>
        <ServiceWorkerRegistration />
        {children}
      </body>
    </html>
  );
}
