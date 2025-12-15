export type JwtPayload = {
  sub: number; //userId
  email: string;
  role: string;
};

export interface RefreshTokenPayload {
  sub: number; //userId
  tokenId: string; //uuid for refresh token
}
