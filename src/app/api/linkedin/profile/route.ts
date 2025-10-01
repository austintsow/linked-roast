import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(req: NextRequest) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('linkedin_access_token')?.value;
  const profileDataCookie = cookieStore.get('linkedin_profile')?.value;

  if (!accessToken || !profileDataCookie) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    const profileData = JSON.parse(profileDataCookie);
    
    // Format the profile data into text suitable for roasting
    const profileText = `
LinkedIn Profile:
Name: ${profileData.name || 'N/A'}
Email: ${profileData.email || 'N/A'}
${profileData.sub ? `LinkedIn ID: ${profileData.sub}` : ''}
${profileData.picture ? `Profile Picture: Yes` : 'Profile Picture: No'}

Note: This is a basic LinkedIn profile. For a more detailed roast, the user can paste their full profile text or upload a PDF.
    `.trim();

    return NextResponse.json({ profileText, profileData });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}
