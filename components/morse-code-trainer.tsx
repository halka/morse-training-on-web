"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import MorseCodeChart from "./morse-code-chart"
import PracticeMode from "./practice-mode"
import AudioPlayer from "./audio-player"
import QCodes from "./q-codes"
import QCodePractice from "./q-code-practice"
import KeyInput from "./key-input"
import HamRadioCodes from "./ham-radio-codes"
import HamRadioPractice from "./ham-radio-practice"

export default function MorseCodeTrainer() {
  const [activeTab, setActiveTab] = useState("chart")

  return (
    <div className="bg-card rounded-lg shadow-lg p-6">
      <Tabs defaultValue="chart" onValueChange={setActiveTab}>
        <TabsList className="grid w-full h-full grid-cols-2grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8">
          <TabsTrigger value="chart">モールス符号表</TabsTrigger>
          <TabsTrigger value="practice">練習モード</TabsTrigger>
          <TabsTrigger value="audio">音声学習</TabsTrigger>
          <TabsTrigger value="qcodes">Q符号表</TabsTrigger>
          <TabsTrigger value="qpractice">Q符号練習</TabsTrigger>
          <TabsTrigger value="hamcodes">無線略語</TabsTrigger>
          <TabsTrigger value="hampractice">略語練習</TabsTrigger>
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
        <TabsContent value="hamcodes">
          <HamRadioCodes />
        </TabsContent>
        <TabsContent value="hampractice">
          <HamRadioPractice />
        </TabsContent>
        <TabsContent value="keyinput">
          <KeyInput />
        </TabsContent>
      </Tabs>
    </div>
  )
}

