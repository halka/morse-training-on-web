"use client"

import { useState, useEffect } from "react"

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    // SSRの場合はデフォルト値を返す
    if (typeof window === "undefined") {
      return setMatches(false)
    }

    const media = window.matchMedia(query)

    // 初期値を設定
    setMatches(media.matches)

    // リスナーを追加
    const listener = (e: MediaQueryListEvent) => {
      setMatches(e.matches)
    }

    // メディアクエリの変更を監視
    media.addEventListener("change", listener)

    // クリーンアップ
    return () => {
      media.removeEventListener("change", listener)
    }
  }, [query])

  return matches
}

