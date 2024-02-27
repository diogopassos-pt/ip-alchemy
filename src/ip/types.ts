export type IPVersion = "v4" | "v6"
export type IPObject = {
  address: string
  version: IPVersion
  numericIP: bigint
}
export type CheckIPVersionType = IPVersion | "invalid"

export type IPv4Types =
  | "Public"
  | "Private"
  | "Loopback"
  | "Link-Local"
  | "Multicast"
  | "Broadcast"
  | "Documentation"
  | "Software"
  | "Future"
  | "Other"

export type IPv6Types =
  | "Software"
  | "Loopback"
  | "Documentation"
  | "IPV4-Mapped"
  | "Benchmarking"
  | "Orchid"
  | "6to4"
  | "Multicast"
  | "Teredo"
  | "Public"
  | "Private"
  | "Link-Local"
  | "Future"

export type IPAddressTypes = IPv4Types | IPv6Types
