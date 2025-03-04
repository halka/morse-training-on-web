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

