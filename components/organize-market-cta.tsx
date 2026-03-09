"use client"

import { useRouter } from "next/navigation"
import { EmptyState } from "@/components/ui/empty-state"
import { Store, MapPin, CalendarDays } from "lucide-react"

export function OrganizeMarketCTA({ locale }: { locale: string }) {
  const router = useRouter()
  return (
    <EmptyState
      title={locale === "da" ? "Arrangerer du et marked?" : "Organizing a market?"}
      description={locale === "da" 
        ? "Gør det nemt for folk at finde dig. Tilføj dit loppemarked gratis." 
        : "Make it easy for people to find you. Add your flea market for free."}
      icons={[Store, MapPin, CalendarDays]}
      action={{
        label: locale === "da" ? "Tilføj et marked" : "Add a market",
        onClick: () => router.push(`/${locale}/dashboard?series=new`)
      }}
      className="mx-auto"
    />
  )
}
