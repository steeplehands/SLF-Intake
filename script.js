/* =========================
   Singleton Intake Widget
   script.js (clean working)
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

let currentStep = 1;
let isSpanish = false;

// -------------------------
// DOM
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

const descriptionEl = document.getElementById("description");
const firstNameEl = document.getElementById("firstName");
const lastNameEl = document.getElementById("lastName");
const phoneEl = document.getElementById("phone");
const emailEl = document.getElementById("email");
const finalSubmitBtn = document.getElementById("finalSubmit");

// -------------------------
// i18n (EN / ES)
// -------------------------
const i18n = {
  en: {
    // Tooltip + language button label
    tooltip: "How can I help you?",
    langBtnLabel: "Español",

    // Step messages
    step1Msg: "Hi 👋 Welcome to Singleton Law Firm. What kind of matter can we assist you with?",
    step2Msg: "Could you briefly explain the situation for me?",
    step3Msg: "This will be quick—what's your full name?",
    step4Msg: "In case we get disconnected, can I have your phone number please?",
    step5Msg: "And what's the best email to reach you at?",

    // Buttons
    back: "← Back",
    continue: "Continue",
    submit: "Submit",
    submitting: "Submitting...",

    // Placeholders
    description_ph: "Describe what happened...",
    firstName_ph: "First Name",
    lastName_ph: "Last Name",
    phone_ph: "(555) 555-5555",
    email_ph: "your@email.com",

    // Options (step 1)
    optCar: "Car Accident",
    optMotorcycle: "Motorcycle Accident",
    optTruck: "Truck Accident",
    optWrongful: "Wrongful Death",
    optBus: "Bus Accident",
    optSlip: "Slip & Fall",
    optPersonalInjury: "Personal Injury (All kinds)",

    // Success
    successTitle: "Thank You!",
    successBody: "We've received your information. Someone from Singleton Law Firm will contact you shortly."
  },
  es: {
    tooltip: "¿Cómo puedo ayudarte?",
    langBtnLabel: "English",

    step1Msg: "Hola 👋 Bienvenido(a) a Singleton Law Firm. ¿En qué podemos ayudarte hoy?",
    step2Msg: "¿Podrías explicar brevemente la situación?",
    step3Msg: "Será rápido—¿cuál es tu nombre completo?",
    step4Msg: "Por si nos desconectamos, ¿me das tu número de teléfono?",
    step5Msg: "¿Y cuál es el mejor correo para contactarte?",

    back: "← Atrás",
    continue: "Continuar",
    submit: "Enviar",
    submitting: "Enviando...",

    description_ph: "Describe lo ocurrido...",
    firstName_ph: "Nombre",
    lastName_ph: "Apellido",
    phone_ph: "(555) 555-5555",
    email_ph: "tu@correo.com",

    optCar: "Accidente de auto",
    optMotorcycle: "Accidente de motocicleta",
    optTruck: "Accidente de camión",
    optWrongful: "Muerte por negligencia",
    optBus: "Accidente de autobús",
    optSlip: "Caída / resbalón",
    optPersonalInjury: "Lesiones personales (todo tipo)",

    successTitle: "¡Gracias!",
    successBody: "Hemos recibido tu información. Alguien de Singleton Law Firm se pondrá en contacto contigo en breve."
  }
};

function t(key) {
  return (isSpanish ? i18n.es[key] : i18n.en[key]) || "";
}

// -------------------------
// Language apply
// -------------------------
function applyLanguage() {
  // Tooltip text (don’t overwrite emoji)
  if (tooltip) {
    const textSpan = tooltip.querySelector(".tooltip-text");
    if (textSpan) textSpan.textContent = t("tooltip");
    else tooltip.textContent = t("tooltip");
  }

  // Language button label
  if (langBtn) langBtn.textContent = t("langBtnLabel");

  // Step messages
  const step1Msg = document.getElementById("step1Msg");
  const step2Msg = document.getElementById("step2Msg");
  const step3Msg = document.getElementById("step3Msg");
  const step4Msg = document.getElementById("step4Msg");
  const step5Msg = document.getElementById("step5Msg");

  if (step1Msg) step1Msg.textContent = t("step1Msg");
  if (step2Msg) step2Msg.textContent = t("step2Msg");
  if (step3Msg) step3Msg.textContent = t("step3Msg");
  if (step4Msg) step4Msg.textContent = t("step4Msg");
  if (step5Msg) step5Msg.textContent = t("step5Msg");

  // Back buttons
  const back2 = document.getElementById("back2");
  const back3 = document.getElementById("back3");
  const back4 = document.getElementById("back4");
  const back5 = document.getElementById("back5");

  if (back2) back2.textContent = t("back");
  if (back3) back3.textContent = t("back");
  if (back4) back4.textContent = t("back");
  if (back5) back5.textContent = t("back");

  // Continue buttons
  const continue2 = document.getElementById("continue2");
  const continue3 = document.getElementById("continue3");
  const continue4 = document.getElementById("continue4");

  if (continue2) continue2.textContent = t("continue");
  if (continue3) continue3.textContent = t("continue");
  if (continue4) continue4.textContent = t("continue");

  // Final submit button (show correct label depending on disabled state)
  if (finalSubmitBtn) {
    finalSubmitBtn.textContent = finalSubmitBtn.disabled ? t("submitting") : t("submit");
  }

  // Placeholders
  if (descriptionEl) descriptionEl.placeholder = t("description_ph");
  if (firstNameEl) firstNameEl.placeholder = t("firstName_ph");
  if (lastNameEl) lastNameEl.placeholder = t("lastName_ph");
  if (phoneEl) phoneEl.placeholder = t("phone_ph");
  if (emailEl) emailEl.placeholder = t("email_ph");

  // Step 1 option labels (preserve radio circle span)
  const optionIds = [
    "optCar",
    "optMotorcycle",
    "optTruck",
    "optWrongful",
    "optBus",
    "optSlip",
    "optPersonalInjury"
  ];

  optionIds.forEach((id) => {
    const btn = document.getElementById(id);
    if (!btn) return;

    const label = t(id);
    const circle = btn.querySelector(".radio-circle");
    if (circle) {
      btn.innerHTML = "";
      btn.appendChild(circle);
      btn.appendChild(document.createTextNode(label));
    } else {
      btn.textContent = label;
    }
  });

  // Success screen
  const successTitle = document.getElementById("successTitle");
  const successBody = document.getElementById("successBody");

  if (successTitle) successTitle.textContent = t("successTitle");
  if (successBody) successBody.textContent = t("successBody");
}

// -------------------------
// Helpers
// -------------------------
function showStep(step) {
  document.querySelectorAll(".step").forEach((s) => s.classList.remove("active"));
  const target = document.getElementById("step" + step);
  if (target) target.classList.add("active");
  currentStep = step;

  // keep language correct as user advances
  applyLanguage();
}

function goBack(step) {
  showStep(step);
}

function openWidget() {
  if (!widget) return;
  widget.classList.remove("is-hidden");

  if (launcher) launcher.style.display = "none";
  if (tooltip) tooltip.classList.add("is-hidden");

  // try to play video if allowed
  if (video && video.paused) video.play().catch(() => {});
}

function closeWidget() {
  if (!widget) return;
  widget.classList.add("is-hidden");

  if (launcher) launcher.style.display = "grid";
  if (tooltip) tooltip.classList.remove("is-hidden");
}

function resetForm() {
  currentStep = 1;
  Object.keys(formData).forEach((k) => (formData[k] = ""));

  if (descriptionEl) descriptionEl.value = "";
  if (firstNameEl) firstNameEl.value = "";
  if (lastNameEl) lastNameEl.value = "";
  if (phoneEl) phoneEl.value = "";
  if (emailEl) emailEl.value = "";

  if (finalSubmitBtn) {
    finalSubmitBtn.disabled = false;
    finalSubmitBtn.textContent = t("submit");
  }

  showStep(1);
}

// Convert "(702) 555-1234" -> "+17025551234"
function toE164US(input) {
  const digits = (input || "").replace(/\D/g, "");
  if (!digits) return "";
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  return `+${digits}`;
}

// -------------------------
// Form flow handlers (used by inline onclick)
// -------------------------
function selectCaseType(type) {
  formData.caseType = type;
  showStep(2);
}

function submitDescription() {
  formData.description = (descriptionEl ? descriptionEl.value : "").trim();
  if (formData.description) showStep(3);
}

function submitName() {
  formData.firstName = (firstNameEl ? firstNameEl.value : "").trim();
  formData.lastName = (lastNameEl ? lastNameEl.value : "").trim();
  if (formData.firstName && formData.lastName) showStep(4);
}

function submitPhone() {
  formData.phone = (phoneEl ? phoneEl.value : "").trim();
  if (formData.phone) showStep(5);
}

function submitForm() {
  formData.email = (emailEl ? emailEl.value : "").trim();
  if (!formData.email) return;

  const webhookUrl =
    "https://services.leadconnectorhq.com/hooks/auZVaoSosuyK3y7NwfVh/webhook-trigger/6b388f33-dc4d-40e0-90cc-af48f58b8562";

  if (finalSubmitBtn) {
    finalSubmitBtn.disabled = true;
    finalSubmitBtn.textContent = t("submitting");
  }

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
    .then(() => showStep(6))
    .catch((err) => {
      console.error("Webhook error:", err);
      showStep(6);
    });
}

// expose for inline onclick=""
window.selectCaseType = selectCaseType;
window.submitDescription = submitDescription;
window.submitName = submitName;
window.submitPhone = submitPhone;
window.submitForm = submitForm;
window.goBack = goBack;

// -------------------------
// Event bindings
// -------------------------

// Ensure widget starts hidden and tooltip shows
if (widget) widget.classList.add("is-hidden");
if (tooltip) tooltip.classList.remove("is-hidden");

// Apply initial language (default English)
applyLanguage();

if (launcher) launcher.addEventListener("click", openWidget);
if (tooltip) tooltip.addEventListener("click", openWidget);
if (closeBtn) closeBtn.addEventListener("click", closeWidget);

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && widget && !widget.classList.contains("is-hidden")) closeWidget();
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

// Refresh (reset flow + restart video loop)
// Refresh (reset flow + restart video loop) — NO black flash
if (video && refreshBtn) {
  refreshBtn.addEventListener("click", () => {
    resetForm();

    const wasPaused = video.paused;

    // rewind without reloading (prevents black flash)
    video.currentTime = 0;

    // if it was playing, keep it playing
    if (!wasPaused) {
      video.play().catch(() => {});
    }
  });
}


// Language toggle
if (langBtn) {
  langBtn.addEventListener("click", () => {
    isSpanish = !isSpanish;
    applyLanguage();
  });
}

// Phone formatting (UI-only)
if (phoneEl) {
  phoneEl.addEventListener("input", (e) => {
    let v = e.target.value.replace(/\D/g, "").slice(0, 10);
    if (v.length >= 6) v = "(" + v.slice(0, 3) + ") " + v.slice(3, 6) + "-" + v.slice(6);
    else if (v.length >= 3) v = "(" + v.slice(0, 3) + ") " + v.slice(3);
    e.target.value = v;
  });
}
