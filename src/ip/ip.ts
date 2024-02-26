import { CONSTS } from "./consts"
import type {
  CheckIPVersionType,
  IPAddressTypes,
  IPObject,
  IPVersion,
  IPv4Types,
  IPv6Types,
} from "./types"

const ipv4Pattern =
  /^(25[0-5]|2[0-4][0-9]|[0-1]?[0-9]{1,2})(\.(25[0-5]|2[0-4][0-9]|[0-1]?[0-9]{1,2})){3}$/
const ipv6Pattern =
  /^(?:(?:[0-9a-fA-F]{1,4}:){6,6}(?::[0-9a-fA-F]{1,4})?|(?:[0-9a-fA-F]{1,4}:){1,7}[0-9a-fA-F]{1,4}|::1?)$/

export class IPAddress {
  private _ip: string
  private _numeric_ip: bigint
  private _version: IPVersion

  private constructByString(ip: string) {
    const ipType = IPAddress.checkIPVersion(ip)
    if (ipType === "invalid") throw new Error(`Invalid IP address: ${ip}`)

    return {
      ip: ip,
      version: ipType,
      numericIp: ipType === "v4" ? this.ipv4ToInt(ip) : this.ipv6ToInt(ip),
    }
  }

  private constructByInt(ip: bigint) {
    const numberOfBits = ip.toString(2).length

    return {
      ip: numberOfBits > 32 ? this.intToIpv6(ip) : this.intToIpv4(ip),
      version: numberOfBits > 32 ? "v6" : ("v4" as IPVersion),
      numericIp: ip,
    }
  }
  private intToIpv4(integer: bigint) {
    const octet4 = integer & 0xffn
    const octet3 = (integer >> 8n) & 0xffn
    const octet2 = (integer >> 16n) & 0xffn
    const octet1 = (integer >> 24n) & 0xffn

    return `${octet1}.${octet2}.${octet3}.${octet4}`
  }

  private intToIpv6(integer: bigint) {
    const hexString = integer.toString(16).padStart(32, "0")
    // Split the string into 8 groups of 4 characters
    const groups = hexString.match(/.{1,4}/g) || []

    // Remove leading zeros from each segment
    const compactGroups = groups.map(segment => segment.replace(/^0+/, ""))

    // Join the groups with colons and return the result
    let compactIPv6String = compactGroups.join(":")

    // Collapse consecutive segments of zeros with double colon
    compactIPv6String = compactIPv6String
      .replace(/(^|:)0+(?=:|$)/g, ":")
      .replace(/:{3,}/, "::")
    return compactIPv6String
  }
  private constructor(arg: string | bigint) {
    let data
    if (typeof arg === "bigint") {
      data = this.constructByInt(arg)
    } else if (typeof arg === "string") {
      data = this.constructByString(arg)
    } else {
      throw new Error(`Invalid Argument: ${arg}`)
    }

    this._ip = data.ip
    this._numeric_ip = data.numericIp
    this._version = data.version
  }
  private ipv4ToInt(ip: string): bigint {
    const octets = ip.split(".")
    const value = octets
      .map(BigInt)
      .reduce((acc, octet) => (acc << 8n) + octet, 0n)

    return BigInt.asUintN(32, value)
  }
  private ipv6ToInt(ip: string): bigint {
    const groups = ip.split(":")
    const expandedGroups = groups.map(group => {
      return group.length < 4 ? group.padStart(4, "0") : group
    })
    const hexString = expandedGroups.join("")
    return BigInt.asUintN(128, BigInt("0x" + hexString))
  }

  public toInt() {
    return this._numeric_ip
  }

  /**
   * Convert the IPObject to a plain object representation.
   *
   * @return {IPObject} The plain object representation of the IPObject.
   */
  public toObject(): IPObject {
    return {
      address: this._ip,
      version: this._version,
      numericIP: this._numeric_ip,
    }
  }

  /**
   * Parse the given IP address.
   *
   * @param {string} ip - the IP address to parse
   * @return {IPAddress} the parsed IPAddress object
   */
  static parse(ip: string) {
    return new IPAddress(ip)
  }

  /**
   * Create an IPAddress object from a numeric value.
   *
   * @param {bigint} integer - the numeric value for the IPAddress
   * @return {IPAddress} the new IPAddress object
   */
  static fromNumeric(integer: bigint) {
    return new IPAddress(integer)
  }

  public get version() {
    return this._version
  }

  /**
   * Check the type of IP address and return the type.
   *
   * @param {string} ip - the IP address to be checked
   * @return {CheckIPVersionType} the type of the IP address (v4, v6, or invalid)
   */
  static checkIPVersion(ip: string): CheckIPVersionType {
    const ipaddress = ip.replace(/^\[|\]$/g, "")

    if (ipv4Pattern.test(ipaddress)) return "v4"
    if (ipv6Pattern.test(ipaddress)) return "v6"

    return "invalid"
  }

  private checkIPV4Local(integer: bigint) {
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

  private checkIPV4Documentation(integer: bigint) {
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

  private checkIPV4Other(integer: bigint) {
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

  private getIPV4AddressType(): IPv4Types {
    const ipInteger = this._numeric_ip

    if (this.checkIPV4Local(ipInteger)) return "Private"
    if (this.checkIPV4Documentation(ipInteger)) return "Documentation"
    if (this.checkIPV4Other(ipInteger)) return "Other"
    if (
      ipInteger >= CONSTS.IPV4.SUBNET_LINK_LOCAL_START &&
      ipInteger <= CONSTS.IPV4.SUBNET_LINK_LOCAL_END
    )
      return "Link-Local"
    if (
      ipInteger >= CONSTS.IPV4.SUBNET_LOOPBACK_START &&
      ipInteger <= CONSTS.IPV4.SUBNET_LOOPBACK_END
    )
      return "Loopback"
    if (
      ipInteger >= CONSTS.IPV4.SUBNET_SOFTWARE_START &&
      ipInteger <= CONSTS.IPV4.SUBNET_SOFTWARE_END
    )
      return "Software"
    if (
      ipInteger >= CONSTS.IPV4.SUBNET_MULTICAST_START &&
      ipInteger <= CONSTS.IPV4.SUBNET_MULTICAST_END
    )
      return "Multicast"
    if (
      ipInteger >= CONSTS.IPV4.SUBNET_FUTURE_240_START &&
      ipInteger <= CONSTS.IPV4.SUBNET_FUTURE_240_END
    )
      return "Future"
    if (ipInteger === CONSTS.IPV4.BROADCAST_ADDRESS) return "Broadcast"

    return "Public"
  }

  private getIPV6AddressType(): IPv6Types {
    throw Error("Not implemented")
  }

  public getIPAddressType(): IPAddressTypes {
    if (this._version === "v4") {
      return this.getIPV4AddressType()
    } else {
      return this.getIPV6AddressType()
    }
  }

  public toString() {
    return this._ip
  }
}
