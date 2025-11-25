import { readBlockConfig, createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  const config = readBlockConfig(block);
  const picture = createOptimizedPicture(config.image, config.imagedescription);

  const blockId = `teaser-${Math.random().toString(36).substr(2, 9)}`;

  const content = document.createRange().createContextualFragment(`
    <section class="teaser-section">
        <div id="${blockId}-image" class="teaser-background">
            ${picture.outerHTML}
        </div>
        <div class="bokeh-effect"></div>
        <div class="content-container">
            <h3 id="${blockId}-title" data-aue-label="Title" data-aue-prop="title" data-aue-type="text" >${config.title}</h1>
            <p id="${blockId}-description" data-aue-label="Description" data-aue-prop="description" data-aue-type="text">${config.description}</p>
            <a id="${blockId}-button" data-aue-label="Call to Action" data-aue-prop="buttonText" data-aue-type="text" href="${config.buttonlink}" class="learn-more-btn">${config.buttontext}</a>
        </div>
    </section>
  `);

  block.textContent = '';
  block.append(content);

  if (config.offerzone) {
    alloy('sendEvent', {
      decisionScopes: ['teaser-zone'],
    }).then((result) => {
      const { propositions } = result;
      if (propositions) {
        // Find the discount proposition, if it exists.
        for (let i = 0; i < propositions.length; i += 1) {
          const proposition = propositions[i];

          const offerContent = proposition.items[0].data.content.data.offerByPath.item;

          const titleElement = document.getElementById(`${blockId}-title`);
          titleElement.innerHTML = offerContent.title;

          const descriptionElement = document.getElementById(
            `${blockId}-description`,
          );
          descriptionElement.innerHTML = offerContent.description.html;

          const buttonElement = document.getElementById(`${blockId}-button`);
          buttonElement.innerHTML = offerContent.buttonText;
          // eslint-disable-next-line no-underscore-dangle
          buttonElement.href = offerContent.buttonLink._path;

          const imageElement = document.getElementById(`${blockId}-image`);
          // eslint-disable-next-line no-underscore-dangle
          const imagePath = `https://publish-p31104-e170504.adobeaemcloud.com${offerContent.image._path}`;
          //const imagePath = getDeliveryUrl(offerContent.image._path, '3590x1000');
          imageElement.innerHTML = `
            <picture>
              <source media="(min-width: 600px)" type="image/webp" srcset="${imagePath}?width=750&amp;format=webply&amp;optimize=medium">
              <source type="image/webp" srcset="${imagePath}?width=750&amp;format=webply&amp;optimize=medium">
              <source media="(min-width: 600px)" srcset="${imagePath}?width=2000&amp;format=png&amp;optimize=medium">
              <img loading="lazy" alt="Black Week Banner" src="${imagePath}?width=750&amp;format=png&amp;optimize=medium">
            </picture>`;
        }
      }
    });
  }
}
