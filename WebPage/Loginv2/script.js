let isSignUp = false;
let passwordVisible = false;
let isFaceCaptured = true; // Start with true to allow sign-in by default
let videoStream = null;

// Show loading state
function showLoadingState() {
  const cameraPlaceholder = document.getElementById('camera-placeholder');
  const video = document.getElementById('video');
  
  // Show loading animation
  cameraPlaceholder.innerHTML = `
    <div class="loading-spinner"></div>
    <p class="loading-text">Scanning your face...</p>
  `;
  cameraPlaceholder.classList.remove('hidden');
  video.classList.add('hidden');
}

// Show error message
function showError(message) {
  const errorElement = document.createElement('div');
  errorElement.className = 'error-message';
  errorElement.textContent = message;
  
  // Remove any existing error messages
  const existingError = document.querySelector('.error-message');
  if (existingError) existingError.remove();
  
  // Insert error message
  const form = document.getElementById('auth-form');
  form.insertBefore(errorElement, form.firstChild);
  
  // Auto-remove after 5 seconds
  setTimeout(() => {
    errorElement.remove();
  }, 5000);
}

// Initialize camera
async function initCamera() {
  try {
    showLoadingState();
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { width: 640, height: 480, facingMode: 'user' }
    });

    const video = document.getElementById('video');
    const placeholder = document.getElementById('camera-placeholder');
    const liveIndicator = document.getElementById('live-indicator');
    const scanLine = document.getElementById('scan-line');

    videoStream = stream;
    video.srcObject = stream;
    video.play();
    
    video.classList.remove('hidden');
    placeholder.classList.add('hidden');
    liveIndicator.classList.remove('hidden');
    scanLine.classList.remove('hidden');
  } catch (err) {
    console.error('Error accessing camera:', err);
    const statusElement = document.getElementById('camera-status');
    statusElement.textContent = 'Camera access denied. Please enable camera permissions.';
  }
}

// Toggle password visibility
function togglePassword() {
  const passwordInput = document.getElementById('password');
  const eyeOff = document.getElementById('eye-off');
  const eyeOn = document.getElementById('eye-on');

  passwordVisible = !passwordVisible;
  passwordInput.type = passwordVisible ? 'text' : 'password';
  eyeOff.classList.toggle('hidden');
  eyeOn.classList.toggle('hidden');
}

// Toggle between Sign In and Sign Up
function toggleAuthMode() {
  isSignUp = !isSignUp;
  const captureBtn = document.getElementById('capture-btn');
  const submitBtn = document.getElementById('submit-btn');
  const tooltip = document.getElementById('submit-tooltip');
  const authTitle = document.getElementById('auth-title');
  const authSubtitle = document.getElementById('auth-subtitle');
  const nameGroup = document.getElementById('name-group');
  const formOptions = document.getElementById('form-options');
  const toggleText = document.getElementById('toggle-text');
  const toggleBtn = document.getElementById('toggle-btn');

  if (isSignUp) {
    // Sign Up Mode
    authTitle.textContent = 'Create Account';
    authSubtitle.textContent = 'Sign up to get started';
    nameGroup.classList.remove('hidden');
    formOptions.classList.add('hidden');
    submitBtn.textContent = 'Sign Up';
    toggleText.textContent = 'Already have an account?';
    toggleBtn.textContent = 'Sign In';
    
    // Show capture button and disable submit button until face is captured
    captureBtn.classList.remove('hidden');
    captureBtn.innerHTML = `
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
      </svg>
      Capture Face
    `;
    captureBtn.style.background = '';
    captureBtn.style.color = '';
    submitBtn.disabled = true;
    isFaceCaptured = false;
    tooltip.textContent = 'Please capture your face first';
  } else {
    // Sign In Mode
    authTitle.textContent = 'Welcome Back';
    authSubtitle.textContent = 'Sign in to continue';
    nameGroup.classList.add('hidden');
    formOptions.classList.remove('hidden');
    submitBtn.textContent = 'Sign In';
    toggleText.textContent = "Don't have an account?";
    toggleBtn.textContent = 'Sign Up';
    
    // Hide capture button and enable submit button for sign in
    captureBtn.classList.add('hidden');
    submitBtn.disabled = false;
    isFaceCaptured = true; // Set to true to allow sign-in
    tooltip.textContent = 'Click to sign in';
  }
}

// Capture face from video
function captureFace() {
  const video = document.getElementById('video');
  const canvas = document.createElement('canvas');
  const submitBtn = document.getElementById('submit-btn');
  const captureBtn = document.getElementById('capture-btn');
  const tooltip = document.getElementById('submit-tooltip');
  
  // Set canvas dimensions to match video
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  
  // Draw current video frame to canvas
  const ctx = canvas.getContext('2d');
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  
  // Show success feedback
  captureBtn.innerHTML = `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
    </svg>
    Face Captured
  `;
  captureBtn.style.background = '#10B981';
  captureBtn.style.color = 'white';
  
  // Enable submit button
  isFaceCaptured = true;
  submitBtn.disabled = false;
  tooltip.textContent = 'Click to complete sign up';
  
  // In a real app, you would store or process the captured face data here
  // const faceData = canvas.toDataURL('image/jpeg');
  // console.log('Face captured:', faceData);
}

// Handle form submission
function handleSubmit(event) {
  event.preventDefault();
  
  // Only check for face capture during sign up
  if (isSignUp && !isFaceCaptured) {
    alert('Please capture your face before signing up');
    return;
  }
  
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const name = isSignUp ? document.getElementById('name').value : '';

  console.log({
    mode: isSignUp ? 'Sign Up' : 'Sign In',
    email,
    password,
    name,
    faceCaptured: isSignUp ? isFaceCaptured : 'N/A'
  });

  alert((isSignUp ? 'Sign up' : 'Sign in') + ' successful!');
}

// Handle Google Sign In
function handleGoogleSignIn() {
  console.log('Google Sign In clicked');
  alert('Google Sign In clicked!');
}

// Create floating particles
function createParticles() {
  const container = document.getElementById('particles');
  for (let i = 0; i < 20; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.top = Math.random() * 100 + '%';
    particle.style.animationDelay = Math.random() * 2 + 's';
    container.appendChild(particle);
  }
}

// Initialize the form in sign-in mode
function initializeForm() {
  const captureBtn = document.getElementById('capture-btn');
  const submitBtn = document.getElementById('submit-btn');
  const tooltip = document.getElementById('submit-tooltip');
  
  // Set initial state for sign-in
  isSignUp = false;
  isFaceCaptured = true;  // Set to true to allow sign-in
  captureBtn.classList.add('hidden');
  submitBtn.disabled = false;
  tooltip.textContent = 'Click to sign in';
  
  // Update UI elements
  document.getElementById('auth-title').textContent = 'Welcome Back';
  document.getElementById('auth-subtitle').textContent = 'Sign in to continue';
  document.getElementById('name-group').classList.add('hidden');
  document.getElementById('form-options').classList.remove('hidden');
  document.getElementById('submit-btn').textContent = 'Sign In';
  document.getElementById('toggle-text').textContent = "Don't have an account?";
  document.getElementById('toggle-btn').textContent = 'Sign Up';
}

// Initialize when the page loads
window.addEventListener('DOMContentLoaded', () => {
  initializeForm();
  initCamera();
  createParticles();
});

// ❄️ FrostByte Snow Easter Egg
document.addEventListener("DOMContentLoaded", () => {
  const logo = document.getElementById("frostbyte-logo");
  if (!logo) return;

  logo.addEventListener("click", () => {
    createSnowfall();
  });
});

function createSnowfall() {
  const snowCount = 40;

  for (let i = 0; i < snowCount; i++) {
    const snowflake = document.createElement("div");
    snowflake.className = "snowflake";
    snowflake.textContent = "❄";

    const size = Math.random() * 10 + 12;
    const left = Math.random() * window.innerWidth;
    const duration = Math.random() * 3 + 3;
    const drift = (Math.random() - 0.5) * 100;

    snowflake.style.left = `${left}px`;
    snowflake.style.fontSize = `${size}px`;
    snowflake.style.animationDuration = `${duration}s`;
    snowflake.style.setProperty("--drift", `${drift}px`);

    document.body.appendChild(snowflake);

    setTimeout(() => {
      snowflake.remove();
    }, duration * 1000);
  }
}