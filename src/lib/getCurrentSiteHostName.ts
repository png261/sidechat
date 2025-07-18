/**
 * Get the current site's hostname (e.g., "example.com").
 * This works in any standard browser environment (not a Chrome Extension).
 */
export const getCurrentSiteHostName = (): Promise<string> => {
    return Promise.resolve(window.location.hostname)
}

