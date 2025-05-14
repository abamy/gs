import { readBlockConfig } from '../../scripts/aem.js';

export default function decorate(block) {
  const config = readBlockConfig(block);
  console.info(config.asset)

  const content = document.createRange().createContextualFragment(`
    <script type="module" src="https://ajax.googleapis.com/ajax/libs/model-viewer/4.0.0/model-viewer.min.js"></script>
    <model-viewer style="width: 100%; height: 500px;"
      src="${config.asset}"
      ar shadow-intensity="1" camera-controls touch-action="pan-y">
    </model-viewer>
  `);

  block.textContent = '';
  block.append(content);
}