import { BasketItem, CategorizeResult, CategoryType, EntryType } from '../types';

/**
 * Expands spoken verbal quantity units, e.g. Khmer "២ម៉ឺន" -> "20000", "៥ពាន់" -> "5000",
 * "១សែន" -> "100000", "50k" -> "50000", etc.
 */
export function normalizeSpokenNumbers(text: string): string {
  let res = text;
  // Khmer digits to standard
  const khmerDigits = ['០', '១', '២', '៣', '៤', '៥', '៦', '៧', '៨', '៩'];
  khmerDigits.forEach((kd, idx) => { res = res.replaceAll(kd, idx.toString()); });

  // Khmer compound verbal numbers: e.g. 1ម៉ឺន4ពាន់ -> 14000
  res = res.replace(/កន្លះដុល្លារ/g, ' 0.5 ដុល្លារ ');
  res = res.replace(/(\d+(?:\.\d+)?)\s*ដុល្លារកន្លះ/g, (_, num) => {
    return (parseFloat(num) + 0.5).toString() + ' ដុល្លារ ';
  });
  res = res.replace(/ដុល្លារកន្លះ/g, ' 1.5 ដុល្លារ ');

  res = res.replace(/កន្លះម៉ឺន/g, ' 5000 រៀល ');
  res = res.replace(/កន្លះសែន/g, ' 50000 រៀល ');
  res = res.replace(/កន្លះលាន/g, ' 500000 រៀល ');

  res = res.replace(/(\d+)\s*ម៉ឺន\s*(\d+)\s*ពាន់/g, (_, tenK, k) => {
    const val = parseInt(tenK, 10) * 10000 + parseInt(k, 10) * 1000;
    return val.toString() + ' រៀល ';
  });
  // 1ម៉ឺន -> 10000
  res = res.replace(/(\d+(?:\.\d+)?)\s*ម៉ឺន/g, (_, num) => {
    return (parseFloat(num) * 10000).toString() + ' រៀល ';
  });
  // 1សែន -> 100000
  res = res.replace(/(\d+(?:\.\d+)?)\s*សែន/g, (_, num) => {
    return (parseFloat(num) * 100000).toString() + ' រៀល ';
  });
  // e.g. 5ពាន់3រយ -> 5300
  res = res.replace(/(\d+)\s*ពាន់\s*(\d+)\s*រយ/g, (_, k, r) => {
    const val = parseInt(k, 10) * 1000 + parseInt(r, 10) * 100;
    return val.toString() + ' រៀល ';
  });
  // 5ពាន់ -> 5000
  res = res.replace(/(\d+(?:\.\d+)?)\s*ពាន់/g, (_, num) => {
    return (parseFloat(num) * 1000).toString() + ' រៀល ';
  });
  // 5រយ -> 500
  res = res.replace(/(\d+(?:\.\d+)?)\s*រយ/g, (_, num) => {
    return (parseFloat(num) * 100).toString() + ' រៀល ';
  });
  // 1លាន -> 1000000
  res = res.replace(/(\d+(?:\.\d+)?)\s*លាន/g, (_, num) => {
    return (parseFloat(num) * 1000000).toString() + ' រៀល ';
  });

  // Vietnamese: 50 ngàn / 50k -> 50000
  res = res.replace(/(\d+)\s*(?:ngàn|nghìn|k)\b/gi, (_, num) => {
    return (parseInt(num, 10) * 1000).toString() + ' vnd ';
  });

  return res;
}

/**
 * Extracts a single price and currency from a snippet
 */
function extractPriceSnippet(snippet: string, defaultCurrency: string = 'USD', preferredLang: string = 'km'): { amount: number; currency: string } | null {
  // USD
  const usd = snippet.match(/(\d+(?:[.,]\d+)?)\s*(?:\$|ដុល្លារ?|usd|dollars?)\b/i) || 
              snippet.match(/(?:\$|usd|dollars?|ដុល្លារ?)\s*(\d+(?:[.,]\d+)?)/i);
  if (usd) return { amount: parseFloat((usd[1] || usd[2] || '0').replace(',', '.')), currency: 'USD' };

  // GBP (£ / pound / quid)
  const gbp = snippet.match(/(\d+(?:[.,]\d+)?)\s*(?:£|gbp|pound|pounds|quid)/i) || 
              snippet.match(/(?:£|gbp|pound|pounds|quid)\s*(\d+(?:[.,]\d+)?)/i);
  if (gbp) return { amount: parseFloat(gbp[1].replace(',', '.')), currency: 'GBP' };

  // EUR (€ / euro)
  const eur = snippet.match(/(\d+(?:[.,]\d+)?)\s*(?:€|eur|euro|euros)/i) || 
              snippet.match(/(?:€|eur)\s*(\d+(?:[.,]\d+)?)/i);
  if (eur) return { amount: parseFloat(eur[1].replace(',', '.')), currency: 'EUR' };

  // AUD (A$ / aud)
  const aud = snippet.match(/(\d+(?:[.,]\d+)?)\s*(?:a\$|aud)/i) || 
              snippet.match(/(?:a\$|aud)\s*(\d+(?:[.,]\d+)?)/i);
  if (aud) return { amount: parseFloat(aud[1].replace(',', '.')), currency: 'AUD' };

  // SGD (S$ / sgd)
  const sgd = snippet.match(/(\d+(?:[.,]\d+)?)\s*(?:s\$|sgd)/i) || 
              snippet.match(/(?:s\$|sgd)\s*(\d+(?:[.,]\d+)?)/i);
  if (sgd) return { amount: parseFloat(sgd[1].replace(',', '.')), currency: 'SGD' };

  // KHR
  const khr = snippet.match(/(\d+(?:[.,]\d+)?)\s*(?:៛|រៀល|khr|riels?)\b/i) || 
              snippet.match(/(?:៛|khr|រៀល)\s*(\d+(?:[.,]\d+)?)/i);
  if (khr) return { amount: parseFloat((khr[1] || khr[2] || '0').replace(',', '')), currency: 'KHR' };

  // THB
  const thb = snippet.match(/(\d+(?:[.,]\d+)?)\s*(?:฿|thb|บาท|baht)/i) || 
              snippet.match(/(?:฿|thb)\s*(\d+(?:[.,]\d+)?)/i);
  if (thb) return { amount: parseFloat(thb[1].replace(',', '.')), currency: 'THB' };

  // VND
  const vnd = snippet.match(/(\d+(?:[.,]\d+)?)\s*(?:₫|vnd|đồng|dong)/i) || 
              snippet.match(/(?:₫|vnd)\s*(\d+(?:[.,]\d+)?)/i);
  if (vnd) return { amount: parseFloat(vnd[1].replace(',', '')), currency: 'VND' };

  // Generic number
  const gen = snippet.match(/(\d+(?:[.,]\d+)?)/);
  if (gen) {
    const val = parseFloat(gen[1].replace(',', '.'));
    if (preferredLang === 'km' && val >= 500) return { amount: val, currency: 'KHR' };
    return { amount: val, currency: defaultCurrency || 'USD' };
  }

  return null;
}

/**
 * Identifies if a spoken sentence has multiple grocery items,
 * parses each sub-item and sums their values.
 */
export function parseMultiItemGroceryBasket(
  rawText: string,
  rateToUsd: number = 4030
): {
  isBasket: boolean;
  basketItems: BasketItem[];
  totalAmount: number;
  currency: string;
  itemsList: string[];
} | null {
  const norm = normalizeSpokenNumbers(rawText);

  // Split by common multi-item delimiters: commas, semicolons, "និង" (and), "and", "với", "và", "และ", "dan", "\n"
  const segments = norm
    .split(/[,;\n]+|\s+និង\s+|\s+and\s+|\s+với\s+|\s+và\s+|\s+และ\s+|\s+dan\s+/i)
    .map((s) => s.trim())
    .filter((s) => s.length > 1);

  if (segments.length < 2) {
    return null;
  }

  const parsedItems: BasketItem[] = [];
  let primaryCurr = 'USD';
  let hasKhr = false;
  let hasUsd = false;

  for (const seg of segments) {
    const priceInfo = extractPriceSnippet(seg);
    if (priceInfo) {
      if (priceInfo.currency === 'KHR') hasKhr = true;
      if (priceInfo.currency === 'USD') hasUsd = true;

      // Clean item name from segment
      let itemName = seg
        .replace(/(\d+(?:[.,]\d+)?)\s*(?:\$|ដុល្លារ|usd|dollar|dollars|៛|រៀល|khr|riel|฿|thb|บาท|baht|₫|vnd|đồng|dong)/gi, '')
        .replace(/^(?:លក់|ទិញ|sold|bought|sale|buy|bán|mua|ขาย|ซื้อ)\s+/i, '')
        .trim();

      if (!itemName) itemName = seg;

      parsedItems.push({
        name: itemName,
        price: priceInfo.amount,
        currency: priceInfo.currency,
      });
    }
  }

  // If at least 2 distinct items with prices were found, it is a multi-item grocery basket!
  if (parsedItems.length >= 2) {
    // If predominantly KHR or all KHR, use KHR, else USD
    if (hasKhr && !hasUsd) {
      primaryCurr = 'KHR';
    } else if (hasKhr && hasUsd) {
      // Mixed basket (common in Cambodia): normalize to primary USD or KHR
      primaryCurr = 'USD';
    } else {
      primaryCurr = parsedItems[0].currency;
    }

    let totalSum = 0;
    parsedItems.forEach((it) => {
      if (primaryCurr === 'USD') {
        if (it.currency === 'KHR') {
          totalSum += it.price / rateToUsd;
        } else {
          totalSum += it.price;
        }
      } else if (primaryCurr === 'KHR') {
        if (it.currency === 'USD') {
          totalSum += it.price * rateToUsd;
        } else {
          totalSum += it.price;
        }
      } else {
        totalSum += it.price;
      }
    });

    const itemsList = parsedItems.map((it) => {
      const formattedPrice = it.currency === 'USD' ? `$${it.price.toFixed(2)}` : `${it.price.toLocaleString()} ${it.currency}`;
      return `${it.name}: ${formattedPrice}`;
    });

    return {
      isBasket: true,
      basketItems: parsedItems,
      totalAmount: Math.round(totalSum * 100) / 100,
      currency: primaryCurr,
      itemsList,
    };
  }

  return null;
}

export function parseVoiceTranscript(text: string, defaultCurrency: string = 'USD', preferredLang: string = 'km'): CategorizeResult {
  const clean = text.trim();
  
  // Convert digits from Khmer, Myanmar, Thai, and Lao scripts to standard digits
  const myanmarDigits = ['၀', '၁', '၂', '၃', '၄', '៥', '៦', '៧', '៨', '၉'];
  const thaiDigits = ['๐', '๑', '๒', '๓', '๔', '๕', '๖', '๗', '๘', '๙'];
  const laoDigits = ['໐', '໑', '໒', '໓', '໔', '໕', '໖', '໗', '໘', '໙'];

  let normalized = normalizeSpokenNumbers(clean);
  myanmarDigits.forEach((md, idx) => { normalized = normalized.replaceAll(md, idx.toString()); });
  thaiDigits.forEach((td, idx) => { normalized = normalized.replaceAll(td, idx.toString()); });
  laoDigits.forEach((ld, idx) => { normalized = normalized.replaceAll(ld, idx.toString()); });

  // 1. Check for Multi-Item Grocery Basket first!
  const basketResult = parseMultiItemGroceryBasket(clean);

  // Extract amount and currency across all ASEAN and global currencies
  let amount: number | undefined;
  let currency: string = defaultCurrency || 'USD';

  if (basketResult && basketResult.isBasket) {
    amount = basketResult.totalAmount;
    currency = basketResult.currency;
  } else {
    // Currency Matchers:
    // USD ($ / dollar / ដុល្លារ / ដុល្លា)
    const usdMatch = normalized.match(/(\d+(?:[.,]\d+)?)\s*(?:\$|ដុល្លារ?|usd|dollars?)\b/i) || 
                     normalized.match(/(?:\$|usd|dollars?|ដុល្លារ?)\s*(\d+(?:[.,]\d+)?)/i);
    // GBP (£ / pound / quid)
    const gbpMatch = normalized.match(/(\d+(?:[.,]\d+)?)\s*(?:£|gbp|pound|pounds|quid)/i) || 
                     normalized.match(/(?:£|gbp|pound|pounds|quid)\s*(\d+(?:[.,]\d+)?)/i);
    // EUR (€ / euro)
    const eurMatch = normalized.match(/(\d+(?:[.,]\d+)?)\s*(?:€|eur|euro|euros)/i) || 
                     normalized.match(/(?:€|eur)\s*(\d+(?:[.,]\d+)?)/i);
    // AUD (A$ / aud)
    const audMatch = normalized.match(/(\d+(?:[.,]\d+)?)\s*(?:a\$|aud)/i) || 
                     normalized.match(/(?:a\$|aud)\s*(\d+(?:[.,]\d+)?)/i);
    // KHR (៛ / riel / riels / រៀល)
    const khrMatch = normalized.match(/(\d+(?:[.,]\d+)?)\s*(?:៛|រៀល|khr|riels?)\b/i) || 
                     normalized.match(/(?:៛|khr|រៀល)\s*(\d+(?:[.,]\d+)?)/i);
    // VND
    const vndMatch = normalized.match(/(\d+(?:[.,]\d+)?)\s*(?:₫|vnd|đồng|dong)/i) || 
                     normalized.match(/(?:₫|vnd)\s*(\d+(?:[.,]\d+)?)/i);
    // THB
    const thbMatch = normalized.match(/(\d+(?:[.,]\d+)?)\s*(?:฿|thb|บาท|baht)/i) || 
                     normalized.match(/(?:฿|thb)\s*(\d+(?:[.,]\d+)?)/i);
    // IDR
    const idrMatch = normalized.match(/(\d+(?:[.,]\d+)?)\s*(?:rp|idr|rupiah)/i) || 
                     normalized.match(/(?:rp|idr)\s*(\d+(?:[.,]\d+)?)/i);
    // MYR
    const myrMatch = normalized.match(/(\d+(?:[.,]\d+)?)\s*(?:rm|myr|ringgit)/i) || 
                     normalized.match(/(?:rm|myr)\s*(\d+(?:[.,]\d+)?)/i);
    // SGD
    const sgdMatch = normalized.match(/(\d+(?:[.,]\d+)?)\s*(?:s\$|sgd)/i) || 
                     normalized.match(/(?:s\$|sgd)\s*(\d+(?:[.,]\d+)?)/i);
    // PHP
    const phpMatch = normalized.match(/(\d+(?:[.,]\d+)?)\s*(?:₱|php|peso|pesos)/i) || 
                     normalized.match(/(?:₱|php)\s*(\d+(?:[.,]\d+)?)/i);
    // LAK
    const lakMatch = normalized.match(/(\d+(?:[.,]\d+)?)\s*(?:₭|lak|ກີບ|kip)/i) || 
                     normalized.match(/(?:₭|lak)\s*(\d+(?:[.,]\d+)?)/i);
    // MMK
    const mmkMatch = normalized.match(/(\d+(?:[.,]\d+)?)\s*(?:mmk|ကျပ်|kyat)/i) || 
                     normalized.match(/(?:mmk|k)\s*(\d+(?:[.,]\d+)?)/i);
    // CNY
    const cnyMatch = normalized.match(/(\d+(?:[.,]\d+)?)\s*(?:¥|cny|rmb|元|块)/i) || 
                     normalized.match(/(?:¥|cny|rmb)\s*(\d+(?:[.,]\d+)?)/i);
    // KRW
    const krwMatch = normalized.match(/(\d+(?:[.,]\d+)?)\s*(?:₩|krw|원|won)/i) || 
                     normalized.match(/(?:₩|krw)\s*(\d+(?:[.,]\d+)?)/i);

    if (usdMatch) {
      amount = parseFloat((usdMatch[1] || usdMatch[2] || '0').replace(',', '.'));
      currency = 'USD';
    } else if (gbpMatch) {
      amount = parseFloat((gbpMatch[1] || gbpMatch[2] || '0').replace(',', '.'));
      currency = 'GBP';
    } else if (eurMatch) {
      amount = parseFloat((eurMatch[1] || eurMatch[2] || '0').replace(',', '.'));
      currency = 'EUR';
    } else if (audMatch) {
      amount = parseFloat((audMatch[1] || audMatch[2] || '0').replace(',', '.'));
      currency = 'AUD';
    } else if (khrMatch) {
      amount = parseFloat((khrMatch[1] || khrMatch[2] || '0').replace(',', ''));
      currency = 'KHR';
    } else if (vndMatch) {
      amount = parseFloat(vndMatch[1].replace(',', ''));
      currency = 'VND';
    } else if (thbMatch) {
      amount = parseFloat(thbMatch[1].replace(',', '.'));
      currency = 'THB';
    } else if (idrMatch) {
      amount = parseFloat(idrMatch[1].replace(',', ''));
      currency = 'IDR';
    } else if (myrMatch) {
      amount = parseFloat(myrMatch[1].replace(',', '.'));
      currency = 'MYR';
    } else if (sgdMatch) {
      amount = parseFloat(sgdMatch[1].replace(',', '.'));
      currency = 'SGD';
    } else if (phpMatch) {
      amount = parseFloat(phpMatch[1].replace(',', '.'));
      currency = 'PHP';
    } else if (lakMatch) {
      amount = parseFloat(lakMatch[1].replace(',', ''));
      currency = 'LAK';
    } else if (mmkMatch) {
      amount = parseFloat(mmkMatch[1].replace(',', ''));
      currency = 'MMK';
    } else if (cnyMatch) {
      amount = parseFloat(cnyMatch[1].replace(',', '.'));
      currency = 'CNY';
    } else if (krwMatch) {
      amount = parseFloat(krwMatch[1].replace(',', ''));
      currency = 'KRW';
    } else {
      // Check for generic plain number without explicit currency symbol
      const plainNumMatch = normalized.match(/(\d+(?:[.,]\d+)?)/);
      if (plainNumMatch) {
        const val = parseFloat(plainNumMatch[1].replace(',', '.'));
        // In Khmer context, numbers >= 500 without unit are typically Riels
        if (preferredLang === 'km' && val >= 500) {
          amount = val;
          currency = 'KHR';
        } else {
          amount = val;
          currency = defaultCurrency || 'USD';
        }
      }
    }
  }

  // Detect Type & Category across ALL 19 supported languages
  let type: EntryType = 'note';
  let category: CategoryType = 'others';
  let isLaborLog = false;
  let detectedPersonName: string | undefined;

  const lower = normalized.toLowerCase();

  // Helper & Labor Cost Matchers (Salary, Advance, Absence, Attendance)
  const isSalary = /ប្រាក់ខែ|បើកប្រាក់ខែ|ថ្លៃឈ្នួល|salary|wage|wages|lương|tiền\s*lương|เงินเดือน|ค่าจ้าง|gaji|upah|sweldo|sahod|ເງິນເດືອນ|လစာ|工资|薪水|월급|salaire|gehalt|sueldo|salario|salaris/i.test(lower);
  const isAdvance = /បុរេប្រទាន|ខ្ចីមុន|advance|salary\s*advance|tạm\s*ứng|เบิกล่วงหน้า|kasbon|panimula|ເບີກກ່ອນ|ကြိုထုတ်|预支|가불|avance|vorschuss|anticipo|voorschot|adiantamento/i.test(lower);
  const isAbsence = /ឈប់សម្រាក|អវត្តមាន|ឈឺ|សុំច្បាប់|absent|absence|sick|day\s*off|leave|nghỉ\s*phép|nghỉ\s*làm|nghỉ\s*ốm|ขาดงาน|ลาป่วย|ลาหยุด|absen|izin|sakit|libur|lumiban|không\s*có\s*mặt|ລາພັກ|ခွင့်|ပျက်ကွက်|请假|缺勤|生病|결근|휴가|병가|absent|congé|malade|krank|fehlt|ausfall|ausente|baja|assente|malattia|ziek|afwezig|falta/i.test(lower);
  const isHelperStaff = /បុគ្គលិក|កូនឈ្នួល|អ្នកជួយ|កូនជាង|helper|assistant|staff|employee|worker|nhân\s*viên|phụ\s*việc|ลูกจ้าง|คนช่วย|pembantu|karyawan|kasambahay|ພະນັກງານ|အကူ|ဝန်ထမ်း|员工|帮工|직원|assistant|employé|mitarbeiter|asistente|empleado|assistente|dipendente|medewerker/i.test(lower);

  // Extract helper name if mentioned e.g., "Sokha", "Dara", "សុខា", "ដារ៉ា", "Bopha", "បុប្ផា"
  const knownNamesMatch = lower.match(/(?:ឱ្យ|ទៅ|បុគ្គលិក|helper|staff|for|to)?\s*(សុខា|ដារ៉ា|បុប្ផា|រតនា|sokha|dara|bopha|channa|rattana|linh|mai|somchai|noi)/i);
  if (knownNamesMatch && knownNamesMatch[1]) {
    detectedPersonName = knownNamesMatch[1].trim();
  }

  if (isSalary || isAdvance || isAbsence || isHelperStaff) {
    isLaborLog = true;
    category = 'msme';
    if (isAbsence && !amount) {
      type = 'note';
    } else {
      type = 'expense';
    }
  }

  // Multi-language Intent Keyword Matchers:
  // Income
  const isIncome = /លក់|ចំណូល|បានលុយ|ប្រមូល|រកបាន|sold|sale|sales|income|received|earn|revenue|bán|thu\s*nhập|doanh\s*thu|nhận\s*tiền|ขาย|รายได้|ยอดขาย|ได้เงิน|jual|pendapatan|omzet|pemasukan|terima\s*uang|benta|kita|kinita|natanggap|ຂາຍ|ລາຍຮັບ|ໄດ້ເງິນ|ရောင်း|ဝင်ငွေ|ရောင်းရငွေ|卖|收入|销售|进账|赚|판매|수입|매출|입금|벌었|vente|vendu|revenu|recette|verkauf|verkauft|einnahme|umsatz|venta|vendido|ingreso|cobro|ganado|venduto|entrata|incasso|ricavo|verkoop|verkocht|inkomst|receita|faturamento/i.test(lower);

  // Expense
  const isExpense = /ទិញ|ចំណាយ|បង់|អស់|ថ្លៃ|bought|paid|expense|spent|cost|fee|purchase|mua|chi\s*phí|trả\s*tiền|tốn|tiêu|ซื้อ|จ่าย|ค่าใช้จ่าย|หมดไป|beli|bayar|belanja|pengeluaran|biaya|ongkos|gastos|nagbayad|binayaran|bayad|ຊື້|ຈ່າຍ|ລາຍຈ່າຍ|ເສຍເງິນ|ဝယ်|ကုန်ကျစရိတ်|သုံး|ပေး|买|支出|花费|购买|费用|付款|구매|구입|지출|비용|썼음|결제|acheté|achat|dépense|payé|frais|coût|gekauft|kauf|ausgabe|bezahlt|kosten|comprado|compra|gasto|pagado|costo|acquisto|spesa|gekocht|aankoop|uitgave|betaald|despesa/i.test(lower);

  // Debt
  const isDebt = /ជំពាក់|ខ្ចី|owe|debt|credit|borrow|lend|loan|nợ|thiếu|vay|mượn|หนี้|ค้างชำระ|ติดหนี้|ยืม|hutang|piutang|pinjam|utang|pautang|hiram|ໜີ້|ຢືມ|ကြွေး|အကြွေး|ချေး|借|欠款|欠钱|赊账|빚|외상|빌림|채무|dette|crédit|emprunt|prêt|schulden|kredit|geliehen|deuda|fiado|préstamo|debito|prestito|schuld|lening|dívida/i.test(lower);

  // Health / Medicine
  const isHealth = /លេបថ្នាំ|ថ្នាំ|ពេទ្យ|ពិនិត្យសុខភាព|សុខភាព|medicine|pill|medication|tablet|vitamin|clinic|doctor|hospital|health|thuốc|uống\s*thuốc|bệnh\s*viện|bác\s*sĩ|sức\s*khỏe|ยา|ทานยา|กินยา|หมอ|คลินิก|สุขภาพ|obat|minum\s*obat|pil|dokter|klinik|kesehatan|gamot|inum\s*ng\s*gamot|doktor|klinika|kalusugan|ຢາ|ກິນຢາ|ໝໍ|ສຸຂະພາບ|ဆေး|ဆေးသောက်|ဆရာဝန်|ကျန်းမာရေး|药|吃药|药片|诊所|医生|健康|약|약먹기|복용|병원|의사|건강|médicament|pilule|comprimé|santé|medikament|tablette|pille|arzt|gesundheit|pastilla|medicamento|salud|farmaco|salute|medicijn|remédio|pílula/i.test(lower);

  // Meeting & Appointments
  const isMeeting = /ប្រជុំ|ណាត់|ជួប|ជជែក|meeting|appointment|discuss|consultation|call|zoom|họp|gặp\s*gỡ|hẹn|ประชุม|นัดหมาย|rapat|pertemuan|janji|pulong|miting|usapan|ປະຊຸມ|ນັດ|အစည်းအဝေး|တွေ့ဆုံ|ဆွေးနွေး|开会|会议|预约|회의|미팅|약속|réunion|rendez-vous|besprechung|termin|reunión|cita|junta|riunione|appuntamento|vergadering|afspraak|encontro/i.test(lower);

  // Training & Mentorship
  const isTraining = /បណ្តុះបណ្តាល|រៀន|វគ្គ|គ្រូ|សិស្ស|training|workshop|course|mentorship|mentor|coaching|webinar|đào\s*tạo|tập\s*huấn|khóa\s*học|cố\s*vấn|อบรม|สัมมนา|การเรียน|ที่ปรึกษา|pelatihan|kursus|pembimbing|seminar|pagsasanay|kurso|tagapayo|ຝຶກອົບຮົມ|ຮຽນ|သင်တန်း|လမ်းညွှန်|培训|研讨会|导师|辅导|교육|워크샵|멘토|연수|formation|atelier|cours|schulung|capacitación|taller|mentoría|formazione|mentore/i.test(lower);

  // Family & Utilities
  const isUtilities = /ភ្លើង|ទឹក|edc|wifi|bill|electricity|water|điện|nước|ไฟ|ค่าน้ำ|listrik|air|kuryente|tubig|ໄຟຟ້າ|မီး|ရေ|电费|水费|전기|수도|électricité|eau|strom|wasser|electricidad|agua|luce|acqua|stroom|water/i.test(lower);

  // Food, Meals, Drinks & Dining (Very common daily personal/family expense)
  const isFoodOrDining = /អាហារ|បាយ|គុយទាវ|កាហ្វេ|ទឹកតែ|នំប៉័ង|មី|ម្ហូប|ភេសជ្ជៈ|បាយព្រឹក|បាយថ្ងៃ|បាយល្ងាច|breakfast|lunch|dinner|meal|meals|snack|coffee|tea|drink|food|bread|noodle|noodles|rice|soup|cafe|restaurant|burger|pizza|ăn\s*sáng|ăn\s*trưa|ăn\s*tối|cà\s*phê|cơm|phở|อาหารเช้า|อาหารกลางวัน|อาหารเย็น|กาแฟ|ข้าว|sarapan|makan\s*siang|makan\s*malam|kopi|almusal|tanghalian|hapunan|kape|ontbijt|middageten|avondeten|lunch|diner|koffie|frühstück|mittagessen|abendessen|kaffee|petit-déjeuner|déjeuner|dîner|café|desayuno|almuerzo|cena|colazione|pranzo|caffè/i.test(lower);

  if (!isLaborLog) {
    if (basketResult && basketResult.isBasket) {
      category = 'msme';
      type = isExpense ? 'expense' : 'income';
    } else if (isDebt) {
      type = 'debt';
      category = 'msme';
    } else if (isIncome) {
      type = 'income';
      category = 'msme';
    } else if (isExpense || isFoodOrDining || isUtilities || (amount !== undefined && !isTraining && !isMeeting && !isHealth)) {
      type = 'expense';
      if (isFoodOrDining || isUtilities) {
        category = 'family';
      } else if (/ប្រអប់|ស្កុត|ទំនិញ|wholesale|packaging|stock|hàng|สต็อก|barang|paninda|ကုန်ပစ္စည်း|货|재고|marchandise|ware|mercancía/i.test(lower)) {
        category = 'msme';
      } else {
        category = 'family';
      }
    } else if (isTraining) {
      type = 'reminder';
      category = 'training';
    } else if (isMeeting) {
      type = 'reminder';
      category = 'meeting';
    } else if (isHealth) {
      type = 'reminder';
      category = 'health';
    }
  }

  // Extract time if any
  let reminderTime: string | undefined;
  const timeMatch = 
    normalized.match(/ម៉ោង\s*(\d{1,2}(?::\d{2})?)\s*(ព្រឹក|ថ្ងៃ|រសៀល|ល្ងាច|យប់)?/i) || 
    normalized.match(/at\s*(\d{1,2}(?::\d{2})?\s*(?:am|pm)?)/i) ||
    normalized.match(/lúc\s*(\d{1,2}(?::\d{2})?)\s*(sáng|trưa|chiều|tối)?/i) ||
    normalized.match(/(\d{1,2}(?::\d{2})?\s*(?:giờ|h))\s*(sáng|chiều|tối)?/i) ||
    normalized.match(/(\d{1,2}(?::\d{2})?\s*(?:am|pm))/i) ||
    normalized.match(/(\d{1,2}:\d{2})/);

  if (timeMatch) {
    reminderTime = timeMatch[0];
  }

  // Bilingual titles
  let titleKhmer = clean;
  let titleEnglish = clean;

  if (basketResult && basketResult.isBasket) {
    const summaryNames = basketResult.basketItems.map((b) => b.name).join(', ');
    titleKhmer = `កន្ត្រកទំនិញ (${basketResult.basketItems.length} មុខ)៖ ${summaryNames}`;
    titleEnglish = `Grocery Basket (${basketResult.basketItems.length} items): ${summaryNames}`;
  } else if (isFoodOrDining) {
    if (/breakfast|អាហារពេលព្រឹក|បាយព្រឹក|ăn\s*sáng|อาหารเช้า|sarapan|ontbijt|frühstück|petit-déjeuner|desayuno/i.test(lower)) {
      titleKhmer = 'អាហារពេលព្រឹក (Breakfast)';
      titleEnglish = 'Breakfast (អាហារពេលព្រឹក)';
    } else if (/lunch|អាហារថ្ងៃត្រង់|បាយថ្ងៃ|ăn\s*trưa|อาหารกลางวัน|makan\s*siang|middageten|mittagessen|déjeuner|almuerzo/i.test(lower)) {
      titleKhmer = 'អាហារថ្ងៃត្រង់ (Lunch)';
      titleEnglish = 'Lunch (អាហារថ្ងៃត្រង់)';
    } else if (/dinner|អាហារពេលល្ងាច|បាយល្ងាច|ăn\s*tối|อาหารเย็น|makan\s*malam|avondeten|abendessen|dîner|cena/i.test(lower)) {
      titleKhmer = 'អាហារពេលល្ងាច (Dinner)';
      titleEnglish = 'Dinner (អាហារពេលល្ងាច)';
    } else if (/coffee|កាហ្វេ|cà\s*phê|กาแฟ|kopi|koffie|kaffee|café/i.test(lower)) {
      titleKhmer = 'កាហ្វេ (Coffee)';
      titleEnglish = 'Coffee (កាហ្វេ)';
    } else if (/noodle|គុយទាវ|មី|phở|ก๋วยเตี๋ยว|mie/i.test(lower)) {
      titleKhmer = 'គុយទាវ/មី (Noodles)';
      titleEnglish = 'Noodles (គុយទាវ/មី)';
    }
  }

  return {
    category,
    type,
    titleKhmer,
    titleEnglish,
    amount,
    currency,
    reminderTime,
    personName: detectedPersonName,
    items: basketResult?.itemsList,
    basketBreakdown: basketResult?.basketItems,
    isLaborLog,
    confidenceScore: 0.98,
  };
}

