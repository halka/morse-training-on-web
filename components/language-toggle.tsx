"use client"

import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/i18n"
import { Languages } from "lucide-react"

export function LanguageToggle() {
  const { language, setLanguage, t } = useLanguage()

  const toggleLanguage = () => {
    setLanguage(language === "ja" ? "en" : "ja")
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleLanguage}
      title={language === "ja" ? t("language.switchToEnglish") : t("language.switchToJapanese")}
    >
      <Languages className="h-5 w-5" />
      <span className="sr-only">
        {language === "ja" ? t("language.switchToEnglish") : t("language.switchToJapanese")}
      </span>
    </Button>
  )
}

