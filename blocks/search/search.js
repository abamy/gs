/**
 * Search block
 * @param {Element} block The search block element
 */
export default async function decorate(block) {
  const rows = [...block.children];
  let title = 'Search';
  let description = 'Enter keywords to find what you\'re looking for';

  rows.forEach((row) => {
    const cols = [...row.children];
    if (cols.length >= 2) {
      const key = cols[0].textContent.trim().toLowerCase();
      const value = cols[1].textContent.trim();

      if (key === 'title') {
        title = value;
      } else if (key === 'description') {
        description = value;
      }
    }
  });

  const searchHTML = `
    <div class="search-container">
      <h3 class="search-title" data-aue-label="Title" data-aue-prop="title" data-aue-type="text">${title}</h3>
      <p class="search-subtitle" data-aue-label="Description" data-aue-prop="description" data-aue-type="text">${description}</p>

      <form class="search-form" role="search">
        <div class="search-wrapper">
          <input
            type="search"
            class="search-input"
            placeholder="Search..."
            aria-label="Search"
            autocomplete="off"
          />
        </div>
      </form>
    </div>
  `;

  const content = document.createRange().createContextualFragment(searchHTML);
  block.textContent = '';
  block.append(content);

  const searchForm = block.querySelector('.search-form');

  searchForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    // Placeholder for search implementation
  });
}
