export type CIDRArgs =
  | [cidr: string]
  | [ip: string, prefix: number]
  | [firstIP: string, lastIP: string]
