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
import MorseQSOSimulator from "./morse-qso-simulator"
import { Card, CardHeader } from "@/components/ui/card"
import {
  Tabs as InnerTabs,
  TabsContent as InnerTabsContent,
  TabsList as InnerTabsList,
  TabsTrigger as InnerTabsTrigger,
} from "@/components/ui/tabs"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useLanguage } from "@/lib/i18n"

export default function MorseCodeTrainer() {
  const [activeTab, setActiveTab] = useState("morse")
  const isDesktop = useMediaQuery("(min-width: 768px)")
  const { t } = useLanguage()

  // モバイル用のセレクト変更ハンドラー
  const handleMobileTabChange = (value: string) => {
    setActiveTab(value)
  }

  return (
    <div className="bg-card rounded-lg shadow-lg p-4 md:p-6">
      <Tabs defaultValue="morse" value={activeTab} onValueChange={setActiveTab}>
        {isDesktop ? (
          // デスクトップ表示: 通常のタブ
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 mb-4">
            <TabsTrigger value="morse">{t("morseCode")}</TabsTrigger>
            <TabsTrigger value="audio">{t("morseConverter")}</TabsTrigger>
            <TabsTrigger value="codes">{t("codesAndAbbr")}</TabsTrigger>
            <TabsTrigger value="keyinput">{t("keyInput")}</TabsTrigger>
            <TabsTrigger value="qso">{t("qsoSimulator")}</TabsTrigger>
          </TabsList>
        ) : (
          // モバイル表示: セレクトボックス
          <div className="mb-4">
            <Select value={activeTab} onValueChange={handleMobileTabChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="セクションを選択" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="morse">{t("morseCode")}</SelectItem>
                <SelectItem value="audio">{t("morseConverter")}</SelectItem>
                <SelectItem value="codes">{t("codesAndAbbr")}</SelectItem>
                <SelectItem value="keyinput">{t("keyInput")}</SelectItem>
                <SelectItem value="qso">{t("qsoSimulator")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        <TabsContent value="morse">
          <Card className="border-0 shadow-none">
            <CardHeader className="px-0 pt-0">
              <InnerTabs defaultValue="chart">
                <InnerTabsList className="w-full grid grid-cols-2">
                  <InnerTabsTrigger value="chart">{t("chart")}</InnerTabsTrigger>
                  <InnerTabsTrigger value="practice">{t("practice")}</InnerTabsTrigger>
                </InnerTabsList>
                <InnerTabsContent value="chart" className="pt-6">
                  <MorseCodeChart />
                </InnerTabsContent>
                <InnerTabsContent value="practice" className="pt-6">
                  <PracticeMode />
                </InnerTabsContent>
              </InnerTabs>
            </CardHeader>
          </Card>
        </TabsContent>

        <TabsContent value="audio">
          <AudioPlayer />
        </TabsContent>

        <TabsContent value="codes">
          <Card className="border-0 shadow-none">
            <CardHeader className="px-0 pt-0">
              <InnerTabs defaultValue="qcodes">
                <InnerTabsList className="w-full grid grid-cols-2">
                  <InnerTabsTrigger value="qcodes">{t("qCodes")}</InnerTabsTrigger>
                  <InnerTabsTrigger value="hamcodes">{t("hamCodes")}</InnerTabsTrigger>
                </InnerTabsList>
                <InnerTabsContent value="qcodes" className="pt-6">
                  <InnerTabs defaultValue="chart">
                    <InnerTabsList className="w-full grid grid-cols-2">
                      <InnerTabsTrigger value="chart">{t("chart")}</InnerTabsTrigger>
                      <InnerTabsTrigger value="practice">{t("practice")}</InnerTabsTrigger>
                    </InnerTabsList>
                    <InnerTabsContent value="chart" className="pt-6">
                      <QCodes />
                    </InnerTabsContent>
                    <InnerTabsContent value="practice" className="pt-6">
                      <QCodePractice />
                    </InnerTabsContent>
                  </InnerTabs>
                </InnerTabsContent>
                <InnerTabsContent value="hamcodes" className="pt-6">
                  <InnerTabs defaultValue="chart">
                    <InnerTabsList className="w-full grid grid-cols-2">
                      <InnerTabsTrigger value="chart">{t("chart")}</InnerTabsTrigger>
                      <InnerTabsTrigger value="practice">{t("practice")}</InnerTabsTrigger>
                    </InnerTabsList>
                    <InnerTabsContent value="chart" className="pt-6">
                      <HamRadioCodes />
                    </InnerTabsContent>
                    <InnerTabsContent value="practice" className="pt-6">
                      <HamRadioPractice />
                    </InnerTabsContent>
                  </InnerTabs>
                </InnerTabsContent>
              </InnerTabs>
            </CardHeader>
          </Card>
        </TabsContent>

        <TabsContent value="keyinput">
          <KeyInput />
        </TabsContent>

        <TabsContent value="qso">
          <MorseQSOSimulator />
        </TabsContent>
      </Tabs>
    </div>
  )
}

