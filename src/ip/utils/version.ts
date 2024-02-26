import { CheckIPVersionType } from "../types"

const ipv4Pattern =
  /^(25[0-5]|2[0-4][0-9]|[0-1]?[0-9]{1,2})(\.(25[0-5]|2[0-4][0-9]|[0-1]?[0-9]{1,2})){3}$/
const ipv6Pattern =
  /^(?:(?:[0-9a-fA-F]{1,4}:){6,6}(?::[0-9a-fA-F]{1,4})?|(?:[0-9a-fA-F]{1,4}:){1,7}[0-9a-fA-F]{1,4}|::1?)$/

/**
 * Check the version of IP address and return.
 *
 * @param {string} ip - the IP address to be checked
 * @return {CheckIPVersionType} the type of the IP address (v4, v6, or invalid)
 */
export function checkIPVersion(ip: string): CheckIPVersionType {
  const ipaddress = ip.replace(/^\[|\]$/g, "")

  if (ipv4Pattern.test(ipaddress)) return "v4"
  if (ipv6Pattern.test(ipaddress)) return "v6"

  return "invalid"
}
