"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { getLocalizedQCodesData, getLocalizedHamRadioData, getHamRadioCategories, textToMorse } from "@/lib/morse-code"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Search, Volume2, Info } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/i18n"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function RadioCodes() {
  const [searchTerm, setSearchTerm] = useState("")
  const [viewMode, setViewMode] = useState<"list" | "cards">("cards")
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined)
  const [isPlaying, setIsPlaying] = useState<string | null>(null)
  const { t, language } = useLanguage()

  const qCodesData = getLocalizedQCodesData(language)
  const hamRadioData = getLocalizedHamRadioData(language)
  const categories = ["Q符号", ...getHamRadioCategories(language)]

  // Q符号データを整形して、ham-radio-dataと同じ形式にする
  const formattedQCodesData = Object.entries(qCodesData).reduce(
    (acc, [code, data]) => {
      acc[code] = {
        ...data,
        morse: textToMorse(code),
        category: "Q符号",
      }
      return acc
    },
    {} as Record<string, any>,
  )

  // 両方のデータを統合
  const combinedData = {
    ...formattedQCodesData,
    ...hamRadioData,
  }

  // カテゴリーでフィルタリング
  const filteredByCategory = selectedCategory
    ? Object.fromEntries(Object.entries(combinedData).filter(([_, data]) => data.category === selectedCategory))
    : combinedData

  // 検索語でフィルタリング
  const filteredData = Object.entries(filteredByCategory).filter(
    ([code, data]) =>
      code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      data.morse.includes(searchTerm) ||
      data.meaning.toLowerCase().includes(searchTerm.toLowerCase()) ||
      data.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // アルファベット順にソート
  const sortedData = [...filteredData].sort(([codeA], [codeB]) => codeA.localeCompare(codeB))

  // モールス符号を音声で再生する関数
  const playMorseAudio = (morse: string, codeId: string) => {
    // 既に再生中の場合は停止
    if (isPlaying) {
      setIsPlaying(null)
      return
    }

    setIsPlaying(codeId)

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

    // 再生終了後の処理
    setTimeout(
      () => {
        setIsPlaying(null)
        audioContext.close()
      },
      (currentTime - audioContext.currentTime) * 1000 + 100,
    )
  }

  // コードを再生する関数
  const playCode = (code: string) => {
    playMorseAudio(textToMorse(code), `code-${code}`)
  }

  // 無線略語のモールス符号を再生する関数
  const playHamCodeMorse = (morse: string, code: string) => {
    playMorseAudio(morse, `morse-${code}`)
  }

  // カテゴリーバッジの色を取得する関数
  const getCategoryColor = (category: string) => {
    if (category === "Q符号") return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
    if (category === "運用符号") return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
    if (category === "一般的な略語") return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
    if (category === "数字コード") return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
    if (category === "緊急通信") return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
    if (category === "よく目にする") return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"
    return ""
  }

  // カテゴリーチップをレンダリングする関数
  const renderCategoryChips = () => {
    return (
      <div className="flex flex-wrap gap-2 mb-4">
        <Button
          variant={selectedCategory === undefined ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedCategory(undefined)}
          className="rounded-full"
        >
          {t("codes.all")}
        </Button>
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category)}
            className="rounded-full"
          >
            {category}
          </Button>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder={t("codes.searchByCodeMeaningDesc")}
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {renderCategoryChips()}

        <div className="flex justify-end">
          <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as "list" | "cards")} className="w-auto">
            <TabsList className="grid w-[180px] grid-cols-2">
              <TabsTrigger value="cards">{t("codes.cardView")}</TabsTrigger>
              <TabsTrigger value="list">{t("codes.listView")}</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {viewMode === "cards" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {sortedData.map(([code, data]) => (
            <Card key={code} className="hover:bg-accent/50 transition-colors overflow-hidden">
              <CardHeader className="pb-1 sm:pb-2 px-3 sm:px-4 pt-3 sm:pt-4">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg sm:text-xl flex items-center gap-1 sm:gap-2">
                    {code}
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => playCode(code)}>
                            <Volume2 className={`h-4 w-4 ${isPlaying === `code-${code}` ? "text-primary" : ""}`} />
                            <span className="sr-only">{t("common.play")}</span>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{t("morse.playMorse")}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </CardTitle>
                  <Badge variant="secondary" className={`${getCategoryColor(data.category)} text-xs`}>
                    {data.category}
                  </Badge>
                </div>
                <CardDescription className="font-medium text-foreground text-sm sm:text-base">
                  {data.meaning}
                </CardDescription>
              </CardHeader>
              <CardContent className="px-3 sm:px-4 pb-3 sm:pb-4 pt-0">
                <div className="font-mono text-xs sm:text-sm mb-1 sm:mb-2 flex items-center gap-1 sm:gap-2 flex-wrap">
                  {data.morse}
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => playHamCodeMorse(data.morse, code)}
                        >
                          <Volume2 className={`h-4 w-4 ${isPlaying === `morse-${code}` ? "text-primary" : ""}`} />
                          <span className="sr-only">{t("common.play")}</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{t("morse.playMorse")}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground">{data.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="border rounded-md divide-y">
          {sortedData.map(([code, data]) => (
            <div key={code} className="p-4 hover:bg-accent/50 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-lg">{code}</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => playCode(code)}>
                            <Volume2 className={`h-4 w-4 ${isPlaying === `code-${code}` ? "text-primary" : ""}`} />
                            <span className="sr-only">{t("common.play")}</span>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{t("morse.playMorse")}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <Badge variant="secondary" className={`${getCategoryColor(data.category)}`}>
                      {data.category}
                    </Badge>
                  </div>
                  <div className="font-medium mb-1">{data.meaning}</div>
                  <div className="font-mono text-sm flex items-center gap-2 mb-2">
                    {data.morse}
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => playHamCodeMorse(data.morse, code)}
                          >
                            <Volume2 className={`h-4 w-4 ${isPlaying === `morse-${code}` ? "text-primary" : ""}`} />
                            <span className="sr-only">{t("common.play")}</span>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{t("morse.playMorse")}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <p className="text-sm text-muted-foreground">{data.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {sortedData.length === 0 && (
        <div className="text-center p-8 text-muted-foreground border rounded-md">
          <Info className="h-12 w-12 mx-auto mb-2 text-muted-foreground/50" />
          <p className="mb-2">{t("codes.noResults")}</p>
          <Button
            variant="outline"
            onClick={() => {
              setSearchTerm("")
              setSelectedCategory(undefined)
            }}
          >
            {t("codes.all")}
          </Button>
        </div>
      )}
    </div>
  )
}

