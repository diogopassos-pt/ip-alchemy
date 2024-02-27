import { CIDR } from "./cidr"

describe("CIDR", () => {
  it("should create an valid ipv4 CIDR object", () => {
    const cidr = CIDR.parse("127.0.0.1/24")
    expect(cidr.getNetworkAddress().version).toBe("v4")
    expect(cidr.getNetworkType()).toBe("Loopback")
  })

  it("should create an valid ipv6 CIDR object", () => {
    const cidr = CIDR.parse("::1/128")
    expect(cidr.getNetworkAddress().version).toBe("v6")
    expect(cidr.getNetworkType()).toBe("Loopback")
  })
})

describe("Test IPV4 local", () => {
  it("should create an valid ipv4 CIDR object", () => {
    const cidr = CIDR.parse("10.0.10.0/24")
    expect(cidr.getNetworkType()).toBe("Private")
    expect(cidr.getFirstUsableAddress().toString()).toBe("10.0.10.1")
    expect(cidr.getHostMaskAddress().toString()).toBe("0.0.0.255")
    expect(cidr.getNetworkMaskAddress().toString()).toBe("255.255.255.0")
    expect(cidr.getBroadcastAddress().toString()).toBe("10.0.10.255")
    expect(cidr.prefix).toBe(24)
  })

  it("should create an valid ipv4 /32 CIDR object", () => {
    const cidr = CIDR.parse("10.0.10.0/32")
    expect(cidr.getNetworkType()).toBe("Private")
    expect(cidr.getFirstUsableAddress().toString()).toBe("10.0.10.1")
    expect(cidr.getHostMaskAddress().toString()).toBe("0.0.0.0")
    expect(cidr.getNetworkMaskAddress().toString()).toBe("255.255.255.255")
    expect(cidr.prefix).toBe(32)
  })
})
