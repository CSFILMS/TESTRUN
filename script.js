// Configuration - easily modifiable settings
const CONFIG = {
  animationSpeed: 80,
  textChunkSize: 15,
  bootSequenceDelay: 200,
  accessSequenceDelay: 300,
  redirectDelay: 1000,
  // Simple password for demo purposes
  correctPassword: 'demo'
};

// Debug: Log that script is loaded
console.log('🚀 SCRIPT.JS LOADED - VERSION 4 - FORCE REDIRECT');
console.log('🎯 Will redirect to DRSEY_PITCHTEXT.html');

// State management
const state = {
  isAnimating: false,
  currentInterval: null,
  lastAdvance: 0,
  throttleDelay: 300
};

// DOM elements cache
const elements = {
  passwordInput: null,
  msg: null,
  prompt: null,
  boot: null,
  video: null
};

// Initialize DOM elements
function initializeElements() {
  elements.passwordInput = document.getElementById('password');
  elements.msg = document.getElementById('msg');
  elements.prompt = document.getElementById('prompt');
  elements.boot = document.getElementById('boot');
  elements.video = document.getElementById('video');
  
  // Debug: Log that elements are initialized
  console.log('Elements initialized:', {
    passwordInput: !!elements.passwordInput,
    msg: !!elements.msg,
    prompt: !!elements.prompt,
    boot: !!elements.boot
  });
}

// Improved text scrambling with requestAnimationFrame for better performance
function scrambleText(element, finalText, callback) {
  if (!element || !finalText) return;
  
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let iteration = 0;
  const scrambled = finalText.split('');
  let animationId = null;

  function animate() {
    const display = scrambled.map((char, i) => {
      if (i < iteration) return finalText[i];
      return chars[Math.floor(Math.random() * chars.length)];
    });
    
    element.textContent = display.join('');

    if (iteration >= finalText.length) {
      element.textContent = finalText;
      if (callback) callback();
      return;
    }

    iteration += 1;
    animationId = requestAnimationFrame(() => {
      setTimeout(animate, 15);
    });
  }

  // Cleanup function
  const cleanup = () => {
    if (animationId) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
  };

  // Start animation
  animate();
  
  // Return cleanup function
  return cleanup;
}

// Improved sequence runner with better error handling
function runSequence(lines, element, delay = 500, done) {
  if (!element || !Array.isArray(lines) || lines.length === 0) {
    if (done) done();
    return;
  }

  let i = 0;
  const cleanupFunctions = [];

  function next() {
    if (i < lines.length) {
      const lineDiv = document.createElement('div');
      lineDiv.className = 'line';
      lineDiv.id = `boot-line-${i}`;
      element.appendChild(lineDiv);
      
      const cleanup = scrambleText(lineDiv, lines[i], () => {
        setTimeout(next, delay);
      });
      
      if (cleanup) cleanupFunctions.push(cleanup);
      i++;
    } else {
      // Cleanup all animations
      cleanupFunctions.forEach(cleanup => cleanup());
      if (done) done();
    }
  }

  next();
}

// Password validation - simple hardcoded check
function validatePassword(attempt) {
  console.log('Password validation attempt:', {
    input: attempt,
    correct: CONFIG.correctPassword,
    matches: attempt === CONFIG.correctPassword
  });
  return attempt === CONFIG.correctPassword;
}

// Handle password entry with improved error handling
function handlePasswordEntry(attempt) {
  console.log('Handling password entry:', attempt);
  
  if (validatePassword(attempt)) {
    console.log('Password correct! Access granted.');
    elements.passwordInput.style.display = 'none';
    
    const accessGrantedSequence = [
      'ACCESS GRANTED',
      'DECRYPTING PAYLOAD...',
      'LOADING DOCUMENT MODULE',
      'REDIRECTING TO SECURE CHANNEL...',
    ];

    runSequence(accessGrantedSequence, elements.msg, CONFIG.accessSequenceDelay, () => {
      setTimeout(() => {
        console.log('🎯 FORCE REDIRECTING TO test-redirect.html...');
        // Force redirect with multiple methods
        window.location.href = 'test-redirect.html';
        window.location.replace('test-redirect.html');
        document.location = 'test-redirect.html';
      }, CONFIG.redirectDelay);
    });
  } else {
    console.log('Password incorrect. Access denied.');
    const accessDeniedMessages = [
      'ACCESS DENIED',
      'UNAUTHORIZED ATTEMPT LOGGED',
      'INVALID KEY SEQUENCE',
      'SECURITY PROTOCOL ENGAGED',
      'FINGERPRINT MISMATCH'
    ];

    const denial = accessDeniedMessages[Math.floor(Math.random() * accessDeniedMessages.length)];
    scrambleText(elements.msg, denial, () => {
      elements.passwordInput.value = '';
    });
  }
}

// Throttle function for navigation
function throttle() {
  const now = Date.now();
  if (now - state.lastAdvance < state.throttleDelay) return false;
  state.lastAdvance = now;
  return true;
}

// Event handlers
function setupEventListeners() {
  if (!elements.passwordInput) {
    console.error('Password input element not found!');
    return;
  }

  console.log('Setting up password event listener');
  
  elements.passwordInput.addEventListener('keydown', function(e) {
    console.log('Key pressed:', e.key, 'Value:', this.value);
    
    if (e.key === 'Enter') {
      e.preventDefault();
      const attempt = this.value.trim();
      console.log('Enter pressed with value:', attempt);
      
      if (attempt) {
        handlePasswordEntry(attempt);
      } else {
        console.log('Empty password attempt');
      }
    }
  });
  
  // Also add input event listener for debugging
  elements.passwordInput.addEventListener('input', function(e) {
    console.log('Input changed:', this.value);
  });
}

// Initialize boot sequence
function initializeBootSequence() {
  const bootSequence = [
    '[OK] BIOS checksum verified',
    '[OK] Bootloader decrypted',
    '[OK] Neural access bridge initialized',
    '[OK] Proxy tunnels established',
    '[OK] Identity hash resolved',
    '[WARN] Clearance level: REDACTED'
  ];

  runSequence(bootSequence, elements.boot, CONFIG.bootSequenceDelay, () => {
    // Don't show any text in prompt - let the input field show the blinking cursor
    elements.prompt.textContent = '';
    // Focus the input field to show the blinking cursor
    if (elements.passwordInput) {
      elements.passwordInput.focus();
      console.log('Password input focused');
    }
  });
}

// Main initialization
function initialize() {
  console.log('Initializing application...');
  console.log('Correct password is:', CONFIG.correctPassword);
  
  initializeElements();
  setupEventListeners();
  initializeBootSequence();
  
  console.log('Initialization complete');
}

// Cleanup function
function cleanup() {
  if (state.currentInterval) {
    clearInterval(state.currentInterval);
    state.currentInterval = null;
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  console.log('DOM loading, waiting for DOMContentLoaded...');
  document.addEventListener('DOMContentLoaded', initialize);
} else {
  console.log('DOM already loaded, initializing immediately...');
  initialize();
}

// Cleanup on page unload
window.addEventListener('beforeunload', cleanup);