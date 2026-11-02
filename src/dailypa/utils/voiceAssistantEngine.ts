import { Entry, SupportedLanguage, ScheduleConfig, CreditDebtRecord } from '../types';

export const DEFAULT_SCHEDULE: ScheduleConfig = {
  morningTime: '07:00',
  eveningTime: '21:00',
  telegramAlertsEnabled: true,
};

export function getStoredSchedule(): ScheduleConfig {
  if (typeof window === 'undefined') return DEFAULT_SCHEDULE;
  try {
    const raw = localStorage.getItem('dailypa_briefing_schedule');
    if (raw) return { ...DEFAULT_SCHEDULE, ...JSON.parse(raw) };
  } catch (e) {
    console.error('Error reading schedule from localStorage', e);
  }
  return DEFAULT_SCHEDULE;
}

export function saveStoredSchedule(config: ScheduleConfig): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('dailypa_briefing_schedule', JSON.stringify(config));
  } catch (e) {
    console.error('Error saving schedule to localStorage', e);
  }
}

/**
 * Normalizes numbers from Khmer, Myanmar, Thai, or Lao script to western digits
 */
export function normalizeNumerals(text: string): string {
  const khmerDigits = ['០', '១', '២', '៣', '៤', '៥', '៦', '៧', '៨', '៩'];
  const myanmarDigits = ['၀', '၁', '၂', '၃', '၄', '၅', '၆', '၇', '၈', '၉'];
  const thaiDigits = ['๐', '๑', '๒', '๓', '๔', '๕', '๖', '๗', '๘', '๙'];
  const laoDigits = ['໐', '໑', '໒', '໓', '໔', '໕', '໖', '໗', '໘', '໙'];

  let res = text;
  khmerDigits.forEach((d, idx) => { res = res.replaceAll(d, idx.toString()); });
  myanmarDigits.forEach((d, idx) => { res = res.replaceAll(d, idx.toString()); });
  thaiDigits.forEach((d, idx) => { res = res.replaceAll(d, idx.toString()); });
  laoDigits.forEach((d, idx) => { res = res.replaceAll(d, idx.toString()); });
  return res;
}

/**
 * Parses Voice Commands to Customize Reminder & Alarm Times by Voice Alone
 * Works for all 19 supported languages across ASEAN & the globe.
 */
export function parseVoiceReminderScheduleCommand(
  transcript: string,
  currentSchedule: ScheduleConfig,
  lang: SupportedLanguage
): { handled: boolean; updatedSchedule: ScheduleConfig; spokenFeedback: string } | null {
  const normalized = normalizeNumerals(transcript).toLowerCase().trim();

  // 1. Check if user is toggling Telegram / Alert notifications by voice
  const enableAlertsIntent = 
    normalized.includes('បើកតេឡេក្រាម') ||
    normalized.includes('បើក telegram') ||
    normalized.includes('turn on telegram') ||
    normalized.includes('enable telegram') ||
    normalized.includes('bật thông báo') ||
    normalized.includes('เปิดการแจ้งเตือน') ||
    normalized.includes('aktifkan notifikasi') ||
    normalized.includes('bật telegram') ||
    normalized.includes('开启提醒') ||
    normalized.includes('알림 켜기');

  if (enableAlertsIntent) {
    const updated = { ...currentSchedule, telegramAlertsEnabled: true };
    saveStoredSchedule(updated);
    const feedbackMap: Record<string, string> = {
      km: 'បានបើកការផ្ញើសាររំលឹក និងសង្ខេបទៅតេឡេក្រាមដោយជោគជ័យ!',
      en: 'Automated notification and recap alerts enabled successfully!',
      vi: 'Đã bật thông báo nhắc nhở và tổng kết tự động thành công!',
      th: 'เปิดการแจ้งเตือนและสรุปข้อมูลอัตโนมัติเรียบร้อยแล้วค่ะ!',
      id: 'Pemberitahuan pengingat dan ringkasan otomatis berhasil diaktifkan!',
      ms: 'Pemberitahuan peringatan dan ringkasan automatik berjaya diaktifkan!',
      sg: 'Automated notification and recap alerts enabled successfully!',
      bn: 'Pemberitahuan peringatan automatik berjaya diaktifkan!',
      fil: 'Matagumpay na pinagana ang awtomatikong paalala at buod!',
      lo: 'ເປີດການແຈ້ງເຕືອນ ແລະ ສະຫຼຸບອັດຕະໂນມັດສຳເລັດແລ້ວ!',
      my: 'တယ်လီဂရမ် အလိုအလျောက် သတိပေးချက်ကို ဖွင့်လိုက်ပါပြီ။',
      zh: '已成功开启自动通知与每日总结提醒！',
      ko: '자동 알림 및 일일 요약 안내가 활성화되었습니다!',
      fr: 'Les alertes automatiques et récapitulatifs ont été activés avec succès !',
      de: 'Automatische Benachrichtigungen und Tagesberichte wurden aktiviert!',
      es: '¡Alertas automáticas y resúmenes diarios activados con éxito!',
      it: 'Avvisi e riepiloghi automatici attivati con successo!',
      nl: 'Automatische meldingen en dagelijkse samenvattingen succesvol ingeschakeld!',
      pt: 'Alertas automáticos e resumos diários ativados com sucesso!',
    };
    return { handled: true, updatedSchedule: updated, spokenFeedback: feedbackMap[lang] || feedbackMap.en };
  }

  const disableAlertsIntent = 
    normalized.includes('បិទទូរលេខ') ||
    normalized.includes('បិទតេឡេក្រាម') ||
    normalized.includes('បិទ telegram') ||
    normalized.includes('turn off telegram') ||
    normalized.includes('disable telegram') ||
    normalized.includes('tắt thông báo') ||
    normalized.includes('ปิดการแจ้งเตือน') ||
    normalized.includes('nonaktifkan pengingat') ||
    normalized.includes('关闭提醒') ||
    normalized.includes('알림 끄기');

  if (disableAlertsIntent) {
    const updated = { ...currentSchedule, telegramAlertsEnabled: false };
    saveStoredSchedule(updated);
    const feedbackMap: Record<string, string> = {
      km: 'បានបិទការផ្ញើសាររំលឹកជាស្វ័យប្រវត្តរួចរាល់។',
      en: 'Automated reminders have been disabled.',
      vi: 'Đã tắt thông báo nhắc nhở tự động.',
      th: 'ปิดการแจ้งเตือนอัตโนมัติเรียบร้อยแล้วค่ะ',
      id: 'Pengingat otomatis telah dinonaktifkan.',
      ms: 'Peringatan automatik telah dinyahaktifkan.',
      sg: 'Automated reminders have been disabled.',
      bn: 'Peringatan automatik telah ditutup.',
      fil: 'Hindi pinagana ang mga awtomatikong paalala.',
      lo: 'ປິດການແຈ້ງເຕືອນອັດຕະໂນມັດຮຽບຮ້ອຍແລ້ວ.',
      my: 'တယ်လီဂရမ် သတိပေးချက်ကို ပိတ်လိုက်ပါပြီ။',
      zh: '已关闭自动提醒功能。',
      ko: '자동 알림이 해제되었습니다.',
      fr: 'Les rappels automatiques ont été désactivés.',
      de: 'Automatische Erinnerungen wurden deaktiviert.',
      es: 'Los recordatorios automáticos han sido desactivados.',
      it: 'I promemoria automatici sono stati disattivati.',
      nl: 'Automatische herinneringen zijn uitgeschakeld.',
      pt: 'Os lembretes automáticos foram desativados.',
    };
    return { handled: true, updatedSchedule: updated, spokenFeedback: feedbackMap[lang] || feedbackMap.en };
  }

  // 2. Check if this is a reminder scheduling command across ALL 19 languages
  const isReminderIntent = 
    normalized.includes('រំលឹក') ||
    normalized.includes('ម៉ោងរោទ៍') ||
    normalized.includes('កំណត់ម៉ោង') ||
    normalized.includes('remind') ||
    normalized.includes('reminder') ||
    normalized.includes('alarm') ||
    normalized.includes('briefing') ||
    normalized.includes('recap') ||
    normalized.includes('nhắc') ||
    normalized.includes('hẹn giờ') ||
    normalized.includes('báo thức') ||
    normalized.includes('เตือน') ||
    normalized.includes('ตั้งเตือน') ||
    normalized.includes('ingatkan') ||
    normalized.includes('pengingat') ||
    normalized.includes('paalala') ||
    normalized.includes('itakda') ||
    normalized.includes('ເຕືອນ') ||
    normalized.includes('သတိပေး') ||
    normalized.includes('အချိန်သတ်မှတ်') ||
    normalized.includes('提醒') ||
    normalized.includes('闹钟') ||
    normalized.includes('알림') ||
    normalized.includes('알람') ||
    normalized.includes('rappeler') ||
    normalized.includes('rappel') ||
    normalized.includes('erinner') ||
    normalized.includes('wecker') ||
    normalized.includes('recordar') ||
    normalized.includes('recordatorio') ||
    normalized.includes('ricorda') ||
    normalized.includes('promemoria') ||
    normalized.includes('herinner') ||
    normalized.includes('lembrar') ||
    normalized.includes('lembrete');

  if (!isReminderIntent) return null;

  // Detect Morning vs Evening intent
  const isMorning = 
    normalized.includes('ព្រឹក') || 
    normalized.includes('morning') || 
    normalized.includes('am') || 
    normalized.includes('sáng') ||
    normalized.includes('เช้า') ||
    normalized.includes('pagi') ||
    normalized.includes('umaga') ||
    normalized.includes('ເຊົ້າ') ||
    normalized.includes('နံနက်') ||
    normalized.includes('မနက်') ||
    normalized.includes('早上') ||
    normalized.includes('上午') ||
    normalized.includes('아침') ||
    normalized.includes('오전') ||
    normalized.includes('matin') ||
    normalized.includes('morgen') ||
    normalized.includes('früh') ||
    normalized.includes('mañana') ||
    normalized.includes('mattina') ||
    normalized.includes('ochtend') ||
    normalized.includes('manhã');

  const isEvening = 
    normalized.includes('យប់') || 
    normalized.includes('ល្ងាច') || 
    normalized.includes('night') || 
    normalized.includes('evening') || 
    normalized.includes('pm') || 
    normalized.includes('recap') ||
    normalized.includes('ចំណេញ') ||
    normalized.includes('tối') ||
    normalized.includes('chiều') ||
    normalized.includes('เย็น') ||
    normalized.includes('ค่ำ') ||
    normalized.includes('malam') ||
    normalized.includes('gabi') ||
    normalized.includes('ແລງ') ||
    normalized.includes('ຄ່ຳ') ||
    normalized.includes('ည') ||
    normalized.includes('ညနေ') ||
    normalized.includes('晚上') ||
    normalized.includes('下午') ||
    normalized.includes('저녁') ||
    normalized.includes('오후') ||
    normalized.includes('soir') ||
    normalized.includes('nuit') ||
    normalized.includes('abend') ||
    normalized.includes('noche') ||
    normalized.includes('tarde') ||
    normalized.includes('sera') ||
    normalized.includes('notte') ||
    normalized.includes('avond') ||
    normalized.includes('noite');

  // Extract hour & minute
  const timeRegex = /(?:ម៉ោង|at|time|lúc|giờ|jam|pukul|ora|heures?|uhr)?\s*(\d{1,2})(?::(\d{2}))?\s*(ព្រឹក|ល្ងាច|យប់|am|pm|sáng|tối|chiều|เช้า|เย็น|pagi|malam|နာရီ|点|시|h)?/i;
  const match = normalized.match(timeRegex);

  if (!match) return null;

  let hour = parseInt(match[1], 10);
  let minute = match[2] ? parseInt(match[2], 10) : 0;

  if (isNaN(hour) || hour < 0 || hour > 24) return null;

  // Adjust for AM / PM if 12-hour format used
  if (isEvening && hour < 12) {
    hour += 12; // e.g. 9 PM -> 21:00
  } else if (isMorning && hour === 12) {
    hour = 0;
  }

  const formattedTime = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  const isTargetEvening = hour >= 12;

  const updated: ScheduleConfig = isTargetEvening
    ? { ...currentSchedule, eveningTime: formattedTime }
    : { ...currentSchedule, morningTime: formattedTime };

  saveStoredSchedule(updated);

  // Spoken feedback in the user's active language for all 19 languages
  const eveningFeedbackMap: Record<string, string> = {
    km: `បានកំណត់ម៉ោងសង្ខេបប្រាក់ចំណេញពេលល្ងាចនៅម៉ោង ${hour > 12 ? hour - 12 : hour}:${minute.toString().padStart(2, '0')} យប់ (${formattedTime}) រួចរាល់ហើយ! ខ្ញុំនឹងរំលឹកអ្នកដោយស្វ័យប្រវត្តិ។`,
    en: `Evening Profit Recap reminder set to ${formattedTime} successfully! I will alert and speak to you automatically.`,
    vi: `Đã cài đặt giờ nhắc nhở tổng kết lợi nhuận buổi tối lúc ${formattedTime} thành công! Tôi sẽ tự động thông báo và đọc cho bạn.`,
    th: `ตั้งเวลาแจ้งเตือนสรุปกำไรช่วงเย็นเวลา ${formattedTime} เรียบร้อยแล้วค่ะ! ระบบจะสรุปด้วยเสียงอัตโนมัติ`,
    id: `Pengingat ringkasan laba malam berhasil diatur pukul ${formattedTime}! Saya akan mengingatkan Anda secara otomatis.`,
    ms: `Peringatan ringkasan keuntungan malam berjaya ditetapkan pada pukul ${formattedTime}! Saya akan bersuara secara automatik.`,
    sg: `Evening Profit Recap reminder set to ${formattedTime} successfully! I will alert and speak to you automatically.`,
    bn: `Peringatan ringkasan keuntungan malam berjaya ditetapkan pada pukul ${formattedTime}!`,
    fil: `Matagumpay na naitakda ang paalala sa buod ng kita sa gabi sa ganap na ${formattedTime}! Awtomatiko kitang sasabihan.`,
    lo: `ຕັ້ງເວລາສະຫຼຸບກຳໄລຕອນແລງເວລາ ${formattedTime} ຮຽບຮ້ອຍແລ້ວ! ຂ້ອຍຈະເຕືອນທ່ານໂດຍອັດຕະໂນມັດ.`,
    my: `ညနေ ${formattedTime} နာရီတွင် အမြတ်ငွေအကျဉ်းချုပ် သတိပေးချက်ကို သတ်မှတ်ပြီးပါပြီ။ အလိုအလျောက် သတိပေးပါမည်။`,
    zh: `晚上利润总结提醒已成功设定为 ${formattedTime}！届时我将自动通过语音为您播报。`,
    ko: `저녁 순이익 요약 알림이 ${formattedTime}으로 설정되었습니다! 자동으로 음성 안내해 드립니다.`,
    fr: `Rappel du récapitulatif des bénéfices du soir programmé à ${formattedTime} avec succès ! Je vous préviendrai automatiquement.`,
    de: `Erinnerung an den abendlichen Gewinnbericht erfolgreich auf ${formattedTime} Uhr eingestellt! Ich werde Sie automatisch informieren.`,
    es: `¡Recordatorio del resumen de ganancias de la tarde configurado para las ${formattedTime} con éxito! Te avisaré por voz automáticamente.`,
    it: `Promemoria del riepilogo profitti serale impostato alle ${formattedTime} con successo! Ti avviserò automaticamente a voce.`,
    nl: `Herinnering voor het avondwinstoverzicht succesvol ingesteld op ${formattedTime} uur! Ik spreek je automatisch toe.`,
    pt: `Lembrete do resumo de lucros da noite definido para as ${formattedTime} com sucesso! Avisarei você por voz automaticamente.`,
  };

  const morningFeedbackMap: Record<string, string> = {
    km: `បានកំណត់ម៉ោងរបាយការណ៍ពេលព្រឹកនៅម៉ោង ${formattedTime} ព្រឹក រួចរាល់ហើយ!`,
    en: `Morning briefing reminder set to ${formattedTime} successfully!`,
    vi: `Đã cài đặt giờ tóm tắt buổi sáng lúc ${formattedTime} thành công!`,
    th: `ตั้งเวลาแจ้งเตือนภารกิจตอนเช้าเวลา ${formattedTime} เรียบร้อยแล้วค่ะ!`,
    id: `Pengingat arahan pagi berhasil diatur pada pukul ${formattedTime}!`,
    ms: `Peringatan taklimat pagi berjaya ditetapkan pada pukul ${formattedTime}!`,
    sg: `Morning briefing reminder set to ${formattedTime} successfully!`,
    bn: `Peringatan taklimat pagi berjaya ditetapkan pada pukul ${formattedTime}!`,
    fil: `Matagumpay na naitakda ang paalala sa briefing sa umaga sa ganap na ${formattedTime}!`,
    lo: `ຕັ້ງເວລາສະຫຼຸບວຽກຕອນເຊົ້າເວລາ ${formattedTime} ຮຽບຮ້ອຍແລ້ວ!`,
    my: `နံနက် ${formattedTime} နာရီတွင် နံနက်ခင်းအကျဉ်းချုပ် သတိပေးချက်ကို သတ်မှတ်ပြီးပါပြီ။`,
    zh: `早晨工作简报提醒已成功设定为 ${formattedTime}！`,
    ko: `아침 브리핑 알림이 ${formattedTime}으로 설정되었습니다!`,
    fr: `Rappel du briefing du matin programmé à ${formattedTime} avec succès !`,
    de: `Morgendliche Aufgabenübersicht erfolgreich auf ${formattedTime} Uhr eingestellt!`,
    es: `¡Recordatorio del informe matutino configurado para las ${formattedTime} con éxito!`,
    it: `Promemoria del briefing mattutino impostato alle ${formattedTime} con successo!`,
    nl: `Herinnering voor de ochtendbriefing succesvol ingesteld op ${formattedTime} uur!`,
    pt: `Lembrete do briefing matinal definido para as ${formattedTime} com sucesso!`,
  };

  const feedback = isTargetEvening
    ? (eveningFeedbackMap[lang] || eveningFeedbackMap.en)
    : (morningFeedbackMap[lang] || morningFeedbackMap.en);

  return { handled: true, updatedSchedule: updated, spokenFeedback: feedback };
}

/**
 * Answers questions about scheduled reminder times across ALL 19 languages
 */
export function queryScheduledReminderTimes(
  transcript: string,
  schedule: ScheduleConfig,
  lang: SupportedLanguage
): { handled: boolean; spokenResponse: string } | null {
  const lower = transcript.toLowerCase();
  const isQuery = 
    lower.includes('ម៉ោងប៉ុន្មាន') ||
    lower.includes('កំណត់ម៉ោងណា') ||
    lower.includes('what time is my reminder') ||
    lower.includes('when is my recap') ||
    lower.includes('check reminder') ||
    lower.includes('mấy giờ nhắc') ||
    lower.includes('khi nào nhắc') ||
    lower.includes('กี่โมง') ||
    lower.includes('เวลาเตือน') ||
    lower.includes('jam berapa pengingat') ||
    lower.includes('anong oras') ||
    lower.includes('ຈັກໂມງ') ||
    lower.includes('ဘယ်အချိန် သတိပေးမလဲ') ||
    lower.includes('几点提醒') ||
    lower.includes('몇 시에 알림') ||
    lower.includes('quelle heure') ||
    lower.includes('wieviel uhr') ||
    lower.includes('a qué hora') ||
    lower.includes('che ora') ||
    lower.includes('hoe laat') ||
    lower.includes('que horas');

  if (!isQuery) return null;

  const responses: Record<string, string> = {
    km: `ម៉ោងសង្ខេបប្រាក់ចំណេញពេលល្ងាចរបស់អ្នកកំណត់នៅម៉ោង ${schedule.eveningTime} យប់ ហើយរបាយការណ៍ពេលព្រឹកកំណត់នៅម៉ោង ${schedule.morningTime} ព្រឹក។`,
    en: `Your Evening Profit Recap is scheduled for ${schedule.eveningTime}, and your Morning Briefing is set for ${schedule.morningTime}.`,
    vi: `Tổng kết lợi nhuận buổi tối được đặt lúc ${schedule.eveningTime}, và điểm tin buổi sáng lúc ${schedule.morningTime}.`,
    th: `สรุปกำไรช่วงเย็นของคุณตั้งไว้เวลา ${schedule.eveningTime} น. และสรุปภารกิจตอนเช้าตั้งไว้เวลา ${schedule.morningTime} น. ค่ะ`,
    id: `Ringkasan laba malam Anda dijadwalkan pukul ${schedule.eveningTime}, dan arahan pagi pukul ${schedule.morningTime}.`,
    ms: `Ringkasan keuntungan malam dijadualkan pada ${schedule.eveningTime}, dan taklimat pagi pada ${schedule.morningTime}.`,
    sg: `Your Evening Profit Recap is scheduled for ${schedule.eveningTime}, and your Morning Briefing is set for ${schedule.morningTime}.`,
    bn: `Ringkasan keuntungan malam dijadualkan pada ${schedule.eveningTime}, dan taklimat pagi pada ${schedule.morningTime}.`,
    fil: `Ang iyong buod sa kita sa gabi ay nakatakda sa ${schedule.eveningTime}, at ang briefing sa umaga ay ${schedule.morningTime}.`,
    lo: `ການສະຫຼຸບກຳໄລຕອນແລງຂອງທ່ານແມ່ນເວລາ ${schedule.eveningTime}, ແລະ ຕອນເຊົ້າແມ່ນ ${schedule.morningTime}.`,
    my: `ညနေပိုင်း အမြတ်ငွေ အကျဉ်းချုပ်ကို ညနေ ${schedule.eveningTime} နာရီတွင်လည်းကောင်း၊ နံနက်ခင်း အစီရင်ခံစာကို နံနက် ${schedule.morningTime} နာရီတွင် သတ်မှတ်ထားပါသည်။`,
    zh: `您的晚间利润总结定于 ${schedule.eveningTime}，早晨简报定于 ${schedule.morningTime}。`,
    ko: `저녁 순이익 요약은 ${schedule.eveningTime}에, 아침 브리핑은 ${schedule.morningTime}에 설정되어 있습니다.`,
    fr: `Votre récapitulatif des bénéfices du soir est prévu à ${schedule.eveningTime}, et votre briefing du matin à ${schedule.morningTime}.`,
    de: `Ihr abendlicher Gewinnbericht ist für ${schedule.eveningTime} Uhr geplant, und Ihre Morgenübersicht für ${schedule.morningTime} Uhr.`,
    es: `Tu resumen de ganancias de la tarde está programado para las ${schedule.eveningTime}, y el informe matutino para las ${schedule.morningTime}.`,
    it: `Il tuo riepilogo profitti serale è programmato per le ${schedule.eveningTime}, e il briefing mattutino per le ${schedule.morningTime}.`,
    nl: `Je avondwinstoverzicht staat gepland voor ${schedule.eveningTime} uur, en je ochtendbriefing voor ${schedule.morningTime} uur.`,
    pt: `Seu resumo de lucros noturno está agendado para as ${schedule.eveningTime}, e o briefing matinal para as ${schedule.morningTime}.`,
  };

  return { handled: true, spokenResponse: responses[lang] || responses.en };
}

/**
 * Smart Memory & AI Digital Mentor Q&A Engine
 * Helps forgetful users, digital mentors, and entrepreneurs across all 19 languages.
 */
export function handleSmartMemoryAndMentorQuery(
  question: string,
  entries: Entry[],
  debts: CreditDebtRecord[],
  _schedule: ScheduleConfig,
  currencyRate: number,
  lang: SupportedLanguage
): { handled: boolean; spokenAnswer: string } | null {
  const lower = question.toLowerCase().trim();
  const now = new Date();

  // 1. Medicine & Health Intake Check across all languages
  const isMedicineQuery = 
    lower.includes('លេបថ្នាំ') || 
    lower.includes('ថ្នាំ') || 
    lower.includes('medicine') || 
    lower.includes('pill') || 
    lower.includes('uống thuốc') ||
    lower.includes('thuốc') ||
    lower.includes('กินยา') ||
    lower.includes('ทานยา') ||
    lower.includes('minum obat') ||
    lower.includes('obat') ||
    lower.includes('gamot') ||
    lower.includes('ກິນຢາ') ||
    lower.includes('ဆေးသောက်') ||
    lower.includes('ဆေး') ||
    lower.includes('吃药') ||
    lower.includes('약먹') ||
    lower.includes('약') ||
    lower.includes('médicament') ||
    lower.includes('pilule') ||
    lower.includes('medikament') ||
    lower.includes('pastilla') ||
    lower.includes('remédio');

  if (isMedicineQuery) {
    const todayHealth = entries.filter((e) => {
      const d = new Date(e.date);
      const isToday = d.toDateString() === now.toDateString();
      const isHealth = e.category === 'health' || /ថ្នាំ|medicine|pill|thuốc|ยา|obat|gamot|ဆေး|药|약|médicament|pastilla|remédio/i.test(e.titleKhmer + e.titleEnglish);
      return isToday && isHealth;
    });

    if (todayHealth.length > 0) {
      const names = todayHealth.map(e => lang === 'km' ? e.titleKhmer : e.titleEnglish).join(', ');
      const messages: Record<string, string> = {
        km: `ថ្ងៃនេះអ្នកបានកត់ត្រាលេបថ្នាំ៖ «${names}» រួចរាល់ហើយ! សូមកុំភ្លេចលេបថ្នាំពេលល្ងាចមុនចូលគេង ប្រសិនបើមានវេជ្ជបញ្ជាបន្ថែម។`,
        en: `You have recorded taking your medication today: "${names}". Remember to take any evening doses before bedtime if prescribed.`,
        vi: `Hôm nay bạn đã ghi nhận uống thuốc: "${names}". Nhớ uống thuốc buổi tối trước khi ngủ nếu có chỉ định của bác sĩ nhé.`,
        th: `วันนี้คุณบันทึกการทานยาแล้ว: "${names}" อย่าลืมทานยาก่อนนอนตามที่แพทย์สั่งด้วยนะคะ`,
        id: `Hari ini Anda sudah mencatat minum obat: "${names}". Jangan lupa minum obat malam sebelum tidur jika dianjurkan.`,
        ms: `Hari ini anda telah merekodkan makan ubat: "${names}". Jangan lupa ubat malam sebelum tidur jika dipreskripsikan.`,
        sg: `You have recorded taking your medication today: "${names}". Remember your evening doses if prescribed.`,
        bn: `Hari ini anda telah merekodkan makan ubat: "${names}".`,
        fil: `Nai-record mo na ang pag-inom ng gamot ngayon: "${names}". Huwag kalimutang uminom bago matulog kung may reseta.`,
        lo: `ມື້ນີ້ທ່ານໄດ້ບັນທຶກການກິນຢາແລ້ວ: "${names}". ຢ່າລືມກິນຢາຕອນແລງກ່ອນນອນຖ້າມີ.`,
        my: `ဒီနေ့ သင် ဆေးသောက်ထားသည့် မှတ်တမ်းရှိပါသည်- «${names}»။ ညအိပ်ရာမဝင်မီ ညနေခင်းဆေးသောက်ရန်လည်း မမေ့ပါနှင့်။`,
        zh: `今天您已记录按时服药：“${names}”。若有晚间医嘱，请在睡前记得服用。`,
        ko: `오늘 복용하신 약이 기록되어 있습니다: "${names}". 취침 전 복용 약이 있다면 잊지 마세요.`,
        fr: `Vous avez bien enregistré la prise de vos médicaments aujourd'hui : "${names}". N'oubliez pas vos prises du soir avant de dormir.`,
        de: `Sie haben heute die Einnahme Ihrer Medikamente erfasst: "${names}". Bitte denken Sie an Ihre Abenddosis vor dem Schlafen.`,
        es: `Has registrado la toma de tu medicina hoy: "${names}". Recuerda tomar la dosis nocturna antes de dormir si está recetada.`,
        it: `Hai registrato l'assunzione del medicinale oggi: "${names}". Ricordati le dosi serali prima di dormire se prescritte.`,
        nl: `Je hebt vandaag de inname van je medicatie geregistreerd: "${names}". Vergeet je avonddosis voor het slapengaan niet.`,
        pt: `Você registrou a toma dos seus remédios hoje: "${names}". Lembre-se da dose noturna antes de dormir, se receitada.`,
      };
      return { handled: true, spokenAnswer: messages[lang] || messages.en };
    } else {
      const messages: Record<string, string> = {
        km: `ថ្ងៃនេះមិនទាន់មានកំណត់ត្រាថ្នាំនៅឡើយទេ។ ប្រសិនបើអ្នកបានលេបថ្នាំរួច សូមចុចមីក្រូហ្វូនហើយប្រាប់ខ្ញុំថា «បានលេបថ្នាំរួច» ដើម្បីខ្ញុំជួយកត់ទុកកុំឱ្យភ្លេច!`,
        en: `No medication has been logged yet for today. If you took your medicine, simply tap the red mic and say "I took my medicine" so you never forget!`,
        vi: `Chưa có nhật ký uống thuốc hôm nay. Nếu đã uống thuốc, bạn chỉ cần bấm mic và nói "Đã uống thuốc" để tôi lưu lại nhé!`,
        th: `ยังไม่มีบันทึกการทานยาสำหรับวันนี้ค่ะ หากทานแล้ว สามารถกดไมค์และพูดว่า "ทานยาแล้ว" เพื่อบันทึกได้เลยค่ะ`,
        id: `Belum ada catatan minum obat untuk hari ini. Jika sudah minum, cukup tekan tombol mikrofon dan katakan "Sudah minum obat"!`,
        ms: `Belum ada rekod makan ubat hari ini. Jika sudah makan, sila tekan mikrofon dan sebut "Dah makan ubat"!`,
        sg: `No medication logged yet today. Tap the mic and say "I took my medicine" so you won't forget!`,
        bn: `Belum ada rekod ubat hari ini. Tekan mikrofon untuk merakam.`,
        fil: `Wala pang tala ng gamot ngayong araw. Pindutin ang mic at sabihing "Uminom na ako ng gamot"!`,
        lo: `ຍັງບໍ່ມີບັນທຶກການກິນຢາໃນມື້ນີ້. ກົດໄມໂຄຣໂຟນແລ້ວບອກວ່າ "ກິນຢາແລ້ວ" ໄດ້ເລີຍ!`,
        my: `ဒီနေ့အတွက် ဆေးသောက်မှတ်တမ်း မရှိသေးပါ။ ဆေးသောက်ပြီးပါက «ဆေးသောက်ပြီးပြီ» ဟု မိုက်ခရိုဖုန်းဖြင့် ပြောပြနိုင်ပါသည်။`,
        zh: `今天暂未记录服药情况。如果您刚服过药，请轻触红色麦克风告诉我“已吃药”，帮您留存备忘！`,
        ko: `오늘 약 복용 기록이 아직 없습니다. 약을 드셨다면 마이크를 누르고 "약 먹었어"라고 말씀해 주세요!`,
        fr: `Aucun médicament enregistré aujourd'hui. Si vous l'avez pris, appuyez sur le micro et dites "J'ai pris mes médicaments" !`,
        de: `Heute wurde noch keine Medikamenteneinnahme erfasst. Tippen Sie auf das Mikrofon und sagen Sie "Ich habe meine Medizin genommen"!`,
        es: `No hay registro de medicamentos hoy. Si ya los tomaste, toca el micrófono y di "Ya tomé mi medicina".`,
        it: `Nessun medicinale registrato per oggi. Se li hai presi, tocca il microfono e dì "Ho preso la medicina"!`,
        nl: `Vandaag is er nog geen medicatie geregistreerd. Tik op de microfoon en zeg "Ik heb mijn medicijnen ingenomen"!`,
        pt: `Nenhum remédio registrado hoje. Se você já tomou, toque no microfone e diga "Tomei meu remédio"!`,
      };
      return { handled: true, spokenAnswer: messages[lang] || messages.en };
    }
  }

  // 2. Meetings & Training / Mentorship check across all languages
  const isMeetingQuery = 
    lower.includes('ប្រជុំ') || 
    lower.includes('បណ្តុះបណ្តាល') || 
    lower.includes('meeting') || 
    lower.includes('training') || 
    lower.includes('cuộc họp') ||
    lower.includes('đào tạo') ||
    lower.includes('ประชุม') ||
    lower.includes('อบรม') ||
    lower.includes('rapat') ||
    lower.includes('pelatihan') ||
    lower.includes('pulong') ||
    lower.includes('pagsasanay') ||
    lower.includes('ປະຊຸມ') ||
    lower.includes('ຝຶກອົບຮົມ') ||
    lower.includes('အစည်းအဝေး') ||
    lower.includes('သင်တန်း') ||
    lower.includes('会议') ||
    lower.includes('培训') ||
    lower.includes('회의') ||
    lower.includes('교육') ||
    lower.includes('réunion') ||
    lower.includes('formation') ||
    lower.includes('besprechung') ||
    lower.includes('schulung') ||
    lower.includes('reunión') ||
    lower.includes('capacitación') ||
    lower.includes('riunione') ||
    lower.includes('vergadering') ||
    lower.includes('treinamento');

  if (isMeetingQuery) {
    const todayMeetings = entries.filter((e) => {
      const d = new Date(e.date);
      const isToday = d.toDateString() === now.toDateString();
      return isToday && (e.category === 'meeting' || e.category === 'training' || e.type === 'reminder');
    });

    if (todayMeetings.length === 0) {
      const noMeetingMap: Record<string, string> = {
        km: 'ថ្ងៃនេះអ្នកមិនមានការណាត់ជួប ប្រជុំ ឬវគ្គបណ្តុះបណ្តាលដែលត្រូវចូលរួមនៅឡើយទេ។ អ្នកអាចសម្រាក ឬផ្តោតលើការលក់ដូរបានពេញលេញ!',
        en: 'You have no meetings or training sessions scheduled for today. You can focus on business and sales!',
        vi: 'Hôm nay bạn không có lịch họp hay buổi đào tạo nào. Bạn có thể tập trung vào kinh doanh và bán hàng!',
        th: 'วันนี้ไม่มีการประชุมหรืออบรมที่กำหนดไว้ค่ะ สามารถโฟกัสกับการขายของได้อย่างเต็มที่!',
        id: 'Tidak ada jadwal rapat atau pelatihan untuk hari ini. Anda dapat fokus pada penjualan!',
        ms: 'Tiada mesyuarat atau latihan dijadualkan hari ini. Anda boleh fokus kepada jualan!',
        sg: 'You have no meetings or training sessions today. Focus on sales and operations!',
        bn: 'Tiada mesyuarat dijadualkan hari ini.',
        fil: 'Walang nakatakdang pulong o pagsasanay ngayon. Makakapag-focus ka sa negosyo!',
        lo: 'ມື້ນີ້ບໍ່ມີການປະຊຸມ ຫຼື ຝຶກອົບຮົມ. ທ່ານສາມາດສຸມໃສ່ການຂາຍໄດ້ເຕັມທີ່!',
        my: 'ဒီနေ့အတွက် စီစဉ်ထားသော အစည်းအဝေး သို့မဟုတ် သင်တန်း မရှိသေးပါ။',
        zh: '今天没有安排会议或培训课程。您可以全心投入商业运营与销售！',
        ko: '오늘 예정된 회의나 교육이 없습니다. 편안하게 영업과 업무에 집중하세요!',
        fr: 'Aucune réunion ou formation prévue aujourd’hui. Vous pouvez vous concentrer sur vos ventes !',
        de: 'Heute stehen keine Besprechungen oder Schulungen an. Sie können sich auf Ihre Verkäufe konzentrieren!',
        es: 'No tienes reuniones ni capacitaciones programadas para hoy. ¡Puedes enfocarte en tus ventas!',
        it: 'Non hai riunioni o corsi in programma per oggi. Puoi concentrarti sulle tue vendite!',
        nl: 'Je hebt vandaag geen vergaderingen of trainingen gepland. Richt je lekker op de verkoop!',
        pt: 'Você não tem reuniões nem treinamentos agendados para hoje. Pode focar nas suas vendas!',
      };
      return { handled: true, spokenAnswer: noMeetingMap[lang] || noMeetingMap.en };
    }

    const listText = todayMeetings.map((m, idx) => {
      const title = lang === 'km' ? m.titleKhmer : m.titleEnglish;
      const time = m.reminderTime ? ` (${m.reminderTime})` : '';
      return `${idx + 1}. ${title}${time}`;
    }).join('. ');

    const msg = lang === 'km'
      ? `ថ្ងៃនេះអ្នកមានកិច្ចការ និងវគ្គបណ្តុះបណ្តាលចំនួន ${todayMeetings.length}៖ ${listText}`
      : `Today you have ${todayMeetings.length} sessions and meetings: ${listText}`;
    return { handled: true, spokenAnswer: msg };
  }

  // 3. Tomorrow's Agenda / Activities across all languages
  const isTomorrowQuery = 
    lower.includes('ស្អែក') || 
    lower.includes('tomorrow') || 
    lower.includes('ngày mai') ||
    lower.includes('พรุ่งนี้') ||
    lower.includes('besok') ||
    lower.includes('esok') ||
    lower.includes('bukas') ||
    lower.includes('ມື້ອື່ນ') ||
    lower.includes('မနက်ဖြန်') || 
    lower.includes('明天') ||
    lower.includes('내일') ||
    lower.includes('demain') ||
    lower.includes('morgen') ||
    lower.includes('mañana') ||
    lower.includes('domani') ||
    lower.includes('amanhã');

  if (isTomorrowQuery) {
    const pending = entries.filter(e => !e.isCompleted && (e.type === 'reminder' || e.type === 'task'));
    if (pending.length === 0) {
      const noPendingMap: Record<string, string> = {
        km: 'ស្អែកនេះ អ្នកមិនទាន់មានកិច្ចការបន្ទាន់ដែលត្រូវដោះស្រាយនៅឡើយទេ។ សូមគេងលក់ដោយស្កប់ស្កល់!',
        en: 'You have no pending urgent tasks scheduled for tomorrow. Have a peaceful, restful night!',
        vi: 'Ngày mai bạn không có công việc khẩn cấp nào cần giải quyết. Chúc bạn có một giấc ngủ ngon!',
        th: 'พรุ่งนี้ไม่มีภารกิจเร่งด่วนที่ต้องทำค่ะ พักผ่อนให้สบายในคืนนี้นะคะ!',
        id: 'Tidak ada tugas mendesak untuk besok. Selamat beristirahat dengan nyenyak malam ini!',
        ms: 'Tiada tugasan mendesak untuk esok. Selamat berehat malam ini!',
        sg: 'No pending urgent tasks for tomorrow. Have a good rest tonight!',
        bn: 'Tiada tugasan mendesak untuk esok. Selamat berehat!',
        fil: 'Walang agarang gawain para bukas. Magpahinga nang mabuti ngayong gabi!',
        lo: 'ມື້ອື່ນທ່ານບໍ່ມີວຽກດ່ວນທີ່ຕ້ອງແກ້ໄຂ. ຂໍໃຫ້ນອນຫຼັບສະບາຍ!',
        my: 'မနက်ဖြန်အတွက် အရေးပေါ်လုပ်ငန်း မရှိသေးပါ။ အေးချမ်းစွာ အနားယူနိုင်ပါသည်။',
        zh: '明天暂无待办紧急事务。今晚请安心休息，祝您好梦！',
        ko: '내일 예정된 긴급한 일정이 없습니다. 편안한 밤 보내세요!',
        fr: 'Aucune tâche urgente prévue pour demain. Passez une excellente nuit réparatrice !',
        de: 'Für morgen stehen keine dringenden Aufgaben an. Eine erholsame Nacht gewünscht!',
        es: 'No tienes tareas urgentes pendientes para mañana. ¡Que descanses plácidamente esta noche!',
        it: 'Nessun compito urgente per domani. Ti auguro una notte tranquilla e serena!',
        nl: 'Je hebt geen dringende taken voor morgen. Slaap lekker vanavond!',
        pt: 'Nenhuma tarefa urgente pendente para amanhã. Tenha uma noite tranquila de descanso!',
      };
      return { handled: true, spokenAnswer: noPendingMap[lang] || noPendingMap.en };
    }
    const sample = pending.slice(0, 3).map(e => lang === 'km' ? e.titleKhmer : e.titleEnglish).join('; ');
    const msg = lang === 'km'
      ? `សម្រាប់ស្អែកនេះ អ្នកមានកិច្ចការដែលត្រូវធ្វើបន្តចំនួន ${pending.length} រួមមាន៖ ${sample}។`
      : `For tomorrow, you have ${pending.length} pending items: ${sample}.`;
    return { handled: true, spokenAnswer: msg };
  }

  // 4. Customer Debts across all languages
  const isDebtQuery = 
    lower.includes('ជំពាក់') || 
    lower.includes('who owes') || 
    lower.includes('customer credit') || 
    lower.includes('ai nợ') ||
    lower.includes('tiền nợ') ||
    lower.includes('ใครติดหนี้') ||
    lower.includes('ลูกหนี้') ||
    lower.includes('siapa yang berhutang') ||
    lower.includes('piutang') ||
    lower.includes('hutang') ||
    lower.includes('sinong may utang') ||
    lower.includes('ໃຜຕິດໜີ້') ||
    lower.includes('ကြွေးကျန်') ||
    lower.includes('谁欠钱') ||
    lower.includes('외상') ||
    lower.includes('qui me doit') ||
    lower.includes('wer schuldet') ||
    lower.includes('quién me debe') ||
    lower.includes('chi mi deve') ||
    lower.includes('wie heeft schuld') ||
    lower.includes('quem me deve');

  if (isDebtQuery) {
    const customerDebts = debts.filter(d => d.debtType === 'customer_owes_me' && d.status !== 'paid');
    if (customerDebts.length === 0) {
      const zeroDebtMap: Record<string, string> = {
        km: 'អបអរសាទរ! បច្ចុប្បន្នគ្មានអតិថិជនណាជំពាក់លុយអ្នកឡើយ។ ការគ្រប់គ្រងសាច់ប្រាក់របស់អ្នកពិតជាល្អប្រសើរ!',
        en: 'Great news! No customers currently owe you money. Your cash collection is on track!',
        vi: 'Tin tuyệt vời! Hiện không có khách hàng nào nợ tiền bạn. Dòng tiền của bạn rất tốt!',
        th: 'ข่าวดีค่ะ! ตอนนี้ไม่มีลูกหนี้ค้างชำระ การบริหารกระแสเงินสดของคุณยอดเยี่ยมมากค่ะ!',
        id: 'Kabar baik! Saat ini tidak ada pelanggan yang berhutang. Manajemen kas Anda sangat baik!',
        ms: 'Berita baik! Tiada pelanggan yang berhutang pada masa ini.',
        sg: 'Great news! Zero outstanding customer debt. Good cashflow management!',
        bn: 'Berita baik! Tiada pelanggan yang berhutang pada masa ini.',
        fil: 'Magandang balita! Walang kostumer na may utang sa iyo ngayon!',
        lo: 'ຂ່າວດີ! ປະຈຸບັນບໍ່ມີລູກຄ້າຕິດໜີ້ທ່ານເລີຍ. ການເງິນຂອງທ່ານດີຫຼາຍ!',
        my: 'ဂုဏ်ယူပါသည်၊ သင့်ထံတွင် အကြွေးကျန်နေသော ဖောက်သည် မရှိပါ။',
        zh: '太棒了！目前没有任何客户拖欠款项，您的现金流状况非常稳健！',
        ko: '좋은 소식입니다! 현재 미수금이나 외상 고객이 없습니다. 현금 흐름이 매우 양호합니다!',
        fr: 'Excellente nouvelle ! Aucun client ne vous doit de l’argent actuellement.',
        de: 'Tolle Neuigkeiten! Zurzeit schuldet Ihnen kein Kunde Geld. Ihr Cashflow ist stabil!',
        es: '¡Buenas noticias! Ningún cliente te debe dinero actualmente. ¡Tu flujo de caja está impecable!',
        it: 'Ottima notizia! Nessun cliente ti deve denaro al momento. Flusso di cassa ottimale!',
        nl: 'Goed nieuws! Geen enkele klant heeft momenteel een openstaande schuld bij jou!',
        pt: 'Ótima notícia! Nenhum cliente lhe deve dinheiro no momento. Seu fluxo de caixa está ótimo!',
      };
      return { handled: true, spokenAnswer: zeroDebtMap[lang] || zeroDebtMap.en };
    }
    const totalOwed = customerDebts.reduce((sum, d) => sum + d.remainingAmount, 0);
    const names = customerDebts.slice(0, 3).map(d => `${d.contactName} ($${d.remainingAmount})`).join(', ');
    const msg = lang === 'km'
      ? `មានអតិថិជនចំនួន ${customerDebts.length} នាក់កំពុងជំពាក់លុយសរុប $${totalOwed.toFixed(2)} រួមមាន៖ ${names}។`
      : `${customerDebts.length} customers owe a total of $${totalOwed.toFixed(2)}: ${names}.`;
    return { handled: true, spokenAnswer: msg };
  }

  // 5. MSME Guidance: Profit Calculation across all languages
  const isProfitCalcQuery = 
    lower.includes('គិតប្រាក់ចំណេញ') || 
    lower.includes('calculate profit') || 
    lower.includes('tính lợi nhuận') ||
    lower.includes('คิดกำไร') ||
    lower.includes('hitung laba') ||
    lower.includes('kwentahin ang kita') ||
    lower.includes('ໄລ່ກຳໄລ') ||
    lower.includes('တွက်ချက်နည်း') ||
    lower.includes('算利润') ||
    lower.includes('순이익 계산') ||
    lower.includes('calculer bénéfice') ||
    lower.includes('gewinn berechnen') ||
    lower.includes('calcular ganancia') ||
    lower.includes('calcolare profitto') ||
    lower.includes('winst berekenen') ||
    lower.includes('calcular lucro');

  if (isProfitCalcQuery) {
    const profitExplanationMap: Record<string, string> = {
      km: 'រូបមន្តគិតប្រាក់ចំណេញសុទ្ធ គឺយក ចំណូលសរុប ដក ចំណាយសរុប។ បើចំណូលច្រើនជាងចំណាយ នោះជាប្រាក់ចំណេញ។ MyDailyPA នឹងជួយគណនា និងអានប្រាប់អ្នករៀងរាល់ល្ងាចដោយស្វ័យប្រវត្តិ!',
      en: 'Net Profit is simply Total Sales minus Total Expenses. When sales exceed costs, you are profitable. MyDailyPA calculates and speaks this for you every evening!',
      vi: 'Lợi nhuận ròng = Tổng doanh thu bán hàng trừ đi Tổng chi phí. MyDailyPA sẽ tự động tính và đọc cho bạn nghe mỗi tối!',
      th: 'กำไรสุทธิคำนวณง่ายๆ คือ ยอดขายทั้งหมดลบด้วยค่าใช้จ่ายทั้งหมดค่ะ MyDailyPA จะคำนวณและสรุปเป็นเสียงให้คุณฟังทุกเย็นค่ะ!',
      id: 'Laba Bersih adalah Total Penjualan dikurangi Total Pengeluaran. MyDailyPA akan menghitung dan menyuarakannya setiap sore!',
      ms: 'Keuntungan Bersih adalah Jumlah Jualan tolak Jumlah Perbelanjaan. MyDailyPA mengira dan membacanya untuk anda setiap petang!',
      sg: 'Net Profit is Total Sales minus Total Expenses. MyDailyPA calculates and speaks this daily!',
      bn: 'Keuntungan Bersih = Jumlah Jualan - Jumlah Perbelanjaan.',
      fil: 'Ang Netong Kita ay Kabuuang Benta bawas ang Kabuuang Gastos. Awtomatiko itong binibilang ng MyDailyPA tuwing gabi!',
      lo: 'ກຳໄລສຸດທິ = ລາຍຮັບທັງໝົດ ລົບ ລາຍຈ່າຍທັງໝົດ. MyDailyPA ຈະຄິດໄລ່ ແລະ ອ່ານໃຫ້ຟັງທຸກແລງ!',
      my: 'အသားတင်အမြတ်ငွေ = စုစုပေါင်းရောင်းရငွေ - စုစုပေါင်းကုန်ကျစရိတ်။ MyDailyPA သည် ညနေတိုင်း သင့်အတွက် အလိုအလျောက် တွက်ချက်ပေးပါမည်။',
      zh: '净利润公式非常简单：总销售收入减去总经营成本。MyDailyPA 每天傍晚都会自动帮您核算并通过语音播报！',
      ko: '순이익 공식은 총 매출에서 총 지출을 뺀 금액입니다. MyDailyPA가 매일 저녁 자동으로 계산하여 음성으로 알려드립니다!',
      fr: 'Le bénéfice net correspond simplement au total des ventes moins le total des dépenses. MyDailyPA le calcule et vous l’énonce chaque soir !',
      de: 'Der Reingewinn ist die Gesamteinnahme abzüglich der Gesamtausgaben. MyDailyPA berechnet und spricht dies jeden Abend für Sie!',
      es: 'El beneficio neto es simplemente las Ventas Totales menos los Gastos Totales. ¡MyDailyPA lo calcula y te lo lee cada tarde!',
      it: 'Il profitto netto è dato dal totale vendite meno il totale uscite. MyDailyPA lo calcola e te lo legge a voce ogni sera!',
      nl: 'Nettowinst is eenvoudigweg Totale Verkopen min Totale Uitgaven. MyDailyPA berekent en spreekt dit elke avond voor je uit!',
      pt: 'O lucro líquido é simplesmente o total de vendas menos as despesas totais. O MyDailyPA calcula e narra isso todas as noites!',
    };
    return { handled: true, spokenAnswer: profitExplanationMap[lang] || profitExplanationMap.en };
  }

  // 6. Cashflow Management Rules across all languages
  const isCashQuery = 
    lower.includes('គ្រប់គ្រងលុយ') || 
    lower.includes('manage cash') || 
    lower.includes('quản lý tiền') ||
    lower.includes('จัดการเงิน') ||
    lower.includes('kelola uang') ||
    lower.includes('pamamahala ng pera') ||
    lower.includes('ຄຸ້ມຄອງເງິນ') ||
    lower.includes('ငွေကြေးစီမံခန့်ခွဲမှု') ||
    lower.includes('管理现金') ||
    lower.includes('돈 관리') ||
    lower.includes('gérer argent') ||
    lower.includes('geld verwalten') ||
    lower.includes('gestionar dinero') ||
    lower.includes('gestire soldi') ||
    lower.includes('geld beheren') ||
    lower.includes('gerenciar dinheiro');

  if (isCashQuery) {
    const cashRulesMap: Record<string, string> = {
      km: 'គន្លឹះសំខាន់ ៣ សម្រាប់អាជីវកម្ម MSME៖ ទី១ កត់ត្រារាល់ពេលលក់ និងទិញដោយសំឡេងភ្លាមៗ។ ទី២ កត់ត្រាអតិថិជនជំពាក់ឱ្យច្បាស់។ ទី៣ ស្តាប់សង្ខេបប្រាក់ចំណេញពេលល្ងាចរាល់ថ្ងៃដើម្បីដឹងពីសុខភាពហិរញ្ញវត្ថុ។',
      en: '3 Top tips for MSMEs: 1. Record every sale and expense by voice immediately. 2. Track customer credits carefully. 3. Listen to your Evening Profit Recap daily to protect your cashflow.',
      vi: '3 lời khuyên vàng cho hộ kinh doanh: 1. Ghi âm bằng giọng nói ngay khi bán hoặc mua hàng. 2. Ghi rõ sổ nợ khách hàng. 3. Nghe tổng kết lợi nhuận mỗi tối.',
      th: '3 เคล็ดลับสำคัญสำหรับ MSME: 1. บันทึกทุกยอดขายและค่าใช้จ่ายด้วยเสียงทันที 2. จดบัญชีหนี้ให้ชัดเจน 3. ฟังเสียงสรุปกำไรทุกเย็นเพื่อรักษาเงินทุนหมุนเวียนค่ะ',
      id: '3 Tips utama bagi UMKM: 1. Catat setiap penjualan dan pengeluaran lewat suara seketika. 2. Catat piutang pelanggan dengan teliti. 3. Dengarkan rekap laba setiap sore.',
      ms: '3 Petua utama untuk PKS: 1. Rakam setiap jualan dan belanja dengan suara serta-merta. 2. Pantau hutang pelanggan. 3. Dengar ringkasan keuntungan setiap petang.',
      sg: 'Top 3 MSME habits: 1. Record sales instantly by voice. 2. Track customer credits. 3. Review evening profit daily.',
      bn: '3 Petua utama PKS: Catat jualan & belanja serta-merta dengan suara.',
      fil: '3 Mahalagang tips sa negosyo: 1. Itala ang benta at gastos sa boses agad. 2. Ilista ang pautang. 3. Pakinggan ang buod ng kita gabi-gabi.',
      lo: '3 ເຄັດລັບສຳຄັນ: 1. ບັນທຶກທຸກຍອດຂາຍ ແລະ ລາຍຈ່າຍດ້ວຍສຽງທັນທີ. 2. ຈົດບັນຊີໜີ້ໃຫ້ຊັດເຈນ. 3. ຟັງສະຫຼຸບກຳໄລທຸກແລງ.',
      my: 'MSME စီးပွားရေး အကြံပြုချက်- ၁။ အရောင်းအဝယ်တိုင်းကို ချက်ချင်း အသံဖြင့် မှတ်ပါ။ ၂။ အကြွေးစာရင်းကို သေချာမှတ်ပါ။ ၃။ ညနေတိုင်း အမြတ်ငွေ အကျဉ်းချုပ်ကို နားထောင်ပါ။',
      zh: '小微企业三大黄金法则：第一，用语音随手记录每笔收支；第二，清晰跟踪客户赊账；第三，每晚收听利润语音播报，守护现金流健康。',
      ko: '소상공인 성공 3원칙: 1. 모든 매출과 지출을 음성으로 즉시 기록하세요. 2. 외상 내역을 철저히 관리하세요. 3. 매일 저녁 순이익 음성 요약을 청취하세요.',
      fr: '3 conseils clés pour les PME : 1. Enregistrez chaque vente et dépense à la voix. 2. Suivez précisément les crédits clients. 3. Écoutez votre récapitulatif chaque soir.',
      de: '3 Top-Tipps für Kleinunternehmen: 1. Jeden Verkauf und jede Ausgabe sofort per Sprache erfassen. 2. Kundenschulden dokumentieren. 3. Den abendlichen Gewinnbericht hören.',
      es: '3 Reglas de oro para negocios: 1. Registra ventas y gastos por voz al instante. 2. Lleva el control de deudores. 3. Escucha tu resumen de ganancias cada noche.',
      it: '3 Consigli chiave per le PMI: 1. Registra entrate e uscite con la voce subito. 2. Tieni traccia dei crediti. 3. Ascolta il riepilogo serale per tutelare la cassa.',
      nl: '3 Belangrijke tips voor mkb: 1. Registreer verkoop en uitgaven direct met je stem. 2. Houd klantenschulden bij. 3. Luister elke avond naar je winstoverzicht.',
      pt: '3 Dicas de ouro para microempresas: 1. Registre vendas e gastos por voz imediatamente. 2. Controle fiados e dívidas. 3. Ouça seu resumo de lucros toda noite.',
    };
    return { handled: true, spokenAnswer: cashRulesMap[lang] || cashRulesMap.en };
  }

  // 7. Digital Mentorship concept across all languages
  const isMentorConceptQuery = 
    lower.includes('digital mentor') || 
    lower.includes('គ្រូឧទ្ទេស') || 
    lower.includes('mentor') ||
    lower.includes('cố vấn') ||
    lower.includes('ที่ปรึกษา') ||
    lower.includes('pembimbing') ||
    lower.includes('tagapayo') ||
    lower.includes('အကြံပေး') ||
    lower.includes('导师') ||
    lower.includes('멘토');

  if (isMentorConceptQuery) {
    const mentorMap: Record<string, string> = {
      km: 'គ្រូឧទ្ទេសឌីជីថល (Digital Mentor) ជួយបណ្តុះបណ្តាលអាជីវកម្មខ្នាតតូចឱ្យចេះប្រើប្រាស់បច្ចេកវិទ្យាសំឡេង AI ដើម្បីរីកចម្រើនដោយមិនចាំបាច់ចេះអក្សរស្ទាត់ជំនាញឡើយ។',
      en: 'A Digital Mentor empowers local entrepreneurs and business owners to adopt voice AI, record transactions effortlessly, track health, and thrive without literacy barriers.',
      vi: 'Cố vấn kỹ thuật số (Digital Mentor) giúp các hộ kinh doanh ứng dụng trợ lý giọng nói AI để ghi chép dễ dàng mà không bị rào cản về đọc viết.',
      th: 'ที่ปรึกษาดิจิทัล (Digital Mentor) ช่วยฝึกอบรมผู้ประกอบการรายย่อยให้ใช้เทคโนโลยีเสียง AI บันทึกบัญชีและสุขภาพได้ง่ายๆ โดยไม่มีอุปสรรคเรื่องการพิมพ์หรืออ่านเขียนค่ะ',
      id: 'Digital Mentor memberdayakan pelaku usaha mikro menggunakan AI suara untuk mencatat keuangan tanpa kendala literasi.',
      ms: 'Mentor Digital memperkasa usahawan mikro menggunakan AI suara untuk memudahkan perakaunan harian.',
      sg: 'A Digital Mentor empowers small businesses to leverage voice AI with zero typing hurdles.',
      bn: 'Mentor Digital memperkasa usahawan mikro menggunakan AI suara.',
      fil: 'Ang Digital Mentor ay gumagabay sa mga may-ari ng negosyo na gumamit ng voice AI nang walang hadlang sa pagbabasa at pagsusulat.',
      lo: 'ທີ່ປຶກສາດິຈິຕອນຊ່ວຍສອນທຸລະກິດຂະໜາດນ້ອຍໃຫ້ໃຊ້ສຽງ AI ເພື່ອບັນທຶກບັນຊີໂດຍບໍ່ມີອຸປະສັກເລື່ອງການຂຽນ.',
      my: 'ဒစ်ဂျစ်တယ် လမ်းညွှန်ဆရာ (Digital Mentor) များသည် အသေးစားလုပ်ငန်းရှင်များအတွက် AI အသံနည်းပညာဖြင့် လုပ်ငန်းတိုးတက်အောင် ကူညီပေးပါသည်။',
      zh: '数字导师（Digital Mentor）致力于帮助广大小微商户拥抱语音 AI，无须打字或复杂文字门槛即可轻松记账、管理健康与发展事业。',
      ko: '디지털 멘토는 소상공인들이 문자 입력 장벽 없이 음성 AI를 통해 손쉽게 장부를 적고 건강을 챙기며 성장하도록 지원합니다.',
      fr: 'Un mentor numérique aide les entrepreneurs à utiliser l’IA vocale pour gérer leur comptabilité et leur quotidien sans barrière de lecture ou d’écriture.',
      de: 'Ein digitaler Mentor unterstützt Kleinunternehmer dabei, Sprach-KI zu nutzen, um Finanzen und Termine barrierefrei zu verwalten.',
      es: 'Un mentor digital capacita a emprendedores para usar IA de voz, facilitando la gestión de su negocio y salud sin barreras de escritura.',
      it: 'Un mentore digitale aiuta i piccoli imprenditori a sfruttare l’IA vocale per gestire contabilità e salute senza barriere di alfabetizzazione.',
      nl: 'Een digitale mentor helpt ondernemers om spraak-AI te benutten voor eenvoudige administratie zonder lees- of schrijfdrempels.',
      pt: 'Um mentor digital capacita empreendedores a usarem IA por voz para gerenciar finanças e saúde sem barreiras de alfabetização.',
    };
    return { handled: true, spokenAnswer: mentorMap[lang] || mentorMap.en };
  }

  return null;
}

/**
 * Generates the Complete Evening Voice Profit Recap
 * Synthesizes Financials, Medicine status, Meetings/Trainings, and Tomorrow's preview.
 * Fully localized for ALL 19 languages.
 */
export function generateComprehensiveEveningRecap(
  entries: Entry[],
  debts: CreditDebtRecord[],
  currencyRate: number,
  lang: SupportedLanguage
): {
  incomeUsd: number;
  expenseUsd: number;
  netProfitUsd: number;
  debtOwedUsd: number;
  medicineStatus: { taken: boolean; items: string[] };
  meetingsToday: string[];
  trainingsToday: string[];
  tomorrowPreview: string[];
  spokenRecap: string;
} {
  const now = new Date();
  let incomeUsd = 0;
  let expenseUsd = 0;
  let debtOwedUsd = 0;
  const medicineItems: string[] = [];
  const meetingsToday: string[] = [];
  const trainingsToday: string[] = [];
  const tomorrowPreview: string[] = [];

  entries.forEach((e) => {
    const d = new Date(e.date);
    const isToday = d.toDateString() === now.toDateString();
    const title = lang === 'km' ? e.titleKhmer : e.titleEnglish;

    if (isToday) {
      const amt = e.amount || 0;
      const val = e.currency === 'KHR' ? amt / currencyRate : amt;
      if (e.type === 'income') incomeUsd += val;
      if (e.type === 'expense') expenseUsd += val;

      if (e.category === 'health' || /ថ្នាំ|medicine|pill|thuốc|ยา|obat|gamot|ဆေး|药|약|médicament|pastilla|remédio/i.test(title)) {
        medicineItems.push(title);
      }
      if (e.category === 'meeting') {
        meetingsToday.push(title);
      }
      if (e.category === 'training' || /បណ្តុះបណ្តាល|training|mentor|သင်တန်း|đào tạo|อบรม|pelatihan|培训|교육/i.test(title)) {
        trainingsToday.push(title);
      }
    }

    if (!e.isCompleted && (e.type === 'reminder' || e.type === 'task')) {
      tomorrowPreview.push(title);
    }
  });

  // Calculate debts owed
  debts.forEach((d) => {
    if (d.debtType === 'customer_owes_me' && d.status !== 'paid') {
      const val = d.currency === 'KHR' ? d.remainingAmount / currencyRate : d.remainingAmount;
      debtOwedUsd += val;
    }
  });

  const netProfitUsd = incomeUsd - expenseUsd;
  const isProfitable = netProfitUsd >= 0;
  const localSecondary = Math.round(Math.abs(netProfitUsd) * currencyRate).toLocaleString();

  let spokenRecap = '';

  if (lang === 'km') {
    let text = `សួស្តី! នេះជាសង្ខេបប្រាក់ចំណេញ និងកិច្ចការពេលល្ងាចរបស់អ្នក៖ `;
    if (incomeUsd === 0 && expenseUsd === 0) {
      text += `ថ្ងៃនេះមិនទាន់មានកត់ត្រាចំណូល ឬចំណាយឡើយ។ `;
    } else {
      text += `ថ្ងៃនេះអ្នកលក់បានចំណូលសរុប $${incomeUsd.toFixed(2)}។ ចំណាយអស់ $${expenseUsd.toFixed(2)}។ `;
      text += isProfitable
        ? `ប្រាក់ចំណេញសុទ្ធគឺបូក $${netProfitUsd.toFixed(2)} (${localSecondary} ៛)! ពិតជាថ្ងៃជោគជ័យ។ `
        : `ថ្ងៃនេះចំណាយលើសចំណូល $${Math.abs(netProfitUsd).toFixed(2)}។ `;
    }
    if (debtOwedUsd > 0) text += `អតិថិជនជំពាក់លុយសរុបមាន $${debtOwedUsd.toFixed(2)}។ `;
    if (medicineItems.length > 0) {
      text += `ផ្នែកសុខភាព៖ អ្នកបានកត់ត្រាលេបថ្នាំ «${medicineItems[0]}» រួចរាល់។ `;
    } else {
      text += `ផ្នែកសុខភាព៖ សូមកុំភ្លេចលេបថ្នាំមុនចូលគេង ប្រសិនបើអ្នកមានថ្នាំត្រូវលេបពេលល្ងាច។ `;
    }
    if (trainingsToday.length > 0) text += `ផ្នែកបណ្តុះបណ្តាល៖ ថ្ងៃនេះបានចូលរួម «${trainingsToday[0]}»។ `;
    if (meetingsToday.length > 0) text += `ការណាត់ជួប៖ ថ្ងៃនេះមានការប្រជុំ «${meetingsToday[0]}»។ `;
    if (tomorrowPreview.length > 0) text += `សម្រាប់ស្អែកនេះ អ្នកមានកិច្ចការបន្តចំនួន ${tomorrowPreview.length}។ `;
    text += `សូមសម្រាកពេលរាត្រីដោយសេចក្តីសុខ និងគេងលក់ស្រួល!`;
    spokenRecap = text;

  } else if (lang === 'vi') {
    let text = `Chào bạn! Đây là tổng kết lợi nhuận và công việc buổi tối của bạn: `;
    if (incomeUsd === 0 && expenseUsd === 0) {
      text += `Hôm nay chưa có ghi nhận doanh thu hoặc chi phí. `;
    } else {
      text += `Doanh thu hôm nay là $${incomeUsd.toFixed(2)}, chi phí là $${expenseUsd.toFixed(2)}. `;
      text += isProfitable
        ? `Lợi nhuận ròng hôm nay là dương $${netProfitUsd.toFixed(2)}! Rất tuyệt vời. `
        : `Hôm nay chi phí vượt doanh thu $${Math.abs(netProfitUsd).toFixed(2)}. `;
    }
    if (debtOwedUsd > 0) text += `Khách hàng đang nợ $${debtOwedUsd.toFixed(2)}. `;
    if (medicineItems.length > 0) {
      text += `Sức khỏe: Bạn đã ghi nhận uống "${medicineItems[0]}". `;
    } else {
      text += `Sức khỏe: Nhớ uống thuốc buổi tối trước khi đi ngủ nhé. `;
    }
    if (tomorrowPreview.length > 0) text += `Ngày mai bạn có ${tomorrowPreview.length} việc cần làm tiếp theo. `;
    text += `Chúc bạn một buổi tối thư thái và ngủ ngon!`;
    spokenRecap = text;

  } else if (lang === 'th') {
    let text = `สวัสดีตอนเย็นค่ะ! นี่คือสรุปกำไรและภารกิจประจำวันของคุณ: `;
    if (incomeUsd === 0 && expenseUsd === 0) {
      text += `วันนี้ยังไม่มีรายการบันทึกยอดขายหรือค่าใช้จ่ายค่ะ `;
    } else {
      text += `ยอดขายวันนี้ $${incomeUsd.toFixed(2)} ค่าใช้จ่าย $${expenseUsd.toFixed(2)} `;
      text += isProfitable
        ? `กำไรสุทธิวันนี้คือบวก $${netProfitUsd.toFixed(2)}! ยอดเยี่ยมมากค่ะ `
        : `วันนี้ค่าใช้จ่ายเกินยอดขาย $${Math.abs(netProfitUsd).toFixed(2)} ค่ะ `;
    }
    if (debtOwedUsd > 0) text += `มียอดลูกหนี้ค้างชำระ $${debtOwedUsd.toFixed(2)} `;
    if (medicineItems.length > 0) {
      text += `ด้านสุขภาพ: คุณบันทึกการทานยา "${medicineItems[0]}" เรียบร้อยแล้วค่ะ `;
    } else {
      text += `ด้านสุขภาพ: อย่าลืมทานยาก่อนนอนนะคะถ้ามี `;
    }
    if (tomorrowPreview.length > 0) text += `พรุ่งนี้คุณมีสิ่งที่ต้องทำต่อ ${tomorrowPreview.length} รายการค่ะ `;
    text += `ขอให้ค่ำคืนนี้พักผ่อนอย่างมีความสุขและหลับสบายนะคะ!`;
    spokenRecap = text;

  } else if (lang === 'id' || lang === 'ms' || lang === 'bn') {
    let text = `Selamat malam! Ini adalah ringkasan keuntungan dan agenda harian Anda: `;
    if (incomeUsd === 0 && expenseUsd === 0) {
      text += `Belum ada catatan penjualan atau pengeluaran hari ini. `;
    } else {
      text += `Penjualan hari ini $${incomeUsd.toFixed(2)}, pengeluaran $${expenseUsd.toFixed(2)}. `;
      text += isProfitable
        ? `Laba bersih hari ini plus $${netProfitUsd.toFixed(2)}! Kerja bagus. `
        : `Pengeluaran melebihi penjualan sebesar $${Math.abs(netProfitUsd).toFixed(2)}. `;
    }
    if (debtOwedUsd > 0) text += `Piutang pelanggan saat ini $${debtOwedUsd.toFixed(2)}. `;
    if (medicineItems.length > 0) {
      text += `Kesehatan: Anda telah mencatat minum "${medicineItems[0]}". `;
    } else {
      text += `Kesehatan: Jangan lupa minum obat malam sebelum tidur. `;
    }
    if (tomorrowPreview.length > 0) text += `Untuk besok, Anda memiliki ${tomorrowPreview.length} pengingat. `;
    text += `Selamat beristirahat dan semoga tidur nyenyak!`;
    spokenRecap = text;

  } else if (lang === 'my') {
    let text = `မင်္ဂလာညနေခင်းပါ! ဤသည်မှာ သင့်အတွက် ညနေခင်း အမြတ်ငွေနှင့် လုပ်ငန်း အကျဉ်းချုပ်ဖြစ်ပါသည်- `;
    text += `ယနေ့ စုစုပေါင်း ရောင်းရငွေ $${incomeUsd.toFixed(2)}၊ ကုန်ကျစရိတ် $${expenseUsd.toFixed(2)}။ `;
    text += isProfitable 
      ? `ယနေ့ အသားတင်အမြတ်ငွေမှာ +$${netProfitUsd.toFixed(2)} ဖြစ်ပါသည်! အလွန်ကောင်းမွန်ပါသည်။ `
      : `ယနေ့ ကုန်ကျစရိတ်သည် ရောင်းရငွေထက် $${Math.abs(netProfitUsd).toFixed(2)} ပိုများခဲ့သည်။ `;
    if (debtOwedUsd > 0) text += `ဖောက်သည် အကြွေးကျန် $${debtOwedUsd.toFixed(2)} ရှိပါသည်။ `;
    if (medicineItems.length > 0) {
      text += `ကျန်းမာရေးအတွက် ဆေးသောက်မှတ်တမ်း ရှိပြီးဖြစ်ပါသည်။ `;
    } else {
      text += `ကျန်းမာရေး- ညအိပ်ရာမဝင်မီ ညနေခင်းဆေးသောက်ရန် မမေ့ပါနှင့်။ `;
    }
    if (tomorrowPreview.length > 0) text += `မနက်ဖြန်အတွက် အစီအစဉ် ${tomorrowPreview.length} ခု ရှိပါသည်။ `;
    text += `ကောင်းသောညချမ်း ဖြစ်ပါစေ!`;
    spokenRecap = text;

  } else if (lang === 'zh') {
    let text = `晚上好！为您播报今日晚间利润与日程综合总结：`;
    if (incomeUsd === 0 && expenseUsd === 0) {
      text += `今天暂无收支记录。`;
    } else {
      text += `今日销售总额 $${incomeUsd.toFixed(2)}，支出 $${expenseUsd.toFixed(2)}。`;
      text += isProfitable
        ? `今日净利润为正 $${netProfitUsd.toFixed(2)}！业绩非常喜人。`
        : `今日支出超出收入 $${Math.abs(netProfitUsd).toFixed(2)}。`;
    }
    if (debtOwedUsd > 0) text += `客户待结账款为 $${debtOwedUsd.toFixed(2)}。`;
    if (medicineItems.length > 0) {
      text += `健康方面：您已完成“${medicineItems[0]}”服药记录。`;
    } else {
      text += `健康提示：若有睡前用药，请记得按时服用。`;
    }
    if (tomorrowPreview.length > 0) text += `明天您有 ${tomorrowPreview.length} 项待办提醒。`;
    text += `祝您度过一个温馨宁静的夜晚，好梦！`;
    spokenRecap = text;

  } else if (lang === 'ko') {
    let text = `좋은 저녁입니다! 오늘의 순이익과 일일 일정 요약입니다: `;
    if (incomeUsd === 0 && expenseUsd === 0) {
      text += `오늘 기록된 매출이나 지출이 없습니다. `;
    } else {
      text += `오늘 매출은 $${incomeUsd.toFixed(2)}, 지출은 $${expenseUsd.toFixed(2)}입니다. `;
      text += isProfitable
        ? `오늘 순이익은 +$${netProfitUsd.toFixed(2)}입니다! 훌륭합니다. `
        : `오늘 지출이 매출보다 $${Math.abs(netProfitUsd).toFixed(2)} 많았습니다. `;
    }
    if (debtOwedUsd > 0) text += `고객 외상 미수금은 $${debtOwedUsd.toFixed(2)}입니다. `;
    if (medicineItems.length > 0) {
      text += `건강 체크: "${medicineItems[0]}" 복용이 기록되었습니다. `;
    } else {
      text += `건강 체크: 취침 전 드실 약이 있다면 잊지 마세요. `;
    }
    if (tomorrowPreview.length > 0) text += `내일은 ${tomorrowPreview.length}개의 예정 알림이 있습니다. `;
    text += `편안하고 행복한 밤 되세요!`;
    spokenRecap = text;

  } else if (lang === 'fr') {
    let text = `Bonsoir ! Voici votre récapitulatif des bénéfices et de la journée : `;
    if (incomeUsd === 0 && expenseUsd === 0) {
      text += `Aucune vente ou dépense enregistrée aujourd'hui. `;
    } else {
      text += `Ventes du jour : $${incomeUsd.toFixed(2)}, dépenses : $${expenseUsd.toFixed(2)}. `;
      text += isProfitable
        ? `Votre bénéfice net est de +$${netProfitUsd.toFixed(2)} ! Excellent travail. `
        : `Les dépenses ont dépassé les ventes de $${Math.abs(netProfitUsd).toFixed(2)}. `;
    }
    if (debtOwedUsd > 0) text += `Crédit client en attente : $${debtOwedUsd.toFixed(2)}. `;
    if (medicineItems.length > 0) {
      text += `Santé : Prise de "${medicineItems[0]}" enregistrée. `;
    } else {
      text += `Santé : Pensez à vos médicaments du soir avant de dormir. `;
    }
    if (tomorrowPreview.length > 0) text += `Pour demain, vous avez ${tomorrowPreview.length} rappels prévus. `;
    text += `Passez une excellente soirée reposante !`;
    spokenRecap = text;

  } else if (lang === 'de') {
    let text = `Guten Abend! Hier ist Ihre Zusammenfassung des Tagesgewinns und der Termine: `;
    if (incomeUsd === 0 && expenseUsd === 0) {
      text += `Heute wurden keine Einnahmen oder Ausgaben erfasst. `;
    } else {
      text += `Heutige Verkäufe: $${incomeUsd.toFixed(2)}, Ausgaben: $${expenseUsd.toFixed(2)}. `;
      text += isProfitable
        ? `Ihr Nettogewinn beträgt +$${netProfitUsd.toFixed(2)}! Großartige Arbeit. `
        : `Die Ausgaben überstiegen die Verkäufe um $${Math.abs(netProfitUsd).toFixed(2)}. `;
    }
    if (debtOwedUsd > 0) text += `Offene Kundenforderungen: $${debtOwedUsd.toFixed(2)}. `;
    if (medicineItems.length > 0) {
      text += `Gesundheit: Einnahme von "${medicineItems[0]}" erfasst. `;
    } else {
      text += `Gesundheit: Denken Sie an Ihre Abendmedizin vor dem Schlafen. `;
    }
    if (tomorrowPreview.length > 0) text += `Für morgen haben Sie ${tomorrowPreview.length} anstehende Erinnerungen. `;
    text += `Einen erholsamen Abend und eine gute Nacht!`;
    spokenRecap = text;

  } else if (lang === 'es') {
    let text = `¡Buenas noches! Aquí está el resumen de ganancias y agenda de hoy: `;
    if (incomeUsd === 0 && expenseUsd === 0) {
      text += `No se registraron ventas ni gastos hoy. `;
    } else {
      text += `Ventas de hoy: $${incomeUsd.toFixed(2)}, gastos: $${expenseUsd.toFixed(2)}. `;
      text += isProfitable
        ? `¡Tu ganancia neta es de +$${netProfitUsd.toFixed(2)}! Excelente trabajo. `
        : `Los gastos superaron a las ventas por $${Math.abs(netProfitUsd).toFixed(2)}. `;
    }
    if (debtOwedUsd > 0) text += `Deuda de clientes pendiente: $${debtOwedUsd.toFixed(2)}. `;
    if (medicineItems.length > 0) {
      text += `Salud: Registraste tomar "${medicineItems[0]}". `;
    } else {
      text += `Salud: Recuerda tomar la medicina de la noche antes de dormir. `;
    }
    if (tomorrowPreview.length > 0) text += `Para mañana tienes ${tomorrowPreview.length} recordatorios pendientes. `;
    text += `¡Que tengas una noche muy tranquila y descanses!`;
    spokenRecap = text;

  } else if (lang === 'it') {
    let text = `Buonasera! Ecco il riepilogo serale dei profitti e delle attività di oggi: `;
    if (incomeUsd === 0 && expenseUsd === 0) {
      text += `Nessuna vendita o spesa registrata oggi. `;
    } else {
      text += `Vendite di oggi: $${incomeUsd.toFixed(2)}, spese: $${expenseUsd.toFixed(2)}. `;
      text += isProfitable
        ? `Il tuo utile netto è di +$${netProfitUsd.toFixed(2)}! Ottimo lavoro. `
        : `Le spese hanno superato le vendite di $${Math.abs(netProfitUsd).toFixed(2)}. `;
    }
    if (debtOwedUsd > 0) text += `Credito clienti dovuto: $${debtOwedUsd.toFixed(2)}. `;
    if (medicineItems.length > 0) {
      text += `Salute: Hai registrato l'assunzione di "${medicineItems[0]}". `;
    } else {
      text += `Salute: Ricordati i farmaci serali prima di dormire. `;
    }
    if (tomorrowPreview.length > 0) text += `Per domani hai ${tomorrowPreview.length} promemoria programmati. `;
    text += `Buona serata e riposa bene!`;
    spokenRecap = text;

  } else if (lang === 'nl') {
    let text = `Goedenavond! Hier is je avondwinst- en agendarecap: `;
    if (incomeUsd === 0 && expenseUsd === 0) {
      text += `Vandaag zijn er geen verkopen of uitgaven geregistreerd. `;
    } else {
      text += `Verkopen vandaag: $${incomeUsd.toFixed(2)}, uitgaven: $${expenseUsd.toFixed(2)}. `;
      text += isProfitable
        ? `Je nettowinst is +$${netProfitUsd.toFixed(2)}! Goed gedaan. `
        : `De uitgaven overschreden de verkopen met $${Math.abs(netProfitUsd).toFixed(2)}. `;
    }
    if (debtOwedUsd > 0) text += `Klantenschuld openstaand: $${debtOwedUsd.toFixed(2)}. `;
    if (medicineItems.length > 0) {
      text += `Gezondheid: Je hebt "${medicineItems[0]}" geregistreerd. `;
    } else {
      text += `Gezondheid: Denk aan je avondmedicatie voor het slapengaan. `;
    }
    if (tomorrowPreview.length > 0) text += `Voor morgen heb je ${tomorrowPreview.length} herinneringen. `;
    text += `Een fijne en rustige avond gewenst!`;
    spokenRecap = text;

  } else if (lang === 'pt') {
    let text = `Boa noite! Aqui está o resumo dos lucros e da sua agenda de hoje: `;
    if (incomeUsd === 0 && expenseUsd === 0) {
      text += `Nenhuma venda ou despesa registrada hoje. `;
    } else {
      text += `Vendas de hoje: $${incomeUsd.toFixed(2)}, despesas: $${expenseUsd.toFixed(2)}. `;
      text += isProfitable
        ? `Seu lucro líquido é de +$${netProfitUsd.toFixed(2)}! Excelente trabalho. `
        : `As despesas superaram as vendas em $${Math.abs(netProfitUsd).toFixed(2)}. `;
    }
    if (debtOwedUsd > 0) text += `Crédito de clientes pendente: $${debtOwedUsd.toFixed(2)}. `;
    if (medicineItems.length > 0) {
      text += `Saúde: Você registrou "${medicineItems[0]}". `;
    } else {
      text += `Saúde: Lembre-se do remédio da noite antes de dormir. `;
    }
    if (tomorrowPreview.length > 0) text += `Para amanhã você tem ${tomorrowPreview.length} lembretes agendados. `;
    text += `Tenha uma noite tranquila e bom descanso!`;
    spokenRecap = text;

  } else {
    // English (en, sg, fil, lo fallback)
    let text = `Good evening! Here is your Comprehensive Evening Profit and Daily Agenda Recap: `;
    if (incomeUsd === 0 && expenseUsd === 0) {
      text += `No sales or expenses were recorded today. `;
    } else {
      text += `Today's sales are $${incomeUsd.toFixed(2)}, expenses are $${expenseUsd.toFixed(2)}. `;
      text += isProfitable 
        ? `Your net profit today is +$${netProfitUsd.toFixed(2)}! Excellent work. `
        : `Expenses exceeded sales by $${Math.abs(netProfitUsd).toFixed(2)}. `;
    }
    if (debtOwedUsd > 0) {
      text += `Customer credit owed is $${debtOwedUsd.toFixed(2)}. `;
    }
    if (medicineItems.length > 0) {
      text += `Health check: You have recorded taking "${medicineItems[0]}". `;
    } else {
      text += `Health check: Remember to take any prescribed evening medication before sleep. `;
    }
    if (trainingsToday.length > 0) text += `Training: Completed "${trainingsToday[0]}". `;
    if (meetingsToday.length > 0) text += `Meetings: Attended "${meetingsToday[0]}". `;
    if (tomorrowPreview.length > 0) text += `For tomorrow, you have ${tomorrowPreview.length} scheduled reminders. `;
    text += `Have a peaceful and restful evening!`;
    spokenRecap = text;
  }

  return {
    incomeUsd,
    expenseUsd,
    netProfitUsd,
    debtOwedUsd,
    medicineStatus: {
      taken: medicineItems.length > 0,
      items: medicineItems,
    },
    meetingsToday,
    trainingsToday,
    tomorrowPreview,
    spokenRecap,
  };
}
