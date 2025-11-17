// Talent Protocol API integration for Build Score

export interface TalentProtocolScore {
  buildScore: number | null;
  profileId?: string;
  error?: string;
}

/**
 * Fetches Build Score from Talent Protocol API for a given wallet address
 * @param walletAddress - Ethereum wallet address
 * @param apiKey - Optional Talent Protocol API key (can be set via environment variable)
 * @returns Build Score from Talent Protocol or null if not found/error
 */
export async function fetchTalentProtocolBuildScore(
  walletAddress: string,
  apiKey?: string
): Promise<TalentProtocolScore> {
  try {
    // Get API key from parameter or environment variable
    const talentApiKey = apiKey || process.env.NEXT_PUBLIC_TALENT_PROTOCOL_API_KEY;
    
    if (!talentApiKey) {
      console.warn('Talent Protocol API key not provided. Using fallback method.');
      // Try to fetch without API key (may work for public endpoints)
      return await fetchTalentProtocolBuildScorePublic(walletAddress);
    }

    // Talent Protocol API endpoint for profile by wallet address
    // Based on documentation: https://docs.talentprotocol.com/docs/developers/talent-api/api-reference-v2
    const response = await fetch(
      `https://api.talentprotocol.com/api/v2/profiles?wallet_address=${walletAddress.toLowerCase()}`,
      {
        method: 'GET',
        headers: {
          'X-API-KEY': talentApiKey,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        // Profile not found - user might not have a Talent Protocol profile
        return { buildScore: null };
      }
      throw new Error(`Talent Protocol API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    // Extract Build Score from the response
    // The structure may vary, so we'll handle different possible formats
    let profile = null;
    
    if (data.profile) {
      profile = data.profile;
    } else if (Array.isArray(data) && data.length > 0) {
      profile = data[0];
    } else if (data.data) {
      // Some APIs wrap data in a 'data' field
      profile = Array.isArray(data.data) ? data.data[0] : data.data;
    } else if (data.id) {
      // Response might be the profile directly
      profile = data;
    }
    
    if (profile) {
      // Try different possible field names for build score
      let buildScore = 
        profile.build_score || 
        profile.buildScore || 
        profile.builder_score ||
        profile.builderScore;
      
      // Check nested scores object
      if (!buildScore && profile.scores) {
        buildScore = 
          profile.scores.build_score || 
          profile.scores.buildScore || 
          profile.scores.builder_score ||
          profile.scores.builderScore;
      }
      
      // If still no build score, try fetching from scores endpoint
      if (!buildScore && (profile.id || profile.profile_id)) {
        const profileId = profile.id || profile.profile_id;
        const scoresData = await fetchTalentProtocolBuildScoreByProfileId(profileId, talentApiKey);
        if (scoresData.buildScore !== null) {
          return {
            buildScore: scoresData.buildScore,
            profileId,
          };
        }
      }
      
      return {
        buildScore: buildScore ? Number(buildScore) : null,
        profileId: profile.id || profile.profile_id,
      };
    }

    return { buildScore: null };
  } catch (error) {
    console.error('Error fetching Talent Protocol Build Score:', error);
    return {
      buildScore: null,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Attempts to fetch Build Score using public endpoints (no API key required)
 * This method tries to scrape or use public API endpoints
 */
async function fetchTalentProtocolBuildScorePublic(
  walletAddress: string
): Promise<TalentProtocolScore> {
  try {
    // Try the search endpoint which might be public
    const searchUrl = `https://app.talentprotocol.com/search?q=${walletAddress}`;
    
    // Note: This is a fallback method. The search page might not have a direct API.
    // In production, you should use the official API with an API key.
    
    // For now, return null and log a warning
    console.warn('Public endpoint not available. Please provide Talent Protocol API key.');
    return { buildScore: null };
  } catch (error) {
    console.error('Error fetching from public endpoint:', error);
    return { buildScore: null };
  }
}

/**
 * Fetches Build Score using profile ID (alternative method)
 */
export async function fetchTalentProtocolBuildScoreByProfileId(
  profileId: string,
  apiKey?: string
): Promise<TalentProtocolScore> {
  try {
    const talentApiKey = apiKey || process.env.NEXT_PUBLIC_TALENT_PROTOCOL_API_KEY;
    
    if (!talentApiKey) {
      return { buildScore: null, error: 'API key required' };
    }

    const response = await fetch(
      `https://api.talentprotocol.com/api/v2/profiles/${profileId}/scores`,
      {
        method: 'GET',
        headers: {
          'X-API-KEY': talentApiKey,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Talent Protocol API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Extract build score from scores endpoint
    const buildScore = 
      data.build_score || 
      data.buildScore || 
      data.builder_score ||
      data.builderScore ||
      (data.scores && (data.scores.build_score || data.scores.buildScore));
    
    return {
      buildScore: buildScore ? Number(buildScore) : null,
      profileId,
    };
  } catch (error) {
    console.error('Error fetching Talent Protocol Build Score by profile ID:', error);
    return {
      buildScore: null,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

