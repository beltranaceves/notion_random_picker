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

    // Function to run your content script logic
    async function runContentScript() {
      // Set up a MutationObserver to watch for added elements
      const tableObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'childList') {
            mutation.addedNodes.forEach((node) => {
              if (node instanceof HTMLElement) {
                const notionTableView = node.querySelector('.notion-table-view');
                if (notionTableView) {
                  console.log('Found a notion-table-view element:', notionTableView);
                  // Add your logic here to handle the found notion-table-view element
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