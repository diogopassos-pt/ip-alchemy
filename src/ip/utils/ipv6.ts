import { prefixToMask } from "../../cidr/utils/masks"
import { IPv6Types } from "../types"

function fromIPv4mapped(ipv4mapped: string) {
  return ipv4mapped
    .split(":")
    .map(part => {
      if (part.includes(".")) {
        const [a, b, c, d] = part
          .split(".")
          .map(str => Number(str).toString(16).padStart(2, "0"))
        return `${a}${b}:${c}${d}`
      } else {
        return part
      }
    })
    .join(":")
}

function isIPV4Mapped(ipv6Address: string) {
  return ipv6Address.includes(".")
}
export function ipv6ToInt(ipv6Address: string) {
  if (ipv6Address.includes("::")) {
    ipv6Address = expandIPv6(ipv6Address)
  }

  if (isIPV4Mapped(ipv6Address)) {
    ipv6Address = fromIPv4mapped(ipv6Address)
  }

  ipv6Address = ipv6Address
    .split(":")
    .map(slice => {
      return slice.padStart(4, "0")
    })
    .join("")

  return BigInt(`0x${ipv6Address}`)
}

// Function to expand IPv6 short form to full form
function expandIPv6(shortForm: string) {
  if (shortForm === "::") return "0000:0000:0000:0000:0000:0000:0000:0000"
  const fullForm = []
  const groups = shortForm.split("::")
  const leftGroup = groups[0].split(":").filter(n => n)
  const rightGroup = groups[1].split(":").filter(n => n)

  // Handle left group
  fullForm.push(...leftGroup)

  // Insert zeros for omitted groups (::)
  const totalGroups = 8
  const omittedGroups = totalGroups - leftGroup.length - rightGroup.length

  for (let i = 0; i < omittedGroups; i++) {
    fullForm.push("0000")
  }

  // Handle right group
  fullForm.push(...rightGroup)

  return fullForm.join(":")
}

function inRange(ipv6: string, rangeCidr: string) {
  const [rangeIP, rangePrefix] = rangeCidr.split("/")
  const rangeMask = prefixToMask(BigInt(rangePrefix), "v6")
  const rangeIpInt = ipv6ToInt(rangeIP)
  const ipInt = ipv6ToInt(ipv6)
  return (ipInt & rangeMask) === (rangeIpInt & rangeMask)
}

export function getIPV6AddressType(integer: bigint): IPv6Types {
  const ipString = integer.toString(16).padStart(32, "0")

  if (ipString === "00000000000000000000000000000000") return "Software" // ::/128
  if (ipString === "00000000000000000000000000000001") return "Loopback" // ::1/128
  if (ipString.startsWith("00000000000000000000ffff")) return "IPV4-Mapped"
  if (ipString.startsWith("20010db8")) return "Documentation" //2001:0db8::/32
  if (ipString.startsWith("200100020000")) return "Benchmarking"
  if (ipString.startsWith("2001001")) return "Orchid"
  if (ipString.startsWith("2002")) return "6to4"
  if (ipString.startsWith("ff")) return "Multicast" //ff00::/8
  if (ipString.startsWith("20010000")) return "Teredo" // 2001:0000::/32
  if (ipString.startsWith("2") || ipString.startsWith("3")) return "Public"
  if (ipString.startsWith("fc") || ipString.startsWith("fd")) return "Private"
  if (inRange(ipString, "fe80::/10")) return "Link-Local"
  return "Future"
}
