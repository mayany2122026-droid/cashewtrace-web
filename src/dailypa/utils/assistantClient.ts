import { SupportedLanguage, Entry } from '../types';

export interface AssistantContext {
  userName?: string;
  userPhone?: string;
  todaySales?: number;
  todayExpenses?: number;
  todayNetProfit?: number;
  todayRecords?: Entry[];
  yesterdayRecords?: Entry[];
  upcomingAppointments?: any[];
}

export interface AssistantResponse {
  answer: string;
  spokenText: string;
  type: 'records_query' | 'general_qa' | 'appointment_alert' | 'calculation';
}

/**
 * 100% Offline & Client-Side Assistant Engine
 * Runs completely in the browser at ZERO network cost ($0.00).
 * Never makes external API calls to Google Cloud or Gemini.
 */
export async function askAssistant(
  query: string,
  lang: SupportedLanguage = 'en',
  context: AssistantContext = {}
): Promise<AssistantResponse> {
  // Pure local execution with zero network latency and $0.00 cost
  return generateClientAssistantResponse(query, lang, context);
}

function generateClientAssistantResponse(
  query: string,
  lang: SupportedLanguage,
  context: AssistantContext
): AssistantResponse {
  const q = query.toLowerCase().trim();
  const {
    todaySales = 0,
    todayExpenses = 0,
    todayNetProfit = 0,
    yesterdayRecords = [],
    todayRecords = [],
    upcomingAppointments = [],
  } = context;

  // 0. Specific Query: "Where did the [amount] come from?" (e.g. "where the 9usd come from", "៩ដុល្លារមកពីណា")
  const whereMatch = q.match(/(?:where|where did|where the|from where|មកពីណា|បានមកពីណា|ពីណា)\s*.*?(\d+[\d,.]*)/i) ||
                     q.match(/(\d+[\d,.]*)\s*(?:usd|\$|រៀល|dollars?)?.*?(?:where|come from|មកពីណា|បានមកពីណា|ពីណា)/i);
  
  if (whereMatch || q.includes('where the 9usd come from') || q.includes('មកពីណា') || (q.includes('where') && (q.includes('come from') || q.includes('money') || q.includes('usd') || q.includes('$')))) {
    const targetAmt = whereMatch ? parseFloat(whereMatch[1].replace(/,/g, '')) : null;
    const allRecords = [...todayRecords, ...yesterdayRecords];
    const matchedEntry = allRecords.find((r) => targetAmt ? Math.abs((r.amount || 0) - targetAmt) < 0.1 || (r.rawVoiceTranscript && r.rawVoiceTranscript.includes(String(targetAmt))) : false);

    if (matchedEntry) {
      const entryDesc = matchedEntry.rawVoiceTranscript || matchedEntry.titleKhmer || matchedEntry.titleEnglish || 'កំណត់ត្រា';
      const ansKm = `ទឹកប្រាក់ ${matchedEntry.amount || targetAmt || ''}$ គឺបានមកពីកំណត់ត្រា៖ "${entryDesc}"។ ប្រសិនបើកត់ច្រឡំ អ្នកអាចចុចប៊ូតុង "លុប" ពណ៌ក្រហមលើអេក្រង់ ឬនិយាយពាក្យ "លុប" ដើម្បីលុបវាចេញបានភ្លាមៗ!`;
      const ansEn = `The ${matchedEntry.amount || targetAmt || ''}$ comes from record: "${entryDesc}". If this was a mistake, tap the red "Delete" button on the screen or say "Delete" to remove it!`;
      return {
        answer: lang === 'km' ? ansKm : ansEn,
        spokenText: lang === 'km' ? ansKm : ansEn,
        type: 'records_query',
      };
    } else {
      const ansKm = `មិនមានកំណត់ត្រា ${targetAmt ? targetAmt + '$' : ''} នៅក្នុងប្រវត្តិរបស់អ្នកទេ។ ប្រសិនបើអេក្រង់បង្ហាញទិន្នន័យខុស អ្នកអាចចុចប៊ូតុង "លុប" ពណ៌ក្រហម ដើម្បីលុបវាចោលភ្លាមៗ!`;
      const ansEn = `There is no record for ${targetAmt ? targetAmt + '$' : 'that amount'} in your ledger. If an accidental card was created, you can tap the red "Delete" button to remove it!`;
      return {
        answer: lang === 'km' ? ansKm : ansEn,
        spokenText: lang === 'km' ? ansKm : ansEn,
        type: 'records_query',
      };
    }
  }

  // 1. Math / Arithmetic Calculations (e.g. "៥ពាន់ បូក ១ម៉ឺន", "5000 + 12000", "20000 - 5000")
  const calcMatch = query.match(/(\d+[\d\s,.]*)\s*(\+|\-|បូក|ដក|គុណ|ចែក|\*|\/)\s*(\d+[\d\s,.]*)/);
  if (calcMatch) {
    const num1 = parseFloat(calcMatch[1].replace(/,/g, '').replace(/\s+/g, ''));
    const op = calcMatch[2];
    const num2 = parseFloat(calcMatch[3].replace(/,/g, '').replace(/\s+/g, ''));
    if (!isNaN(num1) && !isNaN(num2)) {
      let res = 0;
      if (op === '+' || op === 'បូក') res = num1 + num2;
      else if (op === '-' || op === 'ដក') res = num1 - num2;
      else if (op === '*' || op === 'គុណ') res = num1 * num2;
      else if (op === '/' || op === 'ចែក') res = num2 !== 0 ? Math.round((num1 / num2) * 100) / 100 : 0;

      const ansKm = `លទ្ធផលគណនាគឺ៖ ${res.toLocaleString()}។`;
      const ansEn = `The calculation result is ${res.toLocaleString()}.`;
      return {
        answer: lang === 'km' ? ansKm : ansEn,
        spokenText: lang === 'km' ? ansKm : ansEn,
        type: 'calculation',
      };
    }
  }

  // 2. Yesterday's Records Query ("ម្សិលមិញខ្ញុំកត់អ្វីខ្លះ?" / "What did I record yesterday?")
  if (q.includes('ម្សិលមិញ') || q.includes('yesterday') || q.includes('ថ្ងៃមុន')) {
    if (yesterdayRecords.length === 0) {
      const ansKm = 'ម្សិលមិញអ្នកមិនទាន់មានទិន្នន័យកត់ត្រានោះទេ។';
      const ansEn = 'You did not have any records recorded yesterday.';
      return {
        answer: lang === 'km' ? ansKm : ansEn,
        spokenText: lang === 'km' ? ansKm : ansEn,
        type: 'records_query',
      };
    }
    const count = yesterdayRecords.length;
    const summaries = yesterdayRecords
      .slice(0, 3)
      .map((r) => r.rawVoiceTranscript || r.titleKhmer || r.titleEnglish || r.notes || r.category)
      .join('、 ');
    const ansKm = `ម្សិលមិញអ្នកបានកត់ត្រាចំនួន ${count} កិច្ចការ រួមមាន៖ ${summaries}។`;
    const ansEn = `Yesterday you saved ${count} records including: ${summaries}.`;
    return {
      answer: lang === 'km' ? ansKm : ansEn,
      spokenText: lang === 'km' ? ansKm : ansEn,
      type: 'records_query',
    };
  }

  // 2b. Specific "Show my expenses" / "បង្ហាញការចំណាយ" query
  if (
    q.includes('show my expenses') || 
    q.includes('show expenses') || 
    q.includes('បង្ហាញការចំណាយ') || 
    q.includes('មើលការចំណាយ') ||
    (q.includes('expenses') && (q.includes('show') || q.includes('list') || q.includes('tell')))
  ) {
    const expenseRecords = todayRecords.filter((e) => e.type === 'expense');
    if (expenseRecords.length === 0) {
      const ansKm = `ថ្ងៃនេះអ្នកមិនទាន់មានការចំណាយណាមួយនៅឡើយទេ។ ចំណាយសរុបគឺ $0។`;
      const ansEn = `You have no recorded expenses today. Total is $0.`;
      return {
        answer: lang === 'km' ? ansKm : ansEn,
        spokenText: lang === 'km' ? ansKm : ansEn,
        type: 'records_query',
      };
    }
    const summaries = expenseRecords
      .slice(0, 3)
      .map((e) => `${e.rawVoiceTranscript || e.titleKhmer || e.titleEnglish} ($${e.amount || 0})`)
      .join('、 ');
    const ansKm = `ថ្ងៃនេះអ្នកមានការចំណាយសរុបចំនួន $${todayExpenses.toLocaleString()} រួមមាន៖ ${summaries}។`;
    const ansEn = `Today's expenses total $${todayExpenses.toLocaleString()}, including: ${summaries}.`;
    return {
      answer: lang === 'km' ? ansKm : ansEn,
      spokenText: lang === 'km' ? ansKm : ansEn,
      type: 'records_query',
    };
  }

  // 2c. Today's Records Query ("ថ្ងៃនេះខ្ញុំកត់អ្វីខ្លះ?" / "What did I record today?")
  if (
    (q.includes('ថ្ងៃនេះ') && (q.includes('កត់') || q.includes('អ្វីខ្លះ') || q.includes('សរុប'))) ||
    (q.includes('today') && (q.includes('record') || q.includes('saved') || q.includes('what')))
  ) {
    if (todayRecords.length === 0) {
      const ansKm = 'ថ្ងៃនេះអ្នកមិនទាន់បានកត់ត្រាទិន្នន័យនៅឡើយទេ។';
      const ansEn = 'You have not saved any records today.';
      return {
        answer: lang === 'km' ? ansKm : ansEn,
        spokenText: lang === 'km' ? ansKm : ansEn,
        type: 'records_query',
      };
    }
    const count = todayRecords.length;
    const summaries = todayRecords
      .slice(0, 3)
      .map((r) => r.rawVoiceTranscript || r.titleKhmer || r.titleEnglish || r.notes || r.category)
      .join('、 ');
    const ansKm = `ថ្ងៃនេះអ្នកបានកត់ត្រាចំនួន ${count} រួចរាល់ រួមមាន៖ ${summaries}។`;
    const ansEn = `Today you have recorded ${count} items including: ${summaries}.`;
    return {
      answer: lang === 'km' ? ansKm : ansEn,
      spokenText: lang === 'km' ? ansKm : ansEn,
      type: 'records_query',
    };
  }

  // 3. Today's Financial Totals, Sales & Profit ("ថ្ងៃនេះលក់បានប៉ុន្មាន?" / "Show my sales" / "expenses" / "profit")
  if (
    q.includes('លក់') ||
    q.includes('ចំណេញ') ||
    q.includes('ចំណាយ') ||
    q.includes('sales') ||
    q.includes('profit') ||
    q.includes('expenses') ||
    q.includes('ចំណូល') ||
    q.includes('សល់លុយ') ||
    q.includes('balance')
  ) {
    const isProfit = todayNetProfit >= 0;
    const ansKm = `ថ្ងៃនេះអ្នកលក់បានសរុប $${todaySales.toLocaleString()} ចំណាយ $${todayExpenses.toLocaleString()} ${
      isProfit ? `ចំណេញសុទ្ធ +$${todayNetProfit.toLocaleString()}` : `ខាត -$${Math.abs(todayNetProfit).toLocaleString()}`
    }។`;
    const ansEn = `Today's sales: $${todaySales.toLocaleString()}, expenses: $${todayExpenses.toLocaleString()}, net profit: ${
      isProfit ? `+$${todayNetProfit.toLocaleString()}` : `-$${Math.abs(todayNetProfit).toLocaleString()}`
    }.`;
    return {
      answer: lang === 'km' ? ansKm : ansEn,
      spokenText: lang === 'km' ? ansKm : ansEn,
      type: 'records_query',
    };
  }

  // 4. Appointments & Medicine Reminders ("តើខ្ញុំមានណាត់ជួបអ្វីខ្លះ?" / "Reminders" / "Medicine")
  if (
    q.includes('ណាត់') ||
    q.includes('ថ្នាំ') ||
    q.includes('appointment') ||
    q.includes('reminder') ||
    q.includes('medicine') ||
    q.includes('ពេទ្យ')
  ) {
    if (upcomingAppointments.length > 0) {
      const appt = upcomingAppointments[0];
      const title = appt.title || appt.rawTranscript || appt.titleKhmer || 'ការណាត់ជួប';
      const ansKm = `អ្នកមានការណាត់ជួប ឬរំលឹក៖ "${title}" សម្រាប់ថ្ងៃនេះ។`;
      const ansEn = `You have an appointment or reminder: "${title}" scheduled for today.`;
      return {
        answer: lang === 'km' ? ansKm : ansEn,
        spokenText: lang === 'km' ? ansKm : ansEn,
        type: 'appointment_alert',
      };
    } else {
      const ansKm = 'អ្នកមិនមានការណាត់ជួប ឬកាលវិភាគបន្ទាន់សម្រាប់ថ្ងៃនេះទេ។';
      const ansEn = 'You do not have any urgent appointments scheduled today.';
      return {
        answer: lang === 'km' ? ansKm : ansEn,
        spokenText: lang === 'km' ? ansKm : ansEn,
        type: 'appointment_alert',
      };
    }
  }

  // 5. Farming, Agriculture & Cashew Inquiries
  if (
    q.includes('ចន្ទី') ||
    q.includes('កសិកម្ម') ||
    q.includes('ដំណាំ') ||
    q.includes('farm') ||
    q.includes('crop') ||
    q.includes('cashew') ||
    q.includes('ជី')
  ) {
    const ansKm = 'សម្រាប់ការដាំដុះចន្ទី និងដំណាំកសិកម្ម គួរស្រោចទឹកជាប្រចាំនៅពេលព្រឹកព្រលឹម ដាក់ជីសរីរាង្គ និងពិនិត្យដង្កូវស៊ីស្លឹកឱ្យបានទៀងទាត់។';
    const ansEn = 'For cashew nuts and crops, water early in the morning, use organic compost, and regularly inspect trees to prevent pests.';
    return {
      answer: lang === 'km' ? ansKm : ansEn,
      spokenText: lang === 'km' ? ansKm : ansEn,
      type: 'general_qa',
    };
  }

  // 6. MSME Business & Shop Owner Inquiries
  if (
    q.includes('មុខរបរ') ||
    q.includes('លក់ដូរ') ||
    q.includes('អតិថិជន') ||
    q.includes('business') ||
    q.includes('customer') ||
    q.includes('ហាង')
  ) {
    const ansKm = 'ដើម្បីឱ្យការលក់ដូររីកចម្រើន គួរកត់ត្រាចំណូលចំណាយប្រចាំថ្ងៃឱ្យបានច្បាស់លាស់ ញញឹមស្វាគមន៍អតិថិជន និងរក្សាតម្លៃសមរម្យ។';
    const ansEn = 'To grow your MSME shop, record your daily cashflow consistently, welcome customers with warmth, and maintain honest pricing.';
    return {
      answer: lang === 'km' ? ansKm : ansEn,
      spokenText: lang === 'km' ? ansKm : ansEn,
      type: 'general_qa',
    };
  }

  // 7. Health & Well-being
  if (
    q.includes('ផ្តាសាយ') ||
    q.includes('ឈឺ') ||
    q.includes('សុខភាព') ||
    q.includes('cold') ||
    q.includes('fever') ||
    q.includes('health') ||
    q.includes('ហត់')
  ) {
    const ansKm = 'សូមពិសាទឹកក្តៅឧណ្ហៗឱ្យបានច្រើន សម្រាកឱ្យបានគ្រប់គ្រាន់ និងទៅពិគ្រោះជាមួយគ្រូពេទ្យ ឬឱសថការីប្រសិនបើអាការៈមិនធូរស្បើយ។';
    const ansEn = 'Please drink plenty of warm water, get adequate rest, and visit a clinic or pharmacist if your symptoms continue.';
    return {
      answer: lang === 'km' ? ansKm : ansEn,
      spokenText: lang === 'km' ? ansKm : ansEn,
      type: 'general_qa',
    };
  }

  // 8. General Conversational Secretary Answer
  const ansKm = `ខ្ញុំបានស្តាប់ឮ៖ "${query}"។ ខ្ញុំជា MyDailyPA ជំនួយការរបស់អ្នក ដំណើរការលើទូរសព្ទដោយផ្ទាល់ មិនអស់ប្រាក់ និងត្រៀមកត់ត្រាជានិច្ច!`;
  const ansEn = `I heard you clearly: "${query}". I am MyDailyPA, your personal assistant running 100% locally with zero cost, ready to assist anytime!`;
  return {
    answer: lang === 'km' ? ansKm : ansEn,
    spokenText: lang === 'km' ? ansKm : ansEn,
    type: 'general_qa',
  };
}
