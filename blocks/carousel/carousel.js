import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const slideElements = [];

  for (let i = 0; i < block.children.length; i += 1) {
    const row = block.children[i];
    const pElements = row.getElementsByTagName('p');
    const image = pElements[0].textContent;
    const title = pElements[1].textContent;
    const description = pElements[2].textContent;
    const buttonText = pElements[3].textContent;

    const slideElement = document.createElement('div');
    slideElement.className = `slide ${i === 0 ? 'active' : ''}`;
    slideElement.setAttribute('data-aue-prop', 'slide');
    slideElement.innerHTML = `
      <img class="slide-image" src="${image}&width=1795" alt="Carousel Image ${i}"></img>
      <div class="slide-overlay"></div>
      <div class="slide-content">
          <h1 data-aue-label="Title" data-aue-prop="title" data-aue-type="text">${title}</h1>
          <p data-aue-label="Description" data-aue-prop="description" data-aue-type="text">${description}</p>
          <button data-aue-label="Call to Action" data-aue-prop="buttonText" data-aue-type="text" class="cta-button">${buttonText}</button>
      </div>
    `;
    moveInstrumentation(row, slideElement);
    slideElements.push(slideElement);
  }

  const content = document.createRange().createContextualFragment(`
    <div class="carousel-container">
        <div class="carousel">
        </div>

        <div class="arrow arrow-left">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
        </div>
        <div class="arrow arrow-right">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </div>

        <div class="navigation">
        </div>
    </div>
  `);

  const navigation = content.querySelector('.navigation');
  for (let i = 0; i < block.children.length; i++) {
    const dot = document.createElement('div');
    dot.className = `nav-dot ${i === 0 ? 'active' : ''}`;
    navigation.append(dot);
  }

  const carousel = content.querySelector('.carousel');
  slideElements.forEach((slideElement) => carousel.append(slideElement));

  block.textContent = '';
  block.append(content);

  const slides = document.querySelectorAll('.slide');
  const dots = document.querySelectorAll('.nav-dot');
  const leftArrow = document.querySelector('.arrow-left');
  const rightArrow = document.querySelector('.arrow-right');

  let currentSlide = 0;
  let slideInterval;

  function showSlide(index) {
    // Remove active class from all slides and dots
    slides.forEach((slide) => slide.classList.remove('active'));
    dots.forEach((dot) => dot.classList.remove('active'));

    // Add active class to current slide and dot
    slides[index].classList.add('active');
    dots[index].classList.add('active');

    currentSlide = index;
  }

  function nextSlide() {
    let next = currentSlide + 1;
    if (next >= slides.length) next = 0;
    showSlide(next);
  }

  function prevSlide() {
    let prev = currentSlide - 1;
    if (prev < 0) prev = slides.length - 1;
    showSlide(prev);
  }

  // Setup event listeners
  rightArrow.addEventListener('click', () => {
    nextSlide();
    resetInterval();
  });

  leftArrow.addEventListener('click', () => {
    prevSlide();
    resetInterval();
  });

  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      showSlide(index);
      resetInterval();
    });
  });

  // Auto-advance slides
  function startInterval() {
    slideInterval = setInterval(nextSlide, 5000);
  }

  function resetInterval() {
    clearInterval(slideInterval);
    startInterval();
  }

  // Initialize the automatic slideshow
  startInterval();
}
