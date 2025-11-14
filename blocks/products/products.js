export default async function decorate(block) {
  const content = document.createRange().createContextualFragment(`
    <div class="articles-grid">
      Articles
    </div>
  `);

  block.textContent = '';
  block.append(content);
}