"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

// 言語タイプの定義
export type Language = "ja" | "en"

// 翻訳リソース
export const translations = {
  ja: {
    // 共通
    appTitle: "ham etude",
    chart: "符号表",
    practice: "練習モード",
    search: "検索",
    play: "再生",
    stop: "停止",
    submit: "回答する",
    showAnswer: "答えを見る",
    correct: "正解です！",
    incorrect: "不正解です。",
    answer: "正解",
    nextQuestion: "次の問題",
    accuracyRate: "正解率",

    // メインタブ
    morseCode: "モールス符号",
    morseConverter: "モールス符号へ変換",
    codesAndAbbr: "符号と略語",
    keyInput: "電鍵入力",
    qsoSimulator: "交信シミュレーター",

    // モールス符号
    searchByCharOrMorse: "文字またはモールス符号で検索",
    charToMorse: "文字 → モールス符号",
    morseToChar: "モールス符号 → 文字",
    whatMorseForChar: "この文字のモールス符号は？",
    whatCharForMorse: "このモールス符号の文字は？",
    enterMorse: "モールス符号を入力",
    enterChar: "文字を入力",
    playMorse: "モールス符号を再生",

    // モールス符号変換
    enterText: "テキストを入力",
    convertToMorse: "モールス符号に変換",
    volume: "音量",
    speed: "速度",

    // Q符号と無線略語
    qCodes: "Q符号",
    hamCodes: "無線略語",
    cardView: "カード表示",
    listView: "リスト表示",
    searchByCodeOrMeaning: "Q符号または意味で検索",
    searchByCodeMeaningDesc: "符号、意味、説明で検索",
    category: "カテゴリー",
    all: "すべて",
    codeToMeaning: "符号 → 意味",
    meaningToCode: "意味 → 符号",
    morseToCode: "モールス符号 → 符号",
    whatMeaningForCode: "この符号の意味は？",
    whatCodeForMeaning: "この意味の符号は？",
    whatCodeForMorse: "このモールス符号の符号は？",
    noResults: "検索結果がありません。別のキーワードで検索してください。",
    noCategoryItems: "選択したカテゴリーには符号がありません。別のカテゴリーを選択してください。",

    // 電鍵入力
    keyerTitle: "電鍵入力",
    keyerDescription:
      "オーディオケーブルで接続された電鍵からの入力を検出します。マイクに電鍵の音が入力されるように設定してください。",
    start: "開始",
    stop: "停止",
    waveform: "波形表示",
    detectedMorse: "検出されたモールス符号",
    decodedText: "デコードされたテキスト",
    waitingForInput: "電鍵入力を待機中...",
    decodedTextWillAppear: "デコードされたテキストがここに表示されます",
    decode: "デコード",
    clear: "クリア",
    advancedSettings: "詳細設定",
    autoDecode: "自動デコード",
    sensitivity: "検出感度",
    dotLength: "短点の長さ",
    letterGap: "文字間の間隔",
    wordGap: "単語間の間隔",

    // 言語切り替え
    switchToJapanese: "日本語に切り替え",
    switchToEnglish: "英語に切り替え",

    // 交信シミュレーター
    qsoSimulatorTitle: "交信シミュレーター",
    qsoSimulatorDescription:
      "モールス符号での交信を疑似体験できます。自分のコールサインを入力して、世界中の局との交信を練習しましょう。",
    yourCallsign: "あなたのコールサイン",
    enterYourCallsign: "あなたのコールサインを入力",
    startQSO: "交信を開始",
    newQSO: "新しい交信",
    continueQSO: "交信を続ける",
    sendMessage: "送信",
    listeningMode: "受信モード",
    sendingMode: "送信モード",
    qsoLog: "交信ログ",
    stationInfo: "相手局情報",
    callsign: "コールサイン",
    country: "国",
    operator: "オペレーター",
    signal: "信号",
    qsoStage: "交信ステージ",
    yourTurn: "あなたの番です",
    stationTurn: "相手局の番です",
    waitingForReply: "返信を待っています...",
    qsoComplete: "交信完了",
    rst: "RST",
    qth: "QTH",
    name: "名前",
    rig: "無線機",
    antenna: "アンテナ",
    weather: "天気",
    remarks: "備考",
    cqCalling: "CQ CQ CQ DE {callsign} {callsign} K",
    answerCq: "{theirCallsign} DE {myCallsign} {myCallsign} K",
    initialExchange:
      "{myCallsign} DE {theirCallsign} = GM/GA/GE OM = TNX FER CALL = UR RST {rst} {rst} = NAME {name} {name} = QTH {qth} {qth} = HW? {myCallsign} DE {theirCallsign} K",
    returnExchange:
      "{theirCallsign} DE {myCallsign} = TNX FER RPRT = UR RST {rst} {rst} = MY NAME {name} {name} = QTH {qth} {qth} = RIG {rig} {rig} WID {antenna} {antenna} = WX {weather} = HW? {theirCallsign} DE {myCallsign} K",
    finalMessage:
      "{myCallsign} DE {theirCallsign} = FB OM TKS FER INFO = HPE CUAGN = 73 73 = {myCallsign} DE {theirCallsign} SK",
    goodbye: "{theirCallsign} DE {myCallsign} = TKS FER QSO = 73 73 = {theirCallsign} DE {myCallsign} SK",
    invalidCallsign: "有効なコールサインを入力してください",
    typingPrompt: "ここにモールス符号を入力...",
    playbackSpeed: "再生速度",
    slow: "遅い",
    medium: "普通",
    fast: "速い",
    autoAdvance: "自動進行",
    showMorseText: "モールス符号を表示",
    showPlainText: "平文を表示",
    qsoProgress: "交信の進行状況",
    callsignFormat: "コールサインの形式: 1-2文字のプレフィックス + 数字 + 1-3文字のサフィックス (例: JA1ZRL)",
  },
  en: {
    // Common
    appTitle: "ham etude",
    chart: "Chart",
    practice: "Practice",
    search: "Search",
    play: "Play",
    stop: "Stop",
    submit: "Submit",
    showAnswer: "Show Answer",
    correct: "Correct!",
    incorrect: "Incorrect.",
    answer: "Answer",
    nextQuestion: "Next Question",
    accuracyRate: "Accuracy",

    // Main tabs
    morseCode: "Morse Code",
    morseConverter: "Morse Converter",
    codesAndAbbr: "Codes & Abbreviations",
    keyInput: "Key Input",
    qsoSimulator: "QSO Simulator",

    // Morse code
    searchByCharOrMorse: "Search by character or Morse code",
    charToMorse: "Character → Morse",
    morseToChar: "Morse → Character",
    whatMorseForChar: "What is the Morse code for this character?",
    whatCharForMorse: "What character is this Morse code?",
    enterMorse: "Enter Morse code",
    enterChar: "Enter character",
    playMorse: "Play Morse code",

    // Morse converter
    enterText: "Enter text",
    convertToMorse: "Convert to Morse",
    volume: "Volume",
    speed: "Speed",

    // Q-codes and Ham radio codes
    qCodes: "Q-Codes",
    hamCodes: "Ham Radio Codes",
    cardView: "Card View",
    listView: "List View",
    searchByCodeOrMeaning: "Search by Q-code or meaning",
    searchByCodeMeaningDesc: "Search by code, meaning, or description",
    category: "Category",
    all: "All",
    codeToMeaning: "Code → Meaning",
    meaningToCode: "Meaning → Code",
    morseToCode: "Morse → Code",
    whatMeaningForCode: "What is the meaning of this code?",
    whatCodeForMeaning: "What code has this meaning?",
    whatCodeForMorse: "What code is this Morse code?",
    noResults: "No results found. Try a different search term.",
    noCategoryItems: "No codes in the selected category. Please select a different category.",

    // Key input
    keyerTitle: "Key Input",
    keyerDescription:
      "Detects input from a Morse key connected via audio cable. Make sure the key sound is input to your microphone.",
    start: "Start",
    stop: "Stop",
    waveform: "Show Waveform",
    detectedMorse: "Detected Morse Code",
    decodedText: "Decoded Text",
    waitingForInput: "Waiting for key input...",
    decodedTextWillAppear: "Decoded text will appear here",
    decode: "Decode",
    clear: "Clear",
    advancedSettings: "Advanced Settings",
    autoDecode: "Auto Decode",
    sensitivity: "Sensitivity",
    dotLength: "Dot Length",
    letterGap: "Letter Gap",
    wordGap: "Word Gap",

    // Language toggle
    switchToJapanese: "Switch to Japanese",
    switchToEnglish: "Switch to English",

    // QSO Simulator
    qsoSimulatorTitle: "QSO Simulator",
    qsoSimulatorDescription:
      "Experience simulated Morse code QSOs. Enter your callsign and practice communicating with stations from around the world.",
    yourCallsign: "Your Callsign",
    enterYourCallsign: "Enter your callsign",
    startQSO: "Start QSO",
    newQSO: "New QSO",
    continueQSO: "Continue QSO",
    sendMessage: "Send",
    listeningMode: "Listening Mode",
    sendingMode: "Sending Mode",
    qsoLog: "QSO Log",
    stationInfo: "Station Info",
    callsign: "Callsign",
    country: "Country",
    operator: "Operator",
    signal: "Signal",
    qsoStage: "QSO Stage",
    yourTurn: "Your turn",
    stationTurn: "Station's turn",
    waitingForReply: "Waiting for reply...",
    qsoComplete: "QSO Complete",
    rst: "RST",
    qth: "QTH",
    name: "Name",
    rig: "Rig",
    antenna: "Antenna",
    weather: "Weather",
    remarks: "Remarks",
    cqCalling: "CQ CQ CQ DE {callsign} {callsign} K",
    answerCq: "{theirCallsign} DE {myCallsign} {myCallsign} K",
    initialExchange:
      "{myCallsign} DE {theirCallsign} = GM/GA/GE OM = TNX FER CALL = UR RST {rst} {rst} = NAME {name} {name} = QTH {qth} {qth} = HW? {myCallsign} DE {theirCallsign} K",
    returnExchange:
      "{theirCallsign} DE {myCallsign} = TNX FER RPRT = UR RST {rst} {rst} = MY NAME {name} {name} = QTH {qth} {qth} = RIG {rig} {rig} WID {antenna} {antenna} = WX {weather} = HW? {theirCallsign} DE {myCallsign} K",
    finalMessage:
      "{myCallsign} DE {theirCallsign} = FB OM TKS FER INFO = HPE CUAGN = 73 73 = {myCallsign} DE {theirCallsign} SK",
    goodbye: "{theirCallsign} DE {myCallsign} = TKS FER QSO = 73 73 = {theirCallsign} DE {myCallsign} SK",
    invalidCallsign: "Please enter a valid callsign",
    typingPrompt: "Type Morse code here...",
    playbackSpeed: "Playback Speed",
    slow: "Slow",
    medium: "Medium",
    fast: "Fast",
    autoAdvance: "Auto Advance",
    showMorseText: "Show Morse Text",
    showPlainText: "Show Plain Text",
    qsoProgress: "QSO Progress",
    callsignFormat: "Callsign format: 1-2 character prefix + number + 1-3 character suffix (e.g. W1AW)",
  },
}

// 言語コンテキストの型定義
type LanguageContextType = {
  language: Language
  setLanguage: (language: Language) => void
  t: (key: keyof typeof translations.ja) => string
}

// デフォルト値
const defaultLanguageContext: LanguageContextType = {
  language: "ja",
  setLanguage: () => { },
  t: (key) => key as string,
}

// コンテキストの作成
const LanguageContext = createContext<LanguageContextType>(defaultLanguageContext)

// プロバイダーコンポーネント
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("ja")

  // 初期化時にローカルストレージから言語設定を読み込む
  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language | null
    if (savedLanguage && (savedLanguage === "ja" || savedLanguage === "en")) {
      setLanguageState(savedLanguage)
    }
  }, [])

  // 言語設定を変更する関数
  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage)
    localStorage.setItem("language", newLanguage)
  }

  // 翻訳関数
  const t = (key: keyof typeof translations.ja): string => {
    return translations[language][key] || key
  }

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}

// フック
export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}

