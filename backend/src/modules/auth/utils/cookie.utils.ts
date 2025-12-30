import { Response } from 'express';

export function setAccessToken(res: Response, token: string) {
  res.cookie('access_token', token, {
    httpOnly: true,
    maxAge: 15 * 60 * 1000,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  });
}

export function setRefreshToken(res: Response, token: string) {
  res.cookie('refresh_token', token, {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  });
}

export function clearCookies(res: Response) {
  res.clearCookie('token');
}
