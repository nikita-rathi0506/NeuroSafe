document.addEventListener('DOMContentLoaded', async () => {
  // Load saved settings
  const { neuroSafeSettings } = await chrome.storage.sync.get(['neuroSafeSettings']);
  const settings = neuroSafeSettings || {
    dyslexiaMode: false,
    voiceEnabled: false,
    greyscaleEnabled: false,
    panicHotkey: 'Space',
    voiceLanguage: 'en-US'
  };

  // Set UI to current values
  document.getElementById('dyslexiaDefault').checked = settings.dyslexiaMode;
  document.getElementById('voiceDefault').checked = settings.voiceEnabled;
  document.getElementById('voiceLanguage').value = settings.voiceLanguage || 'en-US';
  document.getElementById('panicHotkey').value = settings.panicHotkey;

  // Hotkey detection
  document.getElementById('panicHotkey').addEventListener('keydown', (e) => {
    e.preventDefault();
    const key = e.code.startsWith('Key') ? e.code.replace('Key', '') : e.code;
    document.getElementById('panicHotkey').value = key;
    settings.panicHotkey = key;
  });

  // Voice language validation
  document.getElementById('voiceLanguage').addEventListener('change', (e) => {
    if (!['en-US', 'en-GB'].includes(e.target.value)) {
      e.target.value = 'en-US';
    }
  });

  // Save settings
  document.getElementById('saveBtn').addEventListener('click', async () => {
    try {
      settings.dyslexiaMode = document.getElementById('dyslexiaDefault').checked;
      settings.voiceEnabled = document.getElementById('voiceDefault').checked;
      settings.voiceLanguage = document.getElementById('voiceLanguage').value;

      await chrome.storage.sync.set({ neuroSafeSettings: settings });
      document.getElementById('status').textContent = 'Settings saved!';
      setTimeout(() => {
        document.getElementById('status').textContent = '';
      }, 2000);
    } catch (error) {
      document.getElementById('status').textContent = 'Save failed!';
      console.error('Save error:', error);
    }
  });

  // Add to your existing options script
const greyscaleToggle = document.getElementById('greyscale-toggle');
document.getElementById('dyslexiaDefault').checked = settings.greyscaleEnabled;


// Load saved state
chrome.storage.sync.get(['greyscaleEnabled'], function(result) {
    greyscaleToggle.checked = result.greyscaleEnabled || false;
});

// Save state when toggled
greyscaleToggle.addEventListener('change', function() {
    chrome.storage.sync.set({ greyscaleEnabled: this.checked });
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {
            action: 'toggleGreyscale',
            enabled: this.checked
        });
    }.bind(this));
});

  // Reset to defaults
  document.getElementById('resetBtn').addEventListener('click', async () => {
    try {
      await chrome.storage.sync.clear();
      location.reload();
    } catch (error) {
      console.error('Reset error:', error);
    }
  });
});