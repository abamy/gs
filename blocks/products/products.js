function extractProductsFromBlock(block) {
  const products = [];
  const productDivs = block.querySelectorAll(':scope > div');

  productDivs.forEach((productDiv, index) => {
    const children = productDiv.querySelectorAll(':scope > div');

    if (children.length >= 5) {
      const title = children[0]?.textContent.trim() || '';
      const sku = children[1]?.textContent.trim() || '';
      const description = children[2]?.textContent.trim() || '';

      // Price can be direct text or wrapped in <p>
      const priceElement = children[3]?.querySelector('p');
      const price = priceElement ? priceElement.textContent.trim() : children[3]?.textContent.trim() || '';

      // Picture can be direct <picture> or wrapped in <p>
      let picture = children[4]?.querySelector('picture');
      if (!picture) {
        const pictureWrapper = children[4]?.querySelector('p');
        picture = pictureWrapper?.querySelector('picture');
      }

      products.push({
        title,
        sku,
        description,
        price,
        picture: picture ? picture.outerHTML : '',
        index
      });
    }
  });

  return products;
}

function buildProductCard(product) {
  const blockId = `product-${product.index}`;

  return `
    <div class="product-card">
      <div id="${blockId}-image" class="product-image">
        ${product.picture}
      </div>
      <div class="product-content">
        <h3 id="${blockId}-title" class="product-title">${product.title}</h3>
        ${product.description ? `<p id="${blockId}-description" class="product-description">${product.description}</p>` : ''}
        <div class="product-footer">
          <span id="${blockId}-price" class="product-price">${product.price}</span>
          <button class="product-btn" data-sku="${product.sku}">View Details</button>
        </div>
      </div>
    </div>
  `;
}

export default async function decorate(block) {
  const products = extractProductsFromBlock(block);

  if (products.length === 0) {
    const emptyContent = document.createRange().createContextualFragment(`
      <div class="products-empty">No products found.</div>
    `);
    block.textContent = '';
    block.append(emptyContent);
    return;
  }

  const productsHTML = products.map(product => buildProductCard(product)).join('');

  const content = document.createRange().createContextualFragment(`
    <div class="products-grid">
      ${productsHTML}
    </div>
  `);

  block.textContent = '';
  block.append(content);
}