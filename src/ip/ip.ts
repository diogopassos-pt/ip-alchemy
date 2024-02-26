import type { CheckIPType, IPObject, IPVersion } from "./types"

const ipv4Pattern =
  /^(25[0-5]|2[0-4][0-9]|[0-1]?[0-9]{1,2})(\.(25[0-5]|2[0-4][0-9]|[0-1]?[0-9]{1,2})){3}$/
const ipv6Pattern =
  /^(?:(?:[0-9a-fA-F]{1,4}:){6,6}(?::[0-9a-fA-F]{1,4})?|(?:[0-9a-fA-F]{1,4}:){1,7}[0-9a-fA-F]{1,4}|::1?)$/

export class IPAddress {
  private _ip: string
  private _numeric_ip: bigint
  private _version: IPVersion

  private constructByString(ip: string) {
    const ipType = IPAddress.checkIPType(ip)
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
   * @return {CheckIPType} the type of the IP address (v4, v6, or invalid)
   */
  static checkIPType(ip: string): CheckIPType {
    const ipaddress = ip.replace(/^\[|\]$/g, "")

    if (ipv4Pattern.test(ipaddress)) return "v4"
    if (ipv6Pattern.test(ipaddress)) return "v6"

    return "invalid"
  }
}
