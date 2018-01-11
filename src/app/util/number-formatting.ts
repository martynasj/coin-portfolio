export function roundNumber(num: number): string {
  return num.toPrecision(6);
}

export function roundCurrency(num: number): string {
  return num.toLocaleString('en-US', {style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2})
}

export function roundPercentage(num: number): string {
  const value = Number(num) / 100;
  return value.toLocaleString('en-US', {style: 'percent', minimumFractionDigits: 2, maximumFractionDigits: 2});
}