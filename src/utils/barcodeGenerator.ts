// EAN-13 and Code-128 SVG Barcode Generator for Retail & Supermarket Packaging
// Designed for Cambodian GS1 Prefix (884...) and international retail POS systems

const EAN13_PATTERNS = {
  L: [
    '0001101', '0011001', '0010011', '0111101', '0100011',
    '0110001', '0101111', '0111011', '0110111', '0001011'
  ],
  G: [
    '0100111', '0110011', '0011011', '0100001', '0011101',
    '0111001', '0000101', '0010001', '0001001', '0010111'
  ],
  R: [
    '1110010', '1100110', '1101100', '1000010', '1011100',
    '1001110', '1010000', '1000100', '1001000', '1110100'
  ],
  FIRST_DIGIT_PARITY: [
    'LLLLLL', 'LLGLGG', 'LLGGLG', 'LLGGGL', 'LGLLGG',
    'LGGLLG', 'LGGGLL', 'LGLGLG', 'LGLGGL', 'LGGLGL'
  ]
};

// Calculate EAN-13 check digit
export function calculateEan13CheckDigit(twelveDigits: string): number {
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    const digit = parseInt(twelveDigits[i] || '0', 10);
    sum += i % 2 === 0 ? digit : digit * 3;
  }
  const remainder = sum % 10;
  return remainder === 0 ? 0 : 10 - remainder;
}

// Generate complete 13-digit EAN-13 string with valid checksum
export function formatEan13(inputCode: string): string {
  if (!inputCode || !inputCode.trim()) {
    return '';
  }
  const digits = inputCode.replace(/\D/g, '');
  if (!digits) {
    return '';
  }
  if (digits.length >= 13) {
    const base12 = digits.slice(0, 12);
    const check = calculateEan13CheckDigit(base12);
    return `${base12}${check}`;
  }
  // Pad or generate standard Cambodian GS1 (884 prefix) only if user actually typed digits
  const padded = (digits + '884212000000').slice(0, 12);
  const check = calculateEan13CheckDigit(padded);
  return `${padded}${check}`;
}

// Convert EAN-13 to binary module string (1 = black bar, 0 = white space)
export function ean13ToBinary(ean13: string): string {
  if (!ean13 || !ean13.trim()) {
    return '';
  }
  const code = formatEan13(ean13);
  if (!code || code.length !== 13) {
    return '';
  }
  const firstDigit = parseInt(code[0], 10);
  const parityPattern = EAN13_PATTERNS.FIRST_DIGIT_PARITY[firstDigit];
  if (!parityPattern) {
    return '';
  }

  let binary = '101'; // Left Guard

  // Left 6 digits
  for (let i = 0; i < 6; i++) {
    const digit = parseInt(code[i + 1], 10);
    const type = parityPattern[i] as 'L' | 'G';
    binary += EAN13_PATTERNS[type][digit];
  }

  binary += '01010'; // Center Guard

  // Right 6 digits
  for (let i = 0; i < 6; i++) {
    const digit = parseInt(code[i + 7], 10);
    binary += EAN13_PATTERNS.R[digit];
  }

  binary += '101'; // Right Guard

  return binary;
}
