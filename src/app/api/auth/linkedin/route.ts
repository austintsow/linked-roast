import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const linkedInAuthURL = 'https://www.linkedin.com/oauth/v2/authorization';
  const client_id = process.env.LINKEDIN_CLIENT_ID;
  const redirect_uri = `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/linkedin/callback`;
  const scope = 'openid profile email';
  const response_type = 'code';

  const authUrl = `${linkedInAuthURL}?response_type=${response_type}&client_id=${client_id}&redirect_uri=${redirect_uri}&scope=${scope}`;

  return NextResponse.redirect(authUrl);
}
