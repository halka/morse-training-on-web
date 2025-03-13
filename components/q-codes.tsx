"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { getLocalizedQCodesData } from "@/lib/morse-code"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Search } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useLanguage } from "@/lib/i18n"

export default function QCodes() {
  const [searchTerm, setSearchTerm] = useState("")
  const [viewMode, setViewMode] = useState<"list" | "cards">("cards")
  const { t, language } = useLanguage()
  const qCodesData = getLocalizedQCodesData(language)

  const filteredData = Object.entries(qCodesData).filter(
    ([code, data]) =>
      code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      data.meaning.toLowerCase().includes(searchTerm.toLowerCase()) ||
      data.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder={t("searchByCodeOrMeaning")}
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as "list" | "cards")} className="w-full sm:w-auto">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="cards">{t("cardView")}</TabsTrigger>
            <TabsTrigger value="list">{t("listView")}</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {viewMode === "cards" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filteredData.map(([code, data]) => (
            <Card key={code} className="hover:bg-accent transition-colors">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl">{code}</CardTitle>
                  <Badge variant="outline" className="font-mono">
                    {code.split("").map((char) => char + " ")}
                  </Badge>
                </div>
                <CardDescription className="font-medium text-foreground">{data.meaning}</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">{data.description}</CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="border rounded-md divide-y">
          {filteredData.map(([code, data]) => (
            <div key={code} className="p-4 hover:bg-accent transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-lg">{code}</span>
                  <Badge variant="outline" className="font-mono">
                    {code.split("").map((char) => char + " ")}
                  </Badge>
                </div>
                <span className="font-medium">{data.meaning}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">{data.description}</p>
            </div>
          ))}
        </div>
      )}

      {filteredData.length === 0 && <div className="text-center p-8 text-muted-foreground">{t("noResults")}</div>}
    </div>
  )
}

