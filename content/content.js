// ====================== CORE FUNCTIONALITY ====================== //
const neuroSafe = {
  // 1. Font Injection
  injectDyslexiaFont: () => {
    try {
      const fontFace = new FontFace(
        'OpenDyslexic',
        `url(${chrome.runtime.getURL('assets/OpenDyslexic.woff2')})`,
        { weight: 'normal', style: 'normal' }
      );
      document.fonts.add(fontFace);
    } catch (error) {
      console.error('Font load error:', error);
    }
  },

  // 2. AI Distraction Detection
  detectDistractions: async () => {
    try {
      const { default: tf } = await import('https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@3.18.0/dist/tf.min.js');
      const { default: cocoSsd } = await import('https://cdn.jsdelivr.net/npm/@tensorflow-models/coco-ssd@2.2.2/dist/coco-ssd.min.js');
      
      const model = await cocoSsd.load();
      const predictions = await model.detect(document.body);
      
      predictions.forEach(pred => {
        if (['tv', 'cell phone', 'laptop'].includes(pred.class)) {
          const element = document.elementFromPoint(
            pred.bbox[0] + pred.bbox[2]/2, 
            pred.bbox[1] + pred.bbox[3]/2
          );
          if (element) {
            element.style.opacity = '0.2';
            element.style.pointerEvents = 'none';
          }
        }
      });
    } catch (error) {
      console.error('AI detection failed:', error);
    }
  },

  // 3. Epilepsy Protection
  blockFlashes: () => {
    document.querySelectorAll('video, img, [style*="animation"]').forEach(el => {
      try {
        const style = getComputedStyle(el);
        if (style.animationDuration.includes('ms') && (1000 / parseInt(style.animationDuration)) > 3) {
          el.style.animationPlayState = 'paused';
        }
      } catch (error) {
        console.error('Flash block error:', error);
      }
    });
  },

  // 4. Enhanced Panic Mode
  activatePanicMode: () => {
    try {
      // Inject CSS overlay
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = chrome.runtime.getURL('assets/panic-overlay.css');
      document.head.appendChild(link);

      // Force-stop media
      document.querySelectorAll('video, audio').forEach(el => {
        try {
          el.pause();
          el.controls = false;
        } catch (error) {
          console.error('Media pause error:', error);
        }
      });

      // Dynamic content watcher
      if (!window.neuroSafeObserver) {
        window.neuroSafeObserver = new MutationObserver(() => {
          neuroSafe.blockFlashes();
          document.querySelectorAll('video, audio').forEach(el => el.pause());
        });
        window.neuroSafeObserver.observe(document.body, { 
          childList: true, 
          subtree: true 
        });
      }
    } catch (error) {
      console.error('Panic mode error:', error);
    }
  },

  // 5. Dyslexia Mode
  applyDyslexiaMode: (enabled) => {
    try {
      document.body.style.fontFamily = enabled ? 'OpenDyslexic, sans-serif' : '';
      document.body.style.backgroundColor = enabled ? '#f0e4d0' : '';
    } catch (error) {
      console.error('Dyslexia mode error:', error);
    }
  },

  // 6. Audio Blocking
  applyAudioBlocking: (enabled) => {
    document.querySelectorAll('video, audio').forEach(el => {
      el.muted = enabled;
      if (enabled) el.pause();
    });
  },

  // 7. Motion Reduction
  applyMotionReduction: (enabled) => {
    document.querySelectorAll('*').forEach(el => {
      if (enabled) {
        el.style.animation = 'none !important';
        el.style.transition = 'none !important';
      }
    });
  }
};

// Add to your existing content script
function applyGreyscale(shouldApply) {
  if (shouldApply) {
      document.documentElement.classList.add('greyscale-toggle');
  } else {
      document.documentElement.classList.remove('greyscale-toggle');
  }
}

// Listen for messages from the popup/options
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'greyscale-toggle') {
      applyGreyscale(request.enabled);
  }
});

// Check storage for initial state
chrome.storage.sync.get(['greyscaleEnabled'], function(result) {
  if (result.greyscaleEnabled) {
      applyGreyscale(true);
  }
});

// ====================== INITIALIZATION ====================== //
(async () => {
  // Load font and settings
  neuroSafe.injectDyslexiaFont();
  
  try {
    const { neuroSafeSettings } = await chrome.storage.sync.get(['neuroSafeSettings']);
    
    // Apply initial modes
    if (neuroSafeSettings?.dyslexiaMode) neuroSafe.applyDyslexiaMode(true);
    if (neuroSafeSettings?.audioBlocking) neuroSafe.applyAudioBlocking(true);
    if (neuroSafeSettings?.motionReduction) neuroSafe.applyMotionReduction(true);
    
    // Start protection systems
    await neuroSafe.detectDistractions();
    neuroSafe.blockFlashes();
    setInterval(neuroSafe.blockFlashes, 5000);

    // Export to popup
    window.neuroSafe = neuroSafe;
  } catch (error) {
    console.error('Initialization error:', error);
  }
})();