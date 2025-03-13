"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { morseToText } from "@/lib/morse-code"
import { Mic, MicOff, Volume2, Settings2 } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { useLanguage } from "@/lib/i18n"

export default function KeyInput() {
  const [isListening, setIsListening] = useState(false)
  const [threshold, setThreshold] = useState(0.1) // 音声検出の閾値
  const [detectionDelay, setDetectionDelay] = useState(50) // ミリ秒
  const [dotDuration, setDotDuration] = useState(150) // ミリ秒
  const [dashDuration, setDashDuration] = useState(450) // ミリ秒
  const [symbolGap, setSymbolGap] = useState(200) // ミリ秒
  const [letterGap, setLetterGap] = useState(500) // ミリ秒
  const [wordGap, setWordGap] = useState(1200) // ミリ秒
  const [currentMorse, setCurrentMorse] = useState("")
  const [decodedText, setDecodedText] = useState("")
  const [showVisualizer, setShowVisualizer] = useState(true)
  const [volume, setVolume] = useState(0)
  const [autoDecodeEnabled, setAutoDecodeEnabled] = useState(true)
  const { t } = useLanguage()

  const audioContext = useRef<AudioContext | null>(null)
  const analyser = useRef<AnalyserNode | null>(null)
  const dataArray = useRef<Uint8Array | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const animationRef = useRef<number | null>(null)
  const lastSignalTime = useRef<number>(0)
  const currentSignalState = useRef<boolean>(false)
  const signalBuffer = useRef<string>("")
  const lastLetterTime = useRef<number>(0)
  const lastWordTime = useRef<number>(0)

  // オーディオ入力の初期化
  const initAudio = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })

      audioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)()
      analyser.current = audioContext.current.createAnalyser()
      const source = audioContext.current.createMediaStreamSource(stream)

      source.connect(analyser.current)
      analyser.current.fftSize = 256

      const bufferLength = analyser.current.frequencyBinCount
      dataArray.current = new Uint8Array(bufferLength)

      setIsListening(true)
      startListening()

      if (showVisualizer) {
        startVisualizer()
      }
    } catch (err) {
      console.error("マイクへのアクセスができませんでした:", err)
      setIsListening(false)
    }
  }

  // オーディオ入力の停止
  const stopAudio = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
      animationRef.current = null
    }

    if (audioContext.current) {
      audioContext.current.close()
      audioContext.current = null
      analyser.current = null
    }

    setIsListening(false)
  }

  // ビジュアライザーの開始
  const startVisualizer = () => {
    if (!canvasRef.current || !analyser.current || !dataArray.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height

    const draw = () => {
      if (!analyser.current || !dataArray.current || !ctx) return

      animationRef.current = requestAnimationFrame(draw)

      analyser.current.getByteTimeDomainData(dataArray.current)

      // ダークモード対応の背景色と線の色
      const isDarkMode = document.documentElement.classList.contains("dark")
      ctx.fillStyle = isDarkMode ? "rgb(30, 30, 30)" : "rgb(240, 240, 240)"
      ctx.fillRect(0, 0, width, height)

      ctx.lineWidth = 2
      ctx.strokeStyle = isDarkMode ? "rgb(0, 200, 0)" : "rgb(0, 120, 200)"
      ctx.beginPath()

      const sliceWidth = width / dataArray.current.length
      let x = 0

      for (let i = 0; i < dataArray.current.length; i++) {
        const v = dataArray.current[i] / 128.0
        const y = (v * height) / 2

        if (i === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }

        x += sliceWidth
      }

      ctx.lineTo(width, height / 2)
      ctx.stroke()
    }

    draw()
  }

  // 音声信号の検出
  const startListening = () => {
    if (!analyser.current || !dataArray.current) return

    const checkSignal = () => {
      if (!isListening || !analyser.current || !dataArray.current) return

      analyser.current.getByteTimeDomainData(dataArray.current)

      // 音量レベルの計算
      let sum = 0
      for (let i = 0; i < dataArray.current.length; i++) {
        // 128を中心として偏差を計算
        const deviation = Math.abs(dataArray.current[i] - 128)
        sum += deviation
      }
      const average = sum / dataArray.current.length / 128 // 0～1の範囲に正規化
      setVolume(average)

      // 閾値を超えたらシグナルあり
      const hasSignal = average > threshold

      const now = Date.now()

      // シグナル状態の変化を検出
      if (hasSignal !== currentSignalState.current) {
        const timeSinceLastSignal = now - lastSignalTime.current

        // 短いノイズを無視するためのディレイ
        if (timeSinceLastSignal > detectionDelay) {
          if (hasSignal) {
            // シグナル開始
            // 何もしない、終了時に長さを判定
          } else {
            // シグナル終了
            const signalDuration = now - lastSignalTime.current

            // 短点か長点かを判定
            if (signalDuration < dotDuration * 1.5) {
              signalBuffer.current += "."
            } else {
              signalBuffer.current += "-"
            }
          }

          currentSignalState.current = hasSignal
          lastSignalTime.current = now
        }
      }

      // 文字の区切りを検出（一定時間信号がない場合）
      if (!hasSignal && signalBuffer.current.length > 0) {
        const timeSinceLastSignal = now - lastSignalTime.current

        if (timeSinceLastSignal > letterGap && timeSinceLastSignal > lastLetterTime.current) {
          // 文字の区切り
          setCurrentMorse((prev) => prev + " " + signalBuffer.current)
          signalBuffer.current = ""
          lastLetterTime.current = now
        }

        // 単語の区切りを検出
        if (timeSinceLastSignal > wordGap && timeSinceLastSignal > lastWordTime.current) {
          // 単語の区切り
          setCurrentMorse((prev) => prev + " / ")
          lastWordTime.current = now
        }
      }

      // 自動デコード
      if (autoDecodeEnabled && currentMorse) {
        const decoded = morseToText(currentMorse)
        setDecodedText(decoded)
      }

      setTimeout(checkSignal, 10) // 10msごとにチェック
    }

    checkSignal()
  }

  // ビジュアライザーの表示/非表示切り替え
  useEffect(() => {
    if (isListening && showVisualizer) {
      startVisualizer()
    } else if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
      animationRef.current = null
    }
  }, [showVisualizer, isListening])

  // テーマ変更時にビジュアライザーを更新
  useEffect(() => {
    let observer: MutationObserver | null = null
    if (isListening && showVisualizer) {
      observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === "attributes" && mutation.attributeName === "class") {
            startVisualizer()
          }
        })
      })

      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["class"],
      })
    }
    return () => observer && observer.disconnect()
  }, [isListening, showVisualizer])

  // コンポーネントのクリーンアップ
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      if (audioContext.current) {
        audioContext.current.close()
      }
    }
  }, [])

  // モールス符号をデコード
  const decodeCurrentMorse = () => {
    const decoded = morseToText(currentMorse)
    setDecodedText(decoded)
  }

  // 入力をクリア
  const clearInput = () => {
    setCurrentMorse("")
    setDecodedText("")
    signalBuffer.current = ""
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t("keyerTitle")}</CardTitle>
          <CardDescription>{t("keyerDescription")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* コントロールセクション - モバイル対応のレイアウト */}
          <div className="flex flex-wrap gap-3 items-center justify-between">
            <Button
              onClick={isListening ? stopAudio : initAudio}
              variant={isListening ? "destructive" : "default"}
              className="w-full sm:w-auto"
            >
              {isListening ? (
                <>
                  <MicOff className="mr-2 h-4 w-4" /> {t("stop")}
                </>
              ) : (
                <>
                  <Mic className="mr-2 h-4 w-4" /> {t("start")}
                </>
              )}
            </Button>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Volume2 className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <div className="w-full sm:w-32 h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all"
                  style={{ width: `${Math.min(volume * 100 * 3, 100)}%` }}
                />
              </div>
            </div>

            <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
              <Label htmlFor="show-visualizer" className="whitespace-nowrap">
                {t("waveform")}
              </Label>
              <Switch id="show-visualizer" checked={showVisualizer} onCheckedChange={setShowVisualizer} />
            </div>
          </div>

          {showVisualizer && (
            <div className="border rounded-md p-1 bg-black dark:bg-black">
              <canvas ref={canvasRef} width={600} height={100} className="w-full h-24" />
            </div>
          )}

          <div className="space-y-2">
            <div className="font-medium">{t("detectedMorse")}:</div>
            <div className="p-4 min-h-16 bg-muted rounded-md font-mono break-all text-sm sm:text-base overflow-x-auto whitespace-normal">
              {currentMorse || t("waitingForInput")}
            </div>
          </div>

          <div className="space-y-2">
            <div className="font-medium">{t("decodedText")}:</div>
            <div className="p-4 min-h-16 bg-muted rounded-md break-all text-sm sm:text-base overflow-x-auto whitespace-normal">
              {decodedText || t("decodedTextWillAppear")}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button onClick={decodeCurrentMorse} disabled={!currentMorse} className="flex-1 sm:flex-none">
              {t("decode")}
            </Button>
            <Button onClick={clearInput} variant="outline" className="flex-1 sm:flex-none">
              {t("clear")}
            </Button>
          </div>
        </CardContent>
        <CardFooter>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="settings">
              <AccordionTrigger>
                <div className="flex items-center">
                  <Settings2 className="h-4 w-4 mr-2" />
                  {t("advancedSettings")}
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 pt-2">
                  <div className="flex items-center space-x-2">
                    <Label htmlFor="auto-decode" className="min-w-[100px]">
                      {t("autoDecode")}
                    </Label>
                    <Switch id="auto-decode" checked={autoDecodeEnabled} onCheckedChange={setAutoDecodeEnabled} />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label className="min-w-[100px]">{t("sensitivity")}:</Label>
                      <span className="text-sm font-mono">{threshold.toFixed(2)}</span>
                    </div>
                    <Slider
                      value={[threshold]}
                      min={0.01}
                      max={0.5}
                      step={0.01}
                      onValueChange={(value) => setThreshold(value[0])}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label className="min-w-[100px]">{t("dotLength")}:</Label>
                      <span className="text-sm font-mono">{dotDuration}ms</span>
                    </div>
                    <Slider
                      value={[dotDuration]}
                      min={50}
                      max={300}
                      step={10}
                      onValueChange={(value) => {
                        setDotDuration(value[0])
                        setDashDuration(value[0] * 3)
                      }}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label className="min-w-[100px]">{t("letterGap")}:</Label>
                      <span className="text-sm font-mono">{letterGap}ms</span>
                    </div>
                    <Slider
                      value={[letterGap]}
                      min={300}
                      max={1000}
                      step={50}
                      onValueChange={(value) => setLetterGap(value[0])}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label className="min-w-[100px]">{t("wordGap")}:</Label>
                      <span className="text-sm font-mono">{wordGap}ms</span>
                    </div>
                    <Slider
                      value={[wordGap]}
                      min={700}
                      max={2000}
                      step={100}
                      onValueChange={(value) => setWordGap(value[0])}
                    />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardFooter>
      </Card>
    </div>
  )
}

