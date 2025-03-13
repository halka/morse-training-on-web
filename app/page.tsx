import MorseCodeTrainer from "@/components/morse-code-trainer"
import { ThemeToggle } from "@/components/theme-toggle"
import { LanguageToggle } from "@/components/language-toggle"

export default function Home() {
  return (
    <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
      <div className="flex justify-between items-center mb-4 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-primary">ham etude</h1>
        <div className="flex items-center gap-1 sm:gap-2">
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </div>
      <MorseCodeTrainer />
    </main>
  )
}

