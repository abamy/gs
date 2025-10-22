const API_ENDPOINT = 'https://85792-162babybluelobster-stage.adobeioruntime.net/api/v1/web/byom/3ds';

async function fetchArticlesFromAPI(pagePath) {
  try {
    const url = new URL(API_ENDPOINT);
    url.searchParams.set('path', pagePath);

    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error(`Failed to fetch articles: ${response.status}`);
    }
    const html = await response.text();

    // Parse HTML string into DOM
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    // Find the articles block in the parsed HTML
    const articlesBlock = doc.querySelector('.articles');
    if (!articlesBlock) {
      return [];
    }

    return extractArticlesFromBlock(articlesBlock);
  } catch (error) {
    console.error('Error fetching articles from API:', error);
    return [];
  }
}

function extractArticlesFromBlock(block) {
  const articles = [];
  const articleDivs = block.querySelectorAll(':scope > div');

  articleDivs.forEach((articleDiv, index) => {
    const children = articleDiv.querySelectorAll(':scope > div');

    if (children.length >= 4) {
      const title = children[0]?.querySelector('p')?.textContent.trim() || '';
      const category = children[1]?.querySelector('p')?.textContent.trim() || '';
      const description = children[2]?.querySelector('p')?.textContent.trim() || '';
      const picture = children[3]?.querySelector('picture');

      articles.push({
        title,
        category,
        description,
        picture: picture ? picture.outerHTML : '',
        index
      });
    }
  });

  return articles;
}

function buildArticleCard(article) {
  const blockId = `article-${article.index}`;

  return `
    <div class="article-card">
      <div id="${blockId}-image" class="article-background">
        ${article.picture}
      </div>
      <div class="bokeh-effect"></div>
      <div class="content-container">
        ${article.category ? `<span id="${blockId}-category" class="article-category">${article.category}</span>` : ''}
        <h3 id="${blockId}-title" class="article-title">${article.title}</h3>
        ${article.description ? `<p id="${blockId}-description" class="article-description">${article.description}</p>` : ''}
      </div>
    </div>
  `;
}

function extractLang(path) {
  const parts = path.split('/').filter(part => part !== '');
  return parts.length >= 4 ? parts[3] : null;
}

export default async function decorate(block) {
  // Extract articles from the block structure
  let articles = extractArticlesFromBlock(block);

  // If no articles found in block, try fetching from API
  if (articles.length === 0) {
    // Show loading state
    const loadingContent = document.createRange().createContextualFragment(`
      <div class="articles-loading">Loading articles...</div>
    `);
    block.textContent = '';
    block.append(loadingContent);

    // Get current page path
    const lang = extractLang(window.location.pathname);
    articles = await fetchArticlesFromAPI(lang);
  }

  // If still no articles found, show empty state
  if (articles.length === 0) {
    const emptyContent = document.createRange().createContextualFragment(`
      <div class="articles-empty">No articles found.</div>
    `);
    block.textContent = '';
    block.append(emptyContent);
    return;
  }

  // Build articles grid
  const articlesHTML = articles.map(article => buildArticleCard(article)).join('');

  const content = document.createRange().createContextualFragment(`
    <div class="articles-grid">
      ${articlesHTML}
    </div>
  `);

  block.textContent = '';
  block.append(content);
}