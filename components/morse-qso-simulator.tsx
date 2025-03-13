"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Volume2, Send, RefreshCw, Play, Pause } from "lucide-react"
import { textToMorse } from "@/lib/morse-code"
import { useLanguage } from "@/lib/i18n"
import { generateRandomStationInfo, isValidCallsign } from "@/lib/callsign-data"

// QSOのステージ
enum QSOStage {
  START = 0, // 開始前
  CQ_CALL = 1, // CQ呼び出し
  ANSWER_CQ = 2, // CQへの応答
  EXCHANGE_1 = 3, // 最初の情報交換（相手局から）
  EXCHANGE_2 = 4, // 2番目の情報交換（自局から）
  FINAL = 5, // 最終メッセージ（相手局から）
  GOODBYE = 6, // さようなら（自局から）
  COMPLETE = 7, // 交信完了
}

export default function MorseQSOSimulator() {
  const { t, language } = useLanguage()
  const [myCallsign, setMyCallsign] = useState("")
  const [callsignError, setCallsignError] = useState(false)
  const [qsoStarted, setQsoStarted] = useState(false)
  const [qsoStage, setQsoStage] = useState<QSOStage>(QSOStage.START)
  const [stationInfo, setStationInfo] = useState<any>(null)
  const [qsoLog, setQsoLog] = useState<Array<{ text: string; morse: string; sender: "me" | "station" }>>([])
  const [currentMessage, setCurrentMessage] = useState("")
  const [isPlaying, setIsPlaying] = useState(false)
  const [playbackSpeed, setPlaybackSpeed] = useState<"slow" | "medium" | "fast">("medium")
  const [autoAdvance, setAutoAdvance] = useState(true)
  const [showMorseText, setShowMorseText] = useState(true)
  const [showPlainText, setShowPlainText] = useState(true)
  const [userInput, setUserInput] = useState("")
  const [expectedInput, setExpectedInput] = useState("")
  const [inputMode, setInputMode] = useState<"listen" | "send">("listen")

  const audioContext = useRef<AudioContext | null>(null)
  const logEndRef = useRef<HTMLDivElement>(null)

  // 再生速度の設定
  const speedSettings = {
    slow: { dotDuration: 150, dashDuration: 450, symbolGap: 150, letterGap: 450, wordGap: 1050 },
    medium: { dotDuration: 100, dashDuration: 300, symbolGap: 100, letterGap: 300, wordGap: 700 },
    fast: { dotDuration: 60, dashDuration: 180, symbolGap: 60, letterGap: 180, wordGap: 420 },
  }

  // QSOを開始する
  const startQSO = () => {
    if (!myCallsign.trim() || !isValidCallsign(myCallsign.trim().toUpperCase())) {
      setCallsignError(true)
      return
    }

    setCallsignError(false)
    setMyCallsign(myCallsign.trim().toUpperCase())

    // ランダムな局情報を生成
    const newStationInfo = generateRandomStationInfo()
    setStationInfo(newStationInfo)

    // QSOログをリセット
    setQsoLog([])

    // QSOを開始
    setQsoStarted(true)
    setQsoStage(QSOStage.CQ_CALL)

    // CQ呼び出しを追加
    const cqText = t("cqCalling").replace("{callsign}", newStationInfo.callsign)
    addToLog(cqText, "station")

    // 次のステップの入力を設定
    const nextInput = t("answerCq")
      .replace("{theirCallsign}", newStationInfo.callsign)
      .replace("{myCallsign}", myCallsign.trim().toUpperCase())
    setExpectedInput(nextInput)
    setInputMode("send")
  }

  // 新しいQSOを開始
  const startNewQSO = () => {
    setQsoStage(QSOStage.START)
    setQsoStarted(false)
    setStationInfo(null)
    setQsoLog([])
    setCurrentMessage("")
    setIsPlaying(false)
    setUserInput("")
    setExpectedInput("")
  }

  // QSOを続ける
  const continueQSO = () => {
    if (qsoStage === QSOStage.COMPLETE) {
      startNewQSO()
      return
    }

    // 次のステージに進む
    advanceQSOStage()
  }

  // QSOのステージを進める
  const advanceQSOStage = () => {
    switch (qsoStage) {
      case QSOStage.CQ_CALL:
        // CQへの応答
        setQsoStage(QSOStage.ANSWER_CQ)
        break

      case QSOStage.ANSWER_CQ:
        // 最初の情報交換（相手局から）
        setQsoStage(QSOStage.EXCHANGE_1)
        const exchange1Text = t("initialExchange")
          .replace("{myCallsign}", myCallsign)
          .replace("{theirCallsign}", stationInfo.callsign)
          .replace(/\{rst\}/g, stationInfo.rst)
          .replace(/\{name\}/g, stationInfo.name)
          .replace(/\{qth\}/g, stationInfo.qth)
        addToLog(exchange1Text, "station")

        // 次のステップの入力を設定
        const nextInput = t("returnExchange")
          .replace("{theirCallsign}", stationInfo.callsign)
          .replace("{myCallsign}", myCallsign)
          .replace(/\{rst\}/g, "599")
          .replace(/\{name\}/g, "OP")
          .replace(/\{qth\}/g, "TOKYO")
          .replace(/\{rig\}/g, "IC7300")
          .replace(/\{antenna\}/g, "DIPOLE")
          .replace(/\{weather\}/g, "SUNNY")
        setExpectedInput(nextInput)
        setInputMode("send")
        break

      case QSOStage.EXCHANGE_1:
        // 2番目の情報交換（自局から）
        setQsoStage(QSOStage.EXCHANGE_2)
        break

      case QSOStage.EXCHANGE_2:
        // 最終メッセージ（相手局から）
        setQsoStage(QSOStage.FINAL)
        const finalText = t("finalMessage")
          .replace("{myCallsign}", myCallsign)
          .replace("{theirCallsign}", stationInfo.callsign)
        addToLog(finalText, "station")

        // 次のステップの入力を設定
        const goodbyeInput = t("goodbye")
          .replace("{theirCallsign}", stationInfo.callsign)
          .replace("{myCallsign}", myCallsign)
        setExpectedInput(goodbyeInput)
        setInputMode("send")
        break

      case QSOStage.FINAL:
        // さようなら（自局から）
        setQsoStage(QSOStage.GOODBYE)
        break

      case QSOStage.GOODBYE:
        // 交信完了
        setQsoStage(QSOStage.COMPLETE)
        break

      default:
        break
    }
  }

  // ログにメッセージを追加
  const addToLog = (text: string, sender: "me" | "station") => {
    const morse = textToMorse(text)
    setQsoLog((prev) => [...prev, { text, morse, sender }])

    // 自動再生
    if (sender === "station" && autoAdvance) {
      playMorseAudio(morse)
    }
  }

  // ユーザーの入力を送信
  const sendUserInput = () => {
    if (!userInput.trim()) return

    // ユーザーの入力をログに追加
    addToLog(userInput, "me")

    // 入力をリセット
    setUserInput("")

    // 次のステージに進む
    setTimeout(() => {
      advanceQSOStage()
    }, 1000)
  }

  // モールス符号を音声で再生する関数
  const playMorseAudio = (morse: string) => {
    if (isPlaying) return

    setIsPlaying(true)
    setCurrentMessage(morse)

    if (!audioContext.current) {
      audioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)()
    }

    const { dotDuration, dashDuration, symbolGap, letterGap, wordGap } = speedSettings[playbackSpeed]

    let currentTime = audioContext.current.currentTime

    // スペースで分割して文字ごとに処理
    morse.split(" ").forEach((letter, letterIndex) => {
      // 文字内の各シンボル（ドッ��とダッシュ）を処理
      letter.split("").forEach((symbol, symbolIndex) => {
        if (symbol === "." || symbol === "-") {
          const duration = symbol === "." ? dotDuration : dashDuration

          // オシレーターを作成して接続
          const osc = audioContext.current!.createOscillator()
          osc.type = "sine"
          osc.frequency.value = 700 // 700Hzの音

          const oscGain = audioContext.current!.createGain()
          oscGain.gain.value = 0.5

          osc.connect(oscGain)
          oscGain.connect(audioContext.current!.destination)

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
        setIsPlaying(false)
        setCurrentMessage("")

        // 自動進行が有効な場合、次のステージに進む
        if (autoAdvance && inputMode === "listen") {
          setTimeout(() => {
            advanceQSOStage()
          }, 1000)
        }
      },
      (currentTime - audioContext.current.currentTime) * 1000,
    )
  }

  // 最新のメッセージにスクロール
  useEffect(() => {
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [qsoLog])

  // コンポーネントのクリーンアップ
  useEffect(() => {
    return () => {
      if (audioContext.current) {
        audioContext.current.close()
      }
    }
  }, [])

  // QSOの進行状況を計算
  const qsoProgress = (qsoStage / QSOStage.COMPLETE) * 100

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t("qsoSimulatorTitle")}</CardTitle>
          <CardDescription>{t("qsoSimulatorDescription")}</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {!qsoStarted ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="callsign">{t("yourCallsign")}</Label>
                <Input
                  id="callsign"
                  placeholder={t("enterYourCallsign")}
                  value={myCallsign}
                  onChange={(e) => setMyCallsign(e.target.value)}
                  className={callsignError ? "border-red-500" : ""}
                />
                {callsignError && <p className="text-sm text-red-500">{t("invalidCallsign")}</p>}
                <p className="text-xs text-muted-foreground">{t("callsignFormat")}</p>
              </div>

              <Button onClick={startQSO} className="w-full">
                {t("startQSO")}
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* QSO進行状況 */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{t("qsoProgress")}</span>
                  <span>{Math.round(qsoProgress)}%</span>
                </div>
                <Progress value={qsoProgress} className="h-2" />
              </div>

              {/* 局情報 */}
              {stationInfo && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{t("stationInfo")}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="font-medium">{t("callsign")}:</div>
                      <div>{stationInfo.callsign}</div>

                      <div className="font-medium">{t("country")}:</div>
                      <div>{stationInfo.country}</div>

                      <div className="font-medium">{t("name")}:</div>
                      <div>{stationInfo.name}</div>

                      <div className="font-medium">{t("qth")}:</div>
                      <div>{stationInfo.qth}</div>

                      <div className="font-medium">{t("rst")}:</div>
                      <div>{stationInfo.rst}</div>

                      <div className="font-medium">{t("rig")}:</div>
                      <div>{stationInfo.rig}</div>

                      <div className="font-medium">{t("antenna")}:</div>
                      <div>{stationInfo.antenna}</div>

                      <div className="font-medium">{t("weather")}:</div>
                      <div>{stationInfo.weather}</div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* QSOログ */}
              <div className="space-y-2">
                <h3 className="font-medium">{t("qsoLog")}</h3>
                <div className="border rounded-md p-4 h-64 overflow-y-auto space-y-4">
                  {qsoLog.map((entry, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-md ${
                        entry.sender === "me" ? "bg-primary/10 ml-8" : "bg-secondary/50 mr-8"
                      }`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <Badge variant="outline">{entry.sender === "me" ? myCallsign : stationInfo?.callsign}</Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => playMorseAudio(entry.morse)}
                          disabled={isPlaying}
                        >
                          <Volume2 className="h-4 w-4 mr-1" />
                          {t("play")}
                        </Button>
                      </div>
                      {showPlainText && <p className="text-sm mb-1">{entry.text}</p>}
                      {showMorseText && <p className="text-xs font-mono text-muted-foreground">{entry.morse}</p>}
                    </div>
                  ))}
                  <div ref={logEndRef} />
                </div>
              </div>

              {/* 入力エリア */}
              {qsoStage !== QSOStage.COMPLETE && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge variant={inputMode === "listen" ? "secondary" : "default"}>
                      {inputMode === "listen" ? t("listeningMode") : t("sendingMode")}
                    </Badge>
                    <Badge variant="outline">
                      {qsoStage < QSOStage.COMPLETE
                        ? inputMode === "send"
                          ? t("yourTurn")
                          : t("stationTurn")
                        : t("qsoComplete")}
                    </Badge>
                  </div>

                  {inputMode === "send" && (
                    <div className="space-y-2">
                      <Input
                        placeholder={t("typingPrompt")}
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        disabled={isPlaying}
                      />
                      <div className="flex justify-between">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setUserInput(expectedInput)}
                          disabled={isPlaying}
                        >
                          {t("showAnswer")}
                        </Button>
                        <Button onClick={sendUserInput} disabled={!userInput.trim() || isPlaying}>
                          <Send className="h-4 w-4 mr-2" />
                          {t("sendMessage")}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 設定 */}
              <div className="space-y-4 pt-4 border-t">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>{t("playbackSpeed")}</Label>
                    <RadioGroup
                      value={playbackSpeed}
                      onValueChange={(v) => setPlaybackSpeed(v as "slow" | "medium" | "fast")}
                      className="flex space-x-2"
                    >
                      <div className="flex items-center space-x-1">
                        <RadioGroupItem value="slow" id="speed-slow" />
                        <Label htmlFor="speed-slow">{t("slow")}</Label>
                      </div>
                      <div className="flex items-center space-x-1">
                        <RadioGroupItem value="medium" id="speed-medium" />
                        <Label htmlFor="speed-medium">{t("medium")}</Label>
                      </div>
                      <div className="flex items-center space-x-1">
                        <RadioGroupItem value="fast" id="speed-fast" />
                        <Label htmlFor="speed-fast">{t("fast")}</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Switch id="auto-advance" checked={autoAdvance} onCheckedChange={setAutoAdvance} />
                      <Label htmlFor="auto-advance">{t("autoAdvance")}</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch id="show-morse" checked={showMorseText} onCheckedChange={setShowMorseText} />
                      <Label htmlFor="show-morse">{t("showMorseText")}</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch id="show-plain" checked={showPlainText} onCheckedChange={setShowPlainText} />
                      <Label htmlFor="show-plain">{t("showPlainText")}</Label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-between">
          {qsoStarted && (
            <>
              <Button variant="outline" onClick={startNewQSO}>
                <RefreshCw className="h-4 w-4 mr-2" />
                {t("newQSO")}
              </Button>

              {qsoStage !== QSOStage.COMPLETE && inputMode === "listen" && (
                <Button onClick={continueQSO} disabled={isPlaying}>
                  {isPlaying ? (
                    <>
                      <Pause className="h-4 w-4 mr-2" />
                      {t("waitingForReply")}
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      {t("continueQSO")}
                    </>
                  )}
                </Button>
              )}
            </>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}

