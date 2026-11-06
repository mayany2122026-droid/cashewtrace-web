import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShoppingBag, Plus, Minus, Check, ArrowRight, ShieldCheck, Sparkles, 
  MapPin, Phone, Mail, Award, Globe, Heart, Coffee, Truck, Clock, 
  FileText, Download, Printer, Share2, CheckCircle2, ChevronRight, 
  Package, DollarSign, X, HelpCircle, ExternalLink, Flame, MessageCircle,
  ZoomIn, Facebook, Building, Users, Quote, QrCode
} from 'lucide-react';
import { useLanguage } from '../lib/LanguageContext';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import CashewMilk1LLabelModal from './CashewMilk1LLabelModal';

export interface StoreProduct {
  id: string;
  nameKh: string;
  nameEn: string;
  nameKo: string;
  category: 'pouches' | 'jars' | 'beverage';
  priceUsd: number;
  weight: string;
  packageType: string;
  badgeKh: string;
  badgeEn: string;
  badgeKo: string;
  imageSrc: string;
  descriptionKh: string;
  descriptionEn: string;
  descriptionKo: string;
  highlightsKh: string[];
  highlightsEn: string[];
  highlightsKo: string[];
  baristaTipKh?: string;
  baristaTipEn?: string;
  baristaTipKo?: string;
  popularWith?: string;
}

export const STORE_PRODUCTS: StoreProduct[] = [
  // 1. 50g = $1.25 Chili Coated Cashew Kernels (Brown Craft Pouch)
  {
    id: 'chili-pouch-50g',
    nameKh: 'គ្រាប់ស្វាយចន្ទីស្រោបម្ទេស (កញ្ចប់ ៥០g)',
    nameEn: 'Chili Coated Cashew Kernels (50g Pouch)',
    nameKo: '고추맛 시즈닝 캐슈넛 (50g 파우치)',
    category: 'pouches',
    priceUsd: 1.25,
    weight: '50g',
    packageType: '50g Kraft Eco Pouch with Window',
    badgeKh: '៥០g = $1.25 (៥,១០០ ៛)',
    badgeEn: '50g = $1.25',
    badgeKo: '50g = $1.25',
    imageSrc: '/images/mayany_chili_pouch_50g.jpg',
    descriptionKh: 'គ្រាប់ស្វាយចន្ទីស្រោបម្ទេសហឹរស្រួយ កញ្ចប់ក្រដាសក្រាហ្វ ៥០ ក្រាម មានបង្អួចថ្លាមើលឃើញសាច់គ្រាប់។ រសជាតិហឹរឈ្ងុយដិតអារម្មណ៍ ញ៉ាំជាមួយស្រាបៀរ ឬជាអាហារសម្រន់។',
    descriptionEn: 'Chili coated crunchy cashew kernels in 50g craft eco pouch with transparent window. Savory & spicy bar snack.',
    descriptionKo: '50g 크라프트 지퍼백에 담긴 바삭하고 매콤한 프리미엄 캐슈넛. 투명 창을 통해 알찬 원물을 확인할 수 있으며, 맥주 안주나 간식으로 최고입니다.',
    highlightsKh: [
      'កញ្ចប់ក្រដាសក្រាហ្វ ៥០ ក្រាម មានខ្សែរូត',
      'រសជាតិម្ទេសហឹរស្រួយ ញ៉ាំជាមួយស្រាបៀរ',
      'តម្លៃសមរម្យត្រឹម $1.25 (៥,១០០ ៛) ក្នុងមួយកញ្ចប់'
    ],
    highlightsEn: [
      '50g craft pouch with resealable zipper',
      'Savory & spicy crunch, perfect beer pairing',
      'Official price: $1.25 per pouch'
    ],
    highlightsKo: [
      '50g 크라프트 친환경 스탠딩 지퍼백 포장',
      '맥주와 환상의 궁합인 매콤 바삭한 풍미',
      '공식 수출 단가: $1.25 / 팩'
    ]
  },

  // 2. 50g = $1.25 Sugar Coated Cashew Kernels (White Pouch)
  {
    id: 'sugar-pouch-50g',
    nameKh: 'គ្រាប់ស្វាយចន្ទីស្រោបស្ករ (កញ្ចប់ ៥០g)',
    nameEn: 'Sugar Coated Cashew Kernels (50g Pouch)',
    nameKo: '달콤 바삭 캐슈넛 (50g 파우치)',
    category: 'pouches',
    priceUsd: 1.25,
    weight: '50g',
    packageType: '50g White Standing Pouch with Window',
    badgeKh: '៥០g = $1.25 (៥,១០០ ៛)',
    badgeEn: '50g = $1.25',
    badgeKo: '50g = $1.25',
    imageSrc: '/images/mayany_sugar_pouch_50g.jpg',
    descriptionKh: 'គ្រាប់ស្វាយចន្ទីស្រោបស្ករធម្មជាតិ កញ្ចប់ពណ៌ស ៥០ ក្រាម ស្រួយក្រមោក រសជាតិផ្អែមស្រទន់ ពេញនិយមនៅកូរ៉េ។',
    descriptionEn: 'Sugar coated cashew kernels in 50g clean white pouch. Light caramel crunch, highly popular in South Korea.',
    descriptionKo: '50g 깔끔한 화이트 스탠딩 파우치에 담긴 은은한 천연 당 코팅 캐슈넛. 한국 바이어와 소비자들에게 가장 인기 있는 스위트 스낵입니다.',
    highlightsKh: [
      'កញ្ចប់ពណ៌ស ៥០ ក្រាម មានបង្អួចថ្លា',
      'ស្រោបស្ករធម្មជាតិ ស្រួយក្រមោក',
      'តម្លៃសមរម្យត្រឹម $1.25 (៥,១០០ ៛) ក្នុងមួយកញ្ចប់'
    ],
    highlightsEn: [
      '50g white standing pouch with window',
      'Natural sugar glaze with crisp shell',
      'Official price: $1.25 per pouch'
    ],
    highlightsKo: [
      '50g 화이트 스탠딩 파우치 (투명 윈도우)',
      '자연스러운 달콤함과 바삭한 크런치 식감',
      '공식 수출 단가: $1.25 / 팩'
    ]
  },

  // 3. 50g = $1.25 GI Kampot Black Pepper Coated Cashew Kernels (Black Pouch)
  {
    id: 'pepper-pouch-50g',
    nameKh: 'គ្រាប់ស្វាយចន្ទីស្រោបម្រេចខ្មៅកំពត GI (កញ្ចប់ ៥០g)',
    nameEn: 'GI Kampot Black Pepper Coated Cashew Kernels (50g Pouch)',
    nameKo: '캄폿 GI 유기농 흑후추 코팅 캐슈넛 (50g 파우치)',
    category: 'pouches',
    priceUsd: 1.25,
    weight: '50g',
    packageType: '50g Matte Black Pouch with Window',
    badgeKh: '៥០g = $1.25 (៥,១០០ ៛)',
    badgeEn: '50g = $1.25',
    badgeKo: '50g = $1.25',
    imageSrc: '/images/mayany_pepper_pouch_50g.jpg',
    descriptionKh: 'គ្រាប់ស្វាយចន្ទីស្រោបម្រេចខ្មៅកំពត GI កញ្ចប់ខ្មៅប្រណិត ៥០ ក្រាម គ្រាប់ពេញលេញ ឈ្ងុយហឹរស្រទន់តាមស្តង់ដារ GI កំពត។',
    descriptionEn: 'Whole cashew kernels coated with authentic GI Kampot black pepper in 50g matte black pouch.',
    descriptionKo: '세계 최고급 캄폿 지리적표시(GI) 흑후추를 입힌 프리미엄 통 캐슈넛. 매트 블랙 지퍼 파우치로 신선함과 품격을 더했습니다.',
    highlightsKh: [
      'ម្រេចខ្មៅកំពត GI សុទ្ធ ១០០%',
      'កញ្ចប់ខ្មៅប្រណិត ៥០ ក្រាម មានខ្សែរូត',
      'តម្លៃសមរម្យត្រឹម $1.25 (៥,១០០ ៛) ក្នុងមួយកញ្ចប់'
    ],
    highlightsEn: [
      '100% Authentic GI Kampot Black Pepper',
      '50g matte black resealable pouch',
      'Official price: $1.25 per pouch'
    ],
    highlightsKo: [
      '100% 정품 캄폿 GI 유기농 흑후추 사용',
      '50g 매트 블랙 지퍼 밀봉 파우치',
      '공식 수출 단가: $1.25 / 팩'
    ]
  },

  // 4. 50g = $0.65 GI Kampot Black Pepper Coated Cashews - Broken / BB Grade (Black Pouch)
  {
    id: 'pepper-broken-pouch-50g',
    nameKh: 'គ្រាប់ស្វាយចន្ទីស្រោបម្រេចខ្មៅកំពត GI - ចំណាត់ថ្នាក់បំណែក (កញ្ចប់ ៥០g)',
    nameEn: 'GI Kampot Black Pepper Coated Cashews - Broken Grade (50g Pouch)',
    nameKo: '캄폿 GI 흑후추 코팅 캐슈넛 - 스플릿 가공용 (50g 파우치)',
    category: 'pouches',
    priceUsd: 0.65,
    weight: '50g',
    packageType: '50g Matte Black Pouch with Window',
    badgeKh: '៥០g = $0.65 (២,៧០០ ៛)',
    badgeEn: '50g = $0.65',
    badgeKo: '50g = $0.65',
    imageSrc: '/images/mayany_pepper_broken_pouch_50g.jpg',
    descriptionKh: 'គ្រាប់ស្វាយចន្ទីបំណែក (Broken / Split Kernels) ស្រោបម្រេចខ្មៅកំពត GI កញ្ចប់ ៥០ ក្រាម រសជាតិឈ្ងុយឆ្ងាញ់ដូចគ្នា តម្លៃសន្សំសំចៃត្រឹម $0.65។',
    descriptionEn: 'Broken / split grade cashew pieces coated with GI Kampot black pepper in 50g pouch. Great value gourmet condiment.',
    descriptionKo: '최고급 캄폿 GI 흑후추를 입힌 가성비 최고의 스플릿/부서진 캐슈넛. 요리용 토핑, 제과제빵, 가성비 스낵으로 탁월합니다.',
    highlightsKh: [
      'ចំណាត់ថ្នាក់គ្រាប់បំណែក BB Broken Grade',
      'ស្រោបម្រេចខ្មៅកំពត GI ឈ្ងុយហឹរដូចគ្នា',
      'តម្លៃសន្សំសំចៃពិសេសត្រឹម $0.65 (២,៧០០ ៛) ក្នុងមួយកញ្ចប់'
    ],
    highlightsEn: [
      'Broken / Split kernel grade',
      'Coated with GI Kampot black pepper',
      'Exceptional value: $0.65 per pouch'
    ],
    highlightsKo: [
      '스플릿/부서진 캐슈넛 알뜰 가성비 등급',
      '고급 캄폿 GI 흑후추 정품 코팅',
      '파격 특가: $0.65 / 팩'
    ]
  },

  // 5. 1L = $3.00 Cashew Milk (1 Liter Glass Bottle)
  {
    id: 'cashew-milk-1l',
    nameKh: 'ទឹកដោះគោគ្រាប់ស្វាយចន្ទី ១០០%',
    nameEn: '100% Plant-Based Cashew Milk',
    nameKo: '100% 식물성 생 캐슈넛 밀크 (1L 병)',
    category: 'beverage',
    priceUsd: 4.50,
    weight: '1L',
    packageType: '1L Glass Bottle with Full Nutritional Label',
    badgeKh: '១L = $4.50 ($3.00 ភេសជ្ជៈ + $1.50 ដប)',
    badgeEn: '1L = $4.50 ($3.00 Drink + $1.50 Bottle)',
    badgeKo: '1L = $4.50 (음료 $3.00 + 유리병 $1.50)',
    imageSrc: '/images/mayany_cashew_milk_1l.jpg',
    descriptionKh: 'ទឹកដោះគោគ្រាប់ស្វាយចន្ទី ១០០% (Make to Order)។ សេចក្តីប្រកាសបញ្ជីគ្រឿងផ្សំពេញលេញ៖ ទឹកចម្រោះ 86%, គ្រាប់ស្វាយចន្ទី 12.9%, ស្ករ 0.86%, ម្សៅស្លឹកតើយ 0.13%, អំបិល 0.09%។ ភេសជ្ជៈប្រណិត អាចទទួលទានផ្ទាល់ភ្លាមៗ ឬលាយជាមួយកាហ្វេ។ គ្មានជាតិទឹកដោះគោគោ (Dairy-Free & Vegan) គ្មានជាតិ Gluten សម្បូរជីវជាតិ និងប្រូតេអ៊ីនធម្មជាតិ។ តម្លៃមានតម្លាភាព៖ ៤.៥០$ (ទឹកដោះគោ ៣.០០$ + ថ្លៃដបកែវ ១.៥០$)។ លើកក្រោយអាចយកដបកែវមកប្តូរទិញតែភេសជ្ជៈក្នុងតម្លៃត្រឹមតែ ៣.០០$។ ស្កេន QR លើដបដើម្បីកុម្ម៉ង់ទិញផ្ទាល់តាម WhatsApp។',
    descriptionEn: '100% plant-based cashew milk in 1L bottle. Smooth, creamy, naturally lactose-free and nutrient-dense. Transparent pricing: $4.50 total ($3.00 drink + $1.50 glass bottle). Bottle can be refilled or exchanged for $3.00. Direct order QR code on bottle.',
    descriptionKo: '유당이 전혀 없는 100% 식물성 프리미엄 캐슈넛 밀크 (1L 병). 부드럽고 진한 풍미로 비건 음료 및 라떼 베이스로 최적. 투명한 가격 정책: 총 $4.50 (음료 $3.00 + 유리병 원가 $1.50, 공병 반납 시 $3.00 재구매). 병 라벨 부착 QR 코드로 즉시 재주문 가능.',
    highlightsKh: [
      'ចំណុះ ១ លីត្រ (1L) ក្នុងដបកែវអនាម័យ តម្លៃ $4.50',
      'តម្លាភាពតម្លៃ: ទឹកដោះគោ $3.00 + ថ្លៃដប $1.50',
      'លើកក្រោយយកដបមកប្តូរទិញទឹកដោះគោត្រឹមតែ $3.00',
      'គ្មានជាតិទឹកដោះគោ (Dairy-Free & Vegan)',
      'មានកូដ QR លើដប សម្រាប់ស្កេនកុម្ម៉ង់ទិញផ្ទាល់'
    ],
    highlightsEn: [
      '1 Liter sanitary glass bottle ($4.50 total)',
      'Transparent price: $3.00 drink + $1.50 glass bottle',
      'Bottle exchange / refill next time for only $3.00',
      'Naturally dairy-free, lactose-free, vegan',
      'Direct order QR code on bottle'
    ],
    highlightsKo: [
      '1리터 위생 유리병 포장 (총 $4.50)',
      '투명한 가격: 음료 $3.00 + 유리병 $1.50',
      '공병 회수/교환 시 음료 가격 $3.00만 결제',
      '락토오스 무함유, 100% 순수 식물성 비건 밀크',
      '병 라벨 부착 직통 주문 QR 코드'
    ]
  },

  // 6. 200g = $2.50 100% Pure Cashew Kernel Flour (200g PET Jar)
  {
    id: 'flour-jar-200g',
    nameKh: 'ម្សៅគ្រាប់ស្វាយចន្ទីសុទ្ធ ១០០% (កំប៉ុង PET ២០០g)',
    nameEn: '100% Pure Cashew Kernel Flour (200g PET Jar)',
    nameKo: '100% 순수 냉압착 캐슈넛 파우더 / 바리스타 라떼용 (200g PET 용기)',
    category: 'beverage',
    priceUsd: 2.50,
    weight: '200g',
    packageType: '200g Clear Induction Sealed PET Jar',
    badgeKh: '២០០g = $2.50 (១០,២៥០ ៛)',
    badgeEn: '200g = $2.50',
    badgeKo: '200g = $2.50',
    imageSrc: '/images/mayany_cashew_flour_200g.jpg',
    descriptionKh: 'ម្សៅកិនម៉ត់ពីសាច់គ្រាប់ស្វាយចន្ទីសុទ្ធ ១០០% កំប៉ុង PET ២០០ ក្រាម។ គ្មានលាយម្សៅ គ្មានទឹកដោះគោ គ្មានជាតិស្ករ។ លាយជាមួយកាហ្វេក្ដៅ/ត្រជាក់ ម៉ាតឆា ឬទឹកផ្លែឈើ បង្កើតជាក្រែមធម្មជាតិជំនួសទឹកដោះគោ ដូចដែលអ្នកវិនិយោគកូរ៉េនៅសេអ៊ូលបានដាក់លាយក្នុងកាហ្វេក្តៅរបស់គាត់ផ្ទាល់!',
    descriptionEn: '100% pure cold-milled cashew kernel flour in 200g PET jar. Mixes smoothly into hot or iced coffee as plant-based creamer (personally mixed into hot coffee and praised by a Korean startup investor in Seoul!).',
    descriptionKo: '200g 밀폐 PET 용기에 담긴 100% 순수 냉압착 캐슈넛 파우더. 커피에 1~2스푼 섞으면 우유 대체 식물성 크레마가 형성되는 바리스타 캐슈 라떼용! (서울의 한국 스타트업 투자자가 따뜻한 커피에 직접 타서 시음하고 극찬)',
    highlightsKh: [
      'សាច់គ្រាប់ស្វាយចន្ទីសុទ្ធ ១០០% កិនត្រជាក់ម៉ត់ខៃ (កំប៉ុង PET ២០០g)',
      'គ្មានជាតិ gluten, គ្មានទឹកដោះគោ (Plant-based & Vegan)',
      'តម្លៃផ្លូវការ: $2.50 (១០,២៥០ ៛) ក្នុងមួយកំប៉ុង'
    ],
    highlightsEn: [
      '100% Cold-milled Cambodian Cashew Kernels (200g PET jar)',
      'Gluten-free, lactose-free natural creamer alternative',
      'Tested and mixed into hot coffee by a Korean startup investor in Seoul'
    ],
    highlightsKo: [
      '100% 순수 캄보디아산 캐슈넛 미세 분말 (200g PET 용기)',
      '글루텐 프리, 유당 없는 천연 식물성 크리머',
      '서울 스타트업 투자자가 직접 따뜻한 커피와 시음 검증'
    ],
    baristaTipKh: '☕ វិធីឆុងកាហ្វេជាមួយម្សៅស្វាយចន្ទី (Cashew Latte): ដួសម្សៅស្វាយចន្ទី ១-២ ស្លាបព្រាបាយ ចូលទៅក្នុងកែវកាហ្វេក្ដៅ ឬ Espresso រួចកូរឱ្យសព្វ វានឹងបង្កើតជាក្រែមធម្មជាតិឈ្ងុយស្រទន់ ជំនួសទឹកដោះគោគោបានយ៉ាងអស្ចារ្យ (ដូចដែលអ្នកវិនិយោគជនជាតិកូរ៉េនៅសេអ៊ូលបានដាក់លាយក្នុងកាហ្វេក្តៅរបស់គាត់ផ្ទាល់!)',
    baristaTipEn: '☕ Barista Cashew Latte Recipe: Stir 1-2 tbsp of Cashew Flour directly into hot espresso or brew. Creates a velvety, nutty natural plant crema with zero dairy (just like the Korean startup investor in Seoul tested with his hot coffee!)',
    baristaTipKo: '☕ 바리스타 캐슈 라떼 레시피: 핫/아이스 에스프레소나 커피에 캐슈 파우더 1~2스푼을 넣고 저어주세요. 우유 없이도 부드러운 고소함과 천연 식물성 크레마가 완성됩니다 (서울 스타트업 투자자 시음 방식!)'
  },

  // 7. 175g = $4.00 Chili Coated Cashew Kernels (175g PET Jar)
  {
    id: 'chili-jar-175g',
    nameKh: 'គ្រាប់ស្វាយចន្ទីស្រោបម្ទេស (កំប៉ុង PET ១៧៥g)',
    nameEn: 'Chili Coated Cashew Kernels (175g PET Jar)',
    nameKo: '고추맛 시즈닝 캐슈넛 (175g 밀폐 PET 용기)',
    category: 'jars',
    priceUsd: 4.00,
    weight: '175g',
    packageType: '175g Clear Induction Sealed PET Jar',
    badgeKh: '១៧៥g = $4.00 (១៦,៤០០ ៛)',
    badgeEn: '175g = $4.00',
    badgeKo: '175g = $4.00',
    imageSrc: '/images/mayany_chili_jar_175g.png',
    descriptionKh: 'គ្រាប់ស្វាយចន្ទីស្រោបម្ទេសហឹរស្រួយ កំប៉ុង PET ១៧៥ ក្រាម បិទជិតខ្យល់ រសជាតិដិតដល់ ជម្រើសដ៏ល្អសម្រាប់ញ៉ាំជាមួយស្រាបៀរ (ដូចដែលលោកស្រីនួន បានជ្រើសរើសសម្រាប់ណែនាំដល់ក្លឹបដ៏ល្បីនៅទីក្រុងឡុងដ៍)។',
    descriptionEn: 'Chili coated cashew kernels in 175g sealed induction PET jar. Savory spice crunch (selected by Ms. Nuon to introduce to a prestigious club in London, UK!).',
    descriptionKo: '175g 인덕션 씰링 밀폐 PET 용기에 담긴 매콤 바삭한 프리미엄 캐슈넛. 영국 런던의 명문 클럽에 선물 및 시음용 샘플로 선정된 시그니처 스낵입니다.',
    highlightsKh: [
      'កំប៉ុង PET ១៧៥ ក្រាម បិទជិតខ្យល់ Induction Seal',
      'រសជាតិម្ទេសហឹរស្រួយ ញ៉ាំជាមួយស្រាបៀរ',
      'តម្លៃផ្លូវការ: $4.00 (១៦,៤០០ ៛) ក្នុងមួយកំប៉ុង'
    ],
    highlightsEn: [
      '175g clear PET jar with tamper induction seal',
      'Savory & spicy crunch, ideal with craft beer',
      'Official price: $4.00 per jar (Selected by Ms. Nuon to introduce to London, UK)'
    ],
    highlightsKo: [
      '175g 투명 PET 용기 & 안심 인덕션 실링 캡',
      '크래프트 비어 및 라운지 바 최고 인기',
      '공식 수출 단가: $4.00 / 개'
    ],
    popularWith: 'London UK Clubs & Lounges'
  },

  // 8. 175g = $4.00 Sugar Coated Cashew Kernels (175g PET Jar)
  {
    id: 'sugar-jar-175g',
    nameKh: 'គ្រាប់ស្វាយចន្ទីស្រោបស្ករ (កំប៉ុង PET ១៧៥g)',
    nameEn: 'Sugar Coated Cashew Kernels (175g PET Jar)',
    nameKo: '달콤 바삭 캐슈넛 (175g 밀폐 PET 용기)',
    category: 'jars',
    priceUsd: 4.00,
    weight: '175g',
    packageType: '175g Clear Induction Sealed PET Jar',
    badgeKh: '១៧៥g = $4.00 (១៦,៤០០ ៛)',
    badgeEn: '175g = $4.00',
    badgeKo: '175g = $4.00',
    imageSrc: '/images/mayany_sugar_jar_175g.png',
    descriptionKh: 'គ្រាប់ស្វាយចន្ទីស្រោបស្ករ កំប៉ុង PET ១៧៥ ក្រាម ស្រួយក្រមោក ផ្អែមស្រទន់បែបធម្មជាតិ ពេញនិយមនៅកូរ៉េ។',
    descriptionEn: 'Sugar coated cashew kernels in 175g induction PET jar. Delicate caramel sweetness, popular in South Korea.',
    descriptionKo: '175g 인덕션 씰링 PET 용기에 담긴 은은한 천연 카라멜 코팅 캐슈넛. 한국 투자자 및 해외 고객들이 선호하는 고급 스낵입니다.',
    highlightsKh: [
      'កំប៉ុង PET ១៧៥ ក្រាម បិទជិតខ្យល់ Induction Seal',
      'ស្រោបស្ករធម្មជាតិ ស្រួយក្រមោក',
      'តម្លៃផ្លូវការ: $4.00 (១៦,៤០០ ៛) ក្នុងមួយកំប៉ុង'
    ],
    highlightsEn: [
      '175g clear PET jar with induction seal',
      'Crispy natural sugar coating',
      'Official price: $4.00 per jar'
    ],
    highlightsKo: [
      '175g 투명 밀폐 PET 용기 포장',
      '천연 설탕 글레이즈의 바삭하고 깔끔한 단맛',
      '공식 수출 단가: $4.00 / 개'
    ]
  },

  // 9. 175g = $4.00 GI Kampot Black Pepper Coated Cashew Kernels (175g PET Jar)
  {
    id: 'pepper-jar-175g',
    nameKh: 'គ្រាប់ស្វាយចន្ទីស្រោបម្រេចខ្មៅកំពត GI (កំប៉ុង PET ១៧៥g)',
    nameEn: 'GI Kampot Black Pepper Coated Cashew Kernels (175g PET Jar)',
    nameKo: '캄폿 GI 유기농 흑후추 코팅 캐슈넛 (175g 밀폐 PET 용기)',
    category: 'jars',
    priceUsd: 4.00,
    weight: '175g',
    packageType: '175g Clear Induction Sealed PET Jar',
    badgeKh: '១៧៥g = $4.00 (១៦,៤០០ ៛)',
    badgeEn: '175g = $4.00',
    badgeKo: '175g = $4.00',
    imageSrc: '/images/mayany_pepper_jar_175g.png',
    descriptionKh: 'គ្រាប់ស្វាយចន្ទីស្រោបម្រេចខ្មៅកំពត GI កំប៉ុង PET ១៧៥ ក្រាម គ្រាប់ធំៗ ឈ្ងុយហឹរស្រទន់ ជម្រើសពេញនិយមបំផុតរបស់វិនិយោគិនកូរ៉េ & ភោជនីយដ្ឋានចក្រភពអង់គ្លេស។',
    descriptionEn: 'GI Kampot black pepper coated whole cashews in 175g PET jar. Top favorite of Korean venture investors & UK restaurants.',
    descriptionKo: '한국 스타트업 투자자와 영국 레스토랑이 극찬한 대표 시그니처 제품. 정품 캄폿 GI 흑후추를 입힌 통 캐슈넛 (175g 밀폐 PET 용기).',
    highlightsKh: [
      'កំប៉ុង PET ១៧៥ ក្រាម បិទជិតខ្យល់ Induction Seal',
      'ម្រេចខ្មៅកំពត GI សុទ្ធ ១០០%',
      'តម្លៃផ្លូវការ: $4.00 (១៦,៤០០ ៛) ក្នុងមួយកំប៉ុង'
    ],
    highlightsEn: [
      '175g clear PET jar with induction seal',
      '100% Authentic GI Kampot Black Pepper',
      'Official price: $4.00 per jar (Favorite of Korean venture investors & UK restaurants)'
    ],
    highlightsKo: [
      '175g 밀폐 PET 용기 & 신선도 보존 실링',
      '한국 벤처투자사 & 영국 레스토랑 인기 1위',
      '공식 수출 단가: $4.00 / 개'
    ],
    popularWith: 'Korean Investors & UK Restaurants'
  }
];

type Currency = 'USD' | 'KRW' | 'GBP' | 'KHR';

const CURRENCY_RATES: Record<Currency, { symbol: string; rate: number; label: string }> = {
  USD: { symbol: '$', rate: 1, label: 'USD ($)' },
  KRW: { symbol: '₩', rate: 1350, label: 'KRW (₩ South Korea)' },
  GBP: { symbol: '£', rate: 0.79, label: 'GBP (£ United Kingdom)' },
  KHR: { symbol: '៛', rate: 4100, label: 'KHR (៛ Cambodia)' }
};

export const getPassportBatch = (id: string): string => {
  switch (id) {
    case 'chili-jar-175g': return '2026-ckc-261j';
    case 'sugar-jar-175g': return '2026-cks-261j';
    case 'pepper-jar-175g': return '2026-ckp-261j';
    case 'cashew-powder-200g': return '2026-MAY-FLR';
    case 'chili-pouch-50g': return '2026-ckc-261';
    case 'sugar-pouch-50g': return '2026-cks-261';
    case 'pepper-pouch-50g': return '2026-ckp-261';
    case 'pepper-broken-pouch-50g': return '2026-ckp-261';
    case 'cashew-milk-1l': return 'MTO-CM-1L';
    default: return '2026-ckp-261';
  }
};

export default function MayanyStore({ 
  onOpenPassport,
  onOpenPackaging,
  onOpenDeploy
}: { 
  onOpenPassport?: (batch: string) => void;
  onOpenPackaging?: () => void;
  onOpenDeploy?: () => void;
}) {
  const { isKhmer, isKorean } = useLanguage();
  const [currency, setCurrency] = useState<Currency>('KHR');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'pouches' | 'jars' | 'beverage'>('all');
  const [selectedPreviewImage, setSelectedPreviewImage] = useState<string | null>(null);
  
  // Cart state: Record<productId, quantity>
  const [cart, setCart] = useState<Record<string, number>>({});
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSubmitted, setOrderSubmitted] = useState<any | null>(null);
  const [isMilkLabelModalOpen, setIsMilkLabelModalOpen] = useState(false);

  // Ensure the page always starts at the top (top page first)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if ('scrollRestoration' in window.history) {
        window.history.scrollRestoration = 'manual';
      }
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
  }, []);

  // Auto-switch currency when language switches
  useEffect(() => {
    if (isKorean) {
      setCurrency('KRW');
    } else if (isKhmer) {
      setCurrency('USD');
    }
  }, [isKorean, isKhmer]);

  // Buyer Form
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [deliveryCountry, setDeliveryCountry] = useState(isKorean ? 'South Korea' : 'Cambodia');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [orderNotes, setOrderNotes] = useState('');
  const [paymentPreference, setPaymentPreference] = useState<'whatsapp' | 'khqr' | 'international_wire'>('whatsapp');

  // Convert USD to Cambodian Riel with official 1 USD = 4,100 KHR benchmark, rounded to nearest 100
  const formatRiel = (usd: number) => {
    const khr = Math.round((usd * 4100) / 100) * 100;
    return `${khr.toLocaleString('en-US')} ៛`;
  };

  // Convert USD to current active currency with thousand separators
  const formatPrice = (usd: number) => {
    const rateInfo = CURRENCY_RATES[currency];
    const converted = usd * rateInfo.rate;
    if (currency === 'KRW') {
      return `₩${Math.round(converted).toLocaleString('en-US')}`;
    }
    if (currency === 'KHR') {
      const rounded = Math.round(converted / 100) * 100;
      return `${rounded.toLocaleString('en-US')} ៛`;
    }
    if (currency === 'GBP') {
      return `£${converted.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    return `$${converted.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // Cart operations
  const addToCart = (productId: string, delta: number = 1) => {
    setCart((prev) => {
      const current = prev[productId] || 0;
      const next = Math.max(0, current + delta);
      if (next === 0) {
        const copy = { ...prev };
        delete copy[productId];
        return copy;
      }
      return { ...prev, [productId]: next };
    });
  };

  const totalCartItems = Object.values(cart).reduce((a, b) => a + b, 0);
  const totalCartUsd = Object.entries(cart).reduce((sum, [id, qty]) => {
    const p = STORE_PRODUCTS.find((item) => item.id === id);
    return sum + (p ? p.priceUsd * qty : 0);
  }, 0);

  const filteredProducts = STORE_PRODUCTS.filter(
    (p) => selectedCategory === 'all' || p.category === selectedCategory
  );

  // Generate WhatsApp Order Link
  const buildWhatsAppMessage = () => {
    const itemsList = Object.entries(cart).map(([id, qty]) => {
      const p = STORE_PRODUCTS.find((item) => item.id === id);
      const name = isKorean ? p?.nameKo : isKhmer ? p?.nameKh : p?.nameEn;
      return `• ${qty}x ${name || id} (${p ? '$' + (p.priceUsd * qty).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : ''})`;
    }).join('\n');

    const message = `*MAYANY ENTERPRISE - NEW ORDER INQUIRY*
----------------------------------------
*Buyer Information:*
Name: ${customerName || 'Customer'}
Phone/WhatsApp: ${customerPhone}
Email: ${customerEmail || 'N/A'}
Country: ${deliveryCountry}
Address: ${deliveryAddress || 'To be confirmed'}

*Items Ordered:*
${itemsList}

*Grand Total:* $${totalCartUsd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD (${formatPrice(totalCartUsd)})
*Payment Method:* ${paymentPreference}
*Notes:* ${orderNotes || 'Standard order processing'}
----------------------------------------
Sent via mayanyenterprise.com storefront`;

    return `https://wa.me/855887712862?text=${encodeURIComponent(message)}`;
  };

  // Submit Order to Firestore and open Confirmation Modal
  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerPhone.trim()) {
      alert(isKorean ? '연락처 또는 왓츠앱 번호를 입력해주세요.' : isKhmer ? 'សូមបញ្ចូលលេខទូរស័ព្ទ ឬ WhatsApp' : 'Please provide your telephone or WhatsApp number.');
      return;
    }
    if (totalCartItems === 0) {
      alert(isKorean ? '장바구니에 담긴 상품이 없습니다.' : isKhmer ? 'មិនទាន់មានទំនិញក្នុងកន្ត្រកទេ' : 'Your cart is empty.');
      return;
    }

    setIsSubmitting(true);
    const orderCode = `ORD-MAY-${Math.floor(1000 + Math.random() * 9000)}`;

    const orderData = {
      orderCode,
      createdAt: serverTimestamp(),
      customerName,
      customerPhone,
      customerEmail,
      deliveryCountry,
      deliveryAddress,
      orderNotes,
      paymentPreference,
      items: Object.entries(cart).map(([id, qty]) => {
        const prod = STORE_PRODUCTS.find((p) => p.id === id);
        return {
          productId: id,
          nameEn: prod?.nameEn,
          nameKh: prod?.nameKh,
          nameKo: prod?.nameKo,
          unitPriceUsd: prod?.priceUsd,
          quantity: qty,
          totalPriceUsd: prod ? prod.priceUsd * qty : 0
        };
      }),
      totalUsd: totalCartUsd,
      status: 'pending_confirmation'
    };

    try {
      if (db) {
        await addDoc(collection(db, 'orders'), orderData);
      }
    } catch (err) {
      console.warn('Saved locally:', err);
    }

    setOrderSubmitted({
      ...orderData,
      dateString: new Date().toLocaleDateString()
    });
    setIsSubmitting(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6 space-y-5 sm:space-y-6 font-sans">
      
      {/* 1. HERO BANNER: Mayany Enterprise Direct Storefront (Compact Full Width) */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white border border-emerald-500/30 p-4 sm:p-5 shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 w-full text-left space-y-2.5">
          {/* Top Line: Badge, About Us Link & Direct WhatsApp pill */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="inline-flex items-center gap-2 px-3 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-full text-[11px] font-mono font-bold tracking-wider uppercase">
              <Sparkles size={13} className="text-amber-400" />
              <span>
                {isKorean 
                  ? '마얀 엔터프라이즈 공식 직영 스토어 • MAYANY ENTERPRISE' 
                  : isKhmer 
                  ? 'ហាងកសិផលផ្លូវការ សហគ្រាស ម៉ាយ៉ានី' 
                  : 'OFFICIAL MAYANY ENTERPRISE AGRO STORE'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <a
                href="#about-mayany-enterprise"
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-full text-xs font-bold transition shadow-xs cursor-pointer"
              >
                <Building size={13} />
                <span>{isKorean ? '📖 마얀 소개' : isKhmer ? '📖 អំពីសហគ្រាស' : '📖 About Us'}</span>
              </a>

              <a
                href="https://wa.me/855887712862?text=Hello%20Mayany%20Enterprise!%20I%20would%20like%20to%20inquire%20about%20ordering%20products."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-600/90 hover:bg-emerald-500 text-white rounded-full text-xs font-bold transition shadow-xs cursor-pointer"
              >
                <MessageCircle size={13} />
                <span>WhatsApp: +855 88 771 2862</span>
              </a>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <img
              src="/assets/aistudio/Mayany_Enterprise_Logo_August_26_2026_4cdf6a3d.jpg"
              alt="Mayany Enterprise"
              className="h-12 w-12 sm:h-14 sm:w-14 rounded-full object-cover ring-2 ring-amber-400 shadow-md shrink-0 bg-white"
            />
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-snug">
                {isKorean
                  ? '캄보디아 프리미엄 수제 농특산물 • 신선 주문제작 수출 품질'
                  : isKhmer 
                  ? 'កសិផលកែច្នៃប្រណិតកម្ពុជា • គុណភាពនាំចេញ & ផលិតតាមការកុម្ម៉ង់' 
                  : 'Cambodian Artisan Agro-Products • Make-to-Order Export Quality'}
              </h1>
              <p className="text-[11px] text-amber-300 font-medium">
                MAYANY Enterprise • Powered by CashewTrace Protocol
              </p>
            </div>
          </div>
          
          <div className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-5xl space-y-2">
            <p className="font-semibold text-amber-200">
              {isKorean
                ? '마얀 엔터프라이즈(Mayany Enterprise)에 오신 것을 환영합니다!'
                : isKhmer
                ? 'សូមស្វាគមន៍មកកាន់ សហគ្រាស ម៉ាយ៉ានី!'
                : 'Welcome to Mayany Enterprise!'}
            </p>
            <p>
              {isKorean
                ? '우리는 정품 캄폿 GI 흑후추, 100% 천연 캐슈 드링크(밀크), 100% 순수 캐슈넛 파우더(음료 및 식물성 라떼용), 그리고 바삭하고 고소한 수제 로스팅 캐슈넛을 정성껏 공급합니다.'
                : isKhmer
                ? 'យើងខ្ញុំផ្គត់ផ្គង់ ម្រេចខ្មៅកំពត GI, ទឹកដោះគោគ្រាប់ស្វាយចន្ទីធម្មជាតិ ១០០%, ម្សៅគ្រាប់ស្វាយចន្ទីសុទ្ធ ១០០% (សម្រាប់ឆុងភេសជ្ជៈ & ជំនួសទឹកដោះគោ), និងគ្រាប់ស្វាយចន្ទីលីងស្រួយរសជាតិប្រណិត។'
                : 'We proudly supply authentic GI Kampot Black Pepper, 100% Natural Fresh Cashew Drink, 100% Pure Cashew Powder (for beverages & wholesome dairy-free recipes), and artisan roasted cashew kernels.'}
            </p>
            <p className="text-slate-400">
              {isKorean
                ? '모든 제품은 주문 제작(Make-to-Order)으로 갓 생산하여 최상의 신선함을 보장하며, 모든 용기와 파우치마다 부착된 디지털 QR Passport를 통해 원산지와 품질 인증서를 투명하게 확인하실 수 있습니다.'
                : isKhmer
                ? 'រាល់ផលិតផលទាំងអស់ត្រូវបានផលិតយ៉ាងសម្រិតសម្រាំងតាមការកុម្ម៉ង់ (Make-to-Order) ធានាថ្មីស្រស់ជានិច្ច ព្រមទាំងមានកូដ QR Passport សម្រាប់ពិនិត្យប្រភពដើម និងវិញ្ញាបនបត្របញ្ជាក់គុណភាពបានគ្រប់ដប និងកញ្ចប់។'
                : 'All products are freshly crafted Make-to-Order to guarantee peak freshness, with an individual digital QR Passport to inspect traceable farm origins and quality certifications on every jar and pouch.'}
            </p>
          </div>

          {/* Trust Badges in a tidy horizontal row */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-slate-200">
            <span className="flex items-center gap-1 px-2.5 py-1 bg-slate-800/80 rounded-lg border border-slate-700">
              <Award size={13} className="text-amber-400" />
              <span>{isKorean ? '캄폿 GI 정품 인증' : isKhmer ? 'ម្រេចខ្មៅកំពត GI' : 'GI Kampot Certified'}</span>
            </span>
            <span className="flex items-center gap-1 px-2.5 py-1 bg-slate-800/80 rounded-lg border border-slate-700">
              <Coffee size={13} className="text-emerald-400" />
              <span>{isKorean ? '100% 캐슈 드링크 & 파우더' : isKhmer ? 'ទឹកដោះគោ & ម្សៅស្វាយចន្ទី ១០០%' : '100% Cashew Drink & Powder'}</span>
            </span>
            <span className="flex items-center gap-1 px-2.5 py-1 bg-slate-800/80 rounded-lg border border-slate-700">
              <Clock size={13} className="text-cyan-400" />
              <span>{isKorean ? '주문제작 신선 로트' : isKhmer ? 'ផលិតថ្មីៗតាមការកុម្ម៉ង់ (Make-to-Order)' : 'Make-to-Order Fresh Batches'}</span>
            </span>
            <span className="flex items-center gap-1 px-2.5 py-1 bg-slate-800/80 rounded-lg border border-slate-700">
              <Globe size={13} className="text-indigo-400" />
              <span>{isKorean ? '한국, 영국, 아세안 직배송' : isKhmer ? 'ដឹកជញ្ជូនទូទាំងពិភពលោក' : 'Worldwide Delivery (Korea, UK, ASEAN)'}</span>
            </span>
          </div>
        </div>
      </div>


      {/* 2. CURRENCY & CATEGORY SWITCHER */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        {/* Category Tabs */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {[
            { 
              id: 'all', 
              labelKh: 'ទាំងអស់ (All 9 Products)', 
              labelEn: 'All 9 Products',
              labelKo: '전체 9개 품목 (All 9)'
            },
            { 
              id: 'jars', 
              labelKh: 'កំប៉ុង PET ១៧៥g & ២០០g ($2.50 - $4.00)', 
              labelEn: 'PET Jars ($2.50 - $4.00)',
              labelKo: '밀폐 PET 용기 ($2.50 - $4.00)'
            },
            { 
              id: 'pouches', 
              labelKh: 'កញ្ចប់ ៥០g ($0.65 - $1.25)', 
              labelEn: '50g Pouches ($0.65 - $1.25)',
              labelKo: '50g 파우치 ($0.65 - $1.25)'
            },
            { 
              id: 'beverage', 
              labelKh: 'ទឹកដោះគោ & ម្សៅឆុងកាហ្វេ', 
              labelEn: 'Milk & Flour',
              labelKo: '밀크 & 파우더'
            }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id as any)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-slate-900 text-white shadow'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {isKorean ? cat.labelKo : isKhmer ? cat.labelKh : cat.labelEn}
            </button>
          ))}
        </div>

        {/* Currency Selector */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto justify-end">
          <span className="text-xs font-bold text-slate-400 mr-1">
            {isKorean ? '통화 선택:' : isKhmer ? 'រូបិយប័ណ្ណ:' : 'Currency:'}
          </span>
          {(['KHR', 'USD', 'KRW', 'GBP'] as Currency[]).map((c) => (
            <button
              key={c}
              onClick={() => setCurrency(c)}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold transition cursor-pointer ${
                currency === c
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              {CURRENCY_RATES[c].symbol} {c}
            </button>
          ))}
        </div>
      </div>

      {/* 3. PRODUCT CATALOG GRID - UN-CROPPED & FULL VIEW */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => {
          const qtyInCart = cart[product.id] || 0;
          const prodName = isKorean ? product.nameKo : isKhmer ? product.nameKh : product.nameEn;
          const prodDesc = isKorean ? product.descriptionKo : isKhmer ? product.descriptionKh : product.descriptionEn;
          const prodBadge = isKorean ? product.badgeKo : isKhmer ? product.badgeKh : product.badgeEn;
          const prodHighlights = isKorean ? product.highlightsKo : isKhmer ? product.highlightsKh : product.highlightsEn;
          const prodBaristaTip = isKorean ? product.baristaTipKo : isKhmer ? product.baristaTipKh : product.baristaTipEn;

          return (
            <motion.div
              key={product.id}
              layout
              className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition flex flex-col justify-between group"
            >
              {/* Product Card Top: Image Container with Full Height & Object-Contain (NO CUT-OFF) */}
              <div className="relative">
                <div 
                  className="h-64 sm:h-72 w-full bg-gradient-to-b from-stone-50 via-slate-50 to-amber-50/20 flex items-center justify-center p-3 sm:p-4 relative rounded-t-3xl overflow-hidden cursor-pointer"
                  onClick={() => setSelectedPreviewImage(product.imageSrc)}
                  title={isKorean ? '클릭하여 원본 사진 및 라벨 확대보기' : isKhmer ? 'ចុចដើម្បីមើលរូបភាពធំ' : 'Click to inspect full high-res photo'}
                >
                  <img
                    src={product.imageSrc}
                    alt={prodName}
                    className="max-h-full max-w-full w-auto h-auto object-contain drop-shadow-md transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = '/images/mayany_ke_application_product_collage_1785131513154.jpg';
                    }}
                  />

                  {/* Zoom hint button */}
                  <div className="absolute bottom-3 left-3 bg-white/90 hover:bg-white text-slate-700 p-1.5 rounded-lg shadow-xs opacity-80 group-hover:opacity-100 transition">
                    <ZoomIn size={14} />
                  </div>
                </div>

                {/* Badge (Price Tag) */}
                <div className="absolute top-3 left-3">
                  <span className="px-3 py-1 bg-amber-500/95 text-slate-950 text-[11px] font-bold rounded-full shadow-md backdrop-blur-sm">
                    {prodBadge}
                  </span>
                </div>

                {/* Weight Tag */}
                <div className="absolute bottom-3 right-3">
                  <span className="px-2.5 py-1 bg-slate-900/90 text-white text-xs font-mono font-bold rounded-lg backdrop-blur-sm">
                    {product.weight}
                  </span>
                </div>

                {/* Popularity Tag */}
                {product.popularWith && (
                  <div className="absolute top-3 right-3">
                    <span className="px-2.5 py-1 bg-emerald-600 text-white text-[10px] font-bold rounded-full shadow">
                      ⭐ {product.popularWith}
                    </span>
                  </div>
                )}
              </div>

              {/* Product Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4 text-left">
                <div className="space-y-2">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                    {prodName}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {prodDesc}
                  </p>

                  {/* Barista Tip if available */}
                  {prodBaristaTip && (
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-900 leading-relaxed font-sans">
                      {prodBaristaTip}
                    </div>
                  )}

                  {/* Highlights */}
                  <ul className="space-y-1 pt-1 text-[11px] text-slate-700">
                    {prodHighlights.map((hl, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <Check size={13} className="text-emerald-600 shrink-0 mt-0.5" />
                        <span>{hl}</span>
                      </li>
                    ))}
                  </ul>

                  {/* 1L Bottle Label & Direct Order QR Code Action for Cashew Milk */}
                  {product.id === 'cashew-milk-1l' && (
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => setIsMilkLabelModalOpen(true)}
                        className="w-full py-2.5 px-3 bg-gradient-to-r from-emerald-900 via-slate-900 to-emerald-950 hover:from-emerald-800 hover:to-slate-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition shadow-sm border border-emerald-500/40 hover:border-amber-400 cursor-pointer group/btn"
                      >
                        <QrCode size={15} className="text-amber-400 group-hover/btn:scale-110 transition-transform" />
                        <span>
                          {isKorean 
                            ? '🏷️ 1L 병 라벨 & 주문 QR 코드 (인쇄/다운로드)' 
                            : isKhmer 
                            ? '🏷️ មើលស្លាកដប ១L & កូដ QR បញ្ជាទិញ (បោះពុម្ព)' 
                            : '🏷️ View 1L Bottle Label & Direct Order QR (Print)'}
                        </span>
                      </button>
                    </div>
                  )}
                  {/* Official CS 001 Certificate & Product Passport Action Button */}
                  <div className="pt-2">
                    <a
                      href={`?mode=passport&batch=${getPassportBatch(product.id)}&product=${product.id}&view=certificate`}
                      onClick={(e) => {
                        if (typeof window !== 'undefined') {
                          const url = new URL(window.location.href);
                          url.searchParams.set('mode', 'passport');
                          url.searchParams.set('batch', getPassportBatch(product.id));
                          url.searchParams.set('product', product.id);
                          url.searchParams.set('view', 'certificate');
                          window.history.replaceState({}, '', url.toString());
                        }
                        if (onOpenPassport) {
                          e.preventDefault();
                          onOpenPassport(getPassportBatch(product.id));
                        }
                      }}
                      className="w-full py-2 px-3 bg-gradient-to-r from-amber-50 to-amber-100/90 hover:from-amber-100 hover:to-amber-200 text-amber-950 border border-amber-300 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer shadow-2xs group/cert"
                      title={isKhmer ? 'ពិនិត្យវិញ្ញាបនបត្រគុណភាព CS 001 និងតាមដានប្រភពកសិករ' : 'View CS 001 Quality Certificate & Origin Passport'}
                    >
                      <FileText size={13} className="text-amber-800 group-hover/cert:scale-110 transition-transform" />
                      <span>
                        {isKorean 
                          ? '📜 CS 001 품질 인증서 & 디지털 여권' 
                          : isKhmer 
                          ? '📜 ពិនិត្យវិញ្ញាបនបត្រគុណភាព CS 001 & Passport' 
                          : '📜 View CS 001 Quality Certificate & Passport'}
                      </span>
                    </a>
                  </div>
                </div>

                {/* Price & Add to Cart Section */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                  <div>
                    <div className="text-lg sm:text-xl font-extrabold text-emerald-700 font-mono">
                      {formatPrice(product.priceUsd)}
                    </div>
                    {isKhmer ? (
                      <div className="text-xs font-bold text-amber-700 font-sans mt-0.5 flex items-center gap-1">
                        {currency === 'KHR' ? (
                          <span className="text-[10px] text-slate-500 font-mono">(${product.priceUsd.toFixed(2)} USD)</span>
                        ) : (
                          <span>≈ {formatRiel(product.priceUsd)}</span>
                        )}
                        {currency !== 'USD' && currency !== 'KHR' && (
                          <span className="text-[10px] text-slate-400 font-mono">(${product.priceUsd.toFixed(2)} USD)</span>
                        )}
                      </div>
                    ) : (
                      currency !== 'USD' && (
                        <div className="text-[10px] text-slate-400 font-mono">
                          (${(product.priceUsd).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD)
                        </div>
                      )
                    )}
                  </div>

                  {/* Quantity Controller / Add Button */}
                  {qtyInCart > 0 ? (
                    <div className="inline-flex items-center gap-2 bg-slate-900 text-white rounded-xl p-1 shadow">
                      <button
                        onClick={() => addToCart(product.id, -1)}
                        className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-800 transition cursor-pointer"
                        title="Reduce"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-6 text-center font-bold text-xs font-mono">{qtyInCart}</span>
                      <button
                        onClick={() => addToCart(product.id, 1)}
                        className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-800 transition cursor-pointer"
                        title="Increase"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => addToCart(product.id, 1)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-xs transition cursor-pointer"
                    >
                      <Plus size={14} />
                      <span>{isKorean ? '주문 담기' : isKhmer ? 'បញ្ចូលកន្ត្រក' : 'Add to Order'}</span>
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* 4. ABOUT MAYANY ENTERPRISE (អំពីសហគ្រាស ម៉ាយ៉ានី / 마얀 엔터프라이즈 소개) */}
      <section 
        id="about-mayany-enterprise" 
        className="bg-white rounded-3xl border border-slate-200/90 shadow-lg p-6 sm:p-10 text-left space-y-8 scroll-mt-24 overflow-hidden relative"
      >
        {/* Decorative background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* 1. Header with Mayany Emblem & Mission Headline */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-slate-100 relative z-10">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 text-amber-900 border border-amber-500/30 rounded-full text-xs font-mono font-bold uppercase tracking-wider">
              <Building size={14} className="text-amber-600" />
              <span>
                {isKorean 
                  ? '마얀 엔터프라이즈 기업 소개 • ABOUT MAYANY ENTERPRISE' 
                  : isKhmer 
                  ? 'អំពីសហគ្រាស ម៉ាយ៉ានី • ABOUT MAYANY ENTERPRISE' 
                  : 'ABOUT MAYANY ENTERPRISE • ARTISAN AGRO-PROCESSING'}
              </span>
            </div>

            <div className="flex items-center gap-3.5">
              <img
                src="/assets/aistudio/Mayany_Enterprise_Logo_August_26_2026_4cdf6a3d.jpg"
                alt="Mayany Enterprise"
                className="h-14 w-14 sm:h-16 sm:w-16 rounded-2xl object-cover ring-2 ring-amber-400 shadow-md shrink-0 bg-white"
              />
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
                  {isKorean 
                    ? '마얀 엔터프라이즈(MAYANY Enterprise)' 
                    : isKhmer 
                    ? 'សហគ្រាស ម៉ាយ៉ានី (MAYANY Enterprise)' 
                    : 'MAYANY Enterprise'}
                </h2>
                <p className="text-xs sm:text-sm font-bold text-amber-700 font-sans">
                  {isKorean
                    ? '캄보디아 프리미엄 수제 캐슈넛 & 캄폿 GI 흑후추 수출 혁신 기업'
                    : isKhmer
                    ? 'កសិ-សហគ្រាសកែច្នៃកសិផលខ្មែរប្រណិត • គុណភាពនាំចេញ & នវានុវត្តន៍'
                    : 'Artisan Cambodian Cashews, GI Kampot Pepper & Barista Plant Nutrition'}
                </p>
              </div>
            </div>

            <div className="text-xs sm:text-sm text-slate-600 leading-relaxed pt-1 space-y-2.5">
              <p>
                {isKorean
                  ? '마얀 엔터프라이즈는 캄보디아 여성 창업가 마얀 삼(Mayany SAM) 대표가 설립한 농산물 가공 기업입니다.'
                  : isKhmer
                  ? 'សហគ្រាស ម៉ាយ៉ានី គឺជាសហគ្រាសកែច្នៃកសិផលខ្មែរដឹកនាំដោយស្ត្រី ដែលបង្កើតឡើងដោយលោកស្រី សំ ម៉ាយ៉ានី (Mayany SAM)។'
                  : 'MAYANY Enterprise is a woman-led Cambodian agricultural processing enterprise founded by Mrs. Mayany SAM.'}
              </p>
              <p>
                {isKorean
                  ? '당사는 캐슈넛과 캄폿 후추를 비롯한 캄보디아의 고잠재력 농산물을 엄격한 품질과 안전 기준을 갖춘 고품질 완제품으로 가공하는 데 전문성을 두고 전념하고 있습니다.'
                  : isKhmer
                  ? 'យើងមានឯកទេស និងប្តេជ្ញាចិត្តក្នុងការកែច្នៃកសិផលសក្តានុពលខ្មែរ រួមមានគ្រាប់ស្វាយចន្ទី និងម្រេចកំពត ឱ្យក្លាយជាផលិតផលសម្រេចប្រកបដោយគុណភាពខ្ពស់ និងសុវត្ថិភាពស្តង់ដារ។'
                  : 'We specialize in and are dedicated to processing high-potential Cambodian crops, including cashew nuts and Kampot pepper, into premium finished products with high quality and safety standards.'}
              </p>
              <p>
                {isKorean
                  ? '캄보디아 캐슈넛협회(CAC) 보고서에 따르면 캄보디아는 세계 2위의 원물 캐슈넛 생산국이며, 캄폿 후추 또한 세계적으로 유명한 지리적 표시(GI) 농산물입니다.'
                  : isKhmer
                  ? 'តាមរបាយការណ៍របស់សមាគមស្វាយចន្ទីកម្ពុជា កម្ពុជាជាប្រទេសផលិតគ្រាប់ស្វាយចន្ទីឆៅធំជាងគេទីពីរលើពិភពលោក ហើយម្រេចកំពតក៏ជាផលិតផលមានសញ្ញាបង្ហាញប្រភពភូមិសាស្ត្រ (GI) ដ៏ល្បីដែរ។'
                  : 'According to the Cashew nut Association of Cambodia (CAC), Cambodia is the world\'s second largest raw cashew nut producer, and Kampot pepper is a globally renowned Geographical Indication (GI) product.'}
              </p>
              <p>
                {isKorean
                  ? '당사는 저부가가치 원물 수출 관행에서 벗어나 우수위생관리기준(GHP) 및 우수제조관리기준(GMP)을 준수하고 HACCP 인증을 준비하며, 고부가가치 완제품 농가공품을 생산하는 사명을 실천하고 있습니다.'
                  : isKhmer
                  ? 'យើងមានបេសកកម្មផ្លាស់ប្តូរពីការនាំចេញគ្រាប់ឆៅតម្លៃទាប ទៅជាការផលិតកសិផលសម្រេចដែលមានតម្លៃបន្ថែមខ្ពស់ ដោយអនុវត្តតាម គោលការណ៍អនាម័យល្អ (GHP) និង ផលិតកម្មល្អ (GMP) ហើយកំពុងត្រៀមខ្លួនឆ្ពោះទៅរកវិញ្ញាបនបត្រ HACCP។'
                  : 'Our mission is to transition from exporting low-value raw cashews to manufacturing high value-added finished agro-products, complying with Good Hygiene Practices (GHP) and Good Manufacturing Practices (GMP), while actively preparing for HACCP certification.'}
              </p>
            </div>
          </div>

          {/* Quick Action Badges */}
          <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 w-full md:w-auto shrink-0">
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-left space-y-1 sm:min-w-[220px]">
              <div className="text-[10px] font-mono uppercase font-bold text-amber-800">
                {isKorean ? '창업자 및 총괄대표' : isKhmer ? 'ស្ថាបនិក & អគ្គនាយិកា' : 'Founder & CEO'}
              </div>
              <div className="text-base font-extrabold text-slate-900 font-sans">
                {isKorean ? '마얀 삼 (Mayany SAM)' : 'សំ ម៉ាយ៉ានី (Mayany SAM)'}
              </div>
              <div className="text-[11px] text-amber-900 leading-tight">
                {isKorean ? '캄보디아 스타트업 런치패드 선정 창업가' : isKhmer ? 'សហគ្រិនស្រ្តីឆ្នើមក្នុងវិស័យកសិ-កែច្នៃ' : 'Cambodia Startup Launchpad Featured Founder'}
              </div>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-left space-y-1 sm:min-w-[220px]">
              <div className="text-[10px] font-mono uppercase font-bold text-emerald-800">
                {isKorean ? '원산지 및 생산 기지' : isKhmer ? 'ប្រភពកសិដ្ឋាន & រោងចក្រ' : 'Origins & Processing'}
              </div>
              <div className="text-xs font-bold text-slate-900 font-sans">
                {isKorean ? '캄퐁톰 & 캄폿 농가 → 프놈펜 시설' : isKhmer ? 'កំពង់ធំ & កំពត → រោងចក្រភ្នំពេញ' : 'Kampong Thom & Kampot → Phnom Penh'}
              </div>
              <div className="text-[11px] text-emerald-800 leading-tight">
                {isKorean ? 'EUDR 산림보호 & CS 001 국가 품질 인증' : isKhmer ? 'ស្តង់ដារជាតិ CS 001 & EUDR មិនកាប់ព្រៃឈើ' : 'EUDR Deforestation-Free & CS 001'}
              </div>
            </div>
          </div>
        </div>

        {/* 2. The 4 Pillars of Mayany Enterprise */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-amber-500" />
            <h3 className="text-lg sm:text-xl font-bold text-slate-900">
              {isKorean 
                ? '마얀 엔터프라이즈의 4대 핵심 가치 및 차별점' 
                : isKhmer 
                ? 'សសរស្តម្ភទាំង ៤ នៃគុណតម្លៃសហគ្រាស ម៉ាយ៉ានី' 
                : 'The 4 Core Pillars of Mayany Enterprise'}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Pillar 1 */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2 hover:shadow-md transition">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center font-bold">
                <Users size={20} />
              </div>
              <h4 className="text-sm font-bold text-slate-900">
                {isKorean ? '1. 직접 농가 계약 & 공정무역' : isKhmer ? '១. ទិញផ្ទាល់ពីកសិករ & យុត្តិធម៌' : '1. Direct Farm Fair Trade'}
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {isKorean
                  ? '캄퐁톰(Kampong Thom) 소농 협동조합과 직계약하여 중간 상인 착취를 배제하고, 농가에 시세 대비 20~30% 높은 정당한 대가를 지급하여 지속 가능한 농촌 생계를 보장합니다.'
                  : isKhmer
                  ? 'សហការទិញផ្ទាល់ពីសហគមន៍កសិករខេត្តកំពង់ធំ និងកំពត ដោយមិនឆ្លងកាត់ឈ្មួញកណ្តាល ផ្តល់តម្លៃលើសទីផ្សារ +២០% ទៅ +៣០% ដើម្បីលើកកម្ពស់ជីវភាពកសិករជនបទ។'
                  : 'Partnering directly with smallholder farming cooperatives in Kampong Thom and Kampot, bypassing predatory middlemen to pay +20% to +30% above farmgate rates.'}
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2 hover:shadow-md transition">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-700 flex items-center justify-center font-bold">
                <Award size={20} />
              </div>
              <h4 className="text-sm font-bold text-slate-900">
                {isKorean ? '2. 정품 캄폿 GI 흑후추' : isKhmer ? '២. ម្រេចខ្មៅកំពត GI សុទ្ធ' : '2. 100% Authentic GI Pepper'}
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {isKorean
                  ? '세계적으로 인정받는 캄보디아 지리적표시(PGI) 인증 정품 캄폿 흑후추와 천연 캄폿 바다 소금을 사용하여 풍부한 아로마와 깔끔하고 깊은 매운맛을 완성합니다.'
                  : isKhmer
                  ? 'ប្រើប្រាស់ម្រេចខ្មៅកំពតពិតប្រាកដដែលទទួលស្គាល់ដោយសម្ព័ន្ធផលិតផលសម្គាល់ភូមិសាស្ត្រទំនិញ (GI) និងអំបិលសមុទ្រកំពតធម្មជាតិ ផ្តល់ក្លិនក្រអូបឈ្ងុយ និងរសជាតិដិតជាប់មាត់។'
                  : 'Sourcing 100% genuine PGI Kampot Black Pepper and natural Kampot sea salt, celebrated by Michelin chefs worldwide for complex floral aromas and lingering warmth.'}
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2 hover:shadow-md transition">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-700 flex items-center justify-center font-bold">
                <Coffee size={20} />
              </div>
              <h4 className="text-sm font-bold text-slate-900">
                {isKorean ? '3. 100% 순수 캐슈 드링크 & 파우더' : isKhmer ? '៣. ម្សៅ & ទឹកដោះគោស្វាយចន្ទី ១០០%' : '3. 100% Pure Cashew Drink & Flour'}
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {isKorean
                  ? '첨가제, 유화제, 팜유가 전혀 들어가지 않은 100% 순수 냉압착 캐슈 파우더와 천연 캐슈 드링크로, 커피와 음료를 위한 건강하고 고소한 식물성 영양을 제공합니다.'
                  : isKhmer
                  ? 'ស្រាវជ្រាវម្សៅ និងទឹកដោះគោគ្រាប់ស្វាយចន្ទីធម្មជាតិ ១០០% គ្មានជាតិគីមី គ្មានសារធាតុរក្សាទុក សម្រាប់ឆុងភេសជ្ជៈ និងកាហ្វេ ជំនួសទឹកដោះគោសត្វយ៉ាងឈ្ងុយឆ្ងាញ់ និងផ្តល់សុខភាពល្អ។'
                  : 'Pioneering clean-label 100% pure cold-milled cashew flour and fresh cashew drinks—delivering rich plant-based nutrition for beverages and coffee without dairy or additives.'}
              </p>
            </div>

            {/* Pillar 4 */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2 hover:shadow-md transition">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-700 flex items-center justify-center font-bold">
                <ShieldCheck size={20} />
              </div>
              <h4 className="text-sm font-bold text-slate-900">
                {isKorean ? '4. 디지털 QR 여권 이력추적' : isKhmer ? '៤. កូដ QR Passport ពិនិត្យប្រភព' : '4. QR Verifiable Passport'}
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {isKorean
                  ? '캐슈트레이스(CashewTrace) 프로토콜을 통해 모든 병과 파우치마다 농장 GPS 위치, EU 산림벌채방지규정(EUDR) 적합성, 수분율 검사 결과를 스마트폰으로 투명하게 확인합니다.'
                  : isKhmer
                  ? 'គ្រប់ដប និងកញ្ចប់ទាំងអស់មានភ្ជាប់កូដ QR CashewTrace Passport ដែលអនុញ្ញាតឱ្យពិនិត្យមើលកូអរដោនេចម្ការ ការមិនកាប់ព្រៃឈើ (EUDR) និងកម្រិតសំណើមបានភ្លាមៗ។'
                  : 'Every container features a CashewTrace QR code verifying GPS farm origins, EUDR deforestation-free compliance, and certified laboratory moisture tests (<4.5%).'}
              </p>
            </div>
          </div>
        </div>

        {/* 3. Global Market Traction & International Buyer Validation */}
        <div className="bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 text-white rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="space-y-1">
            <span className="text-xs font-mono font-bold tracking-wider text-amber-400 uppercase">
              {isKorean ? '글로벌 시장의 관심' : isKhmer ? 'ការចាប់អារម្មណ៍ពីទីផ្សារអន្តរជាតិ' : 'INTERNATIONAL MARKET INTEREST'}
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-white leading-snug">
              {isKorean 
                ? '한국 바이어와 투자자가 당사 제품을 시음하고, 영국으로 제품 샘플이 전달되었으며, 국가 기관의 지원을 받고 있습니다' 
                : isKhmer 
                ? 'អ្នកទិញ និងវិនិយោគិនកូរ៉េបានភ្លក់ផលិតផលរបស់យើង ផលិតផលត្រូវបានផ្ញើទៅចក្រភពអង់គ្លេស ហើយយើងទទួលបានការគាំទ្រពីស្ថាប័នជាតិ' 
                : 'Korean buyers and investors tasted our products, products have been sent to the UK, and we receive support from national institutions'}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            {/* Korea Testimonial */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl p-4 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-lg">🇰🇷</span>
                <span className="font-bold text-amber-300 text-sm">
                  {isKhmer ? 'កូរ៉េខាងត្បូង (សេអ៊ូល)' : isKorean ? '대한민국 서울' : 'South Korea (Seoul)'}
                </span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                {isKorean
                  ? '서울에서 한 한국 스타트업 투자자가 당사의 100% 순수 캐슈 파우더를 직접 따뜻한 커피에 타서 시음한 후 매우 만족해했습니다. 그는 한국에서는 아직 캐슈 파우더를 본 적이 없다고 전했습니다.'
                  : isKhmer
                  ? 'នៅទីក្រុងសេអ៊ូល អ្នកវិនិយោគលើសហគ្រាសថ្មីៗជនជាតិកូរ៉េម្នាក់ បានភ្លក្សម្សៅគ្រាប់ស្វាយចន្ទី ១០០% របស់យើង និងបានដាក់លាយក្នុងកាហ្វេក្តៅរបស់គាត់ផ្ទាល់ ហើយបានចូលចិត្តជាខ្លាំង។ គាត់ប្រាប់ថា គាត់មិនទាន់បានឃើញមានម្សៅស្វាយចន្ទីនៅកូរ៉េនៅឡើយទេ។'
                  : 'In Seoul, a Korean startup investor personally tasted our 100% pure cashew flour, mixed it directly into his own hot coffee, and loved it very much. He mentioned that he had not yet seen cashew flour in Korea.'}
              </p>
            </div>

            {/* UK Testimonial */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl p-4 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-lg">🇬🇧</span>
                <span className="font-bold text-cyan-300 text-sm">
                  {isKhmer ? 'ចក្រភពអង់គ្លេស (ទីក្រុងឡុងដ៍)' : isKorean ? '영국 런던' : 'United Kingdom (London)'}
                </span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                {isKorean
                  ? '누온(Ms. Nuon) 여사는 영국 런던의 명문 클럽에 선물 및 시음용 샘플로 소개하기 위해 សហគ្រាស ម៉ាយ៉ានី(MAYANY Enterprise)의 100% 순수 캐슈 파우더, 매콤 칠리 캐슈넛, 캄폿 GI 흑후추 코팅 캐슈넛을 직접 선정하였습니다.'
                  : isKhmer
                  ? 'លោកស្រីនួន បានជ្រើសរើសផលិតផលរបស់សហគ្រាស ម៉ាយ៉ានី រួមមាន ម្សៅគ្រាប់ស្វាយចន្ទីសុទ្ធ ១០០% គ្រាប់ស្វាយចន្ទីស្រោបម្ទេសហឹរស្រួយ និងគ្រាប់ស្វាយចន្ទីស្រោបម្រេចខ្មៅកំពត ដើម្បីណែនាំដល់ក្លឹបដ៏ល្បីមួយនៅទីក្រុងឡុងដ៍ ប្រទេសអង់គ្លេស ជាអំណោយ និងជាគំរូសម្រាប់សាកល្បង។'
                  : 'Ms. Nuon selected MAYANY Enterprise\'s products—including 100% pure cashew kernel flour, crunchy chili-coated cashews, and GI Kampot black pepper coated cashews—to introduce to a prestigious club in London, UK, as gifts and sampling specimens.'}
              </p>
            </div>

            {/* Institutional Backing */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl p-4 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-lg">🇰🇭</span>
                <span className="font-bold text-emerald-300 text-sm">Khmer Enterprise & FTC / MISTI</span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                {isKorean
                  ? 'MAYANY Enterprise는 크메르 엔터프라이즈(Khmer Enterprise)의 식품 안전 표준 프로그램에 참여하고 있으며, 한-캄 식품가공 TASK 센터(FTC)에서 100% 순수 캐슈 파우더를 생산하고 있습니다.'
                  : isKhmer
                  ? 'MAYANY Enterprise ចូលរួមកម្មវិធីស្តង់ដារសុវត្ថិភាពអាហាររបស់សហគ្រិនខ្មែរ (Khmer Enterprise) ហើយផលិតម្សៅគ្រាប់ស្វាយចន្ទី ១០០% នៅមជ្ឈមណ្ឌលបច្ចេកវិទ្យាកែឆ្នៃអាហារ កម្ពុជា-កូរ៉េ (FTC)។'
                  : 'MAYANY Enterprise participates in Khmer Enterprise\'s food safety standards program and manufactures its 100% pure cashew kernel flour at the Cambodia-Korea Food Processing TASK Center (FTC).'}
              </p>
            </div>
          </div>
        </div>

        {/* 4. Company Fact Sheet Spec Grid */}
        <div className="border border-slate-200 rounded-2xl overflow-hidden text-xs">
          <div className="bg-slate-100 px-4 py-2.5 font-bold text-slate-800 flex items-center justify-between border-b border-slate-200">
            <span className="flex items-center gap-1.5">
              <FileText size={14} className="text-slate-600" />
              <span>{isKorean ? '기업 개요 요약 (Fact Sheet)' : isKhmer ? 'ព័ត៌មានសង្ខេបសហគ្រាស (Company Fact Sheet)' : 'Company Fact Sheet & Specifications'}</span>
            </span>
            <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Active Cambodian Legal Entity
            </span>
          </div>

          <div className="divide-y divide-slate-100 bg-white">
            <div className="grid grid-cols-1 sm:grid-cols-3 p-3 gap-1">
              <span className="font-bold text-slate-500">{isKorean ? '기업명' : isKhmer ? 'ឈ្មោះសហគ្រាស' : 'Enterprise Name'}:</span>
              <span className="sm:col-span-2 font-semibold text-slate-900">
                {isKhmer ? 'សហគ្រាស ម៉ាយ៉ានី (MAYANY Enterprise)' : 'MAYANY Enterprise (សហគ្រាស ម៉ាយ៉ានី)'}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 p-3 gap-1">
              <span className="font-bold text-slate-500">{isKorean ? '대표자 / 창업자' : isKhmer ? 'ស្ថាបនិក & តំណាង' : 'Founder & CEO'}:</span>
              <span className="sm:col-span-2 font-semibold text-slate-900">
                {isKorean ? '마얀 삼 (Mayany SAM)' : 'សំ ម៉ាយ៉ានី (Mayany SAM)'}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 p-3 gap-1">
              <span className="font-bold text-slate-500">{isKorean ? '가공 시설 및 본사' : isKhmer ? 'ទីតាំងរោងចក្រ & ការិយាល័យ' : 'Processing Facility'}:</span>
              <span className="sm:col-span-2 text-slate-800">Phnom Penh, Kingdom of Cambodia</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 p-3 gap-1">
              <span className="font-bold text-slate-500">{isKorean ? '원물 산지 파트너십' : isKhmer ? 'ប្រភពកសិដ្ឋានចម្ការ' : 'Farm Sourcing'}:</span>
              <span className="sm:col-span-2 text-slate-800">Kampong Thom Province (Cashews) & Kampot Province (PGI Black Pepper & Sea Salt)</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 p-3 gap-1">
              <span className="font-bold text-slate-500">{isKorean ? '주요 제품군' : isKhmer ? 'ផលិតផលចម្បង' : 'Core Product Lines'}:</span>
              <span className="sm:col-span-2 text-slate-800">
                {isKorean 
                  ? '프리미엄 로스팅 캐슈넛 (흑후추, 당코팅, 칠리), 100% 순수 바리스타 캐슈넛 파우더, 천연 캐슈 밀크, 정품 캄폿 GI 흑후추'
                  : isKhmer 
                  ? 'គ្រាប់ស្វាយចន្ទីលីង (ម្រេចខ្មៅកំពត, ស្រោបស្ករ, ស្រោបម្ទេស), ម្សៅគ្រាប់ស្វាយចន្ទីសុទ្ធ ១០០%, ទឹកដោះគោស្វាយចន្ទីធម្មជាតិ, ម្រេចខ្មៅកំពត GI'
                  : 'Gourmet Roasted Cashews (Sugar, Chili, GI Pepper), 100% Pure Barista Cashew Flour, Natural Cashew Milk, GI Kampot Black Pepper'}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 p-3 gap-1">
              <span className="font-bold text-slate-500">{isKorean ? '품질 인증 및 표준' : isKhmer ? 'ស្តង់ដារគុណភាព & អនុលោមភាព' : 'Standards & Compliance'}:</span>
              <span className="sm:col-span-2 text-slate-800">CS 001 Cambodian National Standard, PGI Kampot (KPPA), EUDR Deforestation-Free, CashewTrace QR Passport</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 p-3 gap-1">
              <span className="font-bold text-slate-500">{isKorean ? '공식 직통 연락처' : isKhmer ? 'ទំនាក់ទំនងផ្លូវការ' : 'Official Direct Desk'}:</span>
              <span className="sm:col-span-2 font-mono text-emerald-700 font-bold">
                Phone & WhatsApp: +855 88 771 2862 • mayany@mayanyenterprise.com
              </span>
            </div>
          </div>
        </div>

        {/* 5. Personal Quote from Founder Mayany SAM */}
        <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-5 sm:p-6 text-amber-950 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 shadow-md">
            <Quote size={24} />
          </div>
          <div className="space-y-1">
            <p className="text-xs sm:text-sm italic leading-relaxed text-amber-950 font-serif">
              {isKorean
                ? '"우리는 단순한 캐슈넛 가공에 그치지 않고, 캄보디아 농산물의 가치를 높이고 농민들의 생계를 지원하며 지역 일자리를 창출하고, 캄보디아 본연의 진정한 풍미를 세계에 전하는 것을 목표로 하고 있습니다."'
                : isKhmer
                ? '"យើងមិនត្រឹមតែកែច្នៃគ្រាប់ស្វាយចន្ទីប៉ុណ្ណោះទេ ប៉ុន្តែយើងកំពុងខិតខំលើកកម្ពស់តម្លៃនៃផលិតផលកសិកម្មខ្មែរ គាំទ្រជីវភាពកសិករ និងបង្កើតការងារក្នុងស្រុក ហើយមានគោលដៅនាំយករសជាតិដ៏ពិតប្រាកដរបស់កម្ពុជាទៅកាន់ពិភពលោក។"'
                : '"We do not merely process cashews; we are committed to uplifting the value of Cambodian agricultural produce, supporting farmers\' livelihoods, creating local employment, and bringing the authentic taste of Cambodia to the world."'}
            </p>
            <div className="text-[11px] font-bold text-amber-900 font-sans">
              — {isKhmer ? 'លោកស្រី សំ ម៉ាយ៉ានី (Mayany SAM) ស្ថាបនិក & អគ្គនាយិកា សហគ្រាស ម៉ាយ៉ានី (MAYANY Enterprise)' : 'Mrs. Mayany SAM, Founder & CEO of MAYANY Enterprise'}
            </div>
          </div>
        </div>
      </section>

      {/* 5. DEDICATED DIRECT ORDER & CONTACT SECTION AT BOTTOM OF PAGE */}
      <div id="contact-bottom-section" className="bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 text-white rounded-3xl p-6 sm:p-10 border border-emerald-500/40 shadow-2xl text-left space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-slate-800">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-full text-xs font-mono font-bold uppercase">
              <Phone size={13} className="text-emerald-400" />
              <span>
                {isKorean ? '공식 직통 주문 및 수출 상담' : isKhmer ? '📞 ទំនាក់ទំនងបញ្ជាទិញផ្ទាល់' : '📞 Direct Order & Export Desk'}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              {isKorean ? '마얀 엔터프라이즈 직통 주문 및 문의' : isKhmer ? 'ទំនាក់ទំនងបញ្ជាទិញផ្ទាល់ពី សហគ្រាស ម៉ាយ៉ានី' : 'Order Direct from Mayany Enterprise'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {isKorean 
                ? '모든 제품은 신선도 유지를 위해 사전 주문 제작(Make-to-Order)으로 생산됩니다. 대량 수출, 샘플 주문, 카페용 바리스타 파우더 공급 등 궁금하신 점은 언제든 직통 연락처로 문의해 주세요.'
                : isKhmer 
                ? 'រាល់កសិផលទាំងអស់ត្រូវបានផលិតថ្មីៗតាមការកុម្ម៉ង់ (Make-to-Order) ដើម្បីធានាគុណភាពស្រស់ និងក្លិនឈ្ងុយ។ សម្រាប់ព័ត៌មានបន្ថែម ឬកុម្ម៉ង់ទិញជាដុំ និងរាយ សូមទាក់ទងមកយើងខ្ញុំដោយផ្ទាល់។'
                : 'All artisan products are crafted fresh make-to-order for guaranteed export quality. For bulk commercial containers, cafe supplies, or sample orders, contact our direct desk.'}
            </p>
          </div>

          {/* Big WhatsApp CTA Button */}
          <a
            href="https://wa.me/855887712862?text=Hello%20Mayany%20Enterprise!%20I%20would%20like%20to%20inquire%20about%20ordering%20products."
            target="_blank"
            rel="noopener noreferrer"
            className="py-3.5 px-6 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2.5 transition shadow-xl hover:scale-105 cursor-pointer shrink-0"
          >
            <MessageCircle size={20} />
            <span>{isKorean ? 'WhatsApp 상담 / 주문하기' : isKhmer ? 'Chat on WhatsApp (កុម្ម៉ង់ភ្លាមៗ)' : 'Chat on WhatsApp'}</span>
          </a>
        </div>

        {/* Contact Details Grid (4 Columns) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          {/* 1. Phone */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shrink-0">
              <Phone size={20} />
            </div>
            <div>
              <div className="text-[11px] text-slate-400 font-semibold">{isKorean ? '직통 전화 / 텔레그램' : isKhmer ? 'លេខទូរស័ព្ទ / តេឡេក្រាម' : 'Direct Phone'}</div>
              <a href="tel:+855887712862" className="text-sm font-bold text-white font-mono hover:text-emerald-400 transition">
                +855 88 771 2862
              </a>
            </div>
          </div>

          {/* 2. WhatsApp */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shrink-0">
              <MessageCircle size={20} />
            </div>
            <div>
              <div className="text-[11px] text-slate-400 font-semibold">WhatsApp 24/7</div>
              <a href="https://wa.me/855887712862" target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-white font-mono hover:text-emerald-400 transition">
                +855 88 771 2862
              </a>
            </div>
          </div>

          {/* 3. Official Facebook */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-950 border border-blue-500/40 text-blue-400 flex items-center justify-center shrink-0">
              <Facebook size={20} />
            </div>
            <div className="min-w-0">
              <div className="text-[11px] text-slate-400 font-semibold">{isKorean ? '공식 페이스북' : isKhmer ? 'ទំព័រ Facebook ផ្លូវការ' : 'Official Facebook'}</div>
              <a 
                href="https://www.facebook.com/share/p/18sWyRnWDV/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-xs sm:text-sm font-bold text-blue-300 hover:text-white transition truncate block"
              >
                Mayany Enterprise
              </a>
            </div>
          </div>

          {/* 4. Email */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-3.5 sm:p-4 flex items-center gap-2.5 sm:gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-950 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shrink-0">
              <Mail size={18} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[10px] sm:text-[11px] text-slate-400 font-semibold">{isKorean ? '공식 이메일' : isKhmer ? 'អ៊ីមែលផ្លូវការ' : 'Official Email'}</div>
              <a 
                href="mailto:mayany@mayanyenterprise.com" 
                className="text-[11px] sm:text-xs font-mono font-bold text-white hover:text-emerald-400 transition block break-all leading-tight"
                title="mayany@mayanyenterprise.com"
              >
                mayany@mayanyenterprise.com
              </a>
            </div>
          </div>
        </div>

        {/* Export terms note & Packaging Studio Link */}
        <div className="bg-slate-950/50 rounded-2xl p-4 border border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck size={16} className="text-emerald-400 shrink-0" />
            <span>
              {isKorean
                ? 'EUDR 산림벌채방지규정 준수 • CS 001 국가 품질 인증 • Make-to-Order 신선 배치'
                : isKhmer
                ? 'អនុលោមភាព EUDR មិនកាប់ព្រៃឈើ • ស្តង់ដារជាតិ CS 001 • ផលិតថ្មីៗតាមការកុម្ម៉ង់'
                : 'EUDR Deforestation-Free • CS 001 National Standard • Make-to-Order Fresh Batches'}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {onOpenDeploy && (
              <button
                type="button"
                onClick={onOpenDeploy}
                className="text-emerald-300 hover:text-emerald-200 bg-emerald-950/80 border border-emerald-500/50 hover:border-emerald-400 font-bold flex items-center gap-1.5 px-3 py-1 rounded-xl transition cursor-pointer text-[11px] sm:text-xs shadow-xs"
                title="Download verified site archive to deploy on cashewtrace.com / Cloudflare Pages"
              >
                <span>🚀</span>
                <span>{isKhmer ? 'ផ្សាយផ្ទាល់លើ cashewtrace.com' : 'Deploy to cashewtrace.com'}</span>
              </button>
            )}
            {onOpenPackaging && (
              <button
                type="button"
                onClick={onOpenPackaging}
                className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1.5 transition-colors cursor-pointer text-[11px] sm:text-xs"
                title="Open 13-Step Packaging Label Studio"
              >
                <span>🏷️</span>
                <span>{isKhmer ? 'ស្ទូឌីយោស្លាកវេចខ្ចប់ ១៣ ជំហាន (CS 001)' : '13-Step Packaging Studio'}</span>
              </button>
            )}
            <span className="font-mono text-[11px] text-slate-500">
              Phnom Penh & Kampong Thom, Cambodia
            </span>
          </div>
        </div>
      </div>

      {/* 5. FLOATING CART FLOATER (When items exist in cart) */}
      <AnimatePresence>
        {totalCartItems > 0 && (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="fixed bottom-6 right-6 z-40"
          >
            <button
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-3 bg-slate-900 hover:bg-slate-800 text-white py-3.5 px-6 rounded-2xl shadow-2xl border border-emerald-500/50 cursor-pointer group"
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
                <span className="absolute -top-2 -right-2 bg-emerald-500 text-slate-950 text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                  {totalCartItems}
                </span>
              </div>
              <div className="text-left">
                <div className="text-xs text-slate-400">
                  {isKorean ? '장바구니 총액' : isKhmer ? 'សរុបការកុម្ម៉ង់' : 'Cart Total'}
                </div>
                <div className="text-sm font-extrabold font-mono text-emerald-400">
                  {formatPrice(totalCartUsd)}
                </div>
              </div>
              <ChevronRight size={16} className="text-slate-400 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 5. IMAGE PREVIEW MODAL */}
      <AnimatePresence>
        {selectedPreviewImage && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl p-4 max-w-2xl w-full relative shadow-2xl flex flex-col items-center"
            >
              <button
                onClick={() => setSelectedPreviewImage(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer z-10"
              >
                <X size={20} />
              </button>
              <div className="w-full max-h-[75vh] flex items-center justify-center p-2 overflow-hidden">
                <img
                  src={selectedPreviewImage}
                  alt="Product Full Resolution"
                  className="max-h-[70vh] w-auto object-contain rounded-2xl"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = '/images/mayany_ke_application_product_collage_1785131513154.jpg';
                  }}
                />
              </div>
              <p className="text-xs text-slate-500 mt-2 font-mono">
                {isKorean ? '정품 마얀 엔터프라이즈 실물 사진' : isKhmer ? 'រូបភាពកសិផលពិតប្រាកដ Mayany Enterprise' : 'Original Mayany Enterprise Product Photography'}
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 6. CART & CHECKOUT SLIDE-OVER */}
      <AnimatePresence>
        {isCartOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs"
            />

            <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between"
              >
                {/* Cart Header */}
                <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-emerald-600" />
                    <h2 className="text-lg font-bold text-slate-900">
                      {isKorean ? '주문 장바구니' : isKhmer ? 'កន្ត្រកកុម្ម៉ង់ទំនិញ' : 'Your Order Desk'}
                    </h2>
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full text-xs font-mono font-bold">
                      {totalCartItems}
                    </span>
                  </div>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="p-2 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Cart Items List */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {totalCartItems === 0 ? (
                    <div className="py-12 text-center text-slate-400 space-y-3">
                      <ShoppingBag size={48} className="mx-auto text-slate-300" />
                      <p className="text-sm">
                        {isKorean ? '장바구니가 비어 있습니다.' : isKhmer ? 'កន្ត្រករបស់អ្នកមិនទាន់មានទំនិញនៅឡើយទេ' : 'Your cart is empty.'}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {Object.entries(cart).map(([id, qty]) => {
                        const product = STORE_PRODUCTS.find((p) => p.id === id);
                        if (!product) return null;
                        const pName = isKorean ? product.nameKo : isKhmer ? product.nameKh : product.nameEn;
                        return (
                          <div
                            key={id}
                            className="flex items-center justify-between p-3 rounded-2xl border border-slate-200 bg-slate-50 gap-3"
                          >
                            <img
                              src={product.imageSrc}
                              alt={pName}
                              className="w-14 h-14 object-contain rounded-xl bg-white p-1 border border-slate-200 shrink-0"
                              onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.src = '/images/mayany_ke_application_product_collage_1785131513154.jpg';
                              }}
                            />
                            <div className="flex-1 text-left min-w-0">
                              <p className="text-xs font-bold text-slate-900 truncate">
                                {pName}
                              </p>
                              <p className="text-[11px] text-slate-500 font-mono">
                                {product.weight} • {formatPrice(product.priceUsd)} / unit
                              </p>
                              <p className="text-xs font-extrabold text-emerald-700 font-mono">
                                {formatPrice(product.priceUsd * qty)}
                              </p>
                            </div>
                            <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-xl p-1">
                              <button
                                onClick={() => addToCart(id, -1)}
                                className="w-6 h-6 flex items-center justify-center text-slate-600 hover:bg-slate-100 rounded cursor-pointer"
                              >
                                <Minus size={12} />
                              </button>
                              <span className="w-5 text-center text-xs font-bold font-mono">{qty}</span>
                              <button
                                onClick={() => addToCart(id, 1)}
                                className="w-6 h-6 flex items-center justify-center text-slate-600 hover:bg-slate-100 rounded cursor-pointer"
                              >
                                <Plus size={12} />
                              </button>
                            </div>
                          </div>
                        );
                      })}

                      {/* Checkout Buyer Form */}
                      <form onSubmit={handleSubmitOrder} className="pt-4 border-t border-slate-200 space-y-3 text-left">
                        <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                          {isKorean ? '주문자 정보 (Buyer Details)' : isKhmer ? 'ព័ត៌មានអ្នកបញ្ជាទិញ (Buyer Details)' : 'Buyer Details'}
                        </div>

                        <div>
                          <label className="text-[11px] font-bold text-slate-600 block mb-1">
                            {isKorean ? '성함 / 회사명' : isKhmer ? 'ឈ្មោះ / ក្រុមហ៊ុន' : 'Full Name / Company'} *
                          </label>
                          <input
                            type="text"
                            required
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                            placeholder={isKorean ? '예: 김대표 (한국 스타트업)' : isKhmer ? 'ឧ. លោក សុខ' : 'e.g. John Doe / Global Partner'}
                            className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-bold text-slate-600 block mb-1">
                            {isKorean ? '연락처 / 왓츠앱' : isKhmer ? 'លេខទូរស័ព្ទ / WhatsApp' : 'Phone / WhatsApp'} *
                          </label>
                          <input
                            type="text"
                            required
                            value={customerPhone}
                            onChange={(e) => setCustomerPhone(e.target.value)}
                            placeholder="+855 ... / +82 ..."
                            className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-mono"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[11px] font-bold text-slate-600 block mb-1">
                              {isKorean ? '배송 국가' : isKhmer ? 'ប្រទេសដឹកជញ្ជូន' : 'Destination'}
                            </label>
                            <select
                              value={deliveryCountry}
                              onChange={(e) => setDeliveryCountry(e.target.value)}
                              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                            >
                              <option value="South Korea">South Korea (대한민국)</option>
                              <option value="Cambodia">Cambodia (កម្ពុជា)</option>
                              <option value="United Kingdom">United Kingdom (UK)</option>
                              <option value="Japan">Japan (日本)</option>
                              <option value="Singapore">Singapore</option>
                              <option value="Other">Other International</option>
                            </select>
                          </div>
                          <div>
                            <label className="text-[11px] font-bold text-slate-600 block mb-1">
                              {isKorean ? '이메일' : isKhmer ? 'អ៊ីមែល' : 'Email'}
                            </label>
                            <input
                              type="email"
                              value={customerEmail}
                              onChange={(e) => setCustomerEmail(e.target.value)}
                              placeholder="buyer@domain.com"
                              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-[11px] font-bold text-slate-600 block mb-1">
                            {isKorean ? '배송 주소' : isKhmer ? 'អាសយដ្ឋានដឹកជញ្ជូន' : 'Shipping Address'}
                          </label>
                          <input
                            type="text"
                            value={deliveryAddress}
                            onChange={(e) => setDeliveryAddress(e.target.value)}
                            placeholder={isKorean ? '서울시 강남구... 또는 프놈펜 배송지' : isKhmer ? 'រាជធានីភ្នំពេញ ឬខេត្ត...' : 'City, Postal code, Street address'}
                            className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-bold text-slate-600 block mb-1">
                            {isKorean ? '결제 방식' : isKhmer ? 'វិធីទូទាត់ប្រាក់' : 'Payment Method'}
                          </label>
                          <select
                            value={paymentPreference}
                            onChange={(e) => setPaymentPreference(e.target.value as any)}
                            className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                          >
                            <option value="whatsapp">
                              {isKorean ? 'WhatsApp 직접 협의 및 인보이스' : isKhmer ? 'ពិភាក្សាផ្ទាល់តាម WhatsApp' : 'Direct Inquiry via WhatsApp'}
                            </option>
                            <option value="khqr">
                              {isKorean ? '캄보디아 KHQR (ACLEDA Bank / Bakong 전자결제)' : isKhmer ? 'ស្កេន KHQR (ACLEDA Bank / Bakong / ABA)' : 'Cambodia KHQR (ACLEDA Bank / Bakong)'}
                            </option>
                            <option value="international_wire">
                              {isKorean ? '해외 외화 송금 (Swift Wire Transfer / L/C)' : isKhmer ? 'ផ្ទេរប្រាក់អន្តរជាតិ (Bank Swift / LC)' : 'International Bank Swift Wire / L/C'}
                            </option>
                          </select>
                        </div>
                      </form>
                    </div>
                  )}
                </div>

                {/* Cart Footer Actions */}
                {totalCartItems > 0 && (
                  <div className="p-6 border-t border-slate-200 bg-slate-50 space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">
                        {isKorean ? '총 결제 금액 (USD)' : isKhmer ? 'សរុបប្រាក់ដុល្លារ (USD):' : 'Subtotal (USD):'}
                      </span>
                      <span className="font-mono font-extrabold text-lg text-slate-900">
                        ${totalCartUsd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
                      </span>
                    </div>

                    {isKhmer ? (
                      <div className="flex items-center justify-between text-sm bg-amber-50 p-2.5 rounded-xl border border-amber-200">
                        <span className="text-amber-900 font-bold">
                          សរុបជាប្រាក់រៀលខ្មែរ (KHR):
                        </span>
                        <span className="font-mono font-extrabold text-base text-amber-800">
                          {formatRiel(totalCartUsd)}
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600">
                          {isKorean ? '환산 금액' : 'Converted (' + currency + '):'}
                        </span>
                        <span className="font-mono font-extrabold text-lg text-emerald-700">
                          {formatPrice(totalCartUsd)}
                        </span>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-2 pt-2">
                      <a
                        href={buildWhatsAppMessage()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-3 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition shadow cursor-pointer text-center"
                      >
                        <MessageCircle size={15} />
                        <span>{isKorean ? '왓츠앱 주문' : isKhmer ? 'កុម្ម៉ង់ WhatsApp' : 'Order WhatsApp'}</span>
                      </a>

                      <button
                        type="button"
                        onClick={handleSubmitOrder}
                        disabled={isSubmitting}
                        className="py-3 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition shadow cursor-pointer disabled:opacity-50"
                      >
                        <Check size={15} />
                        <span>{isSubmitting ? '...' : isKorean ? '주문 확정' : isKhmer ? 'កត់ត្រាការទិញ' : 'Confirm Order'}</span>
                      </button>
                    </div>

                    <p className="text-[10px] text-slate-400 text-center">
                      Official Export Direct Desk • +855 88 771 2862
                    </p>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* 7. ORDER CONFIRMATION MODAL */}
      <AnimatePresence>
        {orderSubmitted && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-emerald-500/40 text-left space-y-6 my-8"
            >
              <div className="text-center space-y-2">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 size={32} />
                </div>
                <h2 className="text-xl font-extrabold text-slate-900">
                  {isKorean 
                    ? '주문이 성공적으로 접수되었습니다!' 
                    : isKhmer 
                    ? 'ការបញ្ជាទិញត្រូវបានកត់ត្រាជោគជ័យ!' 
                    : 'Order Received Successfully!'}
                </h2>
                <div className="inline-block px-3 py-1 bg-slate-100 text-slate-800 rounded-full text-xs font-mono font-bold">
                  Order Code: {orderSubmitted.orderCode}
                </div>
              </div>

              {/* Order Details Receipt */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3 text-xs">
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500">{isKorean ? '주문자:' : 'Buyer:'}</span>
                  <span className="font-bold text-slate-800">{orderSubmitted.customerName}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500">{isKorean ? '도착지:' : 'Destination:'}</span>
                  <span className="font-bold text-slate-800">{orderSubmitted.deliveryCountry}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500">{isKorean ? '총 수량:' : 'Total Items:'}</span>
                  <span className="font-bold text-slate-800">
                    {orderSubmitted.items.reduce((s: number, i: any) => s + i.quantity, 0)} units
                  </span>
                </div>
                <div className="flex justify-between font-bold text-sm text-emerald-700 pt-1">
                  <span>{isKorean ? '최종 결제 금액:' : isKhmer ? 'តម្លៃសរុប:' : 'Grand Total:'}</span>
                  <div className="text-right">
                    <div>${orderSubmitted.totalUsd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD</div>
                    {isKhmer ? (
                      <div className="text-xs text-amber-700 font-sans mt-0.5">
                        ≈ {formatRiel(orderSubmitted.totalUsd)}
                      </div>
                    ) : (
                      <div className="text-xs text-slate-500 font-mono">
                        ({formatPrice(orderSubmitted.totalUsd)})
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Payment Instructions */}
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs space-y-2 text-amber-900">
                <div className="font-bold flex items-center gap-1.5">
                  <DollarSign size={14} className="text-amber-700" />
                  <span>
                    {isKorean ? '결제 및 선적 안내 (Payment & Shipping)' : isKhmer ? 'ព័ត៌មានទូទាត់ប្រាក់ (Payment Methods)' : 'Payment & Settlement Options'}
                  </span>
                </div>
                <p>
                  <strong>• Korea, UK & International:</strong> Swift Wire Transfer to Mayany Enterprise account, PayPal invoice, or Letter of Credit (L/C) for commercial containers.
                </p>
                <p>
                  <strong>• Cambodia (KHQR / ACLEDA Bank / Bakong):</strong> Scan ACLEDA Bank KHQR or transfer to Mayany Enterprise official merchant account upon proforma invoice.
                </p>
                <p className="text-[11px] text-amber-800 italic">
                  {isKorean
                    ? '마얀 엔터프라이즈 전담팀이 왓츠앱 또는 전화(+855 88 771 2862)로 직접 연락하여 배송 일정 및 포장 LOT을 안내해 드립니다.'
                    : 'Our team will contact you directly on WhatsApp / Phone (+855 88 771 2862) to confirm shipping schedule and packaging LOT.'}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setCart({});
                    setOrderSubmitted(null);
                    setIsCartOpen(false);
                  }}
                  className="flex-1 py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs transition cursor-pointer text-center"
                >
                  {isKorean ? '확인 및 계속 쇼핑하기' : isKhmer ? 'បិទផ្ទាំងនេះ' : 'Done & Continue Browsing'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 8. CASHEW MILK 1L BOTTLE LABEL & DIRECT ORDER QR MODAL */}
      <CashewMilk1LLabelModal
        isOpen={isMilkLabelModalOpen}
        onClose={() => setIsMilkLabelModalOpen(false)}
      />

    </div>
  );
}
