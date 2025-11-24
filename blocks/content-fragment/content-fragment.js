/*
 * Content Fragment Block
 * Fetches and displays content fragments from AEM via GraphQL
 */

/**
 * Loads a content fragment from AEM GraphQL endpoint.
 * @param {string} path The path to the content fragment
 * @returns {Object} The content fragment data
 */
export async function loadFragment(path, url) {
  if (!path) {
    return null;
  }

  // Remove leading slash if present
  const fragmentPath = path.startsWith('/') ? path : `/${path}`;

  // https://publish-p31104-e170504.adobeaemcloud.com/graphql/execute.json/gs/articleByPath;path=/content/dam/gs/fragments/fr/articles/article-1
  const graphqlEndpoint = `${url}/graphql/execute.json/gs/articleByPath;path=${fragmentPath}`;

  try {
    const resp = await fetch(graphqlEndpoint);
    if (resp.ok) {
      const data = await resp.json();
      return data;
    }
    // eslint-disable-next-line no-console
    console.error(`Failed to load content fragment from ${graphqlEndpoint}`);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error fetching content fragment:', error);
  }

  return null;
}

/**
 * Decorates the content fragment block
 * @param {Element} block The content fragment block element
 */
export default async function decorate(block) {
  const link = block.querySelector('a');
  const path = link ? link.getAttribute('href') : block.textContent.trim();

  const aemPublishUrl = 'https://publish-p31104-e170504.adobeaemcloud.com';
  const aemAuthorUrl = 'https://authos-p31104-e170504.adobeaemcloud.com';
  const url = window?.location?.origin.includes('author') ? `${aemAuthorUrl}` : `${aemPublishUrl}`;

  // Clear the block
  block.innerHTML = '';

  // Add loading state
  block.classList.add('loading');

  const fragmentData = await loadFragment(path, url);

  // Remove loading state
  block.classList.remove('loading');

  if (
    fragmentData &&
    fragmentData.data &&
    fragmentData.data.articleByPath &&
    fragmentData.data.articleByPath.item
  ) {
    const article = fragmentData.data.articleByPath.item;

    // Create article container
    const articleContainer = document.createElement('div');
    articleContainer.classList.add('content-fragment-article');

    // Add category if available
    if (article.category) {
      const category = document.createElement('span');
      category.classList.add('content-fragment-category');
      category.textContent = article.category;
      articleContainer.appendChild(category);
    }

    // Add title if available
    if (article.title) {
      const title = document.createElement('h2');
      title.classList.add('content-fragment-title');
      title.textContent = article.title;
      articleContainer.appendChild(title);
    }

    // Add image if available
    // eslint-disable-next-line no-underscore-dangle
    if (article.image && article.image._dynamicUrl) {
      const imageWrapper = document.createElement('div');
      imageWrapper.classList.add('content-fragment-image-wrapper');

      const img = document.createElement('img');
      img.classList.add('content-fragment-image');
      // eslint-disable-next-line no-underscore-dangle
      img.src = `${url}${article.image._dynamicUrl}`;
      img.alt = article.title || 'Content fragment image';
      img.loading = 'lazy';

      imageWrapper.appendChild(img);
      articleContainer.appendChild(imageWrapper);
    }

    // Add description if available
    if (article.description) {
      const description = document.createElement('div');
      description.classList.add('content-fragment-description');
      description.innerHTML = article.description.html || article.description;
      articleContainer.appendChild(description);
    }

    block.appendChild(articleContainer);
  } else {
    // Show error message
    const error = document.createElement('p');
    error.classList.add('content-fragment-error');
    error.textContent = 'Content fragment could not be loaded.';
    block.appendChild(error);
  }
}
