import { CIDR } from "./cidr"

describe("CIDR", () => {
  it("should create an valid ipv4 CIDR object", () => {
    const cidr = new CIDR("127.0.0.1/24")
    expect(cidr.getNetworkAddress().version).toBe("v4")
    expect(cidr.getNetworkType()).toBe("Loopback")
  })
})
