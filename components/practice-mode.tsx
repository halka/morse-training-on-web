"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { morseCodeData, textToMorse, morseToText } from "@/lib/morse-code"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, CheckCircle, Volume2 } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { useLanguage } from "@/lib/i18n"

type PracticeMode = "textToMorse" | "morseToText"

export default function PracticeMode() {
  const [mode, setMode] = useState<PracticeMode>("textToMorse")
  const [currentQuestion, setCurrentQuestion] = useState("")
  const [userAnswer, setUserAnswer] = useState("")
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [score, setScore] = useState(0)
  const [totalQuestions, setTotalQuestions] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const { t } = useLanguage()

  const generateQuestion = () => {
    const characters = Object.keys(morseCodeData)
    const randomChar = characters[Math.floor(Math.random() * characters.length)]
    setCurrentQuestion(mode === "textToMorse" ? randomChar : morseCodeData[randomChar])
    setUserAnswer("")
    setIsCorrect(null)
    setShowAnswer(false)
  }

  useEffect(() => {
    generateQuestion()
  }, []) //Fixed useEffect dependency

  const checkAnswer = () => {
    let correctAnswer = ""
    if (mode === "textToMorse") {
      correctAnswer = textToMorse(currentQuestion)
    } else {
      correctAnswer = morseToText(currentQuestion)
    }

    const isAnswerCorrect = userAnswer.trim().toLowerCase() === correctAnswer.trim().toLowerCase()
    setIsCorrect(isAnswerCorrect)
    setTotalQuestions(totalQuestions + 1)

    if (isAnswerCorrect) {
      setScore(score + 1)
    }
  }

  const handleNextQuestion = () => {
    generateQuestion()
  }

  const toggleMode = () => {
    setMode(mode === "textToMorse" ? "morseToText" : "textToMorse")
  }

  const revealAnswer = () => {
    setShowAnswer(true)
  }

  // モールス符号を音声で再生する関数
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-4 mb-4">
        <Button onClick={toggleMode} variant="outline" className="w-full sm:w-auto text-sm">
          {mode === "textToMorse" ? t("morse.charToMorse") : t("morse.morseToChar")}
        </Button>
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <span className="text-xs sm:text-sm font-medium">{t("common.accuracyRate")}:</span>
          <Badge variant="outline">{totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0}%</Badge>
        </div>
      </div>

      <Progress value={totalQuestions > 0 ? (score / totalQuestions) * 100 : 0} className="h-2" />

      <Card>
        <CardHeader>
          <CardTitle className="text-center">
            {mode === "textToMorse" ? t("morse.whatMorseForChar") : t("morse.whatCharForMorse")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 sm:space-y-4 p-3 sm:p-4">
          <div className="flex flex-col items-center gap-2">
            <div className="text-3xl sm:text-4xl font-bold text-center">{currentQuestion}</div>

            {mode === "morseToText" && (
              <Button variant="outline" size="sm" onClick={() => playMorseAudio(currentQuestion)}>
                <Volume2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                {t("morse.playMorse")}
              </Button>
            )}
          </div>

          <div className="space-y-3 sm:space-y-4">
            <Input
              type="text"
              placeholder={mode === "textToMorse" ? t("morse.enterMorse") : t("morse.enterChar")}
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              className="text-center"
            />

            <div className="flex justify-center gap-2">
              <Button onClick={checkAnswer} className="text-sm">
                {t("common.submit")}
              </Button>
              <Button onClick={revealAnswer} variant="outline" className="text-sm">
                {t("common.showAnswer")}
              </Button>
            </div>
          </div>

          {isCorrect !== null && (
            <div className={`flex items-center justify-center gap-2 ${isCorrect ? "text-green-500" : "text-red-500"}`}>
              {isCorrect ? (
                <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5" />
              ) : (
                <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5" />
              )}
              <span className="text-sm">{isCorrect ? t("common.correct") : t("common.incorrect")}</span>
            </div>
          )}

          {(showAnswer || isCorrect === false) && (
            <div className="text-center">
              <span className="font-medium text-sm">{t("common.answer")}: </span>
              <span className="font-mono text-sm">
                {mode === "textToMorse" ? textToMorse(currentQuestion) : morseToText(currentQuestion)}
              </span>
              {mode === "textToMorse" && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-1 sm:ml-2"
                  onClick={() => playMorseAudio(textToMorse(currentQuestion))}
                >
                  <Volume2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                  {t("common.play")}
                </Button>
              )}
            </div>
          )}

          {(isCorrect !== null || showAnswer) && (
            <div className="flex justify-center">
              <Button onClick={handleNextQuestion} className="text-sm">
                {t("common.nextQuestion")}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

