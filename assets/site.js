const tracking = {
  fire(name, detail = {}) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: name, ...detail });
  }
};

function reportPhoneConversion(url) {
  if (typeof window.gtag !== "function") {
    if (url) window.location.href = url;
    return false;
  }

  let navigated = false;
  const continueToCall = () => {
    if (navigated) return;
    navigated = true;
    if (url) window.location.href = url;
  };

  window.setTimeout(continueToCall, 800);

  window.gtag("event", "conversion", {
    send_to: "AW-18239191836/9QmYCLq0lMAcEJz2j_lD",
    value: 50.0,
    currency: "USD",
    event_callback: continueToCall
  });

  return false;
}

function isPhoneLink(el) {
  return el instanceof HTMLAnchorElement && el.href.startsWith("tel:");
}

document.querySelectorAll("[data-track]").forEach((el) => {
  el.addEventListener("click", (event) => {
    tracking.fire(el.dataset.track, {
      site: "amanda-schrem-tuition",
      label: el.dataset.label || el.textContent.trim()
    });

    if (isPhoneLink(el)) {
      event.preventDefault();
      reportPhoneConversion(el.href);
    }
  });
});

document.querySelectorAll('a[href^="tel:"]:not([data-track])').forEach((el) => {
  el.addEventListener("click", (event) => {
    tracking.fire("phone_intent", {
      site: "amanda-schrem-tuition",
      label: el.textContent.trim() || "phone-link"
    });

    event.preventDefault();
    reportPhoneConversion(el.href);
  });
});

const menuButton = document.querySelector("[data-menu-button]");
const navLinks = document.querySelector("[data-nav-links]");
if (menuButton && navLinks) {
  menuButton.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    document.body.classList.toggle("menu-open", isOpen);
    menuButton.setAttribute("aria-expanded", String(isOpen));
  });
}

const chatToggle = document.querySelector("[data-chat-toggle]");
const chatPanel = document.querySelector("[data-chat-panel]");
if (chatToggle && chatPanel) {
  chatToggle.addEventListener("click", () => {
    const isOpen = chatPanel.classList.toggle("open");
    chatToggle.setAttribute("aria-expanded", String(isOpen));
    tracking.fire("chat_toggle", { site: "amanda-schrem-tuition", open: isOpen });
  });
}

const chatAnswer = document.querySelector("[data-chat-answer]");
document.querySelectorAll("[data-chat-reply]").forEach((button) => {
  button.addEventListener("click", () => {
    const key = button.dataset.chatReply;
    const answers = {
      qualifications: "Amanda is a qualified teacher with QTS, PGCE training, 10 GCSEs at A*, full DBS checking and classroom experience across primary, secondary, SEND and EAL support. Her tutoring is calm, thoughtful and confidence-first.",
      prices: "Current prices are £35 for an initial learning assessment, £39 per hour for primary English or maths, £41 per hour for KS2 SATs support, £43 per hour for KS3 catch-up, £44 per hour for GCSE maths or English support where suitable, £49 per hour for SEND-aware in-person support and £44 per hour for SEND-aware online support.",
      areas: "Amanda is best placed for Stockport, Cheadle, Cheadle Hulme, Bramhall, Hazel Grove, Sale, Altrincham, Manchester City Centre and selected South Manchester areas.",
      trial: "The best next step is to call, WhatsApp or text Amanda to discuss what is difficult, what school has tried, confidence, subject, year group and whether Amanda is the right match."
    };
    if (chatAnswer) chatAnswer.textContent = answers[key] || answers.trial;
    tracking.fire("chat_quick_reply", { site: "amanda-schrem-tuition", topic: key });
  });
});
