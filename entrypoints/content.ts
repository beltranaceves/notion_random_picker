export default defineContentScript({
  matches: ['*://*.notion.so/*'],
  main() {
    // Initial run
    runContentScript();

    // Set up a MutationObserver to detect URL changes
    const observer = new MutationObserver(() => {
      if (window.location.href !== currentUrl) {
        currentUrl = window.location.href;
        runContentScript();
      }
    });

    // Start observing the document with the configured parameters
    observer.observe(document, { subtree: true, childList: true });

    // Store the current URL
    let currentUrl = window.location.href;

    async function highlightRandomRow(element) {
      // Get all rows in the table
      const rows = element.querySelectorAll('.notion-table-view-row');
      const randomIndex = Math.floor(Math.random() * rows.length);
      const randomRow = rows[randomIndex];
      if (randomRow) {
        randomRow.style.backgroundColor = 'yellow';
      }
    }

    // Function to run your content script logic
    async function runContentScript() {
      // Set up a MutationObserver to watch for added elements
      const tableObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'childList') {
            mutation.addedNodes.forEach((node) => {
              if (node instanceof HTMLElement) {
                const notionTableViewItemAdd = node.querySelector('.notion-collection-view-item-add');
                if (notionTableViewItemAdd) {
                  console.log('Found a notion-table-view-item-add element:', notionTableViewItemAdd);
                  console.log(notionTableViewItemAdd.childElementCount);
                  if (notionTableViewItemAdd.childElementCount < 4) {
                    let randomButtonElement = notionTableViewItemAdd.childNodes[0].cloneNode(true);
                    randomButtonElement.style.borderRadius = '0';
                    randomButtonElement.style.boxShadow = 'rgba(255, 255, 255, 0.13) 1px 0px 0px inset';
                    
                    randomButtonElement.textContent = "Random";
                    randomButtonElement?.addEventListener('click', (event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      console.log("this: ", this);
                      console.log(event.target.querySelectorAll('.notion-table-view-row'))
                      highlightRandomRow(event.target);
                      // Add your custom logic here for when the button is clicked
                    });
                    notionTableViewItemAdd.insertBefore(randomButtonElement, notionTableViewItemAdd.childNodes[1]);
                  }
                }
              }
            });
          }
        });
      });

      // Configure and start the observer
      const observerConfig = { childList: true, subtree: true };
      tableObserver.observe(document.body, observerConfig);
    }
  },
});