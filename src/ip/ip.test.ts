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
})
