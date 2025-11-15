import { readBlockConfig } from '../../scripts/aem.js';

export default async function decorate(block) {
  const config = readBlockConfig(block);

  const filters = config.filters.split(',');
  const filterButtons = filters.map((filter, index) =>
    `<button type="button" class="search-filter-btn ${index === 0 ? 'active' : ''}" data-filter="${filter.toLowerCase().replace(/\s+/g, '-')}">${filter}</button>`
  ).join('');

  const searchHTML = `
    <div class="search-container">
      <h3 class="search-title" data-aue-label="Title" data-aue-prop="title" data-aue-type="text">${config.title}</h3>
      <p class="search-subtitle" data-aue-label="Subtitle" data-aue-prop="subtitle" data-aue-type="text">${config.subtitle}</p>

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

      <div class="search-filters" data-aue-label="Filters" data-aue-prop="filters" data-aue-type="text">
        ${filterButtons}
      </div>
    </div>
  `;

  const content = document.createRange().createContextualFragment(searchHTML);
  block.textContent = '';
  block.append(content);

  const searchForm = block.querySelector('.search-form');
  const filterBtns = block.querySelectorAll('.search-filter-btn');

  // Handle filter selection
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      // Placeholder for filter logic
      console.log('Selected filter:', filter);
    });
  });

  searchForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    // Placeholder for search implementation
  });
}
