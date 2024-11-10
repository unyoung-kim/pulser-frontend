/**
 * 
 * 
 * // Usage examples:
'https://www.example.com/path'           // → '/path'
'https://subdomain.example.co.uk/path'  // → '/path'
 * @param url 
 * @returns 
 */
export function getPathFromURL(url: string): string {
  try {
    const urlObj = new URL(url);

    // Check if there is a path beyond the root "/"
    if (urlObj.pathname && urlObj.pathname !== "/") {
      return urlObj.pathname; // Return just the path
    }

    // If no path, return the original URL
    return url;
  } catch (e) {
    console.error("Invalid URL", e);
    return url; // Return the original URL if it's invalid
  }
}
