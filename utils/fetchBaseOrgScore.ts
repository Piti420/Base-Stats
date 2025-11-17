// Fetch Onchain Score from base.org/name/{basename}

export interface BaseOrgScore {
  onchainScore: number | null;
  builderScore: number | null;
  basename: string;
  error?: string;
}

/**
 * Fetches Onchain Score from base.org name profile
 * @param basename - Base name (e.g., "piti420" for piti420.base.eth)
 * @returns Onchain Score from base.org or null if not found/error
 */
export async function fetchBaseOrgOnchainScore(basename: string): Promise<BaseOrgScore> {
  try {
    // Remove .base or .base.eth suffix if present
    const cleanBasename = basename.replace(/\.base(\.eth)?$/i, '');
    
    // Fetch the profile page from base.org
    const url = `https://www.base.org/name/${cleanBasename}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return { onchainScore: null, basename: cleanBasename };
      }
      throw new Error(`base.org API error: ${response.status} ${response.statusText}`);
    }

    const html = await response.text();
    console.log('Fetched HTML length:', html.length);
    
    // Save a sample of HTML for debugging (first 10000 chars)
    if (html.length > 0) {
      console.log('HTML sample (first 10000 chars):', html.substring(0, 10000));
    }
    
    // Look for JSON data in script tags (common in Next.js/React apps)
    const scriptTagPattern = /<script[^>]*>(.*?)<\/script>/gis;
    const scriptMatches = [];
    let match;
    while ((match = scriptTagPattern.exec(html)) !== null) {
      scriptMatches.push(match[1]);
    }
    console.log('Found', scriptMatches.length, 'script tags');
    
    // Look for __NEXT_DATA__ or similar JSON data
    const nextDataPattern = /__NEXT_DATA__\s*=\s*({.*?});/s;
    const nextDataMatch = html.match(nextDataPattern);
    if (nextDataMatch) {
      console.log('Found __NEXT_DATA__');
      try {
        const nextData = JSON.parse(nextDataMatch[1]);
        console.log('__NEXT_DATA__ keys:', Object.keys(nextData));
      } catch (e) {
        console.log('Could not parse __NEXT_DATA__');
      }
    }
    
    // Parse HTML to extract Onchain Score from Activity section
    // Looking for pattern like "Onchain score 70/100" or "Activity Onchain score 70/100"
    let onchainScore: number | null = null;
    const onchainScorePatterns = [
      // Most specific: Activity section with Onchain score
      /Activity[\s\S]{0,300}?Onchain[\s\S]{0,200}?score[\s\S]{0,100}?(\d+)\s*\/\s*100/i,
      // Activity followed by number/100
      /Activity[\s\S]{0,500}?(\d+)\s*\/\s*100/i,
      // Onchain score patterns
      /Onchain\s+score[\s\S]{0,100}?(\d+)\s*\/\s*100/i,
      /Onchain\s+Score[:\s]+(\d+)\s*\/\s*100/i,
      // Look for numbers followed by /100 near "Onchain" or "Activity"
      /(?:Activity|Onchain)[^<]*?(\d+)\s*\/\s*100/i,
      // Generic pattern: any number/100
      /(\d+)\s*\/\s*100/i,
      // Data attributes
      /"onchainScore"[:\s]*(\d+)/i,
      /onchain_score[:\s]*(\d+)/i,
      /data-onchain-score=["'](\d+)["']/i,
      // React state/props
      /onchainScore["']?\s*[:=]\s*["']?(\d+)/i,
    ];

    for (const pattern of onchainScorePatterns) {
      const match = html.match(pattern);
      if (match && match[1]) {
        const score = parseInt(match[1], 10);
        if (score >= 0 && score <= 100) {
          onchainScore = score;
          console.log('Found Onchain Score:', score, 'using pattern:', pattern);
          break;
        }
      }
    }

    // Parse HTML to extract Builder Score from Builder Activity tab
    // Looking for pattern like "Builder score 119" or "Builder Activity" section
    let builderScore: number | null = null;
    const builderScorePatterns = [
      // Most specific: Builder Activity section with number
      /Builder[\s\S]{0,100}?Activity[\s\S]{0,500}?(\d{2,4})(?!\s*\/)/i,
      // Builder Activity followed by number
      /Builder\s+Activity[\s\S]{0,500}?(\d{2,4})(?!\s*\/)/i,
      /Builder\s+activity[\s\S]{0,500}?(\d{2,4})(?!\s*\/)/i,
      // Look for "Builder" followed by a number (2-4 digits, likely 100+)
      /Builder[\s\S]{0,200}?(\d{3,4})(?!\s*\/)/i,
      // More specific patterns
      /Builder\s+score[:\s]+(\d+)/i,
      /Builder\s+Score[:\s]+(\d+)/i,
      /"builderScore"[:\s]*(\d+)/i,
      /builder_score[:\s]*(\d+)/i,
      /Build\s+Score[:\s]+(\d+)/i,
      /build_score[:\s]*(\d+)/i,
      // Data attributes
      /data-builder-score=["'](\d+)["']/i,
      /builderScore["']?\s*[:=]\s*["']?(\d+)/i,
      // Look in script tags or JSON
      /builder[\s\S]{0,200}?activity[\s\S]{0,500}?(\d{2,4})/i,
    ];

    for (const pattern of builderScorePatterns) {
      const match = html.match(pattern);
      if (match && match[1]) {
        const score = parseInt(match[1], 10);
        // Builder Score can be > 100, so we allow any positive number
        if (score >= 0 && score <= 1000) {
          builderScore = score;
          console.log('Found Builder Score:', score, 'using pattern:', pattern);
          break;
        }
      }
    }
    
    // If not found, try to extract from specific HTML structure
    // Look for sections with "Activity" or "Builder Activity"
    if (!onchainScore || !builderScore) {
      // Try to find Activity section - look for broader context
      const activityMatches = html.matchAll(/Activity[\s\S]{0,1000}?(\d+)\s*\/\s*100/gi);
      for (const match of activityMatches) {
        if (!onchainScore && match[1]) {
          const score = parseInt(match[1], 10);
          if (score >= 0 && score <= 100) {
            onchainScore = score;
            console.log('Found Onchain Score in Activity context:', score);
            break;
          }
        }
      }
      
      // Try to find Builder Activity section - look for broader context
      const builderActivityMatches = html.matchAll(/Builder[\s\S]{0,500}?Activity[\s\S]{0,1000}?(\d{2,4})(?!\s*\/)/gi);
      for (const match of builderActivityMatches) {
        if (!builderScore && match[1]) {
          const score = parseInt(match[1], 10);
          if (score >= 10 && score <= 10000) {
            builderScore = score;
            console.log('Found Builder Score in Builder Activity context:', score);
            break;
          }
        }
      }
      
      // Last resort: look for any number near "Builder" that's 100+
      if (!builderScore) {
        const builderNumberMatches = html.matchAll(/Builder[\s\S]{0,200}?(\d{2,4})(?!\s*\/)/gi);
        for (const match of builderNumberMatches) {
          if (match[1]) {
            const score = parseInt(match[1], 10);
            if (score >= 10 && score <= 10000) {
              builderScore = score;
              console.log('Found Builder Score near Builder text:', score);
              break;
            }
          }
        }
      }
      
      // Also try to find numbers in data attributes or React props
      const dataAttrPattern = /data-[^=]*score[^=]*=["'](\d+)["']/gi;
      const dataMatches = html.matchAll(dataAttrPattern);
      for (const match of dataMatches) {
        if (match[1]) {
          const score = parseInt(match[1], 10);
          const attrName = match[0].toLowerCase();
          if (attrName.includes('onchain') && score >= 0 && score <= 100 && !onchainScore) {
            onchainScore = score;
            console.log('Found Onchain Score in data attribute:', score);
          }
          if (attrName.includes('builder') && score >= 0 && !builderScore) {
            builderScore = score;
            console.log('Found Builder Score in data attribute:', score);
          }
        }
      }
    }

    // If we found at least one score, return it
    if (onchainScore !== null || builderScore !== null) {
      return {
        onchainScore,
        builderScore,
        basename: cleanBasename,
      };
    }

    // Try to find in JSON-LD or script tags
    const jsonLdPattern = /<script[^>]*type=["']application\/ld\+json["'][^>]*>(.*?)<\/script>/gis;
    let jsonLdMatch;
    while ((jsonLdMatch = jsonLdPattern.exec(html)) !== null) {
      try {
        const jsonData = JSON.parse(jsonLdMatch[1]);
        console.log('Found JSON-LD data:', Object.keys(jsonData));
        if (jsonData.onchainScore || jsonData.onchain_score) {
          const score = Number(jsonData.onchainScore || jsonData.onchain_score);
          if (score >= 0 && score <= 100) {
            onchainScore = score;
            console.log('Found Onchain Score in JSON-LD:', score);
          }
        }
        if (jsonData.builderScore || jsonData.builder_score) {
          const score = Number(jsonData.builderScore || jsonData.builder_score);
          if (score >= 0) {
            builderScore = score;
            console.log('Found Builder Score in JSON-LD:', score);
          }
        }
      } catch (e) {
        // Continue searching
      }
    }
    
    // Try to find in __NEXT_DATA__ or other JSON in script tags
    if (!onchainScore || !builderScore) {
      // Look for any JSON in script tags
      for (const scriptContent of scriptMatches) {
        try {
          // Try to find JSON objects in script content
          const jsonPattern = /\{[^{}]*(?:"onchainScore"|"onchain_score"|"builderScore"|"builder_score"|"activity"|"builder")[^{}]*\}/gi;
          const jsonMatches = scriptContent.match(jsonPattern);
          if (jsonMatches) {
            for (const jsonStr of jsonMatches) {
              try {
                const jsonData = JSON.parse(jsonStr);
                if (jsonData.onchainScore || jsonData.onchain_score) {
                  const score = Number(jsonData.onchainScore || jsonData.onchain_score);
                  if (score >= 0 && score <= 100 && !onchainScore) {
                    onchainScore = score;
                    console.log('Found Onchain Score in script JSON:', score);
                  }
                }
                if (jsonData.builderScore || jsonData.builder_score) {
                  const score = Number(jsonData.builderScore || jsonData.builder_score);
                  if (score >= 0 && !builderScore) {
                    builderScore = score;
                    console.log('Found Builder Score in script JSON:', score);
                  }
                }
              } catch (e) {
                // Not valid JSON, continue
              }
            }
          }
          
          // Also try to parse entire script as JSON if it looks like JSON
          if (scriptContent.trim().startsWith('{') || scriptContent.trim().startsWith('[')) {
            try {
              const jsonData = JSON.parse(scriptContent);
              // Recursively search for scores
              const searchInObject = (obj: any, path = ''): void => {
                if (typeof obj !== 'object' || obj === null) return;
                for (const [key, value] of Object.entries(obj)) {
                  const currentPath = path ? `${path}.${key}` : key;
                  if (typeof value === 'number') {
                    if ((key.toLowerCase().includes('onchain') && key.toLowerCase().includes('score')) && value >= 0 && value <= 100 && !onchainScore) {
                      onchainScore = value;
                      console.log('Found Onchain Score in nested JSON:', value, 'at', currentPath);
                    }
                    if ((key.toLowerCase().includes('builder') && key.toLowerCase().includes('score')) && value >= 0 && !builderScore) {
                      builderScore = value;
                      console.log('Found Builder Score in nested JSON:', value, 'at', currentPath);
                    }
                  }
                  if (typeof value === 'object') {
                    searchInObject(value, currentPath);
                  }
                }
              };
              searchInObject(jsonData);
            } catch (e) {
              // Not valid JSON, continue
            }
          }
        } catch (e) {
          // Continue searching
        }
      }
    }

    // Try to find in data attributes or React props
    const onchainDataPatterns = [
      /data-onchain-score=["'](\d+)["']/i,
      /onchainScore["']?\s*[:=]\s*["']?(\d+)/i,
    ];

    for (const pattern of onchainDataPatterns) {
      const match = html.match(pattern);
      if (match && match[1]) {
        const score = parseInt(match[1], 10);
        if (score >= 0 && score <= 100) {
          onchainScore = score;
        }
      }
    }

    const builderDataPatterns = [
      /data-builder-score=["'](\d+)["']/i,
      /builderScore["']?\s*[:=]\s*["']?(\d+)/i,
    ];

    for (const pattern of builderDataPatterns) {
      const match = html.match(pattern);
      if (match && match[1]) {
        const score = parseInt(match[1], 10);
        if (score >= 0) {
          builderScore = score;
        }
      }
    }

    // Final check: if still not found, log more details for debugging
    if (!onchainScore || !builderScore) {
      console.log('=== DEBUGGING: Scores not found ===');
      console.log('Onchain Score found:', onchainScore);
      console.log('Builder Score found:', builderScore);
      
      // Look for any numbers that might be scores
      const allNumbers = html.match(/\b(\d{2,3})\b/g);
      if (allNumbers) {
        console.log('All 2-3 digit numbers found in HTML:', allNumbers.slice(0, 20));
      }
      
      // Look for "70" or "119" specifically
      const score70 = html.indexOf('70');
      const score119 = html.indexOf('119');
      if (score70 !== -1) {
        console.log('Found "70" at position:', score70);
        const context70 = html.substring(Math.max(0, score70 - 100), Math.min(html.length, score70 + 100));
        console.log('Context around "70":', context70);
      }
      if (score119 !== -1) {
        console.log('Found "119" at position:', score119);
        const context119 = html.substring(Math.max(0, score119 - 100), Math.min(html.length, score119 + 100));
        console.log('Context around "119":', context119);
      }
      
      // Look for "/100" pattern
      const score100 = html.match(/(\d+)\s*\/\s*100/g);
      if (score100) {
        console.log('Found numbers with /100:', score100);
      }
    }
    
    // Return results (even if null)
    return { 
      onchainScore, 
      builderScore,
      basename: cleanBasename 
    };
  } catch (error) {
    console.error('Error fetching base.org Onchain Score:', error);
    return {
      onchainScore: null,
      builderScore: null,
      basename: basename.replace(/\.base(\.eth)?$/i, ''),
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Alternative method: Try to fetch from Base API if available
 * Uses Next.js API route as proxy to avoid CORS issues
 */
export async function fetchBaseOrgOnchainScoreAPI(basename: string): Promise<BaseOrgScore> {
  try {
    const cleanBasename = basename.replace(/\.base(\.eth)?$/i, '');
    
    // Use Next.js API route as proxy to avoid CORS issues
    // In browser, use relative path; in server, use full URL
    const isServer = typeof window === 'undefined';
    const apiUrl = isServer 
      ? `https://www.base.org/name/${cleanBasename}`
      : `/api/base-org-score?basename=${encodeURIComponent(cleanBasename)}`;
    
    // If in browser, use API route
    if (!isServer) {
      try {
        const response = await fetch(apiUrl);
        if (response.ok) {
          const data = await response.json();
          return {
            onchainScore: data.onchainScore ?? null,
            builderScore: data.builderScore ?? null,
            basename: cleanBasename,
          };
        }
      } catch (error) {
        console.error('Error fetching from API route:', error);
      }
    }
    
    // Fallback to direct HTML scraping (server-side only)
    return await fetchBaseOrgOnchainScore(basename);
  } catch (error) {
    console.error('Error fetching from Base API, falling back to HTML:', error);
    // Fallback to HTML scraping
    return await fetchBaseOrgOnchainScore(basename);
  }
}

