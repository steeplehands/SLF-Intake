/* =========================
   Singleton Intake Widget
   Chat-Style Version
   ========================= */

// -------------------------
// State
// -------------------------
const formData = {
  caseType: "",
  description: "",
  firstName: "",
  lastName: "",
  phone: "",
  email: ""
};

let currentStep = 0;
let isSpanish = false;

// -------------------------
// DOM Elements
// -------------------------
const video = document.getElementById("bgVideo");
const playPauseBtn = document.getElementById("playPauseBtn");
const playIcon = document.getElementById("playIcon");
const pauseIcon = document.getElementById("pauseIcon");
const muteBtn = document.getElementById("muteBtn");
const mutedIcon = document.getElementById("mutedIcon");
const unmutedIcon = document.getElementById("unmutedIcon");
const muteIndicator = document.getElementById("muteIndicator");
const refreshBtn = document.getElementById("refreshBtn");
const langBtn = document.getElementById("langBtn");
const launcher = document.getElementById("intakeLauncher");
const tooltip = document.getElementById("intakeTooltip");
const widget = document.getElementById("intakeWidget");
const closeBtn = document.getElementById("intakeClose");
const chatConversation = document.getElementById("chatConversation");
const chatInputArea = document.getElementById("chatInputArea");

// -------------------------
// i18n (EN / ES)
// -------------------------
const i18n = {
  en: {
    tooltip: "How can I help you?",
    langBtnLabel: "Español",

    greeting: "Hi 👋 Welcome to Singleton Law Firm. What kind of matter can we assist you with?",
    askDescription: "Could you briefly explain the situation for me?",
    askName: "This will be quick—what's your full name?",
    askPhone: "In case we get disconnected, can I have your phone number please?",
    askEmail: "And what's the best email to reach you at?",

    descriptionPlaceholder: "Describe what happened...",
    firstNamePlaceholder: "First Name",
    lastNamePlaceholder: "Last Name",
    phonePlaceholder: "(555) 555-5555",
    emailPlaceholder: "your@email.com",

    caseTypes: [
      "Car Accident",
      "Motorcycle Accident",
      "Truck Accident",
      "Wrongful Death",
      "Bus Accident",
      "Slip & Fall",
      "Personal Injury",
      "Other"
    ],

    successTitle: "Thank You!",
    successBody: "We've received your information. Someone from Singleton Law Firm will contact you shortly.",

    send: "Send"
  },
  es: {
    tooltip: "¿Cómo puedo ayudarte?",
    langBtnLabel: "English",

    greeting: "Hola 👋 Bienvenido(a) a Singleton Law Firm. ¿En qué podemos ayudarte hoy?",
    askDescription: "¿Podrías explicar brevemente la situación?",
    askName: "Será rápido—¿cuál es tu nombre completo?",
    askPhone: "Por si nos desconectamos, ¿me das tu número de teléfono?",
    askEmail: "¿Y cuál es el mejor correo para contactarte?",

    descriptionPlaceholder: "Describe lo ocurrido...",
    firstNamePlaceholder: "Nombre",
    lastNamePlaceholder: "Apellido",
    phonePlaceholder: "(555) 555-5555",
    emailPlaceholder: "tu@correo.com",

    caseTypes: [
      "Accidente de auto",
      "Accidente de motocicleta",
      "Accidente de camión",
      "Muerte por negligencia",
      "Accidente de autobús",
      "Caída / resbalón",
      "Lesiones personales",
      "Otro"
    ],

    successTitle: "¡Gracias!",
    successBody: "Hemos recibido tu información. Alguien de Singleton Law Firm se pondrá en contacto contigo en breve.",

    send: "Enviar"
  }
};

// Case type mapping (for webhook - always send English)
const caseTypeMap = {
  "Car Accident": "Car Accident",
  "Motorcycle Accident": "Motorcycle Accident",
  "Truck Accident": "Truck Accident",
  "Wrongful Death": "Wrongful Death",
  "Bus Accident": "Bus Accident",
  "Slip & Fall": "Slip & Fall",
  "Personal Injury": "Personal Injury (All kinds)",
  "Other": "Other",
  "Accidente de auto": "Car Accident",
  "Accidente de motocicleta": "Motorcycle Accident",
  "Accidente de camión": "Truck Accident",
  "Muerte por negligencia": "Wrongful Death",
  "Accidente de autobús": "Bus Accident",
  "Caída / resbalón": "Slip & Fall",
  "Lesiones personales": "Personal Injury (All kinds)",
  "Otro": "Other"
};

function t(key) {
  return (isSpanish ? i18n.es[key] : i18n.en[key]) || "";
}

// -------------------------
// Chat Functions
// -------------------------
function scrollToBottom(extra = 0) {
  if (chatConversation) {
    setTimeout(() => {
      chatConversation.scrollTop = chatConversation.scrollHeight + extra;
    }, 50);
  }
}

function addBotMessage(text) {
  const bubble = document.createElement("div");
  bubble.className = "chat-bubble bot";
  bubble.textContent = text;
  chatConversation.appendChild(bubble);
  scrollToBottom();
}

function showSuccessMessage() {
  // Clear conversation and input area
  chatConversation.innerHTML = "";
  chatInputArea.innerHTML = "";

  // Create success message in input area (positioned at bottom)
  chatInputArea.innerHTML = `
    <div class="success-msg">
      <div class="success-icon">✓</div>
      <div class="success-title">${t("successTitle")}</div>
      <div class="success-body">${t("successBody")}</div>
    </div>
  `;
}

function addUserMessage(text) {
  const bubble = document.createElement("div");
  bubble.className = "chat-bubble user";
  bubble.textContent = text;
  chatConversation.appendChild(bubble);
  scrollToBottom();
}

function showTypingIndicator() {
  const typing = document.createElement("div");
  typing.className = "chat-bubble bot typing-bubble";
  typing.innerHTML = `
    <div class="typing-indicator">
      <span></span><span></span><span></span>
    </div>
  `;
  typing.id = "typingIndicator";
  chatConversation.appendChild(typing);
  scrollToBottom();
}

function removeTypingIndicator() {
  const typing = document.getElementById("typingIndicator");
  if (typing) typing.remove();
}

function addBotMessageWithDelay(text, delay = 800) {
  showTypingIndicator();
  setTimeout(() => {
    removeTypingIndicator();
    addBotMessage(text);
  }, delay);
}

// -------------------------
// Input Area Rendering
// -------------------------
function renderCaseTypeOptions() {
  const caseTypes = t("caseTypes");
  chatInputArea.innerHTML = `
    <div class="chat-options">
      ${caseTypes.map(type => `
        <button class="chat-option-btn" type="button" data-case="${type}">${type}</button>
      `).join("")}
    </div>
  `;

  // Add click handlers
  chatInputArea.querySelectorAll(".chat-option-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const caseType = btn.dataset.case;
      formData.caseType = caseTypeMap[caseType] || caseType;
      addUserMessage(caseType);
      currentStep = 1;
      proceedToNextStep();
    });
  });
}

function renderTextInput(placeholder, inputType = "text", isTextarea = false) {
  const inputElement = isTextarea
    ? `<textarea class="chat-input" id="chatInput" placeholder="${placeholder}" rows="2"></textarea>`
    : `<input type="${inputType}" class="chat-input" id="chatInput" placeholder="${placeholder}">`;

  chatInputArea.innerHTML = `
    <div class="chat-input-row">
      ${inputElement}
      <button class="chat-send-btn" type="button" id="sendBtn">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
        </svg>
      </button>
    </div>
  `;

  const input = document.getElementById("chatInput");
  const sendBtn = document.getElementById("sendBtn");

  // Phone formatting
  if (inputType === "tel") {
    input.addEventListener("input", (e) => {
      let v = e.target.value.replace(/\D/g, "").slice(0, 10);
      if (v.length >= 6) v = "(" + v.slice(0, 3) + ") " + v.slice(3, 6) + "-" + v.slice(6);
      else if (v.length >= 3) v = "(" + v.slice(0, 3) + ") " + v.slice(3);
      e.target.value = v;
    });
  }

  // Enter key submission
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleInputSubmit();
    }
  });

  sendBtn.addEventListener("click", handleInputSubmit);
  input.focus();
}

function renderNameInputs() {
  chatInputArea.innerHTML = `
    <div class="chat-multi-input">
      <div class="chat-input-row">
        <input type="text" class="chat-input" id="firstNameInput" placeholder="${t("firstNamePlaceholder")}">
        <div class="send-btn-spacer"></div>
      </div>
      <div class="chat-input-row">
        <input type="text" class="chat-input" id="lastNameInput" placeholder="${t("lastNamePlaceholder")}">
        <button class="chat-send-btn" type="button" id="sendBtn">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
          </svg>
        </button>
      </div>
    </div>
  `;

  const firstNameInput = document.getElementById("firstNameInput");
  const lastNameInput = document.getElementById("lastNameInput");
  const sendBtn = document.getElementById("sendBtn");

  // Enter key navigation
  firstNameInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      lastNameInput.focus();
    }
  });

  lastNameInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleNameSubmit();
    }
  });

  sendBtn.addEventListener("click", handleNameSubmit);
  firstNameInput.focus();
}

function clearInputArea() {
  chatInputArea.innerHTML = "";
}

// -------------------------
// Step Handlers
// -------------------------
function handleInputSubmit() {
  const input = document.getElementById("chatInput");
  if (!input) return;

  const value = input.value.trim();
  if (!value) return;

  switch (currentStep) {
    case 1: // Description
      formData.description = value;
      addUserMessage(value);
      currentStep = 2;
      proceedToNextStep();
      break;
    case 3: // Phone
      formData.phone = value;
      addUserMessage(value);
      currentStep = 4;
      proceedToNextStep();
      break;
    case 4: // Email
      formData.email = value;
      addUserMessage(value);
      currentStep = 5;
      submitForm();
      break;
  }
}

function handleNameSubmit() {
  const firstNameInput = document.getElementById("firstNameInput");
  const lastNameInput = document.getElementById("lastNameInput");

  if (!firstNameInput || !lastNameInput) return;

  const firstName = firstNameInput.value.trim();
  const lastName = lastNameInput.value.trim();

  if (!firstName || !lastName) return;

  formData.firstName = firstName;
  formData.lastName = lastName;
  addUserMessage(`${firstName} ${lastName}`);
  currentStep = 3;
  proceedToNextStep();
}

function proceedToNextStep() {
  clearInputArea();

  switch (currentStep) {
    case 1: // Ask for description
      addBotMessageWithDelay(t("askDescription"), 600);
      setTimeout(() => {
        renderTextInput(t("descriptionPlaceholder"), "text", true);
      }, 700);
      break;

    case 2: // Ask for name
      addBotMessageWithDelay(t("askName"), 600);
      setTimeout(() => {
        renderNameInputs();
      }, 700);
      break;

    case 3: // Ask for phone
      addBotMessageWithDelay(t("askPhone"), 600);
      setTimeout(() => {
        renderTextInput(t("phonePlaceholder"), "tel");
      }, 700);
      break;

    case 4: // Ask for email
      addBotMessageWithDelay(t("askEmail"), 600);
      setTimeout(() => {
        renderTextInput(t("emailPlaceholder"), "email");
      }, 700);
      break;
  }
}

// -------------------------
// Form Submission
// -------------------------
function toE164US(input) {
  const digits = (input || "").replace(/\D/g, "");
  if (!digits) return "";
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  return `+${digits}`;
}

function submitForm() {
  clearInputArea();

  const webhookUrl = "https://services.leadconnectorhq.com/hooks/auZVaoSosuyK3y7NwfVh/webhook-trigger/6b388f33-dc4d-40e0-90cc-af48f58b8562";

  const payload = {
    firstName: formData.firstName,
    lastName: formData.lastName,
    email: formData.email,
    phone: toE164US(formData.phone),
    caseType: formData.caseType,
    description: formData.description,
    source: "Website Intake Form"
  };

  fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  })
    .then(() => {
      setTimeout(() => showSuccessMessage(), 500);
    })
    .catch((err) => {
      console.error("Webhook error:", err);
      setTimeout(() => showSuccessMessage(), 500);
    });
}

// -------------------------
// Widget Control
// -------------------------
function openWidget() {
  if (!widget) return;
  widget.classList.remove("is-hidden");

  if (launcher) launcher.style.display = "none";
  if (tooltip) tooltip.classList.add("is-hidden");

  if (video && video.paused) video.play().catch(() => {});

  // Start conversation if empty
  if (chatConversation && chatConversation.children.length === 0) {
    startConversation();
  }
}

function closeWidget() {
  if (!widget) return;
  widget.classList.add("is-hidden");

  if (launcher) launcher.style.display = "grid";
  if (tooltip) tooltip.classList.remove("is-hidden");
}

function startConversation() {
  currentStep = 0;
  chatConversation.innerHTML = "";

  // Initial greeting
  addBotMessage(t("greeting"));
  renderCaseTypeOptions();
}

function resetForm() {
  currentStep = 0;
  Object.keys(formData).forEach(k => formData[k] = "");

  if (chatConversation) chatConversation.innerHTML = "";
  if (chatInputArea) chatInputArea.innerHTML = "";

  startConversation();
}

// -------------------------
// Language Toggle
// -------------------------
function applyLanguage() {
  // Update tooltip
  if (tooltip) {
    const textSpan = tooltip.querySelector(".tooltip-text");
    if (textSpan) textSpan.textContent = t("tooltip");
  }

  // Update language button
  if (langBtn) langBtn.textContent = t("langBtnLabel");
}

// -------------------------
// Event Bindings
// -------------------------

// Ensure widget starts hidden
if (widget) widget.classList.add("is-hidden");
if (tooltip) tooltip.classList.remove("is-hidden");

// Apply initial language
applyLanguage();

// Launcher/tooltip click
if (launcher) launcher.addEventListener("click", openWidget);
if (tooltip) tooltip.addEventListener("click", openWidget);
if (closeBtn) closeBtn.addEventListener("click", closeWidget);

// Escape key to close
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && widget && !widget.classList.contains("is-hidden")) {
    closeWidget();
  }
});

// Play/Pause
if (playPauseBtn && video && playIcon && pauseIcon) {
  playPauseBtn.addEventListener("click", () => {
    if (video.paused) {
      video.play().catch(() => {});
      playIcon.style.display = "none";
      pauseIcon.style.display = "block";
    } else {
      video.pause();
      playIcon.style.display = "block";
      pauseIcon.style.display = "none";
    }
  });
}

// Mute/Unmute
if (muteBtn && video && mutedIcon && unmutedIcon) {
  muteBtn.addEventListener("click", () => {
    video.muted = !video.muted;

    mutedIcon.style.display = video.muted ? "block" : "none";
    unmutedIcon.style.display = video.muted ? "none" : "block";

    if (muteIndicator) {
      muteIndicator.classList.add("show");
      setTimeout(() => muteIndicator.classList.remove("show"), 800);
    }
  });
}

// Refresh (reset conversation)
if (refreshBtn) {
  refreshBtn.addEventListener("click", () => {
    resetForm();

    if (video) {
      const wasPaused = video.paused;
      video.currentTime = 0;
      if (!wasPaused) video.play().catch(() => {});
    }
  });
}

// Language toggle
if (langBtn) {
  langBtn.addEventListener("click", () => {
    isSpanish = !isSpanish;
    applyLanguage();

    // Restart conversation in new language if widget is open
    if (widget && !widget.classList.contains("is-hidden")) {
      resetForm();
    }
  });
}
