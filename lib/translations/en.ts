// 英語の翻訳リソース
export const enTranslations = {
  // Common
  common: {
    appTitle: "ham etude",
    chart: "Chart",
    practice: "Practice",
    search: "Search",
    play: "Play",
    stop: "Stop",
    submit: "Submit",
    showAnswer: "Show Answer",
    correct: "Correct!",
    incorrect: "Incorrect",
    answer: "Answer",
    nextQuestion: "Next",
    accuracyRate: "Accuracy",
    close: "Close",
    howToUse: "How to Use",
  },

  // Main tabs
  tabs: {
    learnMorse: "Morse",
    radioAbbr: "Codes",
    qsoSimulation: "QSO",
    morseChart: "Chart",
    morsePractice: "Practice",
    morseConverter: "Convert",
    morseKey: "Key",
    codeChart: "List",
    codePractice: "Practice",
  },

  // Morse code
  morse: {
    searchByCharOrMorse: "Search by character or Morse code",
    charToMorse: "Char → Morse",
    morseToChar: "Morse → Char",
    whatMorseForChar: "What is the Morse code for this character?",
    whatCharForMorse: "What character is this Morse code?",
    enterMorse: "Enter Morse code",
    enterChar: "Enter character",
    playMorse: "Play Morse code",
    enterText: "Enter text",
    convertToMorse: "Convert to Morse",
    morseConverter: "Morse Code Converter",
    volume: "Volume",
    speed: "Speed",
  },

  // Q-codes and Ham radio codes
  codes: {
    qCodes: "Q-Codes",
    hamCodes: "Ham Codes",
    cardView: "Cards",
    listView: "List",
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
    noResults: "No results found",
    noCategoryItems: "No codes in the selected category",
  },

  // Morse Key Practice
  keyer: {
    keyerTitle: "Morse Key Practice",
    keyerDescription:
      "Detects input from a Morse key connected via audio cable. Make sure the key sound is input to your microphone.",
    start: "Start",
    stop: "Stop",
    waveform: "Waveform",
    detectedMorse: "Detected Morse",
    decodedText: "Decoded Text",
    waitingForInput: "Waiting for input...",
    decodedTextWillAppear: "Decoded text will appear here",
    decode: "Decode",
    clear: "Clear",
    advancedSettings: "Settings",
    autoDecode: "Auto Decode",
    sensitivity: "Sensitivity",
    dotLength: "Dot Length",
    letterGap: "Letter Gap",
    wordGap: "Word Gap",
    useKeyInput: "Use Key Input",
  },

  // Language toggle
  language: {
    switchToJapanese: "日本語",
    switchToEnglish: "English",
  },

  // QSO Simulator
  qso: {
    qsoSimulatorTitle: "QSO Practice",
    qsoSimulatorDescription:
      "Practice Morse code QSOs. Enter your callsign and experience communicating with stations worldwide.",
    qsoSimulatorHelpDescription:
      "Use the QSO Practice to learn Morse code contacts. Experience the flow of a real QSO.",
    qsoSimulatorHelpSteps: "Basic Usage",
    qsoSimulatorHelpStep1: "Enter your callsign (e.g., W1AW) and click 'Start'.",
    qsoSimulatorHelpStep2: "Listen to the CQ from the other station. Click 'Play' to hear it in Morse code.",
    qsoSimulatorHelpStep3: "When it's your turn, type your message. Click 'Example' for the appropriate response.",
    qsoSimulatorHelpStep4: "Click 'Send' to transmit your message.",
    qsoSimulatorHelpStep5: "Listen to the response and continue the conversation.",
    qsoSimulatorHelpStep6: "When the QSO is complete, you can start a new one.",
    qsoSimulatorHelpTips: "Tips",
    qsoSimulatorHelpTip1: "Turn on 'Auto Advance' to automatically play the other station's messages.",
    qsoSimulatorHelpTip2: "Adjust the 'Speed' to match your skill level.",
    qsoSimulatorHelpTip3: "Customize your view with the 'Show Morse' and 'Show Text' options.",
    qsoSimulatorHelpTip4: "Real QSOs often use standard phrases, so practice will help you become familiar with them.",
    yourCallsign: "Callsign",
    enterYourCallsign: "Enter callsign",
    startQSO: "Start",
    newQSO: "New",
    continueQSO: "Continue",
    sendMessage: "Send",
    listeningMode: "Listening",
    sendingMode: "Sending",
    qsoLog: "QSO Log",
    stationInfo: "Station Info",
    callsign: "Call",
    country: "Country",
    operator: "Operator",
    signal: "Signal",
    qsoStage: "QSO Stage",
    yourTurn: "Your turn",
    stationTurn: "Station's turn",
    waitingForReply: "Waiting...",
    qsoComplete: "Complete",
    rst: "RST",
    qth: "QTH",
    name: "Name",
    rig: "Rig",
    antenna: "Antenna",
    weather: "WX",
    remarks: "Notes",
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
    typingPrompt: "Type here...",
    playbackSpeed: "Speed",
    slow: "Slow",
    medium: "Medium",
    fast: "Fast",
    autoAdvance: "Auto",
    showMorseText: "Show Morse",
    showPlainText: "Show Text",
    qsoProgress: "Progress",
    callsignFormat: "Format: prefix + number + suffix (e.g. W1AW)",
    qsoExplanation: "Info",
    commonAbbreviations: "Abbreviations",
    showExample: "Example",
  },

  // Legacy tab names (for backward compatibility)
  legacy: {
    morseCode: "Morse Code",
    morseConverter: "Morse Converter",
    codesAndAbbr: "Codes & Abbreviations",
    morseKeyPractice: "Morse Key Practice",
    morseQsoPractice: "QSO Simulation",
    practiceQSO: "QSO Practice",
  },
}

