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

    function addRandomButton(notionTableViewItemAdd) {
      let randomButtonElement = notionTableViewItemAdd.childNodes[0].cloneNode(true);
      let siblingBoxShadow = notionTableViewItemAdd.childNodes[1].style.boxShadow;
      randomButtonElement.style.borderRadius = '0';
      randomButtonElement.style.boxShadow = siblingBoxShadow;
      
      randomButtonElement.textContent = "Random";
      randomButtonElement?.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        highlightRandomRow(event.target);
      });
      notionTableViewItemAdd.insertBefore(randomButtonElement, notionTableViewItemAdd.childNodes[1]);
    }

    async function highlightRandomRow(element: HTMLElement) {
      const notionTableView = element.closest('.notion-collection_view-block').parentNode.closest('.notion-collection_view-block');
      if (notionTableView) {
        console.log(notionTableView)
        const rows = notionTableView.querySelectorAll(".notion-table-view-row");
        console.log(rows);
        const randomIndex = Math.floor(Math.random() * rows.length);
        let randomRow: Element;
        randomRow = rows[randomIndex];
        if (randomRow) {
          var checkbox = randomRow.querySelector('input[type=checkbox]');
          checkbox.click();
        }
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
                  if (notionTableViewItemAdd.childElementCount < 4) {
                    addRandomButton(notionTableViewItemAdd);
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