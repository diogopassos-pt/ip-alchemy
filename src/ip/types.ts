export type IPVersion = "v4" | "v6"
export type IPObject = {
  address: string
  version: IPVersion
  numericIP: bigint
}
export type CheckIPType = IPVersion | "invalid"
