"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { qCodesData } from "@/lib/morse-code"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, CheckCircle, HelpCircle } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

type PracticeMode = "codeToMeaning" | "meaningToCode"

export default function QCodePractice() {
  const [mode, setMode] = useState<PracticeMode>("codeToMeaning")
  const [currentQuestion, setCurrentQuestion] = useState<string>("")
  const [options, setOptions] = useState<string[]>([])
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [score, setScore] = useState(0)
  const [totalQuestions, setTotalQuestions] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)

  const qCodes = Object.keys(qCodesData)

  const generateQuestion = () => {
    // ランダムなQ符号を選択
    const randomIndex = Math.floor(Math.random() * qCodes.length)
    const selectedCode = qCodes[randomIndex]

    // 現在の問題をセット
    setCurrentQuestion(mode === "codeToMeaning" ? selectedCode : qCodesData[selectedCode].meaning)

    // 選択肢を生成（正解を含む4つの選択肢）
    const correctAnswer = mode === "codeToMeaning" ? qCodesData[selectedCode].meaning : selectedCode
    const allOptions =
      mode === "codeToMeaning" ? Object.values(qCodesData).map((data) => data.meaning) : Object.keys(qCodesData)

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

  useEffect(() => {
    generateQuestion()
  }, [mode]) // Removed qCodes as a dependency

  const checkAnswer = () => {
    if (!selectedAnswer) return

    let correctAnswer = ""
    if (mode === "codeToMeaning") {
      correctAnswer = qCodesData[currentQuestion].meaning
    } else {
      // 意味からコードを探す
      const codeEntry = Object.entries(qCodesData).find(([_, data]) => data.meaning === currentQuestion)
      correctAnswer = codeEntry ? codeEntry[0] : ""
    }

    const isAnswerCorrect = selectedAnswer === correctAnswer
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
    setMode(mode === "codeToMeaning" ? "meaningToCode" : "codeToMeaning")
  }

  const revealAnswer = () => {
    setShowAnswer(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Button onClick={toggleMode} variant="outline">
          {mode === "codeToMeaning" ? "Q符号 → 意味" : "意味 → Q符号"}
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
            {mode === "codeToMeaning" ? "このQ符号の意味は？" : "この意味のQ符号は？"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-2xl font-bold text-center p-4 bg-muted/30 rounded-md">{currentQuestion}</div>

          <RadioGroup value={selectedAnswer || ""} onValueChange={setSelectedAnswer}>
            {options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2 p-2 rounded-md hover:bg-muted/50">
                <RadioGroupItem value={option} id={`option-${index}`} disabled={isCorrect !== null} />
                <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
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
                回答する
              </Button>
              <Button onClick={revealAnswer} variant="outline" className="flex-1">
                <HelpCircle className="h-4 w-4 mr-2" />
                答えを見る
              </Button>
            </div>
          ) : (
            <Button onClick={handleNextQuestion} className="w-full">
              次の問題
            </Button>
          )}

          {isCorrect !== null && (
            <div className={`flex items-center justify-center gap-2 ${isCorrect ? "text-green-500" : "text-red-500"}`}>
              {isCorrect ? <CheckCircle className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
              <span>{isCorrect ? "正解です！" : "不正解です。"}</span>
            </div>
          )}

          {(showAnswer || isCorrect === false) && (
            <div className="text-center p-2 bg-muted/30 rounded-md w-full">
              <span className="font-medium">正解: </span>
              {mode === "codeToMeaning" ? (
                <span>{qCodesData[currentQuestion].meaning}</span>
              ) : (
                <span>{Object.entries(qCodesData).find(([_, data]) => data.meaning === currentQuestion)?.[0]}</span>
              )}
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}

