import { isAuthorMode } from '../../scripts/utils.js';

export default async function decorate(block) {
  let logoImage = isAuthorMode ? '/content/3ds.resource/icons/logo.svg': '/icons/logo.svg';
  let searchImage = isAuthorMode ? '/content/3ds.resource/icons/search.svg': '/icons/search.svg';
  let loggedImage = isAuthorMode ? '/content/3ds.resource/icons/logged.svg': '/icons/logged.svg';
  let notLoggedImage = isAuthorMode ? '/content/3ds.resource/icons/not-logged.svg': '/icons/not-logged.svg';

  const content = document.createRange().createContextualFragment(`
    <div class="header" role="banner" aria-label="Dassault Systèmes Main Navigation">
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
          <a href="./learn" class="nav-link" aria-haspopup="true" aria-expanded="false">
            Learn
          </a>
        </div>
        <div class="nav-item">
          <a href="./support" class="nav-link" aria-haspopup="true" aria-expanded="false">
            Support
          </a>
        </div>
        <div class="nav-item">
          <a href="./about" class="nav-link" aria-haspopup="true" aria-expanded="false">
            About
          </a>
        </div>
      </nav>
      
      <div class="right-nav">
        <button class="search-btn" aria-label="Search">
          <img src="${searchImage}" alt="Search Icon" class="search-icon">
        </button>
        <button class="login-btn" id="loginBtn" aria-label="Login">
          <img src="${notLoggedImage}" alt="User not logged"></img><span>Login</span>
        </button>
      </div>
    </div>

    <div class="modal-overlay" id="loginModal">
    <div class="modal" role="dialog" aria-labelledby="loginModalTitle">
      <div class="modal-header">
        <h2 class="modal-title" id="loginModalTitle">Login</h2>
        <button class="modal-close" id="closeModal" aria-label="Close modal">&times;</button>
      </div>
      <div class="modal-body">
        <form id="loginForm">
          <div class="form-group">
            <label for="username" class="form-label">Username</label>
            <input type="text" id="username" class="form-input" required>
          </div>
          <div class="form-group">
            <label for="profileType" class="form-label">Profile Type</label>
            <select id="profileType" class="form-select" required>
              <option value="">Select profile type</option>
              <option value="designer">Designer</option>
              <option value="engineer">Engineer</option>
              <option value="administrator">Administrator</option>
            </select>
          </div>
        </form>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-cancel" id="cancelBtn">Cancel</button>
        <button type="submit" form="loginForm" class="btn btn-login">Login</button>
      </div>
    </div>
  </div>

  `);

  block.textContent = '';
  block.append(content);

  const loginBtn = document.getElementById('loginBtn');
  const loginModal = document.getElementById('loginModal');
  const closeModal = document.getElementById('closeModal');
  const cancelBtn = document.getElementById('cancelBtn');
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const mainNav = document.querySelector('.main-nav');

  const username = localStorage.getItem('username');
  if (username) { 
      loginBtn.innerHTML = `<img src="${loggedImage}" alt="User logged"></img><span>${username}</span>`;
  }

  // Open modal
  loginBtn.addEventListener('click', function() {
    if (localStorage.getItem('logged')) {
        localStorage.removeItem('logged');
        localStorage.removeItem('username');
        localStorage.removeItem('profileType');
        loginBtn.innerHTML = `<img src="${notLoggedImage}" alt="User not logged"></img><span>Login</span>`;
    } else {
      loginModal.classList.add('active');
    }
  });
  
  // Close modal methods
  function closeLoginModal() {
    loginModal.classList.remove('active');
  }
  
  closeModal.addEventListener('click', closeLoginModal);
  cancelBtn.addEventListener('click', closeLoginModal);
  
  // Close modal when clicking outside
  loginModal.addEventListener('click', function(e) {
    if (e.target === loginModal) {
      closeLoginModal();
    }
  });
  
  // Mobile menu toggle
  mobileMenuBtn.addEventListener('click', function() {
    mainNav.classList.toggle('active');
    const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
    mobileMenuBtn.setAttribute('aria-expanded', !isExpanded);
  });
  
  // Form submission
  document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const profileType = document.getElementById('profileType').value;

    localStorage.setItem('logged', true);
    localStorage.setItem('username', username);
    localStorage.setItem('profileType', profileType);
    loginBtn.innerHTML = `<img src="${loggedImage}" alt="User logged"></img><span>${username}</span>`;
    closeLoginModal();
  });
}
