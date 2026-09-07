export function formatFCFA(amount: number): string {
  return new Intl.NumberFormat('fr-FR', {
    maximumFractionDigits: 0,
  }).format(amount) + ' FCFA';
}

export function generateOrderRef(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let ref = 'EMC-';
  for (let i = 0; i < 5; i++) {
    ref += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return ref;
}

export function buildSmsHref(phoneNumber: string, message: string): string {
  const cleanNumber = phoneNumber.replace(/[^0-9]/g, '');
  const encodedMessage = encodeURIComponent(message);
  return `sms:${cleanNumber}?body=${encodedMessage}`;
}

export function buildWhatsAppHref(phoneNumber: string, message: string): string {
  // If West African / Côte d'Ivoire number without country code, prepend 225
  let cleanNumber = phoneNumber.replace(/[^0-9]/g, '');
  if (cleanNumber.length <= 10 && !cleanNumber.startsWith('225')) {
    cleanNumber = '225' + cleanNumber;
  }
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
}
