export default function decorate(block) {
    // Extract tab content from block
    const tabs = [];
    const tabContents = [];
    
    // Find all rows - first row contains tab headers, rest are content sections
    const rows = [...block.children];
    
    // Add the container class to help with styling and identification
    block.classList.add('tabbed-content-container');
    
    if (rows.length > 0) {
      // First row has the tab headers
      const tabHeaders = [...rows[0].children];
      
      // Create the tab navigation
      const tabNav = document.createElement('div');
      tabNav.className = 'tabbed-content-nav';
      
      tabHeaders.forEach((header, index) => {
        const tabButton = document.createElement('button');
        tabButton.className = 'tab-button';
        tabButton.textContent = header.textContent.trim();
        tabButton.setAttribute('aria-selected', index === 0 ? 'true' : 'false');
        tabButton.setAttribute('role', 'tab');
        tabButton.setAttribute('id', `tab-${index}`);
        tabButton.setAttribute('aria-controls', `tab-panel-${index}`);
        tabButton.dataset.tabIndex = index.toString();
        
        tabButton.addEventListener('click', () => {
          // Deactivate all tabs
          tabNav.querySelectorAll('.tab-button').forEach(btn => {
            btn.setAttribute('aria-selected', 'false');
          });
          
          // Hide all tab contents
          tabContentContainer.querySelectorAll('.tab-content').forEach(content => {
            content.setAttribute('aria-hidden', 'true');
          });
          
          // Activate current tab and show content
          tabButton.setAttribute('aria-selected', 'true');
          tabContents[index].setAttribute('aria-hidden', 'false');
        });
        
        tabNav.appendChild(tabButton);
        tabs.push(tabButton);
      });
      
      // Create the tab content container
      const tabContentContainer = document.createElement('div');
      tabContentContainer.className = 'tabbed-content-panels';
      
      // Process content rows (skip the header row)
      for (let i = 1; i < rows.length; i++) {
        const tabContent = document.createElement('div');
        tabContent.className = 'tab-content';
        tabContent.setAttribute('role', 'tabpanel');
        tabContent.setAttribute('id', `tab-panel-${i-1}`);
        tabContent.setAttribute('aria-labelledby', `tab-${i-1}`);
        tabContent.setAttribute('aria-hidden', i === 1 ? 'false' : 'true');
        tabContent.dataset.tabContentIndex = (i-1).toString();
        
        // Move content from original row to new tab content div
        tabContent.append(...rows[i].children);
        
        tabContentContainer.appendChild(tabContent);
        tabContents.push(tabContent);
      }
      
      // Clear the block and add our new elements
      block.textContent = '';
      block.appendChild(tabNav);
      block.appendChild(tabContentContainer);
      
      // Add active class to first tab
      if (tabs.length > 0) {
        tabs[0].classList.add('active');
      }
    }
  }