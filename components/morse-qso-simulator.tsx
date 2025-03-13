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
import { Volume2, Send, RefreshCw, Play, Pause, HelpCircle } from "lucide-react"
import { textToMorse, morseToText } from "@/lib/morse-code"
import { useLanguage } from "@/lib/i18n"
import { generateRandomStationInfo, isValidCallsign } from "@/lib/callsign-data"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Slider } from "@/components/ui/slider"

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

// 各QSOステージの解説文
const qsoStageExplanations = {
  ja: {
    [QSOStage.START]: "交信を開始するには、あなたのコールサインを入力して「交信を開始」ボタンをクリックしてください。",
    [QSOStage.CQ_CALL]:
      "CQ（一般呼び出し）は、「誰か応答してください」という意味です。相手局がCQを出しているので、あなたが応答する番です。",
    [QSOStage.ANSWER_CQ]:
      "あなたはCQに応答しました。相手局のコールサインに続けて「DE」（〜から）とあなたのコールサインを送信します。",
    [QSOStage.EXCHANGE_1]:
      "相手局があなたに応答し、基本情報を送ってきました。RST（信号レポート）、名前、QTH（所在地）などが含まれています。",
    [QSOStage.EXCHANGE_2]:
      "あなたは相手局に自分の情報を送信しました。RST、名前、QTH、使用している無線機（RIG）、アンテナ、天気などを伝えます。",
    [QSOStage.FINAL]:
      "相手局が最終メッセージを送ってきました。「FB」（Fine Business、素晴らしい）、「TKS」（Thanks、ありがとう）、「HPE CUAGN」（Hope to see you again、またお会いしましょう）、「73」（よろしく）などが含まれています。",
    [QSOStage.GOODBYE]:
      "あなたは最後の挨拶を送信しました。「TKS FER QSO」（交信ありがとう）、「73」（よろしく）などを伝え、「SK」（交信終了）で締めくくります。",
    [QSOStage.COMPLETE]:
      "交信が完了しました。「新しい交信」ボタンをクリックして、別の局との交信を始めることができます。",
  },
  en: {
    [QSOStage.START]: "To start a QSO, enter your callsign and click the 'Start QSO' button.",
    [QSOStage.CQ_CALL]:
      "CQ (general call) means 'Calling anyone'. The station is calling CQ, so it's your turn to respond.",
    [QSOStage.ANSWER_CQ]:
      "You've responded to the CQ. You send the station's callsign followed by 'DE' (from) and your callsign.",
    [QSOStage.EXCHANGE_1]:
      "The station has responded to you and sent basic information including RST (signal report), name, QTH (location), etc.",
    [QSOStage.EXCHANGE_2]:
      "You've sent your information to the station. This includes RST, name, QTH, your rig, antenna, weather, etc.",
    [QSOStage.FINAL]:
      "The station has sent a final message. It includes 'FB' (Fine Business), 'TKS' (Thanks), 'HPE CUAGN' (Hope to see you again), '73' (Best regards), etc.",
    [QSOStage.GOODBYE]:
      "You've sent your final greeting. You convey 'TKS FER QSO' (Thanks for the QSO), '73' (Best regards), etc., and end with 'SK' (End of contact).",
    [QSOStage.COMPLETE]: "The QSO is complete. You can click the 'New QSO' button to start a QSO with another station.",
  },
}

// 略語の解説
const abbreviationExplanations = {
  ja: {
    CQ: "一般呼び出し（誰か応答してください）",
    DE: "〜から（送信者を示す）",
    RST: "信号レポート（Readability, Strength, Tone）",
    UR: "あなたの（Your）",
    "GM/GA/GE": "おはよう/こんにちは/こんばんは",
    OM: "男性オペレーター（Old Man）",
    "TNX/TKS": "ありがとう（Thanks）",
    FER: "〜のために（For）",
    CALL: "呼び出し",
    RPRT: "レポート（Report）",
    NAME: "名前",
    QTH: "所在地",
    RIG: "無線機",
    WID: "〜で（With）",
    WX: "天気（Weather）",
    HW: "どうですか？（How?）",
    FB: "素晴らしい（Fine Business）",
    INFO: "情報",
    HPE: "希望する（Hope）",
    CUAGN: "またお会いしましょう（See you again）",
    "73": "よろしく（Best regards）",
    K: "送信終了、応答を求める",
    SK: "交信終了",
  },
  en: {
    CQ: "General call (Calling anyone)",
    DE: "From (indicates the sender)",
    RST: "Signal report (Readability, Strength, Tone)",
    UR: "Your",
    "GM/GA/GE": "Good morning/afternoon/evening",
    OM: "Old Man (male operator)",
    "TNX/TKS": "Thanks",
    FER: "For",
    CALL: "Call",
    RPRT: "Report",
    NAME: "Name",
    QTH: "Location",
    RIG: "Radio equipment",
    WID: "With",
    WX: "Weather",
    HW: "How?",
    FB: "Fine Business (Excellent)",
    INFO: "Information",
    HPE: "Hope",
    CUAGN: "See you again",
    "73": "Best regards",
    K: "End of transmission, invitation to transmit",
    SK: "End of contact",
  },
}

export default function MorseQSOSimulator() {
  const { t, language } = useLanguage()
  const [myCallsign, setMyCallsign] = useState("")
  const [callsignError, setCallsignError] = useState(false)
  const [qsoStarted, setQsoStarted] = useState(false)
  const [qsoStage, setQsoStage] = useState<QSOStage>(QSOStage.START)
  const [stationInfo, setStationInfo] = useState<any>(null)
  const [qsoLog, setQsoLog] = useState<
    Array<{
      text: string
      morse: string
      sender: "me" | "station"
      callsign?: string // コールサインを追加
      id: string // 一意のIDを追加
    }>
  >([])
  const [currentMessage, setCurrentMessage] = useState("")
  const [isPlaying, setIsPlaying] = useState(false)
  const [playbackSpeed, setPlaybackSpeed] = useState<"slow" | "medium" | "fast">("medium")
  const [autoAdvance, setAutoAdvance] = useState(false)
  const [showMorseText, setShowMorseText] = useState(true)
  const [showPlainText, setShowPlainText] = useState(true)
  const [userInput, setUserInput] = useState("")
  const [expectedInput, setExpectedInput] = useState("")
  const [inputMode, setInputMode] = useState<"listen" | "send">("listen")
  const [currentlyPlayingId, setCurrentlyPlayingId] = useState<string | null>(null)
  const [useKeyInput, setUseKeyInput] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [detectedMorse, setDetectedMorse] = useState("")
  const [threshold, setThreshold] = useState(0.1)
  const [volume, setVolume] = useState(0)

  const audioContext = useRef<AudioContext | null>(null)
  const analyser = useRef<AnalyserNode | null>(null)
  const dataArray = useRef<Uint8Array | null>(null)
  const lastSignalTime = useRef<number>(0)
  const currentSignalState = useRef<boolean>(false)
  const signalBuffer = useRef<string>("")
  const lastLetterTime = useRef<number>(0)
  const lastWordTime = useRef<number>(0)
  const logEndRef = useRef<HTMLDivElement>(null)
  const playbackTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const advanceTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // 再生速度の設定
  const speedSettings = {
    slow: { dotDuration: 150, dashDuration: 450, symbolGap: 150, letterGap: 450, wordGap: 1050 },
    medium: { dotDuration: 100, dashDuration: 300, symbolGap: 100, letterGap: 300, wordGap: 700 },
    fast: { dotDuration: 60, dashDuration: 180, symbolGap: 60, letterGap: 180, wordGap: 420 },
  }

  // タイマーをクリアする関数
  const clearAllTimeouts = () => {
    if (playbackTimeoutRef.current) {
      clearTimeout(playbackTimeoutRef.current)
      playbackTimeoutRef.current = null
    }
    if (advanceTimeoutRef.current) {
      clearTimeout(advanceTimeoutRef.current)
      advanceTimeoutRef.current = null
    }
  }

  // QSOを開始する関数を修正
  const startQSO = () => {
    if (!myCallsign.trim() || !isValidCallsign(myCallsign.trim().toUpperCase())) {
      setCallsignError(true)
      return
    }

    // コールサインを大文字に変換して設定
    const formattedCallsign = myCallsign.trim().toUpperCase()
    setCallsignError(false)
    setMyCallsign(formattedCallsign)

    // ランダムな局情報を生成
    const newStationInfo = generateRandomStationInfo()
    setStationInfo(newStationInfo)

    // QSOログをリセット
    setQsoLog([])

    // QSOを開始
    setQsoStarted(true)
    setQsoStage(QSOStage.CQ_CALL)

    // CQ呼び出しを追加 - プレースホルダーを置換
    const cqText = t("qso.cqCalling").replace(/{callsign}/g, newStationInfo.callsign)
    addToLog(cqText, "station")

    // 次のステップの入力を設定 - プレースホルダーを置換
    const nextInput = t("qso.answerCq")
      .replace(/{theirCallsign}/g, newStationInfo.callsign)
      .replace(/{myCallsign}/g, formattedCallsign)
    setExpectedInput(nextInput)
    setInputMode("send")
  }

  // 新しいQSOを開始
  const startNewQSO = () => {
    // すべてのタイマーをクリア
    clearAllTimeouts()

    // 再生中の音声を停止
    if (isPlaying && audioContext.current) {
      audioContext.current.close()
      audioContext.current = null
      setIsPlaying(false)
      setCurrentlyPlayingId(null)
    }

    setQsoStage(QSOStage.START)
    setQsoStarted(false)
    setStationInfo(null)
    setQsoLog([])
    setCurrentMessage("")
    setUserInput("")
    setExpectedInput("")
    setInputMode("listen")
  }

  // QSOを続ける
  const continueQSO = () => {
    // すべてのタイマーをクリア
    clearAllTimeouts()

    // 再生中の音声を停止
    if (isPlaying && audioContext.current) {
      audioContext.current.close()
      audioContext.current = null
      setIsPlaying(false)
      setCurrentlyPlayingId(null)
    }

    if (qsoStage === QSOStage.COMPLETE) {
      startNewQSO()
      return
    }

    // 次のステージに進む
    advanceQSOStage()
  }

  // モールスキー入力の初期化関数を追加
  const initKeyInput = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })

      audioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)({
        latencyHint: "interactive",
        sampleRate: 44100,
      })
      analyser.current = audioContext.current.createAnalyser()
      const source = audioContext.current.createMediaStreamSource(stream)

      source.connect(analyser.current)
      analyser.current.fftSize = 256

      const bufferLength = analyser.current.frequencyBinCount
      dataArray.current = new Uint8Array(bufferLength)

      setIsListening(true)
      startListening()
    } catch (err) {
      console.error("マイクへのアクセスができませんでした:", err)
      setIsListening(false)
    }
  }

  // モールスキー入力の停止関数を追加
  const stopKeyInput = () => {
    if (audioContext.current) {
      audioContext.current.close()
      audioContext.current = null
      analyser.current = null
    }
    setIsListening(false)
  }

  // 音声信号の検出関数を追加
  const startListening = () => {
    if (!analyser.current || !dataArray.current) return

    const dotDuration = speedSettings[playbackSpeed].dotDuration
    const dashDuration = speedSettings[playbackSpeed].dashDuration
    const letterGap = speedSettings[playbackSpeed].letterGap
    const wordGap = speedSettings[playbackSpeed].wordGap
    const detectionDelay = 50 // ミリ秒

    const checkSignal = () => {
      if (!isListening || !analyser.current || !dataArray.current) return

      analyser.current.getByteTimeDomainData(dataArray.current)

      // 音量レベルの計算
      let sum = 0
      for (let i = 0; i < dataArray.current.length; i++) {
        const deviation = Math.abs(dataArray.current[i] - 128)
        sum += deviation
      }
      const average = sum / dataArray.current.length / 128
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

      // 文字の区切りを検出
      if (!hasSignal && signalBuffer.current.length > 0) {
        const timeSinceLastSignal = now - lastSignalTime.current

        if (timeSinceLastSignal > letterGap && timeSinceLastSignal > lastLetterTime.current) {
          // 文字の区切り
          setDetectedMorse((prev) => prev + " " + signalBuffer.current)
          signalBuffer.current = ""
          lastLetterTime.current = now

          // デコードしてユーザー入力に設定
          const decoded = morseToText(detectedMorse + " " + signalBuffer.current)
          setUserInput(decoded)
        }

        // 単語の区切りを検出
        if (timeSinceLastSignal > wordGap && timeSinceLastSignal > lastWordTime.current) {
          setDetectedMorse((prev) => prev + " / ")
          lastWordTime.current = now
        }
      }

      setTimeout(checkSignal, 10)
    }

    checkSignal()
  }

  // モールスキー入力をクリアする関数を追加
  const clearKeyInput = () => {
    setDetectedMorse("")
    signalBuffer.current = ""
  }

  // QSOのステージを進める関数を修正
  const advanceQSOStage = () => {
    switch (qsoStage) {
      case QSOStage.CQ_CALL:
        // CQへの応答
        setQsoStage(QSOStage.ANSWER_CQ)
        break

      case QSOStage.ANSWER_CQ:
        // 最初の情報交換（相手局から）
        setQsoStage(QSOStage.EXCHANGE_1)
        const exchange1Text = t("qso.initialExchange")
          .replace(/{myCallsign}/g, myCallsign)
          .replace(/{theirCallsign}/g, stationInfo.callsign)
          .replace(/{rst}/g, stationInfo.rst)
          .replace(/{name}/g, stationInfo.name)
          .replace(/{qth}/g, stationInfo.qth)
        addToLog(exchange1Text, "station")

        // 次のステップの入力を設定
        const nextInput = t("qso.returnExchange")
          .replace(/{theirCallsign}/g, stationInfo.callsign)
          .replace(/{myCallsign}/g, myCallsign)
          .replace(/{rst}/g, "599")
          .replace(/{name}/g, "OP")
          .replace(/{qth}/g, "TOKYO")
          .replace(/{rig}/g, "IC7300")
          .replace(/{antenna}/g, "DIPOLE")
          .replace(/{weather}/g, "SUNNY")
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
        const finalText = t("qso.finalMessage")
          .replace(/{myCallsign}/g, myCallsign)
          .replace(/{theirCallsign}/g, stationInfo.callsign)
        addToLog(finalText, "station")

        // 次のステップの入力を設定
        const goodbyeInput = t("qso.goodbye")
          .replace(/{theirCallsign}/g, stationInfo.callsign)
          .replace(/{myCallsign}/g, myCallsign)
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

  // ユーザーの入力を送信する関数を修正
  const sendUserInput = () => {
    if (!userInput.trim()) return

    // すべてのタイマーをクリア
    clearAllTimeouts()

    // 入力がモールス符号かローマ字かを判断し、適切に処理
    let processedInput = userInput

    // モールス符号かどうかをチェック（ドット、ダッシュ、スペースのみで構成されているか）
    const isMorseCode = /^[.\- /]+$/.test(userInput.trim())

    if (isMorseCode) {
      // モールス符号の場合はテキストに変換
      processedInput = morseToText(userInput)
    }

    // ユーザーの入力をログに追加
    addToLog(processedInput, "me")

    // 入力をリセット
    setUserInput("")

    // 入力モードを「listen」に変更
    setInputMode("listen")

    // 現在のQSOステージに基づいて次のステージに進む
    advanceTimeoutRef.current = setTimeout(() => {
      // 現在のステージに応じた処理
      switch (qsoStage) {
        case QSOStage.CQ_CALL:
          // CQへの応答後は、相手局からの応答を表示
          advanceQSOStage()
          break
        case QSOStage.ANSWER_CQ:
          // CQへの応答後は、相手局からの応答を表示
          advanceQSOStage()
          break
        case QSOStage.EXCHANGE_1:
          // 情報交換1の後は、相手局からの応答を待つ
          break
        case QSOStage.EXCHANGE_2:
          // 情報交換2の後は、相手局からの応答を表示
          advanceQSOStage()
          break
        case QSOStage.FINAL:
          // 最終メッセージの後は、相手局からの応答を待つ
          break
        case QSOStage.GOODBYE:
          // さよならの後は、交信完了に進む
          advanceQSOStage()
          break
        default:
          break
      }
    }, 1000)
  }

  // 一意のIDを生成する関数
  const generateUniqueId = () => {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9)
  }

  // ログにメッセージを追加する関数を修正
  const addToLog = (text: string, sender: "me" | "station") => {
    const morse = textToMorse(text)
    const messageId = generateUniqueId()

    // 現在のコールサインを使用してログエントリを作成
    const logEntry = {
      text,
      morse,
      sender,
      callsign: sender === "me" ? myCallsign : stationInfo?.callsign || "",
      id: messageId,
    }

    setQsoLog((prev) => [...prev, logEntry])

    // 相手局からのメッセージは常に再生（自動進行の設定に関わらず）
    if (sender === "station") {
      playMorseAudio(morse, messageId)
    }
  }

  // モールス符号を音声で再生する関数を修正
  const playMorseAudio = (morse: string, messageId: string) => {
    // すべてのタイマーをクリア
    clearAllTimeouts()

    // 既に再生中の場合は中断
    if (isPlaying) {
      if (audioContext.current) {
        audioContext.current.close()
        audioContext.current = null
      }
      setIsPlaying(false)
      setCurrentlyPlayingId(null)
    }

    setIsPlaying(true)
    setCurrentMessage(morse)
    setCurrentlyPlayingId(messageId)

    if (!audioContext.current) {
      // AudioContextを初期化
      audioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)({
        latencyHint: "interactive",
        sampleRate: 44100,
      })
    }

    const { dotDuration, dashDuration, symbolGap, letterGap, wordGap } = speedSettings[playbackSpeed]

    let currentTime = audioContext.current.currentTime
    let totalDuration = 0

    // スペースで分割して文字ごとに処理
    morse.split(" ").forEach((letter, letterIndex) => {
      // 文字内の各シンボル（ドットとダッシュ）を処理
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
          totalDuration += duration

          // シンボル間のギャップを追加（最後のシンボル以外）
          if (symbolIndex < letter.length - 1) {
            currentTime += symbolGap / 1000
            totalDuration += symbolGap
          }
        }
      })

      // 文字間のギャップを追加（最後の文字以外）
      if (letterIndex < morse.split(" ").length - 1) {
        currentTime += letterGap / 1000
        totalDuration += letterGap
      }
    })

    // 再生終了後の処理
    playbackTimeoutRef.current = setTimeout(
      () => {
        setIsPlaying(false)
        setCurrentMessage("")
        setCurrentlyPlayingId(null)

        // 自動進行が有効な場合、次のステージに進む
        if (autoAdvance && inputMode === "listen") {
          advanceTimeoutRef.current = setTimeout(() => {
            // 現在のステージに応じた処理
            if (qsoStage === QSOStage.CQ_CALL || qsoStage === QSOStage.EXCHANGE_1 || qsoStage === QSOStage.FINAL) {
              // これらのステージではユーザーの応答を待つ
              setInputMode("send")
            } else if (
              qsoStage === QSOStage.ANSWER_CQ ||
              qsoStage === QSOStage.EXCHANGE_2 ||
              qsoStage === QSOStage.GOODBYE
            ) {
              // これらのステージでは次に進む
              advanceQSOStage()
            }
          }, 1000)
        }
      },
      totalDuration + 100, // 少し余裕を持たせる
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
      clearAllTimeouts()
      if (audioContext.current) {
        audioContext.current.close()
      }
    }
  }, [])

  // QSOの進行状況を計算
  const qsoProgress = (qsoStage / QSOStage.COMPLETE) * 100

  // 再生速度設定コンポーネント
  const PlaybackSpeedSettings = () => (
    <div className="space-y-2">
      <Label>{t("qso.playbackSpeed")}</Label>
      <RadioGroup
        value={playbackSpeed}
        onValueChange={(v) => setPlaybackSpeed(v as "slow" | "medium" | "fast")}
        className="flex space-x-2"
      >
        <div className="flex items-center space-x-1">
          <RadioGroupItem value="slow" id="speed-slow" />
          <Label htmlFor="speed-slow">{t("qso.slow")}</Label>
        </div>
        <div className="flex items-center space-x-1">
          <RadioGroupItem value="medium" id="speed-medium" />
          <Label htmlFor="speed-medium">{t("qso.medium")}</Label>
        </div>
        <div className="flex items-center space-x-1">
          <RadioGroupItem value="fast" id="speed-fast" />
          <Label htmlFor="speed-fast">{t("qso.fast")}</Label>
        </div>
      </RadioGroup>
    </div>
  )

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle>{t("qso.qsoSimulatorTitle")}</CardTitle>
            <CardDescription>{t("qso.qsoSimulatorDescription")}</CardDescription>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="icon">
                <HelpCircle className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>
                  {t("qso.qsoSimulatorTitle")} - {t("common.howToUse")}
                </DialogTitle>
                <DialogDescription>{t("qso.qsoSimulatorHelpDescription")}</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <h3 className="font-medium">{t("qso.qsoSimulatorHelpSteps")}</h3>
                  <ol className="list-decimal list-inside space-y-2">
                    <li>{t("qso.qsoSimulatorHelpStep1")}</li>
                    <li>{t("qso.qsoSimulatorHelpStep2")}</li>
                    <li>{t("qso.qsoSimulatorHelpStep3")}</li>
                    <li>{t("qso.qsoSimulatorHelpStep4")}</li>
                    <li>{t("qso.qsoSimulatorHelpStep5")}</li>
                    <li>{t("qso.qsoSimulatorHelpStep6")}</li>
                  </ol>
                </div>
                <div className="space-y-2">
                  <h3 className="font-medium">{t("qso.qsoSimulatorHelpTips")}</h3>
                  <ul className="list-disc list-inside space-y-2">
                    <li>{t("qso.qsoSimulatorHelpTip1")}</li>
                    <li>{t("qso.qsoSimulatorHelpTip2")}</li>
                    <li>{t("qso.qsoSimulatorHelpTip3")}</li>
                    <li>{t("qso.qsoSimulatorHelpTip4")}</li>
                  </ul>
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button>{t("common.close")}</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>

        <CardContent className="space-y-6">
          {!qsoStarted ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="callsign">{t("qso.yourCallsign")}</Label>
                <Input
                  id="callsign"
                  placeholder={t("qso.enterYourCallsign")}
                  value={myCallsign}
                  onChange={(e) => setMyCallsign(e.target.value)}
                  className={callsignError ? "border-red-500" : ""}
                />
                {callsignError && <p className="text-sm text-red-500">{t("qso.invalidCallsign")}</p>}
                <p className="text-xs text-muted-foreground">{t("qso.callsignFormat")}</p>
              </div>

              {/* コールサイン入力画面にも再生速度設定を追加 */}
              <PlaybackSpeedSettings />

              <Button onClick={startQSO} className="w-full">
                {t("qso.startQSO")}
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* QSO進行状況 */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{t("qso.qsoProgress")}</span>
                  <span>{Math.round(qsoProgress)}%</span>
                </div>
                <Progress value={qsoProgress} className="h-2" />
              </div>

              {/* 局情報 */}
              {stationInfo && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{t("qso.stationInfo")}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="font-medium">{t("qso.callsign")}:</div>
                      <div>{stationInfo.callsign}</div>

                      <div className="font-medium">{t("qso.country")}:</div>
                      <div>{stationInfo.country}</div>

                      <div className="font-medium">{t("qso.name")}:</div>
                      <div>{stationInfo.name}</div>

                      <div className="font-medium">{t("qso.qth")}:</div>
                      <div>{stationInfo.qth}</div>

                      <div className="font-medium">{t("qso.rst")}:</div>
                      <div>{stationInfo.rst}</div>

                      <div className="font-medium">{t("qso.rig")}:</div>
                      <div>{stationInfo.rig}</div>

                      <div className="font-medium">{t("qso.antenna")}:</div>
                      <div>{stationInfo.antenna}</div>

                      <div className="font-medium">{t("qso.weather")}:</div>
                      <div>{stationInfo.weather}</div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* QSOログ */}
              <div className="space-y-2">
                <h3 className="font-medium">{t("qso.qsoLog")}</h3>
                <div className="border rounded-md p-2 sm:p-4 h-48 sm:h-64 overflow-y-auto space-y-3 sm:space-y-4">
                  {qsoLog.map((entry) => (
                    <div
                      key={entry.id}
                      className={`p-2 sm:p-3 rounded-md ${
                        entry.sender === "me" ? "bg-primary/10 ml-4 sm:ml-8" : "bg-secondary/50 mr-4 sm:mr-8"
                      }`}
                    >
                      <div className="flex justify-between items-center mb-1 flex-wrap gap-1">
                        <Badge variant="outline" className="font-mono font-bold text-xs sm:text-sm">
                          {entry.callsign || (entry.sender === "me" ? myCallsign : stationInfo?.callsign)}
                        </Badge>
                        <Button
                          variant={currentlyPlayingId === entry.id ? "default" : "ghost"}
                          size="sm"
                          onClick={() => playMorseAudio(entry.morse, entry.id)}
                          disabled={isPlaying && currentlyPlayingId !== entry.id}
                          className="h-7 px-2 sm:h-8 sm:px-3"
                        >
                          <Volume2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                          {t("common.play")}
                        </Button>
                      </div>
                      {showPlainText && <p className="text-xs sm:text-sm mb-1">{entry.text}</p>}
                      {showMorseText && (
                        <p className="text-xs font-mono text-muted-foreground break-all">{entry.morse}</p>
                      )}
                    </div>
                  ))}
                  <div ref={logEndRef} />
                </div>
              </div>

              {/* 交信内容の解説 */}
              <div className="space-y-2 mt-4">
                <h3 className="font-medium">{t("qso.qsoExplanation")}</h3>
                <Card className="bg-muted/30">
                  <CardContent className="p-4">
                    <p className="text-sm">{qsoStageExplanations[language as "ja" | "en"][qsoStage]}</p>

                    {qsoStage !== QSOStage.START && qsoStage !== QSOStage.COMPLETE && (
                      <div className="mt-4">
                        <h4 className="text-sm font-medium mb-2">{t("qso.commonAbbreviations")}</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1">
                          {Object.entries(abbreviationExplanations[language as "ja" | "en"])
                            .filter(([abbr]) => {
                              // 現在のステージに関連する略語のみをフィルタリング
                              const currentMessage = qsoLog.length > 0 ? qsoLog[qsoLog.length - 1].text : ""
                              return currentMessage.includes(abbr)
                            })
                            .map(([abbr, explanation]) => (
                              <div key={abbr} className="text-xs flex">
                                <span className="font-mono font-bold w-16">{abbr}</span>
                                <span className="text-muted-foreground">{explanation}</span>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* 入力エリア */}
              {qsoStage !== QSOStage.COMPLETE && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge variant={inputMode === "listen" ? "secondary" : "default"}>
                      {inputMode === "listen" ? t("qso.listeningMode") : t("qso.sendingMode")}
                    </Badge>
                    <Badge variant="outline">
                      {qsoStage < QSOStage.COMPLETE
                        ? inputMode === "send"
                          ? t("qso.yourTurn")
                          : t("qso.stationTurn")
                        : t("qso.qsoComplete")}
                    </Badge>
                  </div>

                  {inputMode === "send" && (
                    <div className="space-y-2">
                      <Input
                        placeholder={t("qso.typingPrompt")}
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
                          {t("qso.showExample")}
                        </Button>
                        <Button onClick={sendUserInput} disabled={!userInput.trim() || isPlaying}>
                          <Send className="h-4 w-4 mr-2" />
                          {t("qso.sendMessage")}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 設定 */}
              <div className="space-y-4 pt-4 border-t">
                <div className="grid grid-cols-1 gap-4">
                  {/* 再生速度設定 */}
                  <div className="space-y-2">
                    <Label>{t("qso.playbackSpeed")}</Label>
                    <RadioGroup
                      value={playbackSpeed}
                      onValueChange={(v) => setPlaybackSpeed(v as "slow" | "medium" | "fast")}
                      className="flex flex-wrap gap-2 sm:gap-4"
                    >
                      <div className="flex items-center gap-1">
                        <RadioGroupItem value="slow" id="speed-slow" />
                        <Label htmlFor="speed-slow" className="text-sm">
                          {t("qso.slow")}
                        </Label>
                      </div>
                      <div className="flex items-center gap-1">
                        <RadioGroupItem value="medium" id="speed-medium" />
                        <Label htmlFor="speed-medium" className="text-sm">
                          {t("qso.medium")}
                        </Label>
                      </div>
                      <div className="flex items-center gap-1">
                        <RadioGroupItem value="fast" id="speed-fast" />
                        <Label htmlFor="speed-fast" className="text-sm">
                          {t("qso.fast")}
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* 表示オプション */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
                    <div className="flex items-center space-x-2">
                      <Switch id="auto-advance" checked={autoAdvance} onCheckedChange={setAutoAdvance} />
                      <Label htmlFor="auto-advance" className="text-sm">
                        {t("qso.autoAdvance")}
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch id="show-morse" checked={showMorseText} onCheckedChange={setShowMorseText} />
                      <Label htmlFor="show-morse" className="text-sm">
                        {t("qso.showMorseText")}
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch id="show-plain" checked={showPlainText} onCheckedChange={setShowPlainText} />
                      <Label htmlFor="show-plain" className="text-sm">
                        {t("qso.showPlainText")}
                      </Label>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="use-key-input"
                      checked={useKeyInput}
                      onCheckedChange={(checked) => {
                        setUseKeyInput(checked)
                        if (checked) {
                          initKeyInput()
                        } else {
                          stopKeyInput()
                        }
                      }}
                    />
                    <Label htmlFor="use-key-input">{t("keyer.useKeyInput")}</Label>
                  </div>

                  {useKeyInput && (
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label className="min-w-[100px]">{t("keyer.sensitivity")}:</Label>
                        <span className="text-sm font-mono">{threshold.toFixed(2)}</span>
                      </div>
                      <Slider
                        value={[threshold]}
                        min={0.01}
                        max={0.5}
                        step={0.01}
                        onValueChange={(value) => setThreshold(value[0])}
                      />

                      <div className="flex items-center gap-2 mt-2">
                        <Volume2 className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary transition-all"
                            style={{ width: `${Math.min(volume * 100 * 3, 100)}%` }}
                          />
                        </div>
                      </div>

                      {detectedMorse && (
                        <div className="p-2 bg-muted/30 rounded-md mt-2">
                          <div className="font-mono text-sm">{detectedMorse}</div>
                          <div className="flex justify-end mt-1">
                            <Button variant="outline" size="sm" onClick={clearKeyInput}>
                              {t("keyer.clear")}
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
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
                {t("qso.newQSO")}
              </Button>

              {qsoStage !== QSOStage.COMPLETE && inputMode === "listen" && !autoAdvance && (
                <Button onClick={continueQSO} disabled={isPlaying}>
                  {isPlaying ? (
                    <>
                      <Pause className="h-4 w-4 mr-2" />
                      {t("qso.waitingForReply")}
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      {t("qso.continueQSO")}
                    </>
                  )}
                </Button>
              )}

              {qsoStage !== QSOStage.COMPLETE && inputMode === "listen" && autoAdvance && (
                <div className="text-sm text-muted-foreground flex items-center">
                  <Play className="h-4 w-4 mr-2 text-muted-foreground" />
                  {t("qso.autoAdvance")}
                </div>
              )}
            </>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}

