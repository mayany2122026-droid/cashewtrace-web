import React from 'react';
import { 
  Phone, MessageSquare, Mail, MapPin, Send, 
  ShieldCheck, Sparkles, ExternalLink, Headphones,
  Facebook, Globe
} from 'lucide-react';
import { SupportedLanguage } from '../types';

interface OfficialContactCardProps {
  lang?: SupportedLanguage;
}

export const OfficialContactCard: React.FC<OfficialContactCardProps> = ({ lang = 'km' }) => {
  // Translations mapped for all supported languages
  const getTelegramSupportLabel = (l?: string) => {
    switch (l) {
      case 'km': return 'ជំនួយ Telegram';
      case 'nl': return 'Telegram Ondersteuning';
      case 'de': return 'Telegram Unterstützung';
      case 'vi': return 'Hỗ trợ Telegram';
      case 'th': return 'ฝ่ายสนับสนุน Telegram';
      case 'zh': return 'Telegram 客服支持';
      case 'ko': return '텔레그램 고객지원';
      case 'fr': return 'Support Telegram';
      case 'es': return 'Soporte Telegram';
      case 'it': return 'Assistenza Telegram';
      case 'pt': return 'Suporte Telegram';
      case 'id': return 'Dukungan Telegram';
      case 'ms':
      case 'bn': return 'Sokongan Telegram';
      case 'fil': return 'Suporta sa Telegram';
      case 'lo': return 'ການຊ່ວຍເຫຼືອ Telegram';
      case 'my': return 'တယ်လီဂရမ် အကူအညီ';
      case 'sg':
      case 'en':
      default: return 'Telegram Support';
    }
  };

  const getSendTelegramLabel = (l?: string) => {
    switch (l) {
      case 'km': return 'ផ្ញើសារ Telegram';
      case 'nl': return 'Telegram Bericht';
      case 'de': return 'Telegram Nachricht';
      case 'vi': return 'Gửi Telegram';
      case 'th': return 'ส่ง Telegram';
      case 'zh': return '发送 Telegram';
      case 'ko': return '텔레그램 메시지';
      case 'fr': return 'Envoyer Telegram';
      case 'es': return 'Enviar Telegram';
      case 'it': return 'Invia Telegram';
      case 'pt': return 'Enviar Telegram';
      case 'id': return 'Kirim Telegram';
      case 'ms':
      case 'bn': return 'Hantar Telegram';
      case 'fil': return 'Mag-Telegram';
      case 'lo': return 'ສົ່ງ Telegram';
      case 'my': return 'တယ်လီဂရမ် ပို့မည်';
      case 'sg':
      case 'en':
      default: return 'Telegram Support';
    }
  };

  const getBadgeLabel = (l?: string) => {
    switch (l) {
      case 'km': return 'ព័ត៌មានទំនាក់ទំនងផ្លូវការ';
      case 'nl': return 'OFFICIEEL CONTACTCENTRUM';
      case 'de': return 'OFFIZIELLES KONTAKTZENTRUM';
      case 'vi': return 'THÔNG TIN LIÊN HỆ CHÍNH THỨC';
      case 'th': return 'ข้อมูลการติดต่ออย่างเป็นทางการ';
      case 'zh': return '官方联络中心';
      case 'ko': return '공식 고객지원 센터';
      case 'fr': return 'CENTRE DE CONTACT OFFICIEL';
      case 'es': return 'CENTRO DE CONTACTO OFICIAL';
      case 'it': return 'CENTRO DI CONTATTO UFFICIALE';
      case 'pt': return 'CENTRO DE CONTACTO OFICIAL';
      case 'id': return 'PUSAT KONTAK RESMI';
      case 'ms':
      case 'bn': return 'PUSAT HUBUNGAN RASMI';
      case 'fil': return 'OPISYAL NA SENTRO NG KONTAK';
      case 'lo': return 'ສູນຕິດຕໍ່ຢ່າງເປັນທາງການ';
      case 'my': return 'တရားဝင် ဆက်သွယ်ရန် ဌာန';
      default: return 'OFFICIAL HEADQUARTERS & SUPPORT';
    }
  };

  const getTitleLabel = (l?: string) => {
    switch (l) {
      case 'km': return 'ទំនាក់ទំនងផ្លូវការ — MyDailyPA';
      case 'nl': return 'Officieel Contact — MyDailyPA';
      case 'de': return 'Offizieller Kontakt — MyDailyPA';
      case 'vi': return 'Liên hệ chính thức — MyDailyPA';
      case 'th': return 'ติดต่ออย่างเป็นทางการ — MyDailyPA';
      case 'zh': return '官方联络 — MyDailyPA';
      case 'ko': return '공식 연락처 — MyDailyPA';
      case 'fr': return 'Contact Officiel — MyDailyPA';
      case 'es': return 'Contacto Oficial — MyDailyPA';
      case 'it': return 'Contatto Ufficiale — MyDailyPA';
      case 'pt': return 'Contacto Oficial — MyDailyPA';
      case 'id': return 'Kontak Resmi — MyDailyPA';
      case 'ms':
      case 'bn': return 'Hubungan Rasmi — MyDailyPA';
      case 'fil': return 'Opisyal na Kontak — MyDailyPA';
      case 'lo': return 'ຕິດຕໍ່ຢ່າງເປັນທາງການ — MyDailyPA';
      case 'my': return 'တရားဝင် ဆက်သွယ်ရန် — MyDailyPA';
      default: return 'Official Contact — MyDailyPA';
    }
  };

  const getSubtitleLabel = (l?: string) => {
    switch (l) {
      case 'km': return 'ទំនាក់ទំនង MyDailyPA សម្រាប់ការគាំទ្របច្ចេកទេស និងកិច្ចសហប្រតិបត្តិការ MSME៖';
      case 'nl': return 'Neem contact op met MyDailyPA voor technische ondersteuning en MSME-partnerschap:';
      case 'de': return 'Kontaktieren Sie MyDailyPA für technischen Support und MSME-Partnerschaften:';
      case 'vi': return 'Liên hệ MyDailyPA để được hỗ trợ kỹ thuật và hợp tác kinh doanh MSME:';
      case 'th': return 'ติดต่อ MyDailyPA เพื่อขอรับการสนับสนุนทางเทคนิคและความร่วมมือทางธุรกิจ MSME:';
      case 'zh': return '联系 MyDailyPA 获取技术支持与中小微企业商务合作：';
      case 'ko': return '기술 지원 및 소상공인 파트너십을 위해 MyDailyPA에 문의하세요:';
      case 'fr': return 'Contactez MyDailyPA pour le support technique et le partenariat MPME :';
      case 'es': return 'Póngase en contacto con MyDailyPA para soporte técnico y alianzas comerciales:';
      case 'it': return 'Contatta MyDailyPA per supporto tecnico e partnership per le PMI:';
      case 'pt': return 'Contacte o MyDailyPA para suporte técnico e parcerias empresariais:';
      case 'id': return 'Hubungi MyDailyPA untuk dukungan teknis dan kemitraan bisnis UMKM:';
      case 'ms':
      case 'bn': return 'Hubungi MyDailyPA untuk sokongan teknikal dan perkongsian perniagaan PKS:';
      case 'fil': return 'Makipag-ugnayan sa MyDailyPA para sa teknikal na suporta at kooperasyon:';
      case 'lo': return 'ຕິດຕໍ່ MyDailyPA ສໍາລັບການຊ່ວຍເຫຼືອດ້ານເຕັກນິກ ແລະ ການຮ່ວມມືທຸລະກິດ:';
      case 'my': return 'နည်းပညာ အကူအညီနှင့် စီးပွားရေး ပူးပေါင်းဆောင်ရွက်ရန် MyDailyPA သို့ ဆက်သွယ်ပါ:';
      default: return 'Contact MyDailyPA for technical support and MSME business partnership:';
    }
  };

  const getOrgBadge = (l?: string) => {
    switch (l) {
      case 'km': return 'ស្ថាប័ន';
      case 'nl': return 'ORGANISATIE';
      case 'de': return 'ORGANISATION';
      case 'vi': return 'TỔ CHỨC';
      case 'th': return 'องค์กร';
      case 'zh': return '机构';
      case 'ko': return '기관 / 조직';
      case 'fr': return 'ORGANISATION';
      case 'es': return 'ORGANIZACIÓN';
      case 'it': return 'ORGANIZZAZIONE';
      case 'pt': return 'ORGANIZAÇÃO';
      case 'id': return 'ORGANISASI';
      case 'ms':
      case 'bn': return 'ORGANISASI';
      case 'fil': return 'ORGANISASYON';
      default: return 'ORGANIZATION';
    }
  };

  const getOrgDesc = (l?: string) => {
    switch (l) {
      case 'km': return 'ជំនួយការសំឡេង AI កម្ពុជា & កត់ត្រាប្រចាំថ្ងៃ';
      case 'nl': return 'Cambodja Voice AI & Dagelijks Beheer';
      case 'de': return 'Kambodscha Voice AI & Tägliche Verwaltung';
      case 'vi': return 'Trợ lý giọng nói AI Campuchia & Quản lý hàng ngày';
      case 'th': return 'ผู้ช่วยเสียง AI กัมพูชา & บันทึกประจำวัน';
      case 'zh': return '柬埔寨智能语音助手与日常记账';
      case 'ko': return '캄보디아 음성 AI 비서 및 일일 장부 관리';
      case 'fr': return 'IA vocale du Cambodge et gestion quotidienne';
      case 'es': return 'IA vocal de Camboya y contabilidad diaria';
      case 'it': return 'IA vocale della Cambogia e gestione quotidiana';
      case 'pt': return 'IA vocal do Camboja e gestão diária';
      case 'id': return 'Asisten Suara AI Kamboja & Pembukuan Harian';
      case 'ms':
      case 'bn': return 'Pembantu Suara AI Kemboja & Pengurusan Harian';
      default: return 'Cambodia Voice AI & Daily Bookkeeping';
    }
  };

  const getLocationLabel = (l?: string) => {
    switch (l) {
      case 'km': return 'ទីតាំង៖ រាជធានីភ្នំពេញ កម្ពុជា • mydailypa.com';
      case 'nl': return 'Locatie: Phnom Penh, Cambodja • mydailypa.com';
      case 'de': return 'Standort: Phnom Penh, Kambodscha • mydailypa.com';
      case 'vi': return 'Địa điểm: Phnom Penh, Campuchia • mydailypa.com';
      case 'th': return 'ที่ตั้ง: พนมเปญ กัมพูชา • mydailypa.com';
      case 'zh': return '地点: 柬埔寨金边 • mydailypa.com';
      case 'ko': return '위치: 캄보디아 프놈펜 • mydailypa.com';
      case 'fr': return 'Emplacement : Phnom Penh, Cambodge • mydailypa.com';
      case 'es': return 'Ubicación: Phnom Penh, Camboya • mydailypa.com';
      case 'it': return 'Posizione: Phnom Penh, Cambogia • mydailypa.com';
      case 'pt': return 'Localização: Phnom Penh, Camboja • mydailypa.com';
      case 'id': return 'Lokasi: Phnom Penh, Kamboja • mydailypa.com';
      case 'ms':
      case 'bn': return 'Lokasi: Phnom Penh, Kemboja • mydailypa.com';
      default: return 'Location: Phnom Penh, Cambodia • mydailypa.com';
    }
  };

  const getSupport247 = (l?: string) => {
    switch (l) {
      case 'km': return 'ប្រព័ន្ធជំនួយ ២៤/៧';
      case 'nl': return '24/7 Ondersteuning';
      case 'de': return '24/7 Support';
      case 'vi': return 'Hỗ trợ 24/7';
      case 'th': return 'ช่วยเหลือ 24/7';
      case 'zh': return '24/7全天候支持';
      case 'ko': return '24/7 연중무휴 지원';
      case 'fr': return 'Support 24/7';
      case 'es': return 'Soporte 24/7';
      case 'it': return 'Supporto 24/7';
      case 'pt': return 'Suporte 24/7';
      case 'id': return 'Layanan 24/7';
      case 'ms':
      case 'bn': return 'Sokongan 24/7';
      default: return '24/7 Support Desk';
    }
  };

  const getDirectLineLabel = (l?: string) => {
    switch (l) {
      case 'km': return 'ខ្សែទូរស័ព្ទផ្ទាល់ (Hotline)';
      case 'nl': return 'Directe Lijn (Hotline)';
      case 'de': return 'Direkter Kanal (Hotline)';
      case 'vi': return 'Kênh trực tiếp (Hotline)';
      case 'th': return 'สายด่วนตรง (Hotline)';
      case 'zh': return '官方热线 (Hotline)';
      case 'ko': return '직통 전화 (Hotline)';
      case 'fr': return 'Ligne Directe (Hotline)';
      case 'es': return 'Línea Directa (Hotline)';
      case 'it': return 'Linea Diretta (Hotline)';
      case 'pt': return 'Linha Direta (Hotline)';
      case 'id': return 'Saluran Langsung (Hotline)';
      case 'ms':
      case 'bn': return 'Talian Terus (Hotline)';
      default: return 'Direct Hotline';
    }
  };

  const getTelegramFastReply = (l?: string) => {
    switch (l) {
      case 'km': return 'ឆ្លើយតបរហ័ស ២៤ ម៉ោង';
      case 'nl': return 'Snelle reactie binnen 24u';
      case 'de': return 'Schnelle Antwort 24h';
      case 'vi': return 'Phản hồi nhanh 24/7';
      case 'th': return 'ตอบกลับรวดเร็ว 24 ชม.';
      case 'zh': return '全天候快速回复';
      case 'ko': return '24시간 빠른 답변';
      case 'fr': return 'Réponse rapide 24h/24';
      case 'es': return 'Respuesta rápida 24h';
      case 'it': return 'Risposta rapida 24h';
      case 'pt': return 'Resposta rápida 24h';
      case 'id': return 'Respon cepat 24 jam';
      case 'ms':
      case 'bn': return 'Balasan pantas 24 jam';
      default: return 'Quick 24h Response';
    }
  };

  const getCallNow = (l?: string) => {
    switch (l) {
      case 'km': return 'ខលឥឡូវនេះ (Call)';
      case 'nl': return 'Bel Nu (Call)';
      case 'de': return 'Jetzt anrufen (Call)';
      case 'vi': return 'Gọi ngay (Call)';
      case 'th': return 'โทรตอนนี้ (Call)';
      case 'zh': return '立即致电 (Call)';
      case 'ko': return '전화 걸기 (Call)';
      case 'fr': return 'Appeler (Call)';
      case 'es': return 'Llamar (Call)';
      case 'it': return 'Chiama (Call)';
      case 'pt': return 'Ligar (Call)';
      case 'id': return 'Telepon Sekarang';
      case 'ms':
      case 'bn': return 'Hubungi Sekarang';
      default: return 'Call Now';
    }
  };

  const getSendEmail = (l?: string) => {
    switch (l) {
      case 'km': return 'ផ្ញើ Email';
      case 'nl': return 'E-mail Sturen';
      case 'de': return 'E-Mail senden';
      case 'vi': return 'Gửi Email';
      case 'th': return 'ส่งอีเมล';
      case 'zh': return '发送邮件';
      case 'ko': return '이메일 보내기';
      case 'fr': return 'Envoyer Email';
      case 'es': return 'Enviar Email';
      case 'it': return 'Invia Email';
      case 'pt': return 'Enviar Email';
      case 'id': return 'Kirim Email';
      case 'ms':
      case 'bn': return 'Hantar Emel';
      default: return 'Email';
    }
  };

  const telegramSupportText = getTelegramSupportLabel(lang);
  const sendTelegramText = getSendTelegramLabel(lang);
  const badgeText = getBadgeLabel(lang);
  const titleText = getTitleLabel(lang);
  const subtitleText = getSubtitleLabel(lang);
  const orgBadgeText = getOrgBadge(lang);
  const orgDescText = getOrgDesc(lang);
  const locationText = getLocationLabel(lang);
  const support247Text = getSupport247(lang);
  const directLineText = getDirectLineLabel(lang);
  const telegramFastReplyText = getTelegramFastReply(lang);
  const callNowText = getCallNow(lang);
  const sendEmailText = getSendEmail(lang);

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-6 my-6">
      <div className="rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-900 text-white p-5 sm:p-7 border border-slate-800 shadow-2xl relative overflow-hidden">
        
        {/* Subtle accent glow */}
        <div className="absolute top-0 right-0 w-60 h-60 bg-rose-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-60 h-60 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 space-y-5">
          
          {/* Header */}
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1.5">
                  <Headphones className="w-3 h-3" />
                  <span>{badgeText}</span>
                </span>
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-black text-white tracking-tight">
                {titleText}
              </h3>
              <p className="text-xs text-slate-300 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                <span>{locationText}</span>
              </p>
              <p className="text-xs text-slate-400 mt-1">
                {subtitleText}
              </p>
            </div>

            <div className="text-right">
              <span className="text-xs font-mono text-slate-400 block">{support247Text}</span>
              <span className="text-sm font-black text-amber-400 font-mono">+855 88 771 2862</span>
            </div>
          </div>

          {/* Contact Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            
            {/* Organization / Brand */}
            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-rose-400" />
                <span>{orgBadgeText}</span>
              </div>
              <p className="text-sm font-black text-white">MyDailyPA</p>
              <p className="text-[11px] text-slate-400 leading-snug">{orgDescText}</p>
            </div>

            {/* Direct Line / Hotline */}
            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>{directLineText}</span>
              </div>
              <p className="text-sm font-black font-mono text-white">088 771 2862</p>
              <p className="text-[11px] text-slate-500">+855 88 771 2862 • {support247Text}</p>
            </div>

            {/* Telegram Support - DYNAMICALLY TRANSLATED */}
            <a
              href="https://t.me/MAYANYEnterprise"
              target="_blank"
              rel="noopener noreferrer"
              className="block p-3.5 rounded-2xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-sky-500/50 space-y-1 transition-all group cursor-pointer"
            >
              <div className="flex items-center gap-2 text-xs font-bold text-slate-400 group-hover:text-sky-400">
                <Send className="w-3.5 h-3.5 text-sky-400" />
                <span className="transition-colors">{telegramSupportText}</span>
              </div>
              <p className="text-sm font-black font-mono text-sky-300 group-hover:underline">@MAYANYEnterprise</p>
              <p className="text-[11px] text-slate-500">{telegramFastReplyText}</p>
            </a>

          </div>

          {/* 1-Tap Quick Action Buttons */}
          <div className="pt-2 border-t border-slate-800 flex items-center gap-2 flex-wrap">
            <a
              href="tel:+855887712862"
              className="flex-1 min-w-[130px] py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>{callNowText}</span>
            </a>

            <a
              href="https://t.me/MAYANYEnterprise"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 min-w-[130px] py-2.5 px-4 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-black flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{sendTelegramText}</span>
            </a>

            <a
              href="https://wa.me/855887712862"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 min-w-[120px] py-2.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-black flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>

            <a
              href="mailto:mayany@mydailypa.com"
              className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-black flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>{sendEmailText}</span>
            </a>

            <a
              href="https://www.facebook.com/share/p/18sWyRnWDV/"
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-black flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <Facebook className="w-3.5 h-3.5" />
              <span>Facebook</span>
              <ExternalLink className="w-3 h-3 opacity-80" />
            </a>

            <a
              href="https://cashewtrace.com"
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs font-black flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer font-mono"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>cashewtrace.com</span>
              <ExternalLink className="w-3 h-3 opacity-80" />
            </a>
          </div>

        </div>
      </div>
    </div>
  );
};
