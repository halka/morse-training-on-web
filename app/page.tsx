"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Shuffle, ChevronLeft, ChevronRight, RotateCcw } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

// 法規と工学のデータ型定義
interface QAPair {
  問題文: string
  回答: string
}

interface FlashcardData {
  qa_pairs: QAPair[]
}

export default function FlashcardApp() {
  // 法規と工学のデータ
  const [lawData, setLawData] = useState<FlashcardData | null>(null)
  const [engineeringData, setEngineeringData] = useState<FlashcardData | null>(null)
  const [loading, setLoading] = useState(true)

  // 現在のカテゴリ、カードインデックス、表示状態
  const [currentCategory, setCurrentCategory] = useState<"law" | "engineering">("law")
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)

  // データの読み込み
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 法規データ
        const lawData: FlashcardData = {
          qa_pairs: [
            {
              問題文: "モールス符号でDENPA3を表したもの。",
              回答: "-.. . -. .--. .- ...--",
            },
            {
              問題文:
                "無線通信規則で定められている次の記述で、（ ）内に入れるべき正しい字句を、虚偽の若しくは（ ）信号の伝送又は識別表示のない信号の伝送をすることを禁止する。",
              回答: "紛らわしい",
            },
            {
              問題文: "アマチュア局の送信設備に使用する電波の質で定められているもの。",
              回答: "周波数の偏差",
            },
            {
              問題文:
                "無線電信による送信中において誤った送信をしたことを知ったときは直ちに訂正しなければならないが、訂正を表すモールス符号。",
              回答: "........",
            },
            {
              問題文:
                "免許状に記載された通信の相手方である無線局を一括して呼び出そうとするときは、次の事項を順次送信することになっているが、（ ）内に入れるべき正しい字句を、---. --.- 3回（ ）自局の呼出符号3回以下",
              回答: "1回",
            },
            {
              問題文: "無線通信規則で定められている周波数の分配で、アマチュア業務に割り当てられているもの。",
              回答: "28 MHz - 29.7 MHz",
            },
            {
              問題文: "無線電信による通信で、通報が終了したときに送信することになっている符号。",
              回答: "AR",
            },
            {
              問題文: "無線通信規則では、世界を3の地域に分けているが、日本はどの地域に含まれるか。",
              回答: "第三地域",
            },
            {
              問題文: "無線通信規則で定められている周波数の分配で、アマチュア業務に割り当てられているもの。",
              回答: "21,000 kHz - 21,450 kHz",
            },
            {
              問題文: "モールス符号で「QTH」を表すもの。",
              回答: "--.- - ....",
            },
            {
              問題文: "電波法で「電波」はどのように定義されているか。",
              回答: "300万メガヘルツ以下の周波数の電磁波をいう。",
            },
            {
              問題文:
                "アマチュア局は、長時間継続して通報を送信するときは、「10分ごとを標準として適当にDE及び自局の呼出符号」を送信しなければならないが、「DE」をモールス符号で表したもの。",
              回答: "—.. .",
            },
            {
              問題文: "電波法で「無線電信」はどのように定義されているか。",
              回答: "「無線電信」とは、電波を利用して、符号を送り、又は受けるための通信設備をいう。",
            },
            {
              問題文: "モールス符号でCHIYODAを表したもの",
              回答: "-.-. .... .. -.-- --- -.. .-",
            },
            {
              問題文: "非常通信に使用する前置符号「--- ... ---」は何を表しているか。",
              回答: "OSO",
            },
            {
              問題文:
                "免許状に記載された通信の相手方である無線局を一括して呼び出そうとするときは、次の事項を順次送信することになっているが、（ ）内に入れるべき正しい字句を、---. --.- 3回 --. . （ ）自局の呼出符号3回以下",
              回答: "1回",
            },
            {
              問題文:
                "モールス符号による無線電信通信で相手局が、「--.- ... ---」と送信してきた。これはどの文字を表しているか。",
              回答: "QSO",
            },
            {
              問題文: "無線通信規則で定められている周波数の分配で、アマチュア業務に割り当てられているもの。",
              回答: "18,068 kHz - 18,168 kHz",
            },
            {
              問題文: "モールス符号で「QSY」を表すもの。",
              回答: "--.- ... -.--",
            },
            {
              問題文:
                "無線通信規則では、アマチュア局はその伝送中、どのような間隔で自局の呼出符号を伝送しなければならないと定められているか。",
              回答: "短い間隔",
            },
            {
              問題文: "モールス符号でMUSEN5を表したもの。",
              回答: "-- ..- ... . -. .....",
            },
            {
              問題文: "第三級アマチュア無線技士の資格の免許で、モールス符号による通信操作を行うことはできるか。",
              回答: "できる。",
            },
            {
              問題文:
                "無線従事者は、免許の取消しの処分を受けたときは、その処分を受けた日から何日以内にその免許証を総務大臣又は総合通信局長に返納しなければならないか。",
              回答: "10日以内",
            },
            {
              問題文: "モールス符号による無線電信通信で「--.- .-. --..」を意味するの。",
              回答: "誰かこちらを呼びましたか。",
            },
            {
              問題文: "無線通信規則で定められているもの。",
              回答: "虚偽の若しくは紛らわしい信号の伝送又は識別表示のない信号の伝送をすることを禁止する。",
            },
            {
              問題文: "第三級アマチュア無線技士の資格の免許で操作できるもの。",
              回答: "空中線電力50ワット以下の無線設備で、18メガヘルツ以上又は8メガヘルツ以下の周波数の電波を使用するもの",
            },
            {
              問題文:
                "次の文は、無線通信規則で定められているアマチュア業務の記述である。「アマチュア、すなわち、（ ）のためでなく、専ら個人的に無線技術に興味をもち、正当に許可された者が行う自己訓練、通信及び技術研究のための無線通信業務」",
              回答: "金銭上の利益",
            },
            {
              問題文: "モールス符号で「お待ちください」を表す「AS」",
              回答: ".- ...",
            },
            {
              問題文:
                "無線通信規則で定められている次の記述で、「送信局は、業務を満足に行うために必要な（ ）の電力を輻射しなければならない。」",
              回答: "最小限",
            },
          ],
        }

        // 工学データ
        const engineeringData: FlashcardData = {
          qa_pairs: [
            {
              問題文: "CW(A1A)電波を受信するとき、受信機の帯域フィルタの通過帯域幅としてもっとも適当なもの。",
              回答: "100〔Hz〕",
            },
            {
              問題文: "放電や充電を繰り返して使用することができる電池を何と呼ぶか。",
              回答: "二次電池",
            },
            {
              問題文: "電離層底（磁気嵐）の特長。",
              回答: "昼夜の別なく発生し、数日間通信不能の状態が続くことがある。",
            },
            {
              問題文: "電源の出力電圧に含まれている交流成分を何と呼ぶか。",
              回答: "リップル",
            },
            {
              問題文: "電離層を形成する主な要素。",
              回答: "自由電子とイオン",
            },
            {
              問題文: "FM(F3E)送信機に使用される回路。",
              回答: "IDC回路",
            },
            {
              問題文: "SSB(J3E)送信機において使用される帯域フィルタについて説明したものは。",
              回答: "下側波帯または上側波帯のどちらかの成分だけを通過させる。",
            },
            {
              問題文: "電話機に電波障害を与えることを何と呼ぶか。",
              回答: "テレホンI",
            },
            {
              問題文: "スペクトルアナライザは、何を測定するために使用されるか。",
              回答: "スプリアス",
            },
            {
              問題文:
                "通過形電力計で送信機からの電力を測定したら、進行波電力が8〔W〕、反射波電力が2〔W〕であった。送信機からアンテナに供給される電力は何Wになるか。",
              回答: "6〔W〕",
            },
            {
              問題文: "SSB(J3E)送信機において使用される平衡変調器について説明したもの。",
              回答: "搬送波を抑圧し、下側波帯と上側波帯の周波数成分を取り出す。",
            },
            {
              問題文: "交流電圧を測る測定器。",
              回答: "テスタ",
            },
            {
              問題文: "SSB(J3E)送信機において使用されるALC回路について説明したもの。",
              回答: "入力に大きな信号が加えられても、出力信号が歪まないように電力増幅器の入力信号の大きさを制御する。",
            },
            {
              問題文: "電界効果トランジスタの別名で正しいもの。",
              回答: "FET",
            },
            {
              問題文: "CW(A1A)送信機での「ブレークイン」操作の説明をしているの。",
              回答: "電鍵操作によって送信と受信を自動的に切り換える。",
            },
            {
              問題文: "CW(A1A)受信機に使用される復調用局部発振器は、何に使用されるか。",
              回答: "SSB(J3E)電波やCW(A1A)電波を検波（復調）するのに使用される。",
            },
            {
              問題文: "スポラディックE層（Es層）を説明したもので正しいもの。",
              回答: "突発的に出現して超短波(VHF)帯の電波を反射する電離層",
            },
            {
              問題文: "八木アンテナを構成する素子。",
              回答: "導波器と放射器及び反射器",
            },
            {
              問題文: "可変容量ダイオードの性質で正しいもの。",
              回答: "可変容量コンデンサとして動作する。",
            },
            {
              問題文: "電源の定電圧回路の説明で正しいもの。",
              回答: "電源に接続された負荷に変動があっても、自動的に出力電圧を一定にする。",
            },
            {
              問題文: "電波が1秒間に進む速さ。",
              回答: "30万〔km/s〕",
            },
            {
              問題文:
                "SSB(J3E)送信機で「SSB」、「AM」、「CW」の電波型式の切換回路があるとき、電信操作するときは、どれを選択すればよいか。",
              回答: "CW",
            },
            {
              問題文: "CW(A1A)送信機で「キークリック」を防止する回路として使用されるもの。",
              回答: "電鍵回路にコンデンサと抵抗からなる直列回路を並列に接続する。",
            },
            {
              問題文: "電界効果トランジスタの電極の記述で正しいもの。",
              回答: "電界効果トランジスタの電極には、ソースがある。",
            },
            {
              問題文: "FM(F3E)受信機において使用される振幅制限器について説明したもの。",
              回答: "受信した信号の振幅を一定にする。",
            },
            {
              問題文: "並列共振回路の性質で正しいもの。",
              回答: "回路が共振したとき、回路に流れる電流は最小になる。",
            },
            {
              問題文: "実効値100〔V〕の交流電圧を最大値で表すと、およそ何Vになるか。",
              回答: "141〔V〕",
            },
            {
              問題文: "CW電波の復調に使用されるもの。",
              回答: "プロダクト検波器",
            },
            {
              問題文: "CW(A1A)送信機に使用される回路。",
              回答: "電鍵操作回路",
            },
            {
              問題文: "八木アンテナで送信機からの給電線は、どの素子に接続するか。",
              回答: "ラジエータ",
            },
          ],
        }

        setLawData(lawData)
        setEngineeringData(engineeringData)
        setLoading(false)
      } catch (error) {
        console.error("データの読み込みに失敗しました", error)
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // 現在のデータセットを取得
  const getCurrentData = () => {
    return currentCategory === "law" ? lawData : engineeringData
  }

  // 現在のカードを取得
  const getCurrentCard = () => {
    const data = getCurrentData()
    if (!data) return null
    return data.qa_pairs[currentIndex]
  }

  // 次のカードに移動
  const nextCard = () => {
    const data = getCurrentData()
    if (!data) return

    setIsFlipped(false)
    setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % data.qa_pairs.length)
    }, 300)
  }

  // 前のカードに移動
  const prevCard = () => {
    const data = getCurrentData()
    if (!data) return

    setIsFlipped(false)
    setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex - 1 + data.qa_pairs.length) % data.qa_pairs.length)
    }, 300)
  }

  // カードをシャッフル
  const shuffleCards = () => {
    const data = getCurrentData()
    if (!data) return

    setIsFlipped(false)
    setTimeout(() => {
      setCurrentIndex(0)

      // カテゴリに応じてデータをシャッフル
      if (currentCategory === "law" && lawData) {
        const shuffled = [...lawData.qa_pairs].sort(() => Math.random() - 0.5)
        setLawData({ qa_pairs: shuffled })
      } else if (currentCategory === "engineering" && engineeringData) {
        const shuffled = [...engineeringData.qa_pairs].sort(() => Math.random() - 0.5)
        setEngineeringData({ qa_pairs: shuffled })
      }
    }, 300)
  }

  // カードをめくる
  const flipCard = () => {
    setIsFlipped(!isFlipped)
  }

  // カテゴリを変更
  const changeCategory = (category: "law" | "engineering") => {
    if (category === currentCategory) return

    setIsFlipped(false)
    setCurrentCategory(category)
    setCurrentIndex(0)
  }

  // 現在のカード
  const currentCard = getCurrentCard()

  // 現在のデータセット
  const currentData = getCurrentData()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg">読み込み中...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">アマチュア無線暗記カード</h1>
        <ThemeToggle />
      </div>

      <Tabs
        defaultValue="law"
        className="mb-8"
        onValueChange={(value) => changeCategory(value as "law" | "engineering")}
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="law">法規</TabsTrigger>
          <TabsTrigger value="engineering">工学</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-muted-foreground">
          {currentData ? `${currentIndex + 1} / ${currentData.qa_pairs.length}` : "0 / 0"}
        </p>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={shuffleCards} title="シャッフル">
            <Shuffle className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              setIsFlipped(false)
              setCurrentIndex(0)
            }}
            title="リセット"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {currentCard && (
        <div className="mb-8">
          <Card className="w-full h-64 md:h-80 cursor-pointer transition-all duration-300" onClick={flipCard}>
            <CardContent className="p-6 h-full flex flex-col justify-center items-center">
              {!isFlipped ? (
                <div className="text-center">
                  <h2 className="text-xl font-semibold mb-4">問題</h2>
                  <p className="text-lg">{currentCard.問題文}</p>
                </div>
              ) : (
                <div className="text-center">
                  <h2 className="text-xl font-semibold mb-4">回答</h2>
                  <p className="text-lg">{currentCard.回答}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex justify-between mt-4">
            <Button onClick={prevCard} variant="outline">
              <ChevronLeft className="mr-2 h-4 w-4" /> 前へ
            </Button>
            <Button onClick={nextCard} variant="outline">
              次へ <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      <div className="text-center text-sm text-muted-foreground">
        <p>カードをクリックして表裏を切り替えます</p>
      </div>
    </div>
  )
}

