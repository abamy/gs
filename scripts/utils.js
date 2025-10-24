function getSiteName() {
  const path = window.location.pathname;
  const match = path.match(/^\/content\/([^/]+)\//);
  return match ? match[1] : '/';
}

const SITE_ROOT = `/content/${getSiteName()}`;

export function getCurrentLocale() {
  const path = window.location.pathname;
  const parts = path.split('/').filter(part => part !== '');

  const countryIndex = isAuthorMode ? 2 : 0;
  const langIndex = isAuthorMode ? 3 : 1;

  return `${parts[countryIndex]}/${parts[langIndex]}`;
}

export function getPagePath(path){
  return isAuthorMode ? `${SITE_ROOT}${path}.html` : path;
};

export function getIconPath(imageName) {
  return `${isAuthorMode ? `${SITE_ROOT}.resource/icons/` : '/icons/'}${imageName}`;
}

export function getDeliveryUrl(url, smartCrop) {
  const processedUrl = url
    .replace(/original\//g, '')
    .replace(/jpeg|jpg|png/g, 'webp');
  
  return `${processedUrl}?format=webply&optimize=high&smartcrop=${smartCrop}&timestamp=${Date.now()}`;
}

export const isAuthorMode = window.location.href.includes('.html');
