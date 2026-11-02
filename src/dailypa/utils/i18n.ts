import { SupportedLanguage } from '../types';

export const SUPPORTED_LANGUAGES_INFO: {
  code: SupportedLanguage;
  nameKhmer: string;
  nameEnglish: string;
  nativeName: string;
  flag: string;
  region: 'eastasia' | 'global';
  defaultCurrency: string;
  defaultCurrencySymbol: string;
  defaultRateToUsd: number;
  description?: string;
}[] = [
  { 
    code: 'en', 
    nameKhmer: 'English', 
    nameEnglish: 'English (International)', 
    nativeName: 'English', 
    flag: '🌐', 
    region: 'global', 
    defaultCurrency: 'USD', 
    defaultCurrencySymbol: '$', 
    defaultRateToUsd: 1,
    description: 'International English for global users (USD $)' 
  },
  { 
    code: 'ko', 
    nameKhmer: '한국어 (Korean)', 
    nameEnglish: 'Korean', 
    nativeName: '한국어', 
    flag: '🇰🇷', 
    region: 'eastasia', 
    defaultCurrency: 'KRW', 
    defaultCurrencySymbol: '₩', 
    defaultRateToUsd: 1380,
    description: '한국어 음성 비서 및 원화(KRW ₩) 관리' 
  },
];

const TRANSLATIONS: Record<string, Record<string, string>> = {
  // Brand & Top Navigation
  brandTitle: {
    en: 'MyDailyPA',
    ko: 'MyDailyPA',
  },
  brandSubtitle: {
    en: 'Voice AI Personal Assistant',
    ko: '개인 음성 AI 비서 (Voice AI)',
  },
  voiceAssistantStatus: {
    en: 'Voice Assistant',
    ko: '음성 비서',
  },
  navSettings: {
    en: 'Settings',
    ko: '설정',
  },
  navMemberAdmin: {
    en: 'Member / Admin',
    ko: '회원 / 관리자',
  },
  navRecordVoice: {
    en: 'Record Voice',
    ko: '음성 녹음',
  },
  navVoicePL: {
    en: 'Voice P&L',
    ko: '음성 손익계산서 (P&L)',
  },
  navDebtBook: {
    en: 'Debt & Credit Ledger',
    ko: '외상 및 미수금 장부',
  },
  navBriefing: {
    en: 'Daily Briefing',
    ko: '일일 요약 브리핑',
  },
  navTemplates: {
    en: 'Voice Templates',
    ko: '음성 템플릿',
  },
  navLanguage: {
    en: 'Language & Currency',
    ko: '언어 및 통화',
  },
  navMenu: {
    en: 'Menu',
    ko: '메뉴',
  },
  selectLanguageTitle: {
    en: 'Select Language (English & Korean)',
    ko: '언어 및 통화 선택 (영어 & 한국어)',
  },
  viewAll: {
    en: 'View Options',
    ko: '옵션 보기',
  },
  exchangeRateBtn: {
    en: 'Exchange Rate',
    ko: '환율 설정',
  },
  currentAccount: {
    en: 'Current Account',
    ko: '현재 계정',
  },
  muteSpeech: {
    en: 'Mute Voice',
    ko: '음성 음소거',
  },
  enableSpeech: {
    en: 'Enable Voice',
    ko: '음성 재생 활성화',
  },

  // Financial Hero Card
  financialVaultBadge: {
    en: 'Zero-Leakage Financial Vault',
    ko: '실시간 가계부 & 재무 금고',
  },
  netCashBalanceTitle: {
    en: 'Net Cash Balance',
    ko: '순 현금 잔액',
  },
  realtimeCalculatedDesc: {
    en: 'Realtime calculated net balance (Income minus Expenses)',
    ko: '실시간 계산된 순 잔액 (수입 - 지출)',
  },
  metricIncome: {
    en: 'Income & Sales',
    ko: '수입 및 매출',
  },
  metricExpense: {
    en: 'Expenses & Costs',
    ko: '지출 및 비용',
  },
  metricTasks: {
    en: 'Active Tasks & Debts',
    ko: '진행 중인 업무 및 외상',
  },

  // Quick Action Feature Cards
  digestCardTitle: {
    en: 'Audio P&L Recap',
    ko: '음성 손익 요약',
  },
  digestCardDesc: {
    en: 'Listen to spoken profit summary, top sales & cost breakdown',
    ko: '음성으로 오늘 하루 이익, 최고 매출 및 비용 분석 청취',
  },
  badgeAudio: {
    en: 'Audio',
    ko: '오디오',
  },
  debtCardTitle: {
    en: 'Customer Debt Book',
    ko: '고객 외상 장부',
  },
  debtCardDesc: {
    en: 'Track who owes you money or suppliers you need to pay',
    ko: '외상 매출금 및 거래처 지급 채무 실시간 추적',
  },
  badgeLedger: {
    en: 'Ledger',
    ko: '장부',
  },

  // Hero Action Buttons
  btnRecord: {
    en: 'Record Voice',
    ko: '음성 녹음',
  },
  btnQuickAdd: {
    en: 'Quick Input',
    ko: '빠른 입력',
  },
  btnReport: {
    en: 'Summary Report',
    ko: '요약 보고서',
  },

  // Quick Utility Links
  linkAudioSummary: {
    en: 'Audio Summary',
    ko: '음성 브리핑',
  },
  linkVideoGuide: {
    en: 'Video Guide',
    ko: '동영상 가이드',
  },
  linkVoiceTemplates: {
    en: 'Templates',
    ko: '템플릿',
  },

  // Video Tutorial Card
  videoBannerTitle: {
    en: 'How to Use MyDailyPA in 60 Seconds',
    ko: '60초 만에 MyDailyPA 완벽 마스터하기',
  },
  videoBannerDesc: {
    en: 'Watch how to record transactions with voice, track debts, and view reports.',
    ko: '음성으로 장부를 기록하고 외상과 손익을 관리하는 방법을 확인하세요.',
  },
  btnWatchVideo: {
    en: 'Watch Video Guide',
    ko: '가이드 영상 보기',
  },
  btnAddToScreen: {
    en: 'Install App (Home Screen)',
    ko: '홈 화면에 앱 설치',
  },

  // Category and View Tabs
  tabAll: { en: 'All', ko: '전체' },
  tabIncome: { en: 'Income', ko: '수입' },
  tabExpense: { en: 'Expense', ko: '지출' },
  tabReminder: { en: 'Reminders', ko: '알림 및 회의' },
  tabTask: { en: 'Tasks', ko: '작업' },

  // Socio-Economic Filter Bar
  socioEconomicTiersTitle: {
    en: 'Sector Filter',
    ko: '분야별 필터',
  },
  showAllReset: {
    en: 'Reset Filters',
    ko: '필터 초기화',
  },

  // Voice Capture Bar
  listeningStatus: {
    en: 'Listening...',
    ko: '듣고 있습니다...',
  },
  tapToSpeak: {
    en: 'Tap Mic & Speak Naturally',
    ko: '마이크를 탭하고 자연스럽게 말씀하세요',
  },
  exampleVoicePrompt: {
    en: 'e.g. "Sold 15 coffees $30", "Paid electricity bill $45", "Collect $20 from John tomorrow"',
    ko: '예: "원두 판매 5만원", "점심 식대 만원 지출", "내일 김대표 미팅 오전 10시"',
  },
  voiceCommandLabel: {
    en: 'Voice Commands',
    ko: '음성 명령어',
  },
  cmdIncome: { en: '🟢 View Income', ko: '🟢 수입 보기' },
  cmdExpense: { en: '🔴 View Expense', ko: '🔴 지출 보기' },
  cmdMeetings: { en: '📅 View Meetings', ko: '📅 회의 보기' },
  cmdReport: { en: '📢 Listen Report', ko: '📢 보고서 듣기' },
  cmdReadAll: { en: '🔊 Read All', ko: '🔊 모두 읽기' },

  manualInputPlaceholder: {
    en: 'Type transaction or notes here if not using voice...',
    ko: '음성을 사용하지 않을 경우 여기에 거래나 메모를 입력하세요...',
  },
  btnSave: { en: 'Save', ko: '저장' },

  // Feed & Entries List
  recentEntriesTitle: {
    en: 'Recent Voice & Financial Records',
    ko: '최근 음성 및 재무 기록',
  },
  sortNewest: { en: 'Newest ↓', ko: '최신순 ↓' },
  sortOldest: { en: 'Oldest ↑', ko: '오래된순 ↑' },

  cleanSlateTitle: {
    en: 'No Records Yet',
    ko: '아직 기록이 없습니다',
  },
  cleanSlateDesc: {
    en: 'Tap the big microphone button above and speak your first sale or expense!',
    ko: '위의 큰 마이크 버튼을 탭하고 첫 수입이나 지출을 말씀해 보세요!',
  },
  loadSampleData: {
    en: 'Load Sample Records',
    ko: '샘플 데이터 불러오기',
  },

  // Entry Cards
  customerPartnerLabel: {
    en: 'Contact / Person',
    ko: '거래처 / 담당자',
  },
  btnReadAloud: {
    en: 'Read Aloud',
    ko: '소리내어 읽기',
  },
  btnDelete: {
    en: 'Delete',
    ko: '삭제',
  },

  // Search & Filters
  searchPlaceholder: {
    en: 'Search notes, customer, or amount...',
    ko: '메모, 거래처, 금액 검색...',
  },
  quickTagLabel: {
    en: 'Quick Tag',
    ko: '빠른 태그',
  },
  resetBtn: {
    en: 'Reset',
    ko: '초기화',
  },

  // Tiers Labels
  tierMicroBiz: {
    en: 'Small Business & Retail',
    ko: '소상공인 및 매장',
  },
  tierFamilyHouse: {
    en: 'Household & Family',
    ko: '가정 및 가계부',
  },
  tierFarmerSupply: {
    en: 'Agriculture & Farm',
    ko: '농업 및 원자재',
  },
  tierHealthWellness: {
    en: 'Health & Medical',
    ko: '건강 및 복약',
  },

  // Footers
  footerPersonalAi: {
    en: 'MyDailyPA — Voice-First AI Assistant for Everyday Life & MSMEs',
    ko: 'MyDailyPA — 소상공인과 일상을 위한 음성 우선 AI 비서',
  },
  footerVoiceEntry: {
    en: 'Speak naturally to record income, expense, and daily tasks with zero typing.',
    ko: '타이핑 없이 자연스러운 음성으로 수입, 지출 및 할 일을 즉시 기록하세요.',
  },
  privacySiloFooterBadge: {
    en: '🛡️ Your data is stored 100% privately on your device',
    ko: '🛡️ 모든 데이터는 회원님의 기기에 100% 안전하게 비공개로 보관됩니다',
  },
};

export function t(key: string, lang: SupportedLanguage = 'en'): string {
  const dict = TRANSLATIONS[key];
  if (!dict) return key;
  return dict[lang] || dict['en'] || key;
}

export function getSpokenVoiceFeedback(action: string, lang: SupportedLanguage = 'en'): string {
  if (lang === 'ko') {
    switch (action) {
      case 'open_briefing':
        return '일일 요약 브리핑을 엽니다! 활동 보고서를 확인하세요.';
      case 'show_income':
        return '모든 수입 및 매출 내역을 표시합니다.';
      case 'show_expense':
        return '모든 지출 및 결제 내역을 표시합니다.';
      case 'open_msme':
        return '소상공인 및 매장 관리함을 열었습니다.';
      case 'open_family':
        return '가계부 및 가정 관리함을 열었습니다.';
      case 'open_health':
        return '건강 및 복약 관리함을 열었습니다.';
      case 'show_all':
        return '모든 활동 기록을 표시합니다.';
      case 'record_success':
        return '성공적으로 저장되었습니다!';
      default:
        return '완료되었습니다!';
    }
  }

  // English default
  switch (action) {
    case 'open_briefing':
      return 'Opening Daily Briefing report!';
    case 'show_income':
      return 'Showing income and sales records.';
    case 'show_expense':
      return 'Showing expense and spending records.';
    case 'open_msme':
      return 'Opened MSME & Merchant box.';
    case 'open_family':
      return 'Opened Family & Household box.';
    case 'open_health':
      return 'Opened Health & Medical box.';
    case 'show_all':
      return 'Showing all activity records.';
    case 'record_success':
      return 'Recorded successfully!';
    default:
      return 'Done!';
  }
}
