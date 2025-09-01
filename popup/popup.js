document.addEventListener('DOMContentLoaded', async () => {
  // DOM Elements
  const panicBtn = document.getElementById('panicBtn');
  const dyslexiaToggle = document.getElementById('dyslexiaToggle');
  const audioToggle = document.getElementById('audioToggle');
  const motionToggle = document.getElementById('motionToggle');
  const voiceToggle = document.getElementById('voiceToggle');
  const voiceStatus = document.getElementById('voiceStatus');
  const errorDisplay = document.getElementById('errorDisplay');
  const settingsLink = document.getElementById('settingsLink');
  const greyscaleToggle = document.getElementById('greyscaleToggle');

  // State Management
  let voiceRecognition;
  let settings = {
    dyslexiaMode: false,
    audioBlocking: false,
    motionReduction: false,
    greyscaleEnabled: false ,
    voiceEnabled: false,
    panicHotkey: 'Space'
  };

  // Initialize from Storage
  async function loadSettings() {
    try {
      const result = await chrome.storage.sync.get(['neuroSafeSettings']);
      if (result.neuroSafeSettings) {
        settings = { ...settings, ...result.neuroSafeSettings };
        applyUISettings();
        
        if (settings.voiceEnabled) {
          await toggleVoiceControl(true);
        }
      }
      async function loadSettings() {
      const result = await chrome.storage.sync.get(['neuroSafeSettings']);
      if (result.neuroSafeSettings) {
        // Add this line:
        greyscaleToggle.checked = result.neuroSafeSettings.greyscaleEnabled || false;
      }
    }
    } catch (error) {
      showError('Failed to load settings');
      console.error('Settings load error:', error);
    }
  }

  function applyUISettings() {
    dyslexiaToggle.checked = settings.dyslexiaMode;
    audioToggle.checked = settings.audioBlocking;
    motionToggle.checked = settings.motionReduction;
    voiceToggle.checked = settings.voiceEnabled;
    updateVoiceUI();
  }

  function updateVoiceUI() {
    voiceStatus.textContent = `Voice: ${settings.voiceEnabled ? 'On' : 'Off'}`;
    voiceToggle.textContent = settings.voiceEnabled ? 'Disable' : 'Enable';
  }

  // Voice Control
  function initVoiceRecognition() {
    if (!('webkitSpeechRecognition' in window)) {
      showError('Voice control not supported');
      voiceToggle.disabled = true;
      return null;
    }

    const recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = settings.voiceLanguage || 'en-US';

    recognition.onresult = (event) => {
      const command = event.results[0][0].transcript.toLowerCase();
      handleVoiceCommand(command);
    };

    recognition.onerror = (event) => {
      showError(`Voice error: ${event.error}`);
      toggleVoiceControl(false);
    };

    return recognition;
  }

  function handleVoiceCommand(command) {
    try {
      if (command.includes('panic')) {
        activatePanicMode();
      } else if (command.includes('dyslexia')) {
        toggleSetting('dyslexiaMode', !settings.dyslexiaMode);
      } else if (command.includes('voice off')) {
        toggleVoiceControl(false);
      }
    } catch (error) {
      console.error('Voice command error:', error);
    }
  }

  async function toggleVoiceControl(enable) {
    try {
      settings.voiceEnabled = enable;
      
      if (enable) {
        if (!voiceRecognition) voiceRecognition = initVoiceRecognition();
        if (voiceRecognition) {
          voiceRecognition.start();
          voiceStatus.textContent = 'Voice: Listening...';
        }
      } else if (voiceRecognition) {
        voiceRecognition.stop();
      }
      
      updateVoiceUI();
      await saveSettings();
    } catch (error) {
      showError('Voice control error');
      console.error('Voice toggle error:', error);
    }
  }

  // Core Features
  async function activatePanicMode() {
    try {
      panicBtn.classList.add('urgent');
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => {
          if (window.neuroSafe && typeof window.neuroSafe.activatePanicMode === 'function') {
            window.neuroSafe.activatePanicMode();
          }
        }
      });
      
      setTimeout(() => panicBtn.classList.remove('urgent'), 2000);
    } catch (error) {
      showError('Failed to activate panic mode');
      console.error('Panic mode error:', error);
    }
  }

  async function toggleSetting(setting, value) {
    try {
      settings[setting] = value;
      await saveSettings();
      
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: (setting, value) => {
          if (window.neuroSafe) {
            const funcName = `apply${setting.charAt(0).toUpperCase() + setting.slice(1)}`;
            if (typeof window.neuroSafe[funcName] === 'function') {
              window.neuroSafe[funcName](value);
            }
          }
        },
        args: [setting, value]
      });
    } catch (error) {
      showError(`Failed to toggle ${setting}`);
      console.error('Toggle error:', error);
    }
  }

  // Settings Persistence
  async function saveSettings() {
    try {
      await chrome.storage.sync.set({ neuroSafeSettings: settings });
    } catch (error) {
      showError('Failed to save settings');
      console.error('Save error:', error);
    }
  }

  // Error Handling
  function showError(message) {
    errorDisplay.textContent = message;
    errorDisplay.classList.remove('error-hidden');
    setTimeout(() => errorDisplay.classList.add('error-hidden'), 5000);
  }

  // Event Listeners
  panicBtn.addEventListener('click', activatePanicMode);
  dyslexiaToggle.addEventListener('change', (e) => toggleSetting('dyslexiaMode', e.target.checked));
  audioToggle.addEventListener('change', (e) => toggleSetting('audioBlocking', e.target.checked));
  motionToggle.addEventListener('change', (e) => toggleSetting('motionReduction', e.target.checked));
  voiceToggle.addEventListener('change', (e) => toggleVoiceControl(e.target.checked));
  
  settingsLink.addEventListener('click', (e) => {
    e.preventDefault();
    chrome.runtime.openOptionsPage();
  });

  // Hotkey Support
  document.addEventListener('keydown', (e) => {
    const pressedKey = e.code.replace('Key', '');
    if (pressedKey === settings.panicHotkey.replace('Key', '') && e.target === document.body) {
      e.preventDefault();
      activatePanicMode();
    }
  });

  // Initialize
  await loadSettings();
});