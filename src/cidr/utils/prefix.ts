/**
 * Calculate the minimum prefix length between two given IP addresses.
 *
 * @param {bigint} firstIP - the first IP address
 * @param {bigint} lastIP - the last IP address
 * @return {bigint} the length of the common prefix between the two IP addresses
 */
export function calculateCommonPrefix(firstIP: bigint, lastIP: bigint) {
  const bitLenght = firstIP.toString(2).length > 32 ? 128n : 32n
  let commonPrefixLength = 0n
  let mask = 1n << (bitLenght - 1n)

  for (let i = 0; i < bitLenght; i++) {
    if ((firstIP & mask) === (lastIP & mask)) {
      commonPrefixLength++
    } else {
      break
    }

    mask >>= 1n // Right shift the mask to the next bit
  }

  return commonPrefixLength
}
