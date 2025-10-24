
export default async function decorate(block) {

  const content = document.createRange().createContextualFragment(`
    <div>Header Component</div>
  `);
  
  block.textContent = '';
  block.append(content);

  
}
