import { IPAddress } from "./ip"

describe("IPAddress", () => {
  it("should create an ipv4 IPAddress object", () => {
    const ip = IPAddress.parse("127.0.0.1")
    expect(ip.version).toBe("v4")
  })

  it("should create an ipv6 IPAddress object", () => {
    const ip = IPAddress.parse("::1")
    expect(ip.version).toBe("v6")
    expect(ip.toInt()).toBe(1n)
  })

  it("to byte array ipv4", () => {
    const ip = IPAddress.parse("127.0.0.1")
    expect(ip.toByteArray()).toStrictEqual([127, 0, 0, 1])
  })

  it("to byte array ipv6", () => {
    const ip = IPAddress.parse("::1")
    expect(ip.toByteArray()).toStrictEqual([
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
    ])
  })

  it("to byte array ipv4 broadcast", () => {
    const ip = IPAddress.parse("255.255.255.255")
    expect(ip.toByteArray()).toStrictEqual([0xff, 0xff, 0xff, 0xff])
  })

  it("to byte array ipv4 software address", () => {
    const ip = IPAddress.parse("0.0.0.0")
    expect(ip.toByteArray()).toStrictEqual([0x00, 0x00, 0x00, 0x00])
  })

  it("should create an software ipv6 IPAddress object", () => {
    const ip = IPAddress.parse("::")
    expect(ip.version).toBe("v6")
    expect(ip.toInt()).toBe(0n)
  })

  it("should return the ip address in string format", () => {
    const ip = IPAddress.parse("127.0.0.1")
    expect(ip.toString()).toBe("127.0.0.1")
  })

  it("ipv4 private address families", () => {
    let ip = IPAddress.parse("192.168.0.1")
    expect(ip.getIPAddressType()).toBe("Private")

    ip = IPAddress.parse("192.168.1.10")
    expect(ip.getIPAddressType()).toBe("Private")

    ip = IPAddress.parse("192.168.255.255")
    expect(ip.getIPAddressType()).toBe("Private")

    ip = IPAddress.parse("10.0.0.0")
    expect(ip.getIPAddressType()).toBe("Private")

    ip = IPAddress.parse("10.10.10.10")
    expect(ip.getIPAddressType()).toBe("Private")

    ip = IPAddress.parse("10.255.255.255")
    expect(ip.getIPAddressType()).toBe("Private")
  })
})
