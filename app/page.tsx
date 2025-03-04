import MorseCodeTrainer from "@/components/morse-code-trainer"
import { ThemeToggle } from "@/components/theme-toggle"

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">アマチュア無線のなんらか</h1>
        <ThemeToggle />
      </div>
      <MorseCodeTrainer />
    </main>
  )
}

