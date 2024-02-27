import { IPAddress, IPAddressTypes } from "../ip"
import { IPv6Error, SubnetError } from "./errors"
import { CIDRArgs } from "./types"
import { hostMaskFromMask, prefixToMask } from "./utils/masks"
import { calculateCommonPrefix } from "./utils/prefix"

export class CIDR {
  private _baseIP: IPAddress
  private _prefix: bigint
  private _mask: bigint
  private _hostMask: bigint

  private constructor(...args: CIDRArgs) {
    if (args.length === 1) {
      const [baseIP, prefix] = args[0].split("/")
      this._baseIP = IPAddress.parse(baseIP)
      this._prefix = BigInt(prefix)
      this._mask = prefixToMask(this._prefix, this._baseIP.version)
      this._hostMask = hostMaskFromMask(this._mask, this._baseIP.version)
      return
    }

    if (
      args.length === 2 &&
      typeof args[0] === "string" &&
      typeof args[1] === "number"
    ) {
      const [baseIP, prefix] = args
      this._baseIP = IPAddress.parse(baseIP)
      this._prefix = BigInt(prefix)
      this._mask = prefixToMask(this._prefix, this._baseIP.version)
      this._hostMask = hostMaskFromMask(this._mask, this._baseIP.version)
      return
    }

    if (
      args.length === 2 &&
      typeof args[0] === "string" &&
      typeof args[1] === "string"
    ) {
      const [firstIP, lastIP] = args
      this._baseIP = IPAddress.parse(firstIP)
      const lastIPAddress = IPAddress.parse(lastIP)

      this._prefix = calculateCommonPrefix(
        this._baseIP.toInt(),
        lastIPAddress.toInt()
      )

      this._mask = prefixToMask(this._prefix, this._baseIP.version)
      this._hostMask = hostMaskFromMask(this._mask, this._baseIP.version)
      return
    }

    throw new Error("Not Implemented")
  }

  public getNetworkType(): IPAddressTypes {
    if (this._baseIP.version === "v6") {
      if (
        this._baseIP.getIPAddressType() ===
        this.getLastUsableAddress().getIPAddressType()
      )
        return this._baseIP.getIPAddressType()

      throw new SubnetError("First and Last IP has a different address type")
    }

    if (
      this._baseIP.getIPAddressType() ===
      this.getBroadcastAddress().getIPAddressType()
    ) {
      return this._baseIP.getIPAddressType()
    }

    throw new SubnetError("First and Last IP has a different address type")
  }

  public getNetworkAddress() {
    return this._baseIP
  }

  public getBroadcastAddress() {
    if (this._baseIP.version === "v6")
      throw new IPv6Error("IPv6 doesn't have a broadcast address")

    return IPAddress.fromNumeric(
      BigInt.asIntN(32, this._baseIP.toInt() | this._hostMask),
      this._baseIP.version
    )
  }

  public getNetworkMaskAddress() {
    return (
      IPAddress.fromNumeric(this._mask, this._baseIP.version).toString(),
      this._baseIP.version
    )
  }

  public getHostMaskAddress() {
    return IPAddress.fromNumeric(
      this._hostMask,
      this._baseIP.version
    ).toString()
  }

  public getFirstUsableAddress() {
    return IPAddress.fromNumeric(
      this._baseIP.toInt() + (this._baseIP.version === "v4" ? 1n : 0n),
      this._baseIP.version
    )
  }

  public getLastUsableAddress() {
    return IPAddress.fromNumeric(
      (this._baseIP.toInt() | this._hostMask) -
        (this._baseIP.version === "v4" ? 1n : 0n),
      this._baseIP.version
    )
  }

  static parse(...args: CIDRArgs) {
    return new CIDR(...args)
  }

  get prefix() {
    return Number(this._prefix)
  }
}
