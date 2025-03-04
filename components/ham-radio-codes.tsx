"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { getHamRadioCategories, getHamRadioByCategory } from "@/lib/morse-code"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Search, Volume2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function HamRadioCodes() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined)
  const [viewMode, setViewMode] = useState<"list" | "cards">("cards")
  const categories = getHamRadioCategories()

  const filteredData = Object.entries(getHamRadioByCategory(selectedCategory)).filter(
    ([code, data]) =>
      code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      data.morse.includes(searchTerm) ||
      data.meaning.toLowerCase().includes(searchTerm.toLowerCase()) ||
      data.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // モールス符号を音声で再生する関数
  const playMorseAudio = (morse: string) => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
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
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="符号、意味、説明で検索"
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Select
          value={selectedCategory}
          onValueChange={(value) => setSelectedCategory(value === "all" ? undefined : value)}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="カテゴリー" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">すべて</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as "list" | "cards")} className="w-full sm:w-auto">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="cards">カード表示</TabsTrigger>
            <TabsTrigger value="list">リスト表示</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {viewMode === "cards" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filteredData.map(([code, data]) => (
            <Card key={code} className="hover:bg-accent transition-colors">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl">{code}</CardTitle>
                  <Badge variant="outline">{data.category}</Badge>
                </div>
                <CardDescription className="font-medium text-foreground">{data.meaning}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="font-mono text-sm mb-2">{data.morse}</div>
                <p className="text-sm text-muted-foreground">{data.description}</p>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" size="sm" className="ml-auto" onClick={() => playMorseAudio(data.morse)}>
                  <Volume2 className="h-4 w-4 mr-2" />
                  再生
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="border rounded-md divide-y">
          {filteredData.map(([code, data]) => (
            <div key={code} className="p-4 hover:bg-accent transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-lg">{code}</span>
                    <Badge variant="outline">{data.category}</Badge>
                  </div>
                  <div className="font-medium">{data.meaning}</div>
                  <div className="font-mono text-sm">{data.morse}</div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => playMorseAudio(data.morse)}>
                  <Volume2 className="h-4 w-4 mr-2" />
                  再生
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-1">{data.description}</p>
            </div>
          ))}
        </div>
      )}

      {filteredData.length === 0 && (
        <div className="text-center p-8 text-muted-foreground">
          検索結果がありません。別のキーワードで検索してください。
        </div>
      )}
    </div>
  )
}

