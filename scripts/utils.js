const SITE_ROOT = '/content/3ds';

export async function loadNav() {
    try {
        const response = await fetch(`/navigation-index.json?$timestamp=${Date.now()}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch navigation: ${response.status} ${response.statusText}`);
        }
        const result = await response.json();

        return result.data.filter(item => 
            item.path.startsWith('/pages/')
        );
    } catch (error) {
        console.error('Error loading navigation:', error);
        return [];
    }
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
