"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { getLocalizedQCodesData, textToMorse } from "@/lib/morse-code"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Search, Volume2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useLanguage } from "@/lib/i18n"
import { Button } from "@/components/ui/button"

export default function QCodes() {
  const [searchTerm, setSearchTerm] = useState("")
  const [viewMode, setViewMode] = useState<"list" | "cards">("cards")
  const { t, language } = useLanguage()
  const qCodesData = getLocalizedQCodesData(language)

  const filteredData = Object.entries(qCodesData).filter(
    ([code, data]) =>
      code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      data.meaning.toLowerCase().includes(searchTerm.toLowerCase()) ||
      data.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // モールス符号を音声で再生する関数
  const playMorseAudio = (code: string) => {
    // Q符号をモールス符号に変換
    const morse = textToMorse(code)

    // Node.js v22.14.0対応のためにオプションを追加
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({
      latencyHint: "interactive",
      sampleRate: 44100,
    })
    const gainNode = audioContext.createGain()
    gainNode.connect(audioContext.destination)

    const dotDuration = 100 // ミリ秒
    const dashDuration = dotDuration * 3
    const symbolGap = dotDuration
    const letterGap = dotDuration * 3

    let currentTime = audioContext.currentTime

    // スペースで分割して文字ごとに処理
    morse.split(" ").forEach((letter, letterIndex) => {
      // 文字内の各シンボル（ドットとダッシュ）を処理
      letter.split("").forEach((symbol, symbolIndex) => {
        if (symbol === "." || symbol === "-") {
          const duration = symbol === "." ? dotDuration : dashDuration

          // オシレーターを作成して接続
          const osc = audioContext.createOscillator()
          osc.type = "sine"
          osc.frequency.value = 700 // 700Hzの音

          const oscGain = audioContext.createGain()
          oscGain.gain.value = 0.5

          osc.connect(oscGain)
          oscGain.connect(audioContext.destination)

          // 音を鳴らす
          osc.start(currentTime)
          osc.stop(currentTime + duration / 1000)

          currentTime += duration / 1000

          // シンボル間のギャップを追加（最後のシンボル以外）
          if (symbolIndex < letter.length - 1) {
            currentTime += symbolGap / 1000
          }
        }
      })

      // 文字間のギャップを追加（最後の文字以外）
      if (letterIndex < morse.split(" ").length - 1) {
        currentTime += letterGap / 1000
      }
    })

    // 5秒後にオーディオコンテキストを閉じる（メモリリーク防止）
    setTimeout(() => {
      audioContext.close()
    }, 5000)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-center mb-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder={t("codes.searchByCodeOrMeaning")}
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as "list" | "cards")} className="w-full sm:w-auto">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="cards">{t("codes.cardView")}</TabsTrigger>
            <TabsTrigger value="list">{t("codes.listView")}</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {viewMode === "cards" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {filteredData.map(([code, data]) => (
            <Card key={code} className="hover:bg-accent transition-colors">
              <CardHeader className="pb-1 sm:pb-2 px-3 sm:px-4 pt-3 sm:pt-4">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg sm:text-xl">{code}</CardTitle>
                  <div className="flex items-center gap-1 sm:gap-2">
                    <Button variant="ghost" size="sm" onClick={() => playMorseAudio(code)}>
                      <Volume2 className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                    <Badge variant="outline" className="font-mono text-xs">
                      {code.split("").map((char) => char + " ")}
                    </Badge>
                  </div>
                </div>
                <CardDescription className="font-medium text-foreground text-sm sm:text-base">
                  {data.meaning}
                </CardDescription>
              </CardHeader>
              <CardContent className="text-xs sm:text-sm text-muted-foreground px-3 sm:px-4 pb-3 sm:pb-4">
                {data.description}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="border rounded-md divide-y">
          {filteredData.map(([code, data]) => (
            <div key={code} className="p-3 sm:p-4 hover:bg-accent transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-base sm:text-lg">{code}</span>
                  <Button variant="ghost" size="sm" onClick={() => playMorseAudio(code)}>
                    <Volume2 className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                  <Badge variant="outline" className="font-mono text-xs">
                    {code.split("").map((char) => char + " ")}
                  </Badge>
                </div>
                <span className="font-medium text-sm">{data.meaning}</span>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">{data.description}</p>
            </div>
          ))}
        </div>
      )}

      {filteredData.length === 0 && <div className="text-center p-8 text-muted-foreground">{t("codes.noResults")}</div>}
    </div>
  )
}

