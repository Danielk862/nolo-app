export function formatMoney(raw) {
  const digits = String(raw).replace(/[^0-9]/g, '');
  if (!digits) return '';
  return parseInt(digits, 10).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}
