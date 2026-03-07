import type { Metadata } from "next";
import { DM_Serif_Display, Fraunces, Instrument_Sans } from "next/font/google";
import "mapbox-gl/dist/mapbox-gl.css";

import "@/app/globals.css";

import { APP_DESCRIPTION, APP_NAME } from "@/lib/constants";

import { ServiceWorkerRegistration } from "@/components/service-worker-registration";

const dmSerifDisplay = DM_Serif_Display({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-dm-serif",
  display: "swap"
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap"
});

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument",
  display: "swap"
});

export const metadata: Metadata = {
  metadataBase: new URL("https://fleafinder.app"),
  applicationName: APP_NAME,
  title: {
    default: APP_NAME,
    template: `%s | ${APP_NAME}`
  },
  description: APP_DESCRIPTION,
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/icon",
    apple: "/apple-icon"
  },
  appleWebApp: {
    title: APP_NAME,
    capable: true,
    statusBarStyle: "black-translucent"
  },
  formatDetection: {
    telephone: false
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${dmSerifDisplay.variable} ${fraunces.variable} ${instrumentSans.variable}`}>
      <body>
        <ServiceWorkerRegistration />
        {children}
      </body>
    </html>
  );
}
