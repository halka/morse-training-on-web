"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import MorseCodeChart from "./morse-code-chart"
import PracticeMode from "./practice-mode"
import AudioPlayer from "./audio-player"
import QCodePractice from "./q-code-practice"
import KeyInput from "./key-input"
import HamRadioPractice from "./ham-radio-practice"
import MorseQSOSimulator from "./morse-qso-simulator"
import RadioCodes from "./radio-codes"
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
  const [activeTab, setActiveTab] = useState("learn")
  const [activeInnerTab, setActiveInnerTab] = useState({
    learn: "chart",
    codes: "chart",
    practice: "",
    codesChart: "qcodes",
  })
  const isDesktop = useMediaQuery("(min-width: 768px)")
  const isTablet = useMediaQuery("(min-width: 640px) and (max-width: 767px)")
  const isMobile = useMediaQuery("(max-width: 639px)")
  const { t } = useLanguage()

  // モバイル用のセレクト変更ハンドラー
  const handleMobileTabChange = (value: string) => {
    setActiveTab(value)
  }

  // 内部タブの変更ハンドラー
  const handleInnerTabChange = (tabGroup: string, value: string) => {
    setActiveInnerTab((prev) => ({
      ...prev,
      [tabGroup]: value,
    }))
  }

  // タブのスタイルをカスタマイズするためのCSS
  useEffect(() => {
    // タブのスタイルをシンプル化
    const style = document.createElement("style")
    style.innerHTML = `
[role="tablist"] {
  background-color: transparent;
  border-bottom: 1px solid var(--border);
  padding: 0;
  margin-bottom: 1rem;
}

[role="tablist"] [role="tab"] {
  padding: 0.5rem 0.75rem;
  font-weight: normal;
  border: none;
  border-radius: 0;
  transition: all 0.2s ease;
  position: relative;
}

[role="tablist"] [data-state="active"] {
  font-weight: 500;
  color: hsl(var(--primary));
  background-color: transparent;
  border-bottom: 2px solid hsl(var(--primary));
  margin-bottom: -1px;
}

[role="tablist"] [role="tab"]:hover {
  background-color: hsl(var(--accent) / 0.2);
}

@media (max-width: 640px) {
  [role="tablist"] {
    gap: 0;
  }
  [role="tablist"] [role="tab"] {
    padding: 0.4rem 0.5rem;
    font-size: 0.8rem;
  }
}

[data-radix-tabs-content] {
  border-top: none;
  margin-top: 1rem;
  padding-top: 0.5rem;
}
`
    document.head.appendChild(style)

    return () => {
      document.head.removeChild(style)
    }
  }, [])

  // 内部タブのレンダリング関数
  const renderInnerTabs = (
    tabGroup: string,
    tabs: { value: string; label: string }[],
    defaultValue: string,
    cols: number,
  ) => {
    // モバイルでは2つ以上のタブがある場合、タブの数に応じて表示方法を変更
    if (isMobile && tabs.length > 2) {
      return (
        <Select
          value={activeInnerTab[tabGroup as keyof typeof activeInnerTab] || defaultValue}
          onValueChange={(value) => handleInnerTabChange(tabGroup, value)}
        >
          <SelectTrigger className="w-full mb-4">
            <SelectValue
              placeholder={
                tabs.find(
                  (tab) => tab.value === (activeInnerTab[tabGroup as keyof typeof activeInnerTab] || defaultValue),
                )?.label || t("common.chart")
              }
            />
          </SelectTrigger>
          <SelectContent>
            {tabs.map((tab) => (
              <SelectItem key={tab.value} value={tab.value}>
                {tab.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )
    }

    // タブレットとデスクトップ、または少ないタブ数の場合はタブリストを表示
    const gridCols = isMobile || isTablet ? Math.min(tabs.length, 2) : Math.min(tabs.length, cols)

    return (
      <InnerTabsList className="w-full grid" style={{ gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))` }}>
        {tabs.map((tab) => (
          <InnerTabsTrigger
            key={tab.value}
            value={tab.value}
            onClick={() => handleInnerTabChange(tabGroup, tab.value)}
            className="px-2 py-1 text-sm"
          >
            {tab.label}
          </InnerTabsTrigger>
        ))}
      </InnerTabsList>
    )
  }

  return (
    <div className="bg-card rounded-lg shadow-sm p-3 md:p-4">
      <Tabs defaultValue="learn" value={activeTab} onValueChange={setActiveTab}>
        {isDesktop ? (
          // デスクトップ表示: 通常のタブ
          <TabsList className="grid w-full grid-cols-3 mb-2">
            <TabsTrigger value="learn" className="text-sm sm:text-base">
              {t("tabs.learnMorse")}
            </TabsTrigger>
            <TabsTrigger value="codes" className="text-sm sm:text-base">
              {t("tabs.radioAbbr")}
            </TabsTrigger>
            <TabsTrigger value="practice" className="text-sm sm:text-base">
              {t("tabs.qsoSimulation")}
            </TabsTrigger>
          </TabsList>
        ) : (
          // モバイル表示: セレクトボックス
          <div className="mb-4">
            <Select value={activeTab} onValueChange={handleMobileTabChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={t("common.chart")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="learn">{t("tabs.learnMorse")}</SelectItem>
                <SelectItem value="codes">{t("tabs.radioAbbr")}</SelectItem>
                <SelectItem value="practice">{t("tabs.qsoSimulation")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {/* モールス符号学習タブ */}
        <TabsContent value="learn">
          <Card className="border-0 shadow-none">
            <CardHeader className="px-0 pt-0">
              <InnerTabs defaultValue="chart" value={activeInnerTab.learn}>
                {renderInnerTabs(
                  "learn",
                  [
                    { value: "chart", label: t("tabs.morseChart") },
                    { value: "practice", label: t("tabs.morsePractice") },
                    { value: "converter", label: t("tabs.morseConverter") },
                    { value: "keyinput", label: t("tabs.morseKey") },
                  ],
                  "chart",
                  4,
                )}

                <InnerTabsContent value="chart" className="pt-6">
                  <MorseCodeChart />
                </InnerTabsContent>
                <InnerTabsContent value="practice" className="pt-6">
                  <PracticeMode />
                </InnerTabsContent>
                <InnerTabsContent value="converter" className="pt-6">
                  <AudioPlayer />
                </InnerTabsContent>
                <InnerTabsContent value="keyinput" className="pt-6">
                  <KeyInput />
                </InnerTabsContent>
              </InnerTabs>
            </CardHeader>
          </Card>
        </TabsContent>

        {/* 無線略語タブ */}
        <TabsContent value="codes">
          <Card className="border-0 shadow-none">
            <CardHeader className="px-0 pt-0">
              <InnerTabs defaultValue="chart" value={activeInnerTab.codes}>
                {renderInnerTabs(
                  "codes",
                  [
                    { value: "chart", label: t("tabs.codeChart") },
                    { value: "practice", label: t("tabs.codePractice") },
                  ],
                  "chart",
                  2,
                )}

                <InnerTabsContent value="chart" className="pt-6">
                  <RadioCodes />
                </InnerTabsContent>
                <InnerTabsContent value="practice" className="pt-6">
                  <InnerTabs defaultValue="qcodes" value={activeInnerTab.codesChart}>
                    {renderInnerTabs(
                      "codesChart",
                      [
                        { value: "qcodes", label: t("codes.qCodes") },
                        { value: "hamcodes", label: t("codes.hamCodes") },
                      ],
                      "qcodes",
                      2,
                    )}

                    <InnerTabsContent value="qcodes" className="pt-6">
                      <QCodePractice />
                    </InnerTabsContent>
                    <InnerTabsContent value="hamcodes" className="pt-6">
                      <HamRadioPractice />
                    </InnerTabsContent>
                  </InnerTabs>
                </InnerTabsContent>
              </InnerTabs>
            </CardHeader>
          </Card>
        </TabsContent>

        {/* QSO練習タブ */}
        <TabsContent value="practice">
          <MorseQSOSimulator />
        </TabsContent>
      </Tabs>
    </div>
  )
}

