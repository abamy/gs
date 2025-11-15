import { moveInstrumentation } from '../../scripts/scripts.js';

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

  var searchElement = document.createElement('div');
  searchElement.className = 'search-container';
  searchElement.innerHTML = `   
    <h3 class="search-title">${title}</h3>
      <p class="search-subtitle">${description}</p>

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
  `;
  moveInstrumentation(block, searchElement); 

  block.textContent = '';
  block.append(searchElement);
}
