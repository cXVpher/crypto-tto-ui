const BASE58_ALPHABET =
  "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";

export function encodeBase58(value: Uint8Array) {
  if (value.length === 0) {
    return "";
  }

  let zeroes = 0;
  while (zeroes < value.length && value[zeroes] === 0) {
    zeroes++;
  }

  const size = Math.ceil(((value.length - zeroes) * Math.log(256)) / Math.log(58)) + 1;
  const digits = new Uint8Array(size);
  let length = 0;

  for (let index = zeroes; index < value.length; index++) {
    let carry = value[index];
    let innerIndex = 0;

    for (
      let digitIndex = size - 1;
      (carry !== 0 || innerIndex < length) && digitIndex >= 0;
      digitIndex--, innerIndex++
    ) {
      carry += digits[digitIndex] * 256;
      digits[digitIndex] = carry % 58;
      carry = Math.floor(carry / 58);
    }

    length = innerIndex;
  }

  let result = "1".repeat(zeroes);
  let digitIndex = size - length;

  while (digitIndex < size && digits[digitIndex] === 0) {
    digitIndex++;
  }

  for (; digitIndex < size; digitIndex++) {
    result += BASE58_ALPHABET[digits[digitIndex]];
  }

  return result;
}
