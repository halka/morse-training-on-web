// モールス符号のデータ
export const morseCodeData: Record<string, string> = {
  A: ".-",
  B: "-...",
  C: "-.-.",
  D: "-..",
  E: ".",
  F: "..-.",
  G: "--.",
  H: "....",
  I: "..",
  J: ".---",
  K: "-.-",
  L: ".-..",
  M: "--",
  N: "-.",
  O: "---",
  P: ".--.",
  Q: "--.-",
  R: ".-.",
  S: "...",
  T: "-",
  U: "..-",
  V: "...-",
  W: ".--",
  X: "-..-",
  Y: "-.--",
  Z: "--..",
  "1": ".----",
  "2": "..---",
  "3": "...--",
  "4": "....-",
  "5": ".....",
  "6": "-....",
  "7": "--...",
  "8": "---..",
  "9": "----.",
  "0": "-----",
  ".": ".-.-.-",
  ",": "--..--",
  "?": "..--..",
  "'": ".----.",
  "!": "-.-.--",
  "/": "-..-.",
  "(": "-.--.",
  ")": "-.--.-",
  "&": ".-...",
  ":": "---...",
  ";": "-.-.-.",
  "=": "-...-",
  "+": ".-.-.",
  "-": "-....-",
  _: "..--.-",
  '"': ".-..-.",
  $: "...-..-",
  "@": ".--.-.",
  " ": "/",
}

// 逆引き用のオブジェクトを作成
const reverseMorseCodeData: Record<string, string> = Object.entries(morseCodeData).reduce(
  (acc, [char, code]) => {
    acc[code] = char
    return acc
  },
  {} as Record<string, string>,
)

// テキストをモールス符号に変換する関数
export function textToMorse(text: string): string {
  return text
    .toUpperCase()
    .split("")
    .map((char) => morseCodeData[char] || char)
    .join(" ")
}

// モールス符号をテキストに変換する関数
export function morseToText(morse: string): string {
  return morse
    .split(" ")
    .map((code) => reverseMorseCodeData[code] || code)
    .join("")
}

// 主要なQ符号のデータ
export const qCodesData: Record<string, { meaning: string; description: string }> = {
  QRA: {
    meaning: "あなたの局名は？",
    description: "無線局の名前を尋ねる際に使用します。",
  },
  QRG: {
    meaning: "私の正確な周波数は？",
    description: "相手に自分の周波数を尋ねる際に使用します。",
  },
  QRH: {
    meaning: "私の周波数は変動していますか？",
    description: "自分の送信周波数が安定しているか確認する際に使用します。",
  },
  QRI: {
    meaning: "私の電波の音調はどうですか？",
    description: "自分の送信信号の音質を尋ねる際に使用します。",
  },
  QRK: {
    meaning: "私の信号の明瞭度は？",
    description: "自分の信号の読みやすさを尋ねる際に使用します。",
  },
  QRL: {
    meaning: "あなたは忙しいですか？",
    description: "周波数が使用中かどうか確認する際に使用します。",
  },
  QRM: {
    meaning: "私の送信は妨害されていますか？",
    description: "人工的な混信（他の局からの干渉）があるか尋ねる際に使用します。",
  },
  QRN: {
    meaning: "静電気による雑音がありますか？",
    description: "自然雑音（雷など）による干渉があるか尋ねる際に使用します。",
  },
  QRO: {
    meaning: "送信電力を増加すべきですか？",
    description: "送信出力を上げるべきか尋ねる際に使用します。",
  },
  QRP: {
    meaning: "送信電力を減少すべきですか？",
    description: "送信出力を下げるべきか尋ねる際に使用します。",
  },
  QRQ: {
    meaning: "もっと速く送信すべきですか？",
    description: "送信速度を上げるべきか尋ねる際に使用します。",
  },
  QRS: {
    meaning: "もっと遅く送信すべきですか？",
    description: "送信速度を下げるべきか尋ねる際に使用します。",
  },
  QRT: {
    meaning: "送信を中止すべきですか？",
    description: "通信を終了するべきか尋ねる際に使用します。",
  },
  QRU: {
    meaning: "何かメッセージがありますか？",
    description: "相手に送信するものがあるか尋ねる際に使用します。",
  },
  QRV: {
    meaning: "準備ができていますか？",
    description: "相手が通信の準備ができているか尋ねる際に使用します。",
  },
  QRX: {
    meaning: "いつ呼び出しますか？",
    description: "相手に待機を依頼する際に使用します。",
  },
  QRZ: {
    meaning: "誰が私を呼んでいますか？",
    description: "自分を呼んでいる局を確認する際に使用します。",
  },
  QSA: {
    meaning: "私の信号の強さは？",
    description: "自分の信号の強度を尋ねる際に使用します。",
  },
  QSB: {
    meaning: "私の信号はフェーディングしていますか？",
    description: "自分の信号が変動しているか尋ねる際に使用します。",
  },
  QSL: {
    meaning: "受信確認できますか？",
    description: "通信の受信確認を求める際に使用します。",
  },
  QSO: {
    meaning: "〜と交信できますか？",
    description: "特定の局との交信が可能か尋ねる際に使用します。",
  },
  QSP: {
    meaning: "〜に中継してくれますか？",
    description: "メッセージの中継を依頼する際に使用します。",
  },
  QSY: {
    meaning: "周波数を変更すべきですか？",
    description: "送信周波数の変更を提案する際に使用します。",
  },
  QTH: {
    meaning: "あなたの位置（緯度と経度）は？",
    description: "相手の位置や所在地を尋ねる際に使用します。",
  },
  QTR: {
    meaning: "正確な時間は？",
    description: "正確な時刻を尋ねる際に使用します。",
  },
}

// アマチュア無線特有の略語や符号のデータ
export const hamRadioData: Record<
  string,
  {
    morse: string
    meaning: string
    description: string
    category: string
  }
> = {
  // 運用符号
  AR: {
    morse: ".-.-.",
    meaning: "送信終了",
    description: "メッセージの終わりを示す符号です。「+」と同じ符号で、一連の送信の終了を示します。",
    category: "運用符号",
  },
  AS: {
    morse: ".-...",
    meaning: "待機",
    description: "相手に少し待ってもらうことを伝える符号です。",
    category: "運用符号",
  },
  BK: {
    morse: "-...-.-",
    meaning: "ブレイク",
    description: "送信の途中で割り込む際に使用する符号です。",
    category: "運用符号",
  },
  BT: {
    morse: "-...-",
    meaning: "区切り",
    description: "文章や段落の区切りを示す符号です。「=」と同じ符号です。",
    category: "運用符号",
  },
  CL: {
    morse: "-.-..-..",
    meaning: "閉局",
    description: "交信を終了し、無線局を閉じることを示す符号です。",
    category: "運用符号",
  },
  CT: {
    morse: "-.-.-",
    meaning: "送信開始",
    description: "送信を開始することを示す符号です。",
    category: "運用符号",
  },
  KN: {
    morse: "-.-.",
    meaning: "指定呼出",
    description: "特定の局のみに応答を求める符号です。",
    category: "運用符号",
  },
  SK: {
    morse: "...-.-",
    meaning: "交信終了",
    description: "交信の終了を示す符号です。",
    category: "運用符号",
  },
  VA: {
    morse: "...-.-",
    meaning: "交信終了",
    description: "SKと同じ意味で、交信の終了を示す符号です。",
    category: "運用符号",
  },

  // 一般的な略語
  CQ: {
    morse: "-.-. --.-",
    meaning: "一般呼出",
    description: "「どなたか応答してください」という意味で使用される一般呼出符号です。",
    category: "一般的な略語",
  },
  DE: {
    morse: "-.. .",
    meaning: "〜から",
    description: "「〜から」を意味し、自局の識別に使用されます。例：「CQ CQ DE JA1ZRL」",
    category: "一般的な略語",
  },
  DX: {
    morse: "-.. -..-",
    meaning: "遠距離通信",
    description: "遠距離の局との通信を意味します。",
    category: "一般的な略語",
  },
  ES: {
    morse: ". ...",
    meaning: "と",
    description: "「and」（と）を意味する略語です。",
    category: "一般的な略語",
  },
  HI: {
    morse: ".... ..",
    meaning: "笑い",
    description: "モールス通信での笑いを表現する略語です。",
    category: "一般的な略語",
  },
  HPE: {
    morse: ".... .--. .",
    meaning: "希望する",
    description: "「hope」（希望する）を意味する略語です。",
    category: "一般的な略語",
  },
  HR: {
    morse: ".... .-.",
    meaning: "ここ",
    description: "「here」（ここ）を意味する略語です。",
    category: "一般的な略語",
  },
  NR: {
    morse: "-. .-.",
    meaning: "番号",
    description: "「number」（番号）を意味する略語です。",
    category: "一般的な略語",
  },
  OM: {
    morse: "--- --",
    meaning: "男性オペレーター",
    description: "「Old Man」の略で、男性オペレーターを指す略語です。",
    category: "一般的な略語",
  },
  PSE: {
    morse: ".--. ... .",
    meaning: "お願いします",
    description: "「please」（お願いします）を意味する略語です。",
    category: "一般的な略語",
  },
  RST: {
    morse: ".-. ... -",
    meaning: "信号レポート",
    description:
      "Readability（可読性）、Strength（信号強度）、Tone（音調）の略で、信号の品質を報告するために使用されます。",
    category: "一般的な略語",
  },
  RX: {
    morse: ".-. -..-",
    meaning: "受信機",
    description: "「receiver」（受信機）を意味する略語です。",
    category: "一般的な略語",
  },
  TX: {
    morse: "- -..-",
    meaning: "送信機",
    description: "「transmitter」（送信機）を意味する略語です。",
    category: "一般的な略語",
  },
  TKS: {
    morse: "- -.- ...",
    meaning: "ありがとう",
    description: "「thanks」（ありがとう）を意味する略語です。",
    category: "一般的な略語",
  },
  TNX: {
    morse: "- -. -..-",
    meaning: "ありがとう",
    description: "「thanks」（ありがとう）を意味する略語です。TKSと同じ意味です。",
    category: "一般的な略語",
  },
  UR: {
    morse: "..- .-.",
    meaning: "あなたの",
    description: "「your」（あなたの）を意味する略語です。",
    category: "一般的な略語",
  },
  VY: {
    morse: "...- -.--",
    meaning: "とても",
    description: "「very」（とても）を意味する略語です。",
    category: "一般的な略語",
  },
  WX: {
    morse: ".-- -..-",
    meaning: "天気",
    description: "「weather」（天気）を意味する略語です。",
    category: "一般的な略語",
  },
  XYL: {
    morse: "-..- -.-- .-..",
    meaning: "妻",
    description: "「ex-Young Lady」の略で、オペレーターの妻を指す略語です。",
    category: "一般的な略語",
  },
  YL: {
    morse: "-.-- .-..",
    meaning: "女性オペレーター",
    description: "「Young Lady」の略で、女性オペレーターを指す略語です。",
    category: "一般的な略語",
  },

  // 数字コード
  "73": {
    morse: "--... ...--",
    meaning: "よろしく",
    description: "「Best regards」（よろしく）を意味する数字コードです。交信の終わりに使用されることが多いです。",
    category: "数字コード",
  },
  "88": {
    morse: "--... --...",
    meaning: "愛と口づけを",
    description: "「Love and kisses」（愛と口づけを）を意味する数字コードです。親しい間柄で使用されます。",
    category: "数字コード",
  },
  "99": {
    morse: "--... ---..",
    meaning: "退去せよ",
    description: "「Go away」（退去せよ）を意味する数字コードです。",
    category: "数字コード",
  },
  "44": {
    morse: "....- ....-",
    meaning: "どこにも行かない",
    description: "「I am not going anywhere」（どこにも行かない）を意味する数字コードです。",
    category: "数字コード",
  },
  "55": {
    morse: "..... .....",
    meaning: "成功を祈る",
    description: "「Good luck」（成功を祈る）を意味する数字コードです。",
    category: "数字コード",
  },

  // 緊急通信
  SOS: {
    morse: "... --- ...",
    meaning: "遭難信号",
    description: "国際的な遭難信号です。緊急時に救助を求める際に使用されます。",
    category: "緊急通信",
  },
  MAYDAY: {
    morse: "-- .- -.-- -.. .- -.--",
    meaning: "遭難信号（音声）",
    description: "音声通信での国際的な遭難信号です。",
    category: "緊急通信",
  },
  PAN: {
    morse: ".--. .- -.",
    meaning: "緊急信号",
    description: "緊急ではあるが、即時の救助は必要ない状況で使用される信号です。",
    category: "緊急通信",
  },
  SECURITE: {
    morse: "... . -.-. ..- .-. .. - .",
    meaning: "安全信号",
    description: "航行上の安全に関する重要な情報を伝える際に使用される信号です。",
    category: "緊急通信",
  },

  // 特殊な符号
  CHIYODA: {
    morse: "-.-. .... .. -.-- --- -.. .-",
    meaning: "ちよだ",
    description: "おなじみのちよだ。",
    category: "謎",
  },
  DENPA3: {
    morse: "-.. . -. .--. .- ...--",
    meaning: "でんぱ3",
    description: "どの問題集にも出てくるやつ。",
    category: "謎",
  },
  MUSEN5: {
    morse: "-- ..- ... . -. .....",
    meaning: "むせん5",
    description: "どの問題集にも出てくるやつ。",
    category: "謎",
  },
}

// アマチュア無線略語のカテゴリーを取得する関数
export function getHamRadioCategories(): string[] {
  const categories = new Set<string>()

  Object.values(hamRadioData).forEach((data) => {
    categories.add(data.category)
  })

  return Array.from(categories)
}

// カテゴリー別にアマチュア無線略語を取得する関数
export function getHamRadioByCategory(category?: string): Record<
  string,
  {
    morse: string
    meaning: string
    description: string
    category: string
  }
> {
  if (!category) return hamRadioData

  return Object.entries(hamRadioData).reduce(
    (acc, [code, data]) => {
      if (data.category === category) {
        acc[code] = data
      }
      return acc
    },
    {} as Record<
      string,
      {
        morse: string
        meaning: string
        description: string
        category: string
      }
    >,
  )
}

