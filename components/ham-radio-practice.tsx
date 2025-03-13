"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, CheckCircle, HelpCircle, Volume2 } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { getHamRadioCategories, getLocalizedHamRadioData } from "@/lib/morse-code"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useLanguage } from "@/lib/i18n"

type PracticeMode = "codeToMeaning" | "meaningToCode" | "morseToCode"

export default function HamRadioPractice() {
  const [mode, setMode] = useState<PracticeMode>("codeToMeaning")
  const [currentQuestion, setCurrentQuestion] = useState<string>("")
  const [options, setOptions] = useState<string[]>([])
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [score, setScore] = useState(0)
  const [totalQuestions, setTotalQuestions] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined)
  const { t, language } = useLanguage()

  const categories = getHamRadioCategories()
  const hamRadioData = getLocalizedHamRadioData(language)
  const codesData = selectedCategory
    ? Object.fromEntries(Object.entries(hamRadioData).filter(([_, data]) => data.category === selectedCategory))
    : hamRadioData
  const codes = Object.keys(codesData)

  // 問題を生成する関数
  const generateQuestion = () => {
    if (codes.length === 0) {
      setCurrentQuestion("")
      setOptions([])
      return
    }

    // ランダムな符号を選択
    const randomIndex = Math.floor(Math.random() * codes.length)
    const selectedCode = codes[randomIndex]
    const codeData = codesData[selectedCode]

    // モードに応じて問題と正解を設定
    let questionText = ""
    let correctAnswer = ""

    switch (mode) {
      case "codeToMeaning":
        questionText = selectedCode
        correctAnswer = codeData.meaning
        break
      case "meaningToCode":
        questionText = codeData.meaning
        correctAnswer = selectedCode
        break
      case "morseToCode":
        questionText = codeData.morse
        correctAnswer = selectedCode
        break
    }

    setCurrentQuestion(questionText)

    // 選択肢を生成（正解を含む4つの選択肢）
    const allOptions =
      mode === "codeToMeaning" ? Object.values(codesData).map((data) => data.meaning) : Object.keys(codesData)

    // 正解を除いた選択肢から3つをランダムに選ぶ
    let otherOptions = allOptions.filter((option) => option !== correctAnswer)
    otherOptions = otherOptions.sort(() => 0.5 - Math.random()).slice(0, 3)

    // 正解と他の選択肢を合わせてシャッフル
    const allChoices = [...otherOptions, correctAnswer].sort(() => 0.5 - Math.random())

    setOptions(allChoices)
    setSelectedAnswer(null)
    setIsCorrect(null)
    setShowAnswer(false)
  }

  // 初回レンダリング時と、モードまたはカテゴリが変更されたときに問題を生成
  useEffect(() => {
    generateQuestion()
  }, [mode, selectedCategory])

  // 回答をチェックする関数
  const checkAnswer = () => {
    if (!selectedAnswer) return

    let correctAnswer = ""

    switch (mode) {
      case "codeToMeaning":
        correctAnswer = codesData[currentQuestion].meaning
        break
      case "meaningToCode":
        // 意味からコードを探す
        const codeEntry = Object.entries(codesData).find(([_, data]) => data.meaning === currentQuestion)
        correctAnswer = codeEntry ? codeEntry[0] : ""
        break
      case "morseToCode":
        // モース符号からコードを探す
        const morseEntry = Object.entries(codesData).find(([_, data]) => data.morse === currentQuestion)
        correctAnswer = morseEntry ? morseEntry[0] : ""
        break
    }

    const isAnswerCorrect = selectedAnswer === correctAnswer
    setIsCorrect(isAnswerCorrect)
    setTotalQuestions(totalQuestions + 1)

    if (isAnswerCorrect) {
      setScore(score + 1)
    }
  }

  // 次の問題に進む関数
  const handleNextQuestion = () => {
    generateQuestion()
  }

  // モードを切り替える関数
  const handleModeChange = (newMode: PracticeMode) => {
    setMode(newMode)
  }

  // 答えを表示する関数
  const revealAnswer = () => {
    setShowAnswer(true)
  }

  // モールス符号を再生する関数
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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-4">
        <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center w-full sm:w-auto">
          <Select value={mode} onValueChange={(value) => handleModeChange(value as PracticeMode)}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder={t("common.practice")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="codeToMeaning">{t("codes.codeToMeaning")}</SelectItem>
              <SelectItem value="meaningToCode">{t("codes.meaningToCode")}</SelectItem>
              <SelectItem value="morseToCode">{t("codes.morseToCode")}</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={selectedCategory}
            onValueChange={(value) => setSelectedCategory(value === "all" ? undefined : value)}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder={t("codes.category")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("codes.all")}</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <span className="text-xs sm:text-sm font-medium">{t("common.accuracyRate")}:</span>
          <Badge variant="outline">{totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0}%</Badge>
        </div>
      </div>

      <Progress value={totalQuestions > 0 ? (score / totalQuestions) * 100 : 0} className="h-2" />

      {codes.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <p>{t("codes.noCategoryItems")}</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-center">
              {mode === "codeToMeaning"
                ? t("codes.whatMeaningForCode")
                : mode === "meaningToCode"
                  ? t("codes.whatCodeForMeaning")
                  : t("codes.whatCodeForMorse")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4 p-3 sm:p-4">
            <div className="flex flex-col items-center gap-2">
              <div className="text-xl sm:text-2xl font-bold text-center p-3 sm:p-4 bg-muted/30 rounded-md w-full break-all">
                {currentQuestion}
              </div>

              {mode === "morseToCode" && (
                <Button variant="outline" size="sm" onClick={() => playMorseAudio(currentQuestion)}>
                  <Volume2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  {t("morse.playMorse")}
                </Button>
              )}
            </div>

            <RadioGroup value={selectedAnswer || ""} onValueChange={setSelectedAnswer}>
              {options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2 p-2 rounded-md hover:bg-muted/50">
                  <RadioGroupItem value={option} id={`option-${index}`} disabled={isCorrect !== null} />
                  <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer text-sm">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            {isCorrect === null && !showAnswer ? (
              <div className="flex gap-2 w-full">
                <Button onClick={checkAnswer} disabled={!selectedAnswer} className="flex-1">
                  {t("common.submit")}
                </Button>
                <Button onClick={revealAnswer} variant="outline" className="flex-1">
                  <HelpCircle className="h-4 w-4 mr-2" />
                  {t("common.showAnswer")}
                </Button>
              </div>
            ) : (
              <Button onClick={handleNextQuestion} className="w-full">
                {t("common.nextQuestion")}
              </Button>
            )}

            {isCorrect !== null && (
              <div
                className={`flex items-center justify-center gap-2 ${isCorrect ? "text-green-500" : "text-red-500"}`}
              >
                {isCorrect ? <CheckCircle className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
                <span>{isCorrect ? t("common.correct") : t("common.incorrect")}</span>
              </div>
            )}

            {(showAnswer || isCorrect === false) && (
              <div className="text-center p-2 bg-muted/30 rounded-md w-full">
                <span className="font-medium">{t("common.answer")}: </span>
                {mode === "codeToMeaning" ? (
                  <span>{codesData[currentQuestion].meaning}</span>
                ) : mode === "meaningToCode" ? (
                  <span>{Object.entries(codesData).find(([_, data]) => data.meaning === currentQuestion)?.[0]}</span>
                ) : (
                  <span>{Object.entries(codesData).find(([_, data]) => data.morse === currentQuestion)?.[0]}</span>
                )}
              </div>
            )}
          </CardFooter>
        </Card>
      )}
    </div>
  )
}

