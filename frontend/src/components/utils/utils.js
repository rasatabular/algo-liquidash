// ceil decimal the numbers to display an upper limit of the actual amount
// and make users more cautious
export function twoDecimalsPercision(num) {
  return (Math.ceil(num * 100) / 100).toFixed(2)
}
