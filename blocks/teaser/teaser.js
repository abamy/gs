import { readBlockConfig } from '../../scripts/aem.js';
import { transformImageSrc } from '../../scripts/utils.js';

export default function decorate(block) {
  const config = readBlockConfig(block);
  console.info(JSON.stringify(config));

  const content = document.createRange().createContextualFragment(`
    <section class="teaser-section">
        <div class="teaser-background">
            <img src="${transformImageSrc(config.image)}" alt="Team collaborating on a unified platform">
        </div>
        <div class="bokeh-effect"></div>
        <div class="content-container">
            <h1>${config.title}</h1>
            <p>${config.description}</p>
            <a href="${config.buttonlink}" class="learn-more-btn">${config.buttontext}</a>
        </div>
    </section>
  `);

  block.textContent = '';
  block.append(content);
}