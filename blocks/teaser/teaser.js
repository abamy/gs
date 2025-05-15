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
            <h1 id="${blockId}-title" data-aue-label="Title" data-aue-prop="title" data-aue-type="text" >${config.title}</h1>
            <p id="${blockId}-description" data-aue-label="Description" data-aue-prop="description" data-aue-type="text">${config.description}</p>
            <a id="${blockId}-button" data-aue-label="Call to Action" data-aue-prop="buttonText" data-aue-type="text" href="${config.buttonlink}" class="learn-more-btn">${config.buttontext}</a>
        </div>
    </section>
  `);

  block.textContent = '';
  block.append(content);

  if (config.offerzone) {
    if (typeof adobe !== 'undefined' && adobe.target) {
      handleOffer();
    } else {
      document.addEventListener('at-library-loaded', handleOffer);
    }

    function handleOffer() {
      adobe.target.getOffer({
        "mbox": config.offerzone,
        "params": {
          "logged": localStorage.getItem('logged'),
          "profileType": localStorage.getItem('profileType')
        },
        "success": function (offer) {
          if (!offer.length) return;

          const offerContent = offer[0].content[0].data.offerByPath.item;
          console.log(offerContent);

          const titleElement = document.getElementById(`${blockId}-title`);
          titleElement.innerHTML = offerContent.title;

          const descriptionElement = document.getElementById(`${blockId}-description`);
          descriptionElement.innerHTML = offerContent.description.html;

          const buttonElement = document.getElementById(`${blockId}-button`);
          buttonElement.innerHTML = offerContent.buttonText;
          buttonElement.href = offerContent.buttonLink['_path'];

          const imageElement = document.getElementById(`${blockId}-image`);
          const picture = createOptimizedPicture(offerContent.image['_path'].substring('/content/dam/3ds'.length), offerContent.imageDescription);
          imageElement.innerHTML = picture.outerHTML;
        },
        "error": function (status, error) {
          console.log('Error', status, error);
        }
      });
    }
  }
}