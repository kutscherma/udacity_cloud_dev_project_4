import { decode } from 'jsonwebtoken'

import { JwtPayload } from './JwtPayload'

/**
 * Parse a JWT token and return a user id
 * @param jwtToken JWT token to parse
 * @returns a user id from the JWT token
 */
export function parseUserId(jwtToken: string): string {
  const decodedJwt = decode(jwtToken) as JwtPayload
  const subAuth0 = 'auth0|'
  if(decodedJwt.sub.startsWith(subAuth0))
    return decodedJwt.sub.substring(subAuth0.length, decodedJwt.sub.length)
  return decodedJwt.sub
}
