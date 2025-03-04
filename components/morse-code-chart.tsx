"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { morseCodeData } from "@/lib/morse-code"
import { Card, CardContent } from "@/components/ui/card"
import { Search } from "lucide-react"

export default function MorseCodeChart() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredData = Object.entries(morseCodeData).filter(
    ([char, code]) => char.toLowerCase().includes(searchTerm.toLowerCase()) || code.includes(searchTerm),
  )

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="文字またはモールス符号で検索"
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {filteredData.map(([char, code]) => (
          <Card key={char} className="hover:bg-accent transition-colors">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold">{char}</div>
              <div className="text-lg font-mono mt-2">{code}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

