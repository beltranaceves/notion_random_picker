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
      console.log("This is the copy button", randomButtonElement);
      let siblingBoxShadow = notionTableViewItemAdd.childNodes[1].style.boxShadow;
      randomButtonElement.style.borderRadius = '0';
      randomButtonElement.style.boxShadow = siblingBoxShadow;
      
      randomButtonElement.textContent = "Random";
      randomButtonElement?.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        highlightRandomRow(event.target);
      });
      if (isInlineDatabase(randomButtonElement)) {
        notionTableViewItemAdd.insertBefore(randomButtonElement, notionTableViewItemAdd.childNodes[0]);  
      } else {
        notionTableViewItemAdd.insertBefore(randomButtonElement, notionTableViewItemAdd.childNodes[1]);  
      }
      
    }

    function isInlineDatabase(randomButtonElement: Element | null): boolean {
      if (!( randomButtonElement == null || randomButtonElement.closest('.notion-collection_view-block') == null)) {
        console.log("This is an inline database");
      } else {
        console.log("This is not an inline database");
      }
      return !( randomButtonElement == null || randomButtonElement.closest('.notion-collection_view-block') == null);
    }

    function findCollectionElement(element: HTMLElement): HTMLElement | null {
      if (isInlineDatabase(element)) {
        return element.closest('.notion-collection_view-block').parentNode.closest('.notion-collection_view-block');
      } else {
        return element.closest(".notion-scroller")
      }
    }

    function getCollectionItems(notionCollection: HTMLElement): Element[] {
      let collectionItems = [];
      let collectionItemTypes = [".notion-timeline-item", ".notion-collection-item", "notion"];
      for (let collectionItemType of collectionItemTypes) {
        collectionItems.push(...notionCollection.querySelectorAll(collectionItemType));
      }
      return collectionItems;
    }

    async function highlightRandomRow(element: HTMLElement) {
      // determine if the url is a page or database
      const notionCollection = findCollectionElement(element);
      if (notionCollection) {
        // const rows = notionCollection.querySelectorAll(".notion-collection-item");
        const rows = getCollectionItems(notionCollection);
        const randomIndex = Math.floor(Math.random() * rows.length);
        let randomRow: Element;
        randomRow = rows[randomIndex];
        if (randomRow) {
          var checkbox = randomRow.querySelector('input[type=checkbox]');
          if (checkbox) {
            // Click the checkbox
            checkbox.click();
          } else {
            console.log(randomRow)
          // Define a list of events to dispatch
          const events = [
              { type: 'pointerdown', constructor: PointerEvent },
              { type: 'mousedown', constructor: MouseEvent },
              { type: 'pointermove', constructor: PointerEvent },
              { type: 'mousemove', constructor: MouseEvent },
              { type: 'pointerup', constructor: PointerEvent },
              { type: 'mouseup', constructor: MouseEvent },
              { type: 'click', constructor: PointerEvent}
          ];

          // Loop through the events and dispatch them
          for (const event of events) {
              const customEvent = new event.constructor(event.type, {
                  bubbles: true,
                  cancelable: true,
                  view: window
              });
              randomRow.dispatchEvent(customEvent);
          }
          }
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