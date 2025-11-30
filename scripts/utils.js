function getSiteName() {
  const path = window.location.pathname;
  const match = path.match(/^\/content\/([^/]+)\//);
  return match ? match[1] : '/';
}

/**
 * Extracts the site name from the current URL pathname
 * @description Extracts the site name from paths following the pattern /content/site-name/...
 * For example:
 * - From "/content/wknd-universal/language-masters/en/path" returns "wknd-universal"
 * - From "/content/wknd-universal/language-masters/en/path/to/content.html" returns "wknd-universal"
 * @returns {string} The site name extracted from the path, or empty string if not found
 */
export async function getHostname() {
  try {
    const listOfAllPlaceholdersData = await fetchPlaceholders();
    const hostname = listOfAllPlaceholdersData?.hostname;
    if (hostname) {
      return hostname;
    }
  } catch (error) {
    console.warn('Error fetching placeholders for hostname:', error);
  }
}

export function getSiteNameFromDAM(damPath) {
  const match = damPath.match(/^\/content\/dam\/([^/]+)/);
  return match[1];
}

export function getCurrentLocale() {
  const path = window.location.pathname;
  const parts = path.split('/').filter((part) => part !== '');

  const countryIndex = isAuthorMode ? 2 : 0;
  const langIndex = isAuthorMode ? 3 : 1;

  return `${parts[countryIndex]}/${parts[langIndex]}`;
}

export function getPagePath(path) {
  return isAuthorMode ? `/content/${getSiteName()}${path}.html` : path;
}

export function getIconPath(imageName) {
  return `${isAuthorMode ? `/content/${getSiteName()}.resource/icons/` : '/icons/'}${imageName}`;
}

export function getDeliveryUrl(url, smartCrop) {
  const processedUrl = url
    .replace(/original\//g, '')
    .replace(/jpeg|jpg|png/g, 'webp');

  return `${processedUrl}?format=webply&optimize=high&smartcrop=${smartCrop}&timestamp=${Date.now()}`;
}

export const isAuthorMode = window.location.href.includes('.html');

export function getLanguageFromUrl() {
  const path = window.location.pathname;
  const parts = path.split('/').filter((part) => part !== '');
  return parts.length >= 2 ? parts[1] : 'en';
}

export async function getTranslation(key, lang) {
  try {
    const response = await fetch('/i18n.json');
    const data = await response.json();

    const item = data.data.find((entry) => entry.key === key);
    if (item) {
      return item[lang] || item.en || key;
    }
    return key;
  } catch (error) {
    console.error('Error fetching translation:', error);
    return key;
  }
}
