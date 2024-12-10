import './style.css';

// Define interface for settings type
interface Settings {
  rowsPerClick: number;
  maxRows: number;
  autoload: boolean;
}

// Initialize popup HTML
document.querySelector<HTMLDivElement>('#app')!.innerHTML = /* html */ `
  <div>
    <h1>Random Picker Settings</h1>
    <div class="card">
      <div class="setting-item">
        <label for="rowsPerClick">Number of selected rows per click:</label>
        <input type="number" id="rowsPerClick" min="1" value="1" class="setting-input">
      </div>

      <div class="setting-item">
        <label for="maxRows">Maximum number of selected rows:</label>
        <input type="number" id="maxRows" min="1" value="10" class="setting-input">
      </div>

      <div class="setting-item">
        <label>Autoload databases</label>
        <label class="switch">
          <input type="checkbox" id="autoload" checked>
          <span class="slider round"></span>
        </label>
      </div>
    </div>
  </div>
`;

// Get DOM elements
const rowsPerClickInput = document.querySelector<HTMLInputElement>('#rowsPerClick')!;
const maxRowsInput = document.querySelector<HTMLInputElement>('#maxRows')!;
const autoloadInput = document.querySelector<HTMLInputElement>('#autoload')!;

// Load saved settings when popup opens
async function loadSettings() {
  const result = await chrome.storage.sync.get({
    // Default values
    rowsPerClick: 1,
    maxRows: 10,
    autoload: true
  });
  
  rowsPerClickInput.value = result.rowsPerClick.toString();
  maxRowsInput.value = result.maxRows.toString();
  autoloadInput.checked = result.autoload;
}

// Save settings when changed
function saveSettings() {
  const settings: Settings = {
    rowsPerClick: parseInt(rowsPerClickInput.value),
    maxRows: parseInt(maxRowsInput.value),
    autoload: autoloadInput.checked
  };
  
  chrome.storage.sync.set(settings);
}

// Add event listeners
rowsPerClickInput.addEventListener('change', saveSettings);
maxRowsInput.addEventListener('change', saveSettings);
autoloadInput.addEventListener('change', saveSettings);

// Load settings when popup opens
loadSettings();