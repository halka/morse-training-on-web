"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import MorseCodeChart from "./morse-code-chart"
import PracticeMode from "./practice-mode"
import AudioPlayer from "./audio-player"
import QCodes from "./q-codes"
import QCodePractice from "./q-code-practice"
import KeyInput from "./key-input"

export default function MorseCodeTrainer() {
  const [activeTab, setActiveTab] = useState("chart")

  return (
    <div className="bg-card rounded-lg shadow-lg p-6">
      <Tabs defaultValue="chart" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="chart">モールス符号表</TabsTrigger>
          <TabsTrigger value="practice">練習モード</TabsTrigger>
          <TabsTrigger value="audio">音声学習</TabsTrigger>
          <TabsTrigger value="qcodes">Q符号表</TabsTrigger>
          <TabsTrigger value="qpractice">Q符号練習</TabsTrigger>
          <TabsTrigger value="keyinput">電鍵入力</TabsTrigger>
        </TabsList>
        <TabsContent value="chart">
          <MorseCodeChart />
        </TabsContent>
        <TabsContent value="practice">
          <PracticeMode />
        </TabsContent>
        <TabsContent value="audio">
          <AudioPlayer />
        </TabsContent>
        <TabsContent value="qcodes">
          <QCodes />
        </TabsContent>
        <TabsContent value="qpractice">
          <QCodePractice />
        </TabsContent>
        <TabsContent value="keyinput">
          <KeyInput />
        </TabsContent>
      </Tabs>
    </div>
  )
}

