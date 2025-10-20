const GRAPHQL_ENDPOINT = 'https://author-p34570-e1263228.adobeaemcloud.com/graphql/execute.json/3ds/articles-all';

async function fetchArticles() {
  try {
    const response = await fetch(GRAPHQL_ENDPOINT, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${btoa('aio:aio')}`
        }
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch articles: ${response.status}`);
    }
    const data = await response.json();
    return data.data.articleList.items || [];
  } catch (error) {
    console.error('Error fetching articles:', error);
    return [];
  }
}

function buildArticleCard(article) {
  const imageUrl = article.image?._dynamicUrl || article.image?._path || '';
  const description = article.description?.plaintext || article.description?.markdown || '';
  const title = article.title || 'Untitled';
  const category = article.category || '';

  return `
    <div class="article-card">
      ${imageUrl ? `
        <div class="article-image">
          <img src="${imageUrl}" alt="${title}" loading="lazy">
        </div>
      ` : ''}
      <div class="article-content">
        ${category ? `<span class="article-category">${category}</span>` : ''}
        <h3 class="article-title">${title}</h3>
        ${description ? `<p class="article-description">${description}</p>` : ''}
      </div>
    </div>
  `;
}

export default async function decorate(block) {
  // Show loading state
  block.innerHTML = '<div class="articles-loading">Loading articles...</div>';

  // Fetch articles
  const articles = await fetchArticles();

  if (articles.length === 0) {
    block.innerHTML = '<div class="articles-empty">No articles found.</div>';
    return;
  }

  // Build articles grid
  const articlesHTML = articles.map(article => buildArticleCard(article)).join('');

  block.innerHTML = `
    <div class="articles-grid">
      ${articlesHTML}
    </div>
  `;
}