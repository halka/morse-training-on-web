"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { textToMorse } from "@/lib/morse-code"
import { Play, Pause, Volume2, VolumeX } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/lib/i18n"

export default function AudioPlayer() {
  const [text, setText] = useState("")
  const [morseCode, setMorseCode] = useState("")
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(0.5)
  const [speed, setSpeed] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const { t } = useLanguage()

  const audioContext = useRef<AudioContext | null>(null)
  const oscillator = useRef<OscillatorNode | null>(null)
  const gainNode = useRef<GainNode | null>(null)

  useEffect(() => {
    // AudioContextはユーザーインタラクション後に初期化する必要がある
    return () => {
      if (audioContext.current) {
        audioContext.current.close()
      }
    }
  }, [])

  const convertToMorse = () => {
    const morse = textToMorse(text)
    setMorseCode(morse)
  }

  const initAudio = () => {
    if (!audioContext.current) {
      audioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)()
      gainNode.current = audioContext.current.createGain()
      gainNode.current.connect(audioContext.current.destination)
    }
  }

  const playMorseCode = () => {
    if (!morseCode) return

    initAudio()
    setIsPlaying(true)

    const dotDuration = 100 / speed // ミリ秒
    const dashDuration = dotDuration * 3
    const symbolGap = dotDuration
    const letterGap = dotDuration * 3
    const wordGap = dotDuration * 7

    let currentTime = audioContext.current!.currentTime

    // モールス符号を文字ごとに処理
    morseCode.split(" ").forEach((letter, letterIndex) => {
      // 文字内の各シンボル（ドットとダッシュ）を処理
      letter.split("").forEach((symbol, symbolIndex) => {
        const duration = symbol === "." ? dotDuration : dashDuration

        // オシレーターを作成して接続
        const osc = audioContext.current!.createOscillator()
        osc.type = "sine"
        osc.frequency.value = 700 // 700Hzの音

        const oscGain = audioContext.current!.createGain()
        oscGain.gain.value = isMuted ? 0 : volume

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
      })

      // 文字間のギャップを追加（最後の文字以外）
      if (letterIndex < morseCode.split(" ").length - 1) {
        currentTime += letterGap / 1000
      }
    })

    // 再生終了後の処理
    setTimeout(() => {
      setIsPlaying(false)
    }, currentTime * 1000)
  }

  const stopPlayback = () => {
    if (oscillator.current) {
      oscillator.current.stop()
      oscillator.current = null
    }
    setIsPlaying(false)
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t("morseConverter")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Input type="text" placeholder={t("enterText")} value={text} onChange={(e) => setText(e.target.value)} />
            <Button onClick={convertToMorse} className="w-full">
              {t("convertToMorse")}
            </Button>
          </div>

          {morseCode && (
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-md font-mono text-center break-all">{morseCode}</div>

              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className="min-w-[80px]">{t("volume")}:</span>
                  <Button variant="outline" size="icon" className="h-8 w-8" onClick={toggleMute}>
                    {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                  </Button>
                  <Slider
                    disabled={isMuted}
                    value={[volume * 100]}
                    min={0}
                    max={100}
                    step={1}
                    onValueChange={(value) => setVolume(value[0] / 100)}
                  />
                </div>

                <div className="flex items-center gap-4">
                  <span className="min-w-[80px]">{t("speed")}:</span>
                  <Slider value={[speed]} min={0.5} max={2} step={0.1} onValueChange={(value) => setSpeed(value[0])} />
                  <span className="min-w-[40px] text-right">{speed}x</span>
                </div>
              </div>

              <Button className="w-full" onClick={isPlaying ? stopPlayback : playMorseCode} disabled={!morseCode}>
                {isPlaying ? (
                  <>
                    <Pause className="mr-2 h-4 w-4" /> {t("stop")}
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-4 w-4" /> {t("play")}
                  </>
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

