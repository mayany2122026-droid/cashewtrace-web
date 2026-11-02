export async function detectUserProvince(): Promise<{
  city: string;
  provinceKhmer: string;
  country: string;
}> {
  return {
    city: 'Phnom Penh',
    provinceKhmer: 'រាជធានីភ្នំពេញ (Phnom Penh)',
    country: 'Cambodia',
  };
}
