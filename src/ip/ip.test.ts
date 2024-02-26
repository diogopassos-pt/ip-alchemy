import { IPAddress } from "./ip"

describe("IPAddress", () => {
  it("should create an ipv4 IPAddress object", () => {
    const ip = IPAddress.parse("127.0.0.1")
    expect(ip.version).toBe("v4")
  })

  it("should create an ipv6 IPAddress object", () => {
    const ip = IPAddress.parse("::1")
    expect(ip.version).toBe("v6")
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
