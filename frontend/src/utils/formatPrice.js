export function formatPrice(price) {
  const num = parseFloat(price || 0);
  return num.toFixed(2) + ' DT';
}
