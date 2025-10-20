const SITE_ROOT = '/content/3ds';

export function getCurrentLocale() {
  const path = window.location.pathname;
  const match = path.match(/(?:^\/content\/3ds\/)?(us\/en|fr\/fr)\//);
  return match ? match[1] : 'us/en';
}

export function getPagePath(path){
    return isAuthorMode ? `${SITE_ROOT}${path === "/" ? "/index" : path}.html` : path;
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
