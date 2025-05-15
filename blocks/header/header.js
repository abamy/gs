import { isAuthorMode } from '../../scripts/utils.js';

export default async function decorate(block) {
  let logoImage = isAuthorMode ? '/content/dassault.resource/icons/logo.svg': '/icons/logo.svg';
  let searchImage = isAuthorMode ? '/content/dassault.resource/icons/search.svg': '/icons/search.svg';

  const content = document.createRange().createContextualFragment(`
    <header class="header" role="banner" aria-label="Dassault Systèmes Main Navigation">
      <button class="mobile-menu-btn" aria-expanded="false" aria-controls="main-navigation" aria-label="Toggle menu">
        <div class="mobile-menu-icon">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </button>
      
      <a href="/" class="logo-link" aria-label="Dassault Systèmes Home">
        <img src="${logoImage}" alt="Dassault Systèmes Logo" class="logo">
      </a>
      
      <nav id="main-navigation" class="main-nav" role="navigation" aria-label="Main Navigation">
        <div class="nav-item">
          <a href="./products" class="nav-link" aria-haspopup="true" aria-expanded="false">
            Products
          </a>
        </div>
        <div class="nav-item">
          <a href="./industries" class="nav-link" aria-haspopup="true" aria-expanded="false">
            Industries
          </a>
        </div>
        <div class="nav-item">
          <a href="./support" class="nav-link" aria-haspopup="true" aria-expanded="false">
            Support
          </a>
        </div>
      </nav>
      
      <div class="right-nav">
        <button class="search-btn" aria-label="Search">
          <img src="${searchImage}" alt="Search Icon" class="search-icon">
        </button>
      </div>
    </header>
  `);

  block.textContent = '';
  block.append(content);

  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const mainNav = document.querySelector('.main-nav');
  
  mobileMenuBtn.addEventListener('click', () => {
    const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
    mobileMenuBtn.setAttribute('aria-expanded', !isExpanded);
    mainNav.classList.toggle('active');
  });
}
