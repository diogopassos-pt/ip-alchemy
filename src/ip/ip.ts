import type { IPAddressTypes, IPObject, IPVersion } from "./types"
import { getIPV4AddressType, ipv4ToInt } from "./utils/ipv4"
import { getIPV6AddressType, ipv6ToInt } from "./utils/ipv6"
import { checkIPVersion } from "./utils/version"

export class IPAddress {
  private _ip: string
  private _numeric_ip: bigint
  private _version: IPVersion

  private constructByString(ip: string) {
    const ipType = checkIPVersion(ip)
    if (ipType === "invalid") throw new Error(`Invalid IP address: ${ip}`)

    return {
      ip: ip,
      version: ipType,
      numericIp: ipType === "v4" ? ipv4ToInt(ip) : ipv6ToInt(ip),
    }
  }

  private constructByInt(ip: bigint) {
    // convert to binary string and remove leading zeros
    const numberOfBits = ip.toString(2).replace(/^0+/, "").length

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
    const groups = hexString.match(/.{1,4}/g) ?? []

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

  /**
   * Converts the IP address to a byte array representation.
   *
   * @return {number[]} The byte array representation of the IP address.
   */
  public toByteArray(): number[] {
    let integer = this._numeric_ip
    const byteArray = Array<number>()

    const length = this._version === "v4" ? 4 : 16

    while (integer > 0n) {
      const byte = Number(integer & 0xffn)
      byteArray.unshift(byte ?? 0x00)
      integer >>= 8n
    }

    while (byteArray.length < length) {
      byteArray.unshift(0)
    }

    return byteArray
  }

  /**
   * Converts a byte array to an IPAddress object.
   *
   * @param {number[]} bytes - the array of bytes to be converted
   * @return {IPAddress} the IPAddress object created from the byte array
   */
  public fromByteArray(bytes: number[]) {
    if (bytes.length === 4) {
      const integer =
        (BigInt(bytes[0]) << 24n) +
        (BigInt(bytes[1]) << 16n) +
        (BigInt(bytes[2]) << 8n) +
        BigInt(bytes[3])

      return IPAddress.fromNumeric(integer)
    }

    if (bytes.length === 16) {
      const integer = bytes.reduce(
        (acc, byte, index) =>
          acc + (BigInt(byte) << BigInt(8 * (16 - 1 - index))),
        0n
      )

      return IPAddress.fromNumeric(integer)
    }

    throw new Error("Invalid IP byte array")
  }

  public get version() {
    return this._version
  }
  public getIPAddressType(): IPAddressTypes {
    if (this._version === "v4") {
      return getIPV4AddressType(this._numeric_ip)
    } else {
      return getIPV6AddressType(this._numeric_ip)
    }
  }

  /**
   * Check if the given IPAddress or string is equal to this IPAddress.
   *
   * @param {IPAddress | string} other - the IPAddress or string to compare
   * @return {boolean} true if the IPAddress or string is equal, false otherwise
   */
  public equals(other: IPAddress | string) {
    if (typeof other === "string") {
      return IPAddress.parse(other)._numeric_ip === this._numeric_ip
    }
    return this._numeric_ip === other._numeric_ip
  }

  /**
   * A getter for retrieving the octets of the IP address if the version is "v4".
   *
   * @return {string[]} The array of octets in the IP address if the version is "v4", otherwise undefined.
   */
  get octets() {
    if (this._version === "v4") {
      return this._ip.split(".")
    }
    return undefined
  }

  public toString() {
    return this._ip
  }
}
