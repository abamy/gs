import { getMetadata } from '../../scripts/aem.js';

export default async function decorate(block) {
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
        <img src="/icons/logo.svg" alt="Dassault Systèmes Logo" class="logo">
      </a>
      
      <nav id="main-navigation" class="main-nav" role="navigation" aria-label="Main Navigation">
        <div class="nav-item">
          <a href="#products" class="nav-link" aria-haspopup="true" aria-expanded="false">
            Products
          </a>
        </div>
        <div class="nav-item">
          <a href="#industries" class="nav-link" aria-haspopup="true" aria-expanded="false">
            Industries
          </a>
        </div>
        <div class="nav-item">
          <a href="#learn" class="nav-link" aria-haspopup="true" aria-expanded="false">
            Learn
          </a>
        </div>
        <div class="nav-item">
          <a href="#support" class="nav-link" aria-haspopup="true" aria-expanded="false">
            Support
          </a>
        </div>
        <div class="nav-item">
          <a href="#about" class="nav-link" aria-haspopup="true" aria-expanded="false">
            About
          </a>
        </div>
      </nav>
      
      <div class="right-nav">
        <button class="search-btn" aria-label="Search">
          <img src="/icons/search.svg" alt="Search Icon" class="search-icon">
        </button>
      </div>
    </header>
  `);

  block.textContent = '';
  block.append(content);

  document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mainNav = document.querySelector('.main-nav');
    
    mobileMenuBtn.addEventListener('click', function() {
        const expanded = this.getAttribute('aria-expanded') === 'true' || false;
        this.setAttribute('aria-expanded', !expanded);
        this.classList.toggle('open');
        mainNav.classList.toggle('open');
    });
    
    // Handle window resize - reset mobile menu if window goes above breakpoint
    window.addEventListener('resize', function() {
        if (window.innerWidth > 1024 && mainNav.classList.contains('open')) {
            mobileMenuBtn.classList.remove('open');
            mobileMenuBtn.setAttribute('aria-expanded', 'false');
            mainNav.classList.remove('open');
        }
    });
    
    // Add click handlers for dropdown menus if needed
    // This is a basic implementation - for a full implementation, you would add dropdown menus
    const navLinks = document.querySelectorAll('.nav-link[aria-haspopup="true"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // For demo purposes, we're preventing the default behavior
            // In a real implementation, you would toggle dropdown visibility here
            if (window.innerWidth <= 1024) {
                e.preventDefault();
                const expanded = this.getAttribute('aria-expanded') === 'true' || false;
                this.setAttribute('aria-expanded', !expanded);
                // Here you would toggle the visibility of the associated dropdown menu
            }
        });
    });
});
}
