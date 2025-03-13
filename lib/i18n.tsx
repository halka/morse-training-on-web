"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { jaTranslations } from "./translations/ja"
import { enTranslations } from "./translations/en"

// 言語タイプの定義
export type Language = "ja" | "en"

// 翻訳リソースの型定義
export type TranslationResource = typeof jaTranslations

// 翻訳リソースをマージ
export const translations = {
  ja: jaTranslations,
  en: enTranslations,
}

// 言語コンテキストの型定義
type LanguageContextType = {
  language: Language
  setLanguage: (language: Language) => void
  t: (key: string) => string
}

// デフォルト値
const defaultLanguageContext: LanguageContextType = {
  language: "ja",
  setLanguage: () => {},
  t: (key) => key,
}

// コンテキストの作成
const LanguageContext = createContext<LanguageContextType>(defaultLanguageContext)

// プロバイダーコンポーネント
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("ja")

  // 初期化時にローカルストレージから言語設定を読み込む
  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language | null
    if (savedLanguage && (savedLanguage === "ja" || savedLanguage === "en")) {
      setLanguageState(savedLanguage)
    }
  }, [])

  // 言語設定を変更する関数
  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage)
    localStorage.setItem("language", newLanguage)
  }

  // 翻訳関数
  const t = (key: string): string => {
    // キーをドット表記で分割（例: "common.search" → ["common", "search"]）
    const parts = key.split(".")

    // 翻訳リソースから値を取得
    let value: any = translations[language]

    // ネストされたオブジェクトから値を取得
    for (const part of parts) {
      if (value && typeof value === "object" && part in value) {
        value = value[part]
      } else {
        // 旧形式のフラットなキーをサポート（後方互換性）
        const flatValue = translations[language][key as keyof typeof translations.ja]
        return typeof flatValue === "string" ? flatValue : key
      }
    }

    return typeof value === "string" ? value : key
  }

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}

// フック
export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}

