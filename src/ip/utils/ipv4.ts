import { CONSTS } from "../consts"

function checkIPV4Local(integer: bigint) {
  const privateSubnets = [
    {
      start: CONSTS.IPV4.SUBNET_PRIVATE_10_START,
      end: CONSTS.IPV4.SUBNET_PRIVATE_10_END,
    },
    {
      start: CONSTS.IPV4.SUBNET_PRIVATE_172_START,
      end: CONSTS.IPV4.SUBNET_PRIVATE_172_END,
    },
    {
      start: CONSTS.IPV4.SUBNET_PRIVATE_192_START,
      end: CONSTS.IPV4.SUBNET_PRIVATE_192_END,
    },
  ]

  for (const subnet of privateSubnets) {
    if (integer >= subnet.start && integer <= subnet.end) {
      return true
    }
  }

  return false
}

function checkIPV4Documentation(integer: bigint) {
  const documentationSubnets = [
    {
      start: CONSTS.IPV4.SUBNET_DOCUMENTATION_192_START,
      end: CONSTS.IPV4.SUBNET_DOCUMENTATION_192_END,
    },
    {
      start: CONSTS.IPV4.SUBNET_DOCUMENTATION_198_START,
      end: CONSTS.IPV4.SUBNET_DOCUMENTATION_198_END,
    },
    {
      start: CONSTS.IPV4.SUBNET_DOCUMENTATION_203_START,
      end: CONSTS.IPV4.SUBNET_DOCUMENTATION_203_END,
    },
    {
      start: CONSTS.IPV4.SUBNET_DOCUMENTATION_233_START,
      end: CONSTS.IPV4.SUBNET_DOCUMENTATION_233_END,
    },
  ]

  for (const subnet of documentationSubnets) {
    if (integer >= subnet.start && integer <= subnet.end) {
      return true
    }
  }

  return false
}

function checkIPV4Other(integer: bigint) {
  const otherSubnets = [
    {
      start: CONSTS.IPV4.SUBNET_OTHER_100_START,
      end: CONSTS.IPV4.SUBNET_OTHER_100_END,
    },
    {
      start: CONSTS.IPV4.SUBNET_OTHER_192_START,
      end: CONSTS.IPV4.SUBNET_OTHER_192_END,
    },
    {
      start: CONSTS.IPV4.SUBNET_OTHER_192_88_START,
      end: CONSTS.IPV4.SUBNET_OTHER_192_88_END,
    },
    {
      start: CONSTS.IPV4.SUBNET_OTHER_198_START,
      end: CONSTS.IPV4.SUBNET_OTHER_198_END,
    },
  ]

  for (const subnet of otherSubnets) {
    if (integer >= subnet.start && integer <= subnet.end) {
      return true
    }
  }

  return false
}

export function getIPV4AddressType(integer: bigint) {
  if (checkIPV4Local(integer)) return "Private"
  if (checkIPV4Documentation(integer)) return "Documentation"
  if (checkIPV4Other(integer)) return "Other"
  if (
    integer >= CONSTS.IPV4.SUBNET_LINK_LOCAL_START &&
    integer <= CONSTS.IPV4.SUBNET_LINK_LOCAL_END
  )
    return "Link-Local"
  if (
    integer >= CONSTS.IPV4.SUBNET_LOOPBACK_START &&
    integer <= CONSTS.IPV4.SUBNET_LOOPBACK_END
  )
    return "Loopback"
  if (
    integer >= CONSTS.IPV4.SUBNET_SOFTWARE_START &&
    integer <= CONSTS.IPV4.SUBNET_SOFTWARE_END
  )
    return "Software"
  if (
    integer >= CONSTS.IPV4.SUBNET_MULTICAST_START &&
    integer <= CONSTS.IPV4.SUBNET_MULTICAST_END
  )
    return "Multicast"
  if (
    integer >= CONSTS.IPV4.SUBNET_FUTURE_240_START &&
    integer <= CONSTS.IPV4.SUBNET_FUTURE_240_END
  )
    return "Future"
  if (integer === CONSTS.IPV4.BROADCAST_ADDRESS) return "Broadcast"

  return "Public"
}

export function ipv4ToInt(ip: string): bigint {
  const octets = ip.split(".")
  const value = octets
    .map(BigInt)
    .reduce((acc, octet) => (acc << 8n) + octet, 0n)

  return BigInt.asUintN(32, value)
}
