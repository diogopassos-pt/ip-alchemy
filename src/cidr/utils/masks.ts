import { IPVersion } from "../../ip"

/**
 * Returns an IP subnet mask based on the given prefix and IP version.
 *
 * @param {bigint} prefix - The prefix length for the subnet mask
 * @param {string} version - The IP version ("v4" or "v6")
 * @return {bigint} The subnet mask value
 */
export function prefixToMask(prefix: bigint, version: IPVersion = "v4") {
  if (version === "v4") return BigInt.asUintN(32, 0xffffffffn << (32n - prefix))
  return BigInt.asUintN(
    128,
    0xffffffff_ffffffff_ffffffff_ffffffffn << (128n - prefix)
  )
}

/**
 * Generates a host mask from the given mask.
 *
 * @param {bigint} mask - the input mask
 * @param {IPVersion} version - the IP version (default: "v4")
 * @return {bigint} the host mask
 */
export function hostMaskFromMask(mask: bigint, version: IPVersion = "v4") {
  if (version === "v4") BigInt.asUintN(32, ~mask)
  return BigInt.asUintN(128, ~mask)
}
