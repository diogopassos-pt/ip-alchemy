import { IPAddress, IPAddressTypes } from "../ip"
import { hostMaskFromMask, prefixToMask } from "./utils/masks"

type CIDRArgs = [ip: string, prefix: number] | [cidr: string]
export class CIDR {
  private baseIP: IPAddress
  private prefix: bigint
  private mask: bigint
  private hostMask: bigint

  constructor(...args: CIDRArgs) {
    if (args.length === 1) {
      const [baseIP, prefix] = args[0].split("/")
      this.baseIP = IPAddress.parse(baseIP)
      this.prefix = BigInt(prefix)
    } else {
      const [baseIP, prefix] = args
      this.baseIP = IPAddress.parse(baseIP)
      this.prefix = BigInt(prefix)
    }

    this.mask = prefixToMask(this.prefix, this.baseIP.version)
    this.hostMask = hostMaskFromMask(this.mask, this.baseIP.version)
  }

  public getNetworkType(): IPAddressTypes {
    if (this.baseIP.version === "v6") {
      if (
        this.baseIP.getIPAddressType() ===
        this.getLastUsableAddress().getIPAddressType()
      )
        return this.baseIP.getIPAddressType()

      throw new Error("Invalid Subnet")
    }

    if (
      this.baseIP.getIPAddressType() &&
      this.getBroadcastAddress().getIPAddressType()
    ) {
      return this.baseIP.getIPAddressType()
    }

    throw new Error("Invalid Subnet")
  }

  public getNetworkAddress() {
    return this.baseIP.toString()
  }

  public getBroadcastAddress() {
    if (this.baseIP.version === "v6")
      throw new Error("IPv6 doesn't have a broadcast address")
    return IPAddress.fromNumeric(this.baseIP.toInt() | this.hostMask)
  }

  public getNetworkMaskAddress() {
    return IPAddress.fromNumeric(this.mask).toString()
  }

  public getHostMaskAddress() {
    return IPAddress.fromNumeric(this.hostMask).toString()
  }

  public getFirstUsableAddress() {
    return IPAddress.fromNumeric(
      this.baseIP.toInt() + (this.baseIP.version === "v4" ? 1n : 0n)
    )
  }

  public getLastUsableAddress() {
    return IPAddress.fromNumeric(
      (this.baseIP.toInt() | this.hostMask) -
        (this.baseIP.version === "v4" ? 1n : 0n)
    )
  }
}
