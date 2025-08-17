import { NextRequest, NextResponse } from 'next/server';

const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';

export async function POST(request: NextRequest) {
  try {
    const { platform, url } = await request.json();

    if (!platform || !url) {
      return NextResponse.json(
        { isValid: false, error: 'Platform and URL are required' },
        { status: 400 }
      );
    }

    // Different validation strategies for each platform
    switch (platform) {
      case 'instagram':
        return await validateInstagram(url);
      case 'spotify':
        return await validateSpotify(url);
      case 'linkedin':
        return await validateLinkedIn(url);
      default:
        return NextResponse.json(
          { isValid: false, error: 'Unsupported platform' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Social link validation error:', error);
    return NextResponse.json(
      { isValid: false, error: 'Validation service temporarily unavailable' },
      { status: 500 }
    );
  }
}

async function validateInstagram(url: string) {
  try {
    // Extract username from URL
    const usernameMatch = url.match(/instagram\.com\/([a-zA-Z0-9_.]+)/);
    if (!usernameMatch) {
      return NextResponse.json({ isValid: false, error: 'Invalid Instagram URL format' });
    }

    const username = usernameMatch[1];
    
    // Check if username follows Instagram rules
    if (username.length < 1 || username.length > 30) {
      return NextResponse.json({ isValid: false, error: 'Instagram username must be 1-30 characters' });
    }

    if (!/^[a-zA-Z0-9_.]+$/.test(username)) {
      return NextResponse.json({ isValid: false, error: 'Instagram username can only contain letters, numbers, dots, and underscores' });
    }

    // Try to fetch the profile (Instagram returns 200 even for non-existent profiles in some cases)
    const response = await fetch(url, {
      method: 'HEAD',
      headers: {
        'User-Agent': USER_AGENT,
      },
    });

    if (response.status === 404) {
      return NextResponse.json({ isValid: false, error: 'Instagram profile not found' });
    }

    if (response.status === 429) {
      return NextResponse.json({ isValid: true, error: '' }); // Rate limited, assume valid
    }

    return NextResponse.json({ isValid: true, error: '' });
  } catch (error) {
    // If we can't validate due to network issues, assume it's valid
    return NextResponse.json({ isValid: true, error: '' });
  }
}

async function validateSpotify(url: string) {
  try {
    // Extract user ID from URL
    const userMatch = url.match(/spotify\.com\/user\/([a-zA-Z0-9_.-]+)/);
    if (!userMatch) {
      return NextResponse.json({ isValid: false, error: 'Invalid Spotify URL format' });
    }

    const userId = userMatch[1];
    
    // Basic format validation
    if (userId.length < 1 || userId.length > 50) {
      return NextResponse.json({ isValid: false, error: 'Spotify username must be 1-50 characters' });
    }

    // Try to access the profile
    const response = await fetch(url, {
      method: 'HEAD',
      headers: {
        'User-Agent': USER_AGENT,
      },
    });

    if (response.status === 404) {
      return NextResponse.json({ isValid: false, error: 'Spotify profile not found' });
    }

    return NextResponse.json({ isValid: true, error: '' });
  } catch (error) {
    // If we can't validate due to network issues, assume it's valid
    return NextResponse.json({ isValid: true, error: '' });
  }
}

async function validateLinkedIn(url: string) {
  try {
    // Check if it's a LinkedIn profile or generic website
    if (url.includes('linkedin.com/in/')) {
      const profileMatch = url.match(/linkedin\.com\/in\/([a-zA-Z0-9-_]+)/);
      if (!profileMatch) {
        return NextResponse.json({ isValid: false, error: 'Invalid LinkedIn profile URL format' });
      }

      const profileId = profileMatch[1];
      
      // LinkedIn profile ID validation
      if (profileId.length < 3 || profileId.length > 100) {
        return NextResponse.json({ isValid: false, error: 'LinkedIn profile ID must be 3-100 characters' });
      }

      if (!/^[a-zA-Z0-9-_]+$/.test(profileId)) {
        return NextResponse.json({ isValid: false, error: 'LinkedIn profile ID can only contain letters, numbers, hyphens, and underscores' });
      }
    } else {
      // Generic website validation
      try {
        const urlObj = new URL(url);
        
        // Basic domain validation
        if (!urlObj.hostname.includes('.')) {
          return NextResponse.json({ isValid: false, error: 'Invalid website URL format' });
        }

        // Check if the website is accessible
        const response = await fetch(url, {
          method: 'HEAD',
          headers: {
            'User-Agent': USER_AGENT,
          },
        });

        if (response.status >= 400 && response.status !== 403) { 
          return NextResponse.json({ isValid: false, error: 'Website is not accessible' });
        }
      } catch (urlError) {
        return NextResponse.json({ isValid: false, error: 'Invalid website URL format' });
      }
    }

    return NextResponse.json({ isValid: true, error: '' });
  } catch (error) {
    return NextResponse.json({ isValid: true, error: '' });
  }
}