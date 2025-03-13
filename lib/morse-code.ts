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

// 多言語対応のQ符号データ
export const qCodesData: Record<
  string,
  {
    meaning: {
      ja: string
      en: string
    }
    description: {
      ja: string
      en: string
    }
  }
> = {
  QRA: {
    meaning: {
      ja: "あなたの局名は？",
      en: "What is the name of your station?",
    },
    description: {
      ja: "無線局の名前を尋ねる際に使用します。",
      en: "Used to ask for the name of the station.",
    },
  },
  QRG: {
    meaning: {
      ja: "私の正確な周波数は？",
      en: "What is my exact frequency?",
    },
    description: {
      ja: "相手に自分の周波数を尋ねる際に使用します。",
      en: "Used to ask the other station about your frequency.",
    },
  },
  QRH: {
    meaning: {
      ja: "私の周波数は変動していますか？",
      en: "Does my frequency vary?",
    },
    description: {
      ja: "自分の送信周波数が安定しているか確認する際に使用します。",
      en: "Used to check if your transmission frequency is stable.",
    },
  },
  QRI: {
    meaning: {
      ja: "私の電波の音調はどうですか？",
      en: "How is the tone of my transmission?",
    },
    description: {
      ja: "自分の送信信号の音質を尋ねる際に使用します。",
      en: "Used to ask about the quality of your transmission signal.",
    },
  },
  QRK: {
    meaning: {
      ja: "私の信号の明瞭度は？",
      en: "What is the readability of my signals?",
    },
    description: {
      ja: "自分の信号の読みやすさを尋ねる際に使用します。",
      en: "Used to ask about the readability of your signals.",
    },
  },
  QRL: {
    meaning: {
      ja: "あなたは忙しいですか？",
      en: "Are you busy?",
    },
    description: {
      ja: "周波数が使用中かどうか確認する際に使用します。",
      en: "Used to check if the frequency is in use.",
    },
  },
  QRM: {
    meaning: {
      ja: "私の送信は妨害されていますか？",
      en: "Is my transmission being interfered with?",
    },
    description: {
      ja: "人工的な混信（他の局からの干渉）があるか尋ねる際に使用します。",
      en: "Used to ask if there is man-made interference (from other stations).",
    },
  },
  QRN: {
    meaning: {
      ja: "静電気による雑音がありますか？",
      en: "Are you troubled by static?",
    },
    description: {
      ja: "自然雑音（雷など）による干渉があるか尋ねる際に使用します。",
      en: "Used to ask if there is natural noise interference (like lightning).",
    },
  },
  QRO: {
    meaning: {
      ja: "送信電力を増加すべきですか？",
      en: "Should I increase power?",
    },
    description: {
      ja: "送信出力を上げるべきか尋ねる際に使用します。",
      en: "Used to ask if you should increase your transmission power.",
    },
  },
  QRP: {
    meaning: {
      ja: "送信電力を減少すべきですか？",
      en: "Should I decrease power?",
    },
    description: {
      ja: "送信出力を下げるべきか尋ねる際に使用します。",
      en: "Used to ask if you should decrease your transmission power.",
    },
  },
  QRQ: {
    meaning: {
      ja: "もっと速く送信すべきですか？",
      en: "Should I send faster?",
    },
    description: {
      ja: "送信速度を上げるべきか尋ねる際に使用します。",
      en: "Used to ask if you should increase your sending speed.",
    },
  },
  QRS: {
    meaning: {
      ja: "もっと遅く送信すべきですか？",
      en: "Should I send more slowly?",
    },
    description: {
      ja: "送信速度を下げるべきか尋ねる際に使用します。",
      en: "Used to ask if you should decrease your sending speed.",
    },
  },
  QRT: {
    meaning: {
      ja: "送信を中止すべきですか？",
      en: "Should I stop sending?",
    },
    description: {
      ja: "通信を終了するべきか尋ねる際に使用します。",
      en: "Used to ask if you should end the communication.",
    },
  },
  QRU: {
    meaning: {
      ja: "何かメッセージがありますか？",
      en: "Have you anything for me?",
    },
    description: {
      ja: "相手に送信するものがあるか尋ねる際に使用します。",
      en: "Used to ask if the other station has anything to transmit.",
    },
  },
  QRV: {
    meaning: {
      ja: "準備ができていますか？",
      en: "Are you ready?",
    },
    description: {
      ja: "相手が通信の準備ができているか尋ねる際に使用します。",
      en: "Used to ask if the other station is ready for communication.",
    },
  },
  QRX: {
    meaning: {
      ja: "いつ呼び出しますか？",
      en: "When will you call me again?",
    },
    description: {
      ja: "相手に待機を依頼する際に使用します。",
      en: "Used to ask the other station to stand by.",
    },
  },
  QRZ: {
    meaning: {
      ja: "誰が私を呼んでいますか？",
      en: "Who is calling me?",
    },
    description: {
      ja: "自分を呼んでいる局を確認する際に使用します。",
      en: "Used to ask who is calling you.",
    },
  },
  QSA: {
    meaning: {
      ja: "私の信号の強さは？",
      en: "What is the strength of my signals?",
    },
    description: {
      ja: "自分の信号の強度を尋ねる際に使用します。",
      en: "Used to ask about the strength of your signals.",
    },
  },
  QSB: {
    meaning: {
      ja: "私の信号はフェーディングしていますか？",
      en: "Are my signals fading?",
    },
    description: {
      ja: "自分の信号が変動しているか尋ねる際に使用します。",
      en: "Used to ask if your signals are fading.",
    },
  },
  QSL: {
    meaning: {
      ja: "受信確認できますか？",
      en: "Can you acknowledge receipt?",
    },
    description: {
      ja: "通信の受信確認を求める際に使用します。",
      en: "Used to ask for confirmation of reception.",
    },
  },
  QSO: {
    meaning: {
      ja: "〜と交信できますか？",
      en: "Can you communicate with ... direct or by relay?",
    },
    description: {
      ja: "特定の局との交信が可能か尋ねる際に使用します。",
      en: "Used to ask if communication with a specific station is possible.",
    },
  },
  QSP: {
    meaning: {
      ja: "〜に中継してくれますか？",
      en: "Will you relay to ...?",
    },
    description: {
      ja: "メッセージの中継を依頼する際に使用します。",
      en: "Used to request relay of a message.",
    },
  },
  QSY: {
    meaning: {
      ja: "周波数を変更すべきですか？",
      en: "Shall I change to another frequency?",
    },
    description: {
      ja: "送信周波数の変更を提案する際に使用します。",
      en: "Used to suggest changing the transmission frequency.",
    },
  },
  QTH: {
    meaning: {
      ja: "あなたの位置（緯度と経度）は？",
      en: "What is your position in latitude and longitude?",
    },
    description: {
      ja: "相手の位置や所在地を尋ねる際に使用します。",
      en: "Used to ask about the other station's location.",
    },
  },
  QTR: {
    meaning: {
      ja: "正確な時間は？",
      en: "What is the correct time?",
    },
    description: {
      ja: "正確な時刻を尋ねる際に使用します。",
      en: "Used to ask for the correct time.",
    },
  },
}

// カテゴリーの多言語対応
export const categories = {
  運用符号: {
    ja: "運用符号",
    en: "Operating Signals",
  },
  一般的な略語: {
    ja: "一般的な略語",
    en: "Common Abbreviations",
  },
  数字コード: {
    ja: "数字コード",
    en: "Numeric Codes",
  },
  緊急通信: {
    ja: "緊急通信",
    en: "Emergency Communications",
  },
  よく目にする: {
    ja: "よく目にする",
    en: "Commonly Seen",
  },
}

// アマチュア無線特有の略語や符号のデータ（多言語対応）
export const hamRadioData: Record<
  string,
  {
    morse: string
    meaning: {
      ja: string
      en: string
    }
    description: {
      ja: string
      en: string
    }
    category: string
  }
> = {
  // 運用符号
  AR: {
    morse: ".-.-.",
    meaning: {
      ja: "送信終了",
      en: "End of transmission",
    },
    description: {
      ja: "メッセージの終わりを示す符号です。「+」と同じ符号で、一連の送信の終了を示します。",
      en: "Indicates the end of a message. Same as '+' and shows the end of a transmission.",
    },
    category: "運用符号",
  },
  AS: {
    morse: ".-...",
    meaning: {
      ja: "待機",
      en: "Wait",
    },
    description: {
      ja: "相手に少し待ってもらうことを伝える符号です。",
      en: "Used to tell the other station to wait a moment.",
    },
    category: "運用符号",
  },
  BK: {
    morse: "-...-.-",
    meaning: {
      ja: "ブレイク",
      en: "Break",
    },
    description: {
      ja: "送信の途中で割り込む際に使用する符号です。",
      en: "Used to interrupt a transmission.",
    },
    category: "運用符号",
  },
  BT: {
    morse: "-...-",
    meaning: {
      ja: "区切り",
      en: "Break (text)",
    },
    description: {
      ja: "文章や段落の区切りを示す符号です。「=」と同じ符号です。",
      en: "Indicates a break in text or paragraphs. Same as '='.",
    },
    category: "運用符号",
  },
  CL: {
    morse: "-.-..-..",
    meaning: {
      ja: "閉局",
      en: "Closing station",
    },
    description: {
      ja: "交信を終了し、無線局を閉じることを示す符号です。",
      en: "Indicates the end of a QSO and that the station is closing.",
    },
    category: "運用符号",
  },
  CT: {
    morse: "-.-.-",
    meaning: {
      ja: "送信開始",
      en: "Start transmission",
    },
    description: {
      ja: "送信を開始することを示す符号です。",
      en: "Indicates the start of a transmission.",
    },
    category: "運用符号",
  },
  KN: {
    morse: "-.-.",
    meaning: {
      ja: "指定呼出",
      en: "Specific call",
    },
    description: {
      ja: "特定の局のみに応答を求める符号です。",
      en: "Used to request a response from a specific station only.",
    },
    category: "運用符号",
  },
  SK: {
    morse: "...-.-",
    meaning: {
      ja: "交信終了",
      en: "End of contact",
    },
    description: {
      ja: "交信の終了を示す符号です。",
      en: "Indicates the end of a contact.",
    },
    category: "運用符号",
  },
  VA: {
    morse: "...-.-",
    meaning: {
      ja: "交信終了",
      en: "End of contact",
    },
    description: {
      ja: "SKと同じ意味で、交信の終了を示す符号です。",
      en: "Same meaning as SK, indicates the end of a contact.",
    },
    category: "運用符号",
  },

  // 一般的な略語
  CQ: {
    morse: "-.-. --.-",
    meaning: {
      ja: "一般呼出",
      en: "General call",
    },
    description: {
      ja: "「どなたか応答してください」という意味で使用される一般呼出符号です。",
      en: "A general call meaning 'Calling anyone'. Used to solicit a response from any station.",
    },
    category: "一般的な略語",
  },
  DE: {
    morse: "-.. .",
    meaning: {
      ja: "〜から",
      en: "From",
    },
    description: {
      ja: "「〜から」を意味し、自局の識別に使用されます。例：「CQ CQ DE JA1ZRL」",
      en: "Means 'from' and is used for station identification. Example: 'CQ CQ DE W1AW'",
    },
    category: "一般的な略語",
  },
  DX: {
    morse: "-.. -..-",
    meaning: {
      ja: "遠距離通信",
      en: "Distance communication",
    },
    description: {
      ja: "遠距離の局との通信を意味します。",
      en: "Refers to communication with distant stations.",
    },
    category: "一般的な略語",
  },
  ES: {
    morse: ". ...",
    meaning: {
      ja: "と",
      en: "And",
    },
    description: {
      ja: "「and」（と）を意味する略語です。",
      en: "Abbreviation for 'and'.",
    },
    category: "一般的な略語",
  },
  HI: {
    morse: ".... ..",
    meaning: {
      ja: "笑い",
      en: "Laughter",
    },
    description: {
      ja: "モールス通信での笑いを表現する略語です。",
      en: "Expresses laughter in Morse code communication.",
    },
    category: "一般的な略語",
  },
  HPE: {
    morse: ".... .--. .",
    meaning: {
      ja: "希望する",
      en: "Hope",
    },
    description: {
      ja: "「hope」（希望する）を意味する略語です。",
      en: "Abbreviation for 'hope'.",
    },
    category: "一般的な略語",
  },
  HR: {
    morse: ".... .-.",
    meaning: {
      ja: "ここ",
      en: "Here",
    },
    description: {
      ja: "「here」（ここ）を意味する略語です。",
      en: "Abbreviation for 'here'.",
    },
    category: "一般的な略語",
  },
  NR: {
    morse: "-. .-.",
    meaning: {
      ja: "番号",
      en: "Number",
    },
    description: {
      ja: "「number」（番号）を意味する略語です。",
      en: "Abbreviation for 'number'.",
    },
    category: "一般的な略語",
  },
  OM: {
    morse: "--- --",
    meaning: {
      ja: "男性オペレーター",
      en: "Male operator",
    },
    description: {
      ja: "「Old Man」の略で、男性オペレーターを指す略語です。",
      en: "Abbreviation for 'Old Man', refers to a male operator.",
    },
    category: "一般的な略語",
  },
  PSE: {
    morse: ".--. ... .",
    meaning: {
      ja: "お願いします",
      en: "Please",
    },
    description: {
      ja: "「please」（お願いします）を意味する略語です。",
      en: "Abbreviation for 'please'.",
    },
    category: "一般的な略語",
  },
  RST: {
    morse: ".-. ... -",
    meaning: {
      ja: "信号レポート",
      en: "Signal report",
    },
    description: {
      ja: "Readability（可読性）、Strength（信号強度）、Tone（音調）の略で、信号の品質を報告するために使用されます。",
      en: "Abbreviation for Readability, Strength, and Tone, used to report signal quality.",
    },
    category: "一般的な略語",
  },
  RX: {
    morse: ".-. -..-",
    meaning: {
      ja: "受信機",
      en: "Receiver",
    },
    description: {
      ja: "「receiver」（受信機）を意味する略語です。",
      en: "Abbreviation for 'receiver'.",
    },
    category: "一般的な略語",
  },
  TX: {
    morse: "- -..-",
    meaning: {
      ja: "送信機",
      en: "Transmitter",
    },
    description: {
      ja: "「transmitter」（送信機）を意味する略語です。",
      en: "Abbreviation for 'transmitter'.",
    },
    category: "一般的な略語",
  },
  TKS: {
    morse: "- -.- ...",
    meaning: {
      ja: "ありがとう",
      en: "Thanks",
    },
    description: {
      ja: "「thanks」（ありがとう）を意味する略語です。",
      en: "Abbreviation for 'thanks'.",
    },
    category: "一般的な略語",
  },
  TNX: {
    morse: "- -. -..-",
    meaning: {
      ja: "ありがとう",
      en: "Thanks",
    },
    description: {
      ja: "「thanks」（ありがとう）を意味する略語です。TKSと同じ意味です。",
      en: "Abbreviation for 'thanks'. Same meaning as TKS.",
    },
    category: "一般的な略語",
  },
  UR: {
    morse: "..- .-.",
    meaning: {
      ja: "あなたの",
      en: "Your",
    },
    description: {
      ja: "「your」（あなたの）を意味する略語です。",
      en: "Abbreviation for 'your'.",
    },
    category: "一般的な略語",
  },
  VY: {
    morse: "...- -.--",
    meaning: {
      ja: "とても",
      en: "Very",
    },
    description: {
      ja: "「very」（とても）を意味する略語です。",
      en: "Abbreviation for 'very'.",
    },
    category: "一般的な略語",
  },
  WX: {
    morse: ".-- -..-",
    meaning: {
      ja: "天気",
      en: "Weather",
    },
    description: {
      ja: "「weather」（天気）を意味する略語です。",
      en: "Abbreviation for 'weather'.",
    },
    category: "一般的な略語",
  },
  XYL: {
    morse: "-..- -.-- .-..",
    meaning: {
      ja: "妻",
      en: "Wife",
    },
    description: {
      ja: "「ex-Young Lady」の略で、オペレーターの妻を指す略語です。",
      en: "Abbreviation for 'ex-Young Lady', refers to an operator's wife.",
    },
    category: "一般的な略語",
  },
  YL: {
    morse: "-.-- .-..",
    meaning: {
      ja: "女性オペレーター",
      en: "Female operator",
    },
    description: {
      ja: "「Young Lady」の略で、女性オペレーターを指す略語です。",
      en: "Abbreviation for 'Young Lady', refers to a female operator.",
    },
    category: "一般的な略語",
  },

  // 数字コード
  "73": {
    morse: "--... ...--",
    meaning: {
      ja: "よろしく",
      en: "Best regards",
    },
    description: {
      ja: "「Best regards」（よろしく）を意味する数字コードです。交信の終わりに使用されることが多いです。",
      en: "Numeric code meaning 'Best regards'. Often used at the end of a QSO.",
    },
    category: "数字コード",
  },
  "88": {
    morse: "--... --...",
    meaning: {
      ja: "愛と口づけを",
      en: "Love and kisses",
    },
    description: {
      ja: "「Love and kisses」（愛と口づけを）を意味する数字コードです。親しい間柄で使用されます。",
      en: "Numeric code meaning 'Love and kisses'. Used between close friends.",
    },
    category: "数字コード",
  },
  "99": {
    morse: "--... ---..",
    meaning: {
      ja: "退去せよ",
      en: "Go away",
    },
    description: {
      ja: "「Go away」（退去せよ）を意味する数字コードです。",
      en: "Numeric code meaning 'Go away'.",
    },
    category: "数字コード",
  },
  "44": {
    morse: "....- ....-",
    meaning: {
      ja: "どこにも行かない",
      en: "I am not going anywhere",
    },
    description: {
      ja: "「I am not going anywhere」（どこにも行かない）を意味する数字コードです。",
      en: "Numeric code meaning 'I am not going anywhere'.",
    },
    category: "数字コード",
  },
  "55": {
    morse: "..... .....",
    meaning: {
      ja: "成功を祈る",
      en: "Good luck",
    },
    description: {
      ja: "「Good luck」（成功を祈る）を意味する数字コードです。",
      en: "Numeric code meaning 'Good luck'.",
    },
    category: "数字コード",
  },

  // 緊急通信
  SOS: {
    morse: "... --- ...",
    meaning: {
      ja: "遭難信号",
      en: "Distress signal",
    },
    description: {
      ja: "国際的な遭難信号です。緊急時に救助を求める際に使用されます。",
      en: "International distress signal. Used to request help in emergencies.",
    },
    category: "緊急通信",
  },
  MAYDAY: {
    morse: "-- .- -.-- -.. .- -.--",
    meaning: {
      ja: "遭難信号（音声）",
      en: "Voice distress signal",
    },
    description: {
      ja: "音声通信での国際的な遭難信号です。",
      en: "International voice distress signal.",
    },
    category: "緊急通信",
  },
  PAN: {
    morse: ".--. .- -.",
    meaning: {
      ja: "緊急信号",
      en: "Urgency signal",
    },
    description: {
      ja: "緊急ではあるが、即時の救助は必要ない状況で使用される信号です。",
      en: "Signal used in urgent situations that do not require immediate rescue.",
    },
    category: "緊急通信",
  },
  SECURITE: {
    morse: "... . -.-. ..- .-. .. - .",
    meaning: {
      ja: "安全信号",
      en: "Safety signal",
    },
    description: {
      ja: "航行上の安全に関する重要な情報を伝える際に使用される信号です。",
      en: "Signal used to convey important information related to navigation safety.",
    },
    category: "緊急通信",
  },

  // よく目にする
  CHIYODA: {
    morse: "-.-. .... .. -.-- --- -.. .-",
    meaning: {
      ja: "ちよだ",
      en: "Chiyoda",
    },
    description: {
      ja: "定番のちよだ",
      en: "'CHIYODA' after all.",
    },
    category: "よく目にする",
  },
  DENPA3: {
    morse: "-.. . -. .--. .- ...--",
    meaning: {
      ja: "でんぱ3",
      en: "Denpa 3",
    },
    description: {
      ja: "覚えておくとよいかもしれない",
      en: "Good to remember",
    },
    category: "よく目にする",
  },
  MUSEN5: {
    morse: "-- ..- ... . -. .....",
    meaning: {
      ja: "むせん5",
      en: "Musen 5",
    },
    description: {
      ja: "覚えておくとよいかもしれない",
      en: "Good to remember",
    },
    category: "よく目にする",
  },
}

// アマチュア無線略語のカテゴリーを取得する関数
export function getHamRadioCategories(language = "ja"): string[] {
  const uniqueCategories = new Set<string>()

  Object.values(hamRadioData).forEach((data) => {
    uniqueCategories.add(data.category)
  })

  // 言語に応じたカテゴリー名を返す
  return Array.from(uniqueCategories).map((category) => categories[category][language as "ja" | "en"])
}

// カテゴリー別にアマチュア無線略語を取得する関数
export function getLocalizedHamRadioData(language = "ja"): Record<
  string,
  {
    morse: string
    meaning: string
    description: string
    category: string
  }
> {
  return Object.entries(hamRadioData).reduce(
    (acc, [code, data]) => {
      acc[code] = {
        morse: data.morse,
        meaning: data.meaning[language as "ja" | "en"],
        description: data.description[language as "ja" | "en"],
        category: categories[data.category][language as "ja" | "en"],
      }
      return acc
    },
    {} as Record<string, { morse: string; meaning: string; description: string; category: string }>,
  )
}

// 言語に応じたQ符号データを取得する関数
export function getLocalizedQCodesData(language = "ja"): Record<string, { meaning: string; description: string }> {
  return Object.entries(qCodesData).reduce(
    (acc, [code, data]) => {
      acc[code] = {
        meaning: data.meaning[language as "ja" | "en"],
        description: data.description[language as "ja" | "en"],
      }
      return acc
    },
    {} as Record<string, { meaning: string; description: string }>,
  )
}

