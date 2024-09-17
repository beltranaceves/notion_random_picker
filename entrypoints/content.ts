export default defineContentScript({
  matches: ['*://*.notion.so/*'],
  main() {
    console.log('Hello Notion!');
  },
});
