"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { morseCodeData } from "@/lib/morse-code"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Search, Volume2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/i18n"

export default function MorseCodeChart() {
  const [searchTerm, setSearchTerm] = useState("")
  const { t } = useLanguage()

  const filteredData = Object.entries(morseCodeData).filter(
    ([char, code]) => char.toLowerCase().includes(searchTerm.toLowerCase()) || code.includes(searchTerm),
  )

  // モールス符号を音声で再生する関数を修正
  const playMorseAudio = (morse: string) => {
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
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder={t("morse.searchByCharOrMorse")}
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {filteredData.map(([char, code]) => (
          <Card key={char} className="hover:bg-accent transition-colors">
            <CardContent className="p-3 sm:p-4 text-center">
              <div className="text-xl sm:text-2xl font-bold">{char}</div>
              <div className="text-base sm:text-lg font-mono mt-1 sm:mt-2">{code}</div>
            </CardContent>
            <CardFooter className="p-2 pt-0 justify-center">
              <Button variant="ghost" size="sm" onClick={() => playMorseAudio(code)}>
                <Volume2 className="h-4 w-4 mr-1 sm:mr-2" />
                {t("common.play")}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

