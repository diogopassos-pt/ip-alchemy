import { IPAddress } from "../ip"
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

  public getNetworkAddress() {
    return this.baseIP.toString()
  }

  public getBroadcastAddress() {
    return IPAddress.fromNumeric(this.baseIP.toInt() | this.hostMask).toString()
  }

  public getNetworkMaskAddress() {
    return IPAddress.fromNumeric(this.mask).toString()
  }

  public getFirstUsableAddress() {
    return IPAddress.fromNumeric(
      this.baseIP.toInt() + (this.baseIP.version === "v4" ? 1n : 0n)
    ).toString()
  }

  public getLastUsableAddress() {
    return IPAddress.fromNumeric(
      (this.baseIP.toInt() | this.hostMask) -
        (this.baseIP.version === "v4" ? 1n : 0n)
    ).toString()
  }
}
