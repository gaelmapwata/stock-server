// eslint-disable-next-line no-shadow
export enum TokenTypeE {
  LOGGED_TOKEN = 'LOGGED_TOKEN'
}

export interface TokenDecodedI {
  id: number,
  type: TokenTypeE
}
