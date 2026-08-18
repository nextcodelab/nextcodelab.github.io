// data.js
const appsData = [
  {
    id: "shepherd-bible",
    name: "Shepherd Bible",
    tagline: "A fast, lightweight Bible for daily study.",
    description:
      "A fast and lightweight offline Bible for daily study. Quickly find Bible verses, read without an internet connection, listen to Bible audio, highlight and bookmark verses, create personal notebooks, explore cross-references, and study with concordance, Hebrew, and Greek tools.",
    category: "Bible",
    icon: "https://store-images.s-microsoft.com/image/apps.24704.14323172057173048.f2d975bd-f26a-4749-b409-d6f4762f27b2.958f411e-da41-45f4-9f9d-5327b0ea614f?h=170",
    platforms: ["Windows"],
    microsoftStore: "https://apps.microsoft.com/detail/9pprws532n91",
    googlePlay: null,
    appStore: null,
    features: [
      "Offline Bible reading",
      "Bible audio based on selected translations",
      "Highlight and bookmark Bible verses",
      "Personal Bible notebooks",
      "Concordance, Hebrew and Greek support",
      "Bible verse cross-references",
      "Worship songs and hymns",
      "Support for SQLite Bible databases",
    ],
    screenshots: [
      "https://store-images.s-microsoft.com/image/apps.12402.14323172057173048.a0945940-bf00-412a-898e-90c261c8b196.382e5db9-41c0-486e-bb97-6b3f90d7d47d",
      "https://store-images.s-microsoft.com/image/apps.28117.14323172057173048.a0945940-bf00-412a-898e-90c261c8b196.c2cdea1d-3c46-4278-a232-2f0ed609cf56",
    ],
  },
  {
    id: "english-dictionary-offline",
    name: "English Dictionary - Offline",
    tagline: "A fast and powerful offline English dictionary.",
    description:
      "A free offline English dictionary with definitions, synonyms, related words, pronunciation, examples, and powerful word search tools. Everything works offline without requiring additional downloads.",
    category: "Utilities",
    icon: "https://play-lh.googleusercontent.com/RVudXjLk1jrG98nx_rbHNDdGnGRDQnSjvWJKfGiz-GIilIeOyp6qxznluhM_16NwoSw5k9QMyrDfbvTAp5Dz=w480-h960-rw",
    platforms: ["Windows", "Android"],
    microsoftStore: "https://apps.microsoft.com/detail/9nsmlkmc3wb6",
    googlePlay:
      "https://play.google.com/store/apps/details?id=com.cloudlabstudio.englishdictionary",
    appStore: null,
    features: [
      "Works completely offline",
      "Fast word search",
      "Search autocomplete and suggestions",
      "Audio pronunciation",
      "Synonyms and related words",
      "Antonyms, hyponyms and hypernyms",
      "Thousands of idioms",
      "Verb forms",
      "Spell checking",
      "Word puzzles",
    ],
    screenshots: [
      "https://store-images.s-microsoft.com/image/apps.24005.14360665815359089.e75a7a44-6980-4e0d-818a-983748b0fa34.f73165f2-c440-4dd4-ae71-299869440872?h=380",
      "https://play-lh.googleusercontent.com/kWFt93pa8UEOsTL0zDGXN56LZtp74pgEtkRCiaLFk0S09r4grcYibjeuWmzdtwRKWdvrZ03Yb3G1dVDq1iSwVQ=w5120-h2880-rw",
    ],
  },
  {
    id: "battery-alarm-analytics",
    name: "Battery Alarm & Analytics",
    category: "Utilities",
    tagline:
      "Monitor your battery and get notified when it reaches your desired level.",
    description:
      "Battery Alarm & Analytics is a Windows utility for monitoring battery status, analyzing battery information, and receiving battery level notifications.",

    icon: "https://store-images.s-microsoft.com/image/apps.10089.13964761162974245.4ae7b5a9-0965-41a3-a63f-757a219eecf9.c85c75f2-1a24-4afa-b471-66e9df62e1ec?h=170",

    platforms: ["Windows"],

    microsoftStore: "https://apps.microsoft.com/detail/9n1v03mzcz86",

    googlePlay: "",
    appStore: "",

    features: [
      "Monitor battery status",
      "Track battery information",
      "Battery level notifications",
      "Designed for Windows",
    ],

    screenshots: [
      "https://store-images.s-microsoft.com/image/apps.61362.13964761162974245.1b859f71-0494-40c5-aa14-55806c2b1b2e.33916860-b013-4645-b178-09a24a4fd470",
    ],
  },
  {
    id: "word-puzzle-center",
    name: "Word Puzzle Center",
    category: "Utilities",
    tagline: "Play fun and challenging word puzzles online.",
    description:
      "Word Puzzle Center is a collection of word puzzle games designed for quick, enjoyable play directly in your web browser.",

    icon: "https://wordpuzzlecenter-github-io.wordpuzzles.workers.dev/icons/icon-192.png",

    platforms: ["Web"],

    microsoftStore: "",
    googlePlay: "",
    appStore: "",

    website: "https://wordpuzzlecenter-github-io.wordpuzzles.workers.dev/",

    features: [
      "Play directly in your browser",
      "Multiple word puzzle games",
      "No installation required",
      "Designed for desktop and mobile browsers",
    ],

    screenshots: [],
  },
  {
    id: "coder-basket",
    name: "Coder Basket",
    category: "Developer Tools",
    tagline:
      "Discover developer libraries, tools, frameworks and open source projects.",
    description:
      "Coder Basket is a developer-focused platform for discovering useful software libraries, development tools, frameworks, and open source projects.",

    icon: "https://coderbasket.github.io/img/codericon.png",

    platforms: ["Web"],

    microsoftStore: "",
    googlePlay: "",
    appStore: "",

    website: "https://coderbasket.github.io/",

    features: [
      "Discover developer tools and libraries",
      "Explore open source projects",
      "Browse frameworks and development technologies",
      "Find useful software and developer resources",
      "Works on desktop and mobile browsers",
    ],

    screenshots: [],
  },
  {
    id: "text-to-speech",
    name: "Text to Speech",
    category: "Productivity",
    tagline: "Convert text into natural-sounding speech and save audio files.",
    description:
      "Text to Speech is an app that converts written text into speech, supports multiple languages and voices, and lets you save generated audio for later playback.",

    icon: "https://play-lh.googleusercontent.com/yRx9SsJtx1z0tUkMqu0AoW4qia5C_In3cy3evZkrIxx28kKD7idimHUn8lgRncp3LZ_biVkR8cC6ZCr4fvOnIg=w480-h960-rw",

    platforms: ["Windows", "Android"],

    microsoftStore: "https://apps.microsoft.com/detail/9pmv6wxsdhjp",
    googlePlay:
      "https://play.google.com/store/apps/details?id=com.nextcodelab.text_to_speech",
    appStore: "",

    website: null,

    features: [
      "Convert text to speech",
      "Support for multiple languages and voices",
      "Save generated audio files",
      "Customize voice and playback options",
      "Available on Windows and Android",
    ],

    screenshots: [],
  },
  // Add up to 50+ apps here easily
];
