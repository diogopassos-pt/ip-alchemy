export class SubnetError extends Error {
  constructor(message: string) {
    super("Subnet Error - " + message)
    this.name = "SubnetError"
  }
}

export class IPv6Error extends Error {
  constructor(message: string) {
    super("IPv6 Error - " + message)
    this.name = "IPv6Error"
  }
}
