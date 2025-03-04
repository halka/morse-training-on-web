"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { morseCodeData, textToMorse, morseToText } from "@/lib/morse-code"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, CheckCircle } from "lucide-react"
import { Progress } from "@/components/ui/progress"

type PracticeMode = "textToMorse" | "morseToText"

export default function PracticeMode() {
  const [mode, setMode] = useState<PracticeMode>("textToMorse")
  const [currentQuestion, setCurrentQuestion] = useState("")
  const [userAnswer, setUserAnswer] = useState("")
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [score, setScore] = useState(0)
  const [totalQuestions, setTotalQuestions] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)

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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Button onClick={toggleMode} variant="outline">
          {mode === "textToMorse" ? "文字 → モールス符号" : "モールス符号 → 文字"}
        </Button>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">正解率:</span>
          <Badge variant="outline">{totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0}%</Badge>
        </div>
      </div>

      <Progress value={totalQuestions > 0 ? (score / totalQuestions) * 100 : 0} className="h-2" />

      <Card>
        <CardHeader>
          <CardTitle className="text-center">
            {mode === "textToMorse" ? "この文字のモールス符号は？" : "このモールス符号の文字は？"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-4xl font-bold text-center">{currentQuestion}</div>

          <div className="space-y-4">
            <Input
              type="text"
              placeholder={mode === "textToMorse" ? "モールス符号を入力" : "文字を入力"}
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              className="text-center"
            />

            <div className="flex justify-center gap-2">
              <Button onClick={checkAnswer}>回答する</Button>
              <Button onClick={revealAnswer} variant="outline">
                答えを見る
              </Button>
            </div>
          </div>

          {isCorrect !== null && (
            <div className={`flex items-center justify-center gap-2 ${isCorrect ? "text-green-500" : "text-red-500"}`}>
              {isCorrect ? <CheckCircle className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
              <span>{isCorrect ? "正解です！" : "不正解です。"}</span>
            </div>
          )}

          {(showAnswer || isCorrect === false) && (
            <div className="text-center">
              <span className="font-medium">正解: </span>
              <span className="font-mono">
                {mode === "textToMorse" ? textToMorse(currentQuestion) : morseToText(currentQuestion)}
              </span>
            </div>
          )}

          {(isCorrect !== null || showAnswer) && (
            <div className="flex justify-center">
              <Button onClick={handleNextQuestion}>次の問題</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

