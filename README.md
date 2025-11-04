🧠 NeuroSafe: Browse Without Pain

https://img.shields.io/badge/Version-1.0.0-brightgreen https://img.shields.io/badge/License-MIT-blue https://img.shields.io/badge/Contributors-4-orange



An AI-powered browser extension that provides real-time, adaptive sensory protection for neurodivergent users, making the web a safer and more accessible place.



✨ Features

🛡️ For Autistic Users

* Panic Mode: One-click or voice-activated mode that instantly applies grayscale + blur filters and mutes all media.
* AI Cleanup: Uses TensorFlow.js to intelligently identify and dim distracting elements (ads, animations) to 20% opacity.



👁️ For Dyslexic Users

* Dyslexia Mode: Switches to OpenDyslexic font and applies a tan background (#f0e4d0) for reduced glare and improved readability.
* Text Enhancement: High-contrast mode with adjustable font size and spacing.



🎯 For ADHD Users

* Focus+ Mode: Hides non-essential elements using AI and freezes animations to minimize distractions.
* Voice Shortcuts: "Hey NeuroSafe, focus" command for hands-free activation.



⚡ For Epileptic Users

* Flash Blocking: Automatically detects and pauses high-frame-rate GIFs/videos.
* Emergency Protocol: Panic Mode activates in under 0.5 seconds for rapid response to flashing content.



🛠️ Tech Stack

* Frontend: HTML5, CSS3, JavaScript
* AI/ML: TensorFlow.js (COCO-SSD model)
* Voice Control: Web Speech API (webkitSpeechRecognition)
* Browser API: Chrome Extensions API
* Version Control: Git, GitHub



🚀 Installation

1.Clone the repository

git clone https://github.com/rakshitdev18/NueroSafe.git

cd NueroSafe

2.Load the extension in Chrome

* Open Chrome and navigate to chrome://extensions/
* Enable "Developer mode" in the top right
* Click "Load unpacked" and select the extension directory

3.Pin the extension 

* Click the puzzle piece icon in Chrome's toolbar
* Pin NeuroSafe for easy access



🏗️ System Architecture



NeuroSafe Extension

├── popup.html          # Extension popup UI

├── content.js          # Content scripts for DOM manipulation

├── background.js       # Background service worker

├── tensorflow/         # AI model for element detection

├── voice-recognition/  # Speech recognition module

└── styles/            # CSS for different accessibility modes



🤝 Contributing

-> We welcome contributions! Please see our Contributing Guidelines for details.



* Fork the project
* Create your feature branch (git checkout -b feature/AmazingFeature)
* Commit your changes (git commit -m 'Add some AmazingFeature')
* Push to the branch (git push origin feature/AmazingFeature)
* Open a Pull Request



🎯 Future Enhancements

* Support for Firefox and Edge browsers
* Customizable sensitivity settings per user
* Pattern-based flash detection for epilepsy safety
* Machine learning model training on user preferences
* Cross-device synchronization of settings



👥 Team Members

* Nikita Rathee (Team Lead) 
* Ranjit - GitHub
* Rakshit - GitHub



📄 License

This project is licensed under the MIT License - see the LICENSE file for details.



🏆 Awards \& Recognition

🥇 Winner - ConceptX College Hackathon 2025



📞 Contact

-> Nikita Rathee

* Email: rathi05nikki@gmail.com
* LinkedIn: linkedin.com/in/nikita-rathee-918324346
* GitHub: github.com/CozNuts



⭐ If you find this project helpful, please give it a star! ⭐

