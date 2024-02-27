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
