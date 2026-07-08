/* =========================
   DOM ELEMENTS
========================= */

const video = document.getElementById("bgVideo");
const button = document.getElementById("spinButton");
const output = document.getElementById("output");

const resetButton = document.getElementById("resetButton");
const tierButton = document.getElementById("tierButton");
const tierMenu = document.getElementById("tierMenu");
const startingTier = tierButton.dataset.value;

const mrPeeksImage = document.getElementById("mrPeeksImage");
const mrPeeksNoseZone = document.getElementById("mrPeeksNoseZone");

const themeToggleButton = document.getElementById("themeToggleButton");
const contactButton = document.getElementById("creditsContactButton");

const creditsButton = document.getElementById("creditsButton");
const creditsModal = document.getElementById("creditsModal");

const configureButton = document.getElementById("configureButton");
const configureModal = document.getElementById("configureModal");
const configureBox = document.getElementById("configureBox");
const saveConfigButton = document.getElementById("saveConfigButton");
const deselectRelicsButton = document.getElementById("deselectRelicsButton");
const resetConfigButton = document.getElementById("resetConfigButton");


/* =========================
   AUDIO
========================= */

const boxLaugh = new Audio("./sounds/BoxLaugh.mp3");
const mysteryBoxJingle = new Audio("./sounds/mystery-box-jingle-full.mp3");
const honkSound = new Audio("./sounds/Honk.mp3");


/* =========================
   APP STATE
========================= */

let state = "idle";


/* =========================
   VIDEO SETUP
========================= */

video.load();
video.pause();
video.currentTime = 0;

video.addEventListener("contextmenu", (e) => {
  e.preventDefault();
});


/* =========================
   THEME TOGGLE
========================= */

themeToggleButton.addEventListener("click", () => {
  document.body.classList.toggle("light-mode");

  themeToggleButton.innerText = document.body.classList.contains("light-mode")
    ? "DARK MODE"
    : "LIGHT MODE";
});


/* =========================
   CONTACT BUTTON
========================= */

contactButton.addEventListener("click", (e) => {
  e.preventDefault();

  const gmailUrl =
    "https://mail.google.com/mail/?view=cm&fs=1" +
    "&to=dopefishlivesagain@gmail.com" +
    "&su=" + encodeURIComponent("Cursed Relic Randomizer");

  const gmailWindow = window.open(gmailUrl, "_blank");

  if (!gmailWindow || gmailWindow.closed || typeof gmailWindow.closed === "undefined") {
    window.location.href =
      "mailto:dopefishlivesagain@gmail.com?subject=" +
      encodeURIComponent("Cursed Relic Randomizer");
  }
});


/* =========================
   MR. PEEKS NOSE HONK
========================= */

mrPeeksNoseZone.addEventListener("click", () => {
  honkSound.currentTime = 0;
  honkSound.play();
});


/* =========================
   SPIN BUTTON
========================= */

button.addEventListener("click", () => {
  if (state !== "idle") return;

  state = "spinning";

  mrPeeksImage.style.display = "none";
  mrPeeksNoseZone.style.display = "none";
  mrPeeksNoseZone.style.pointerEvents = "none";

  boxLaugh.pause();
  boxLaugh.currentTime = 0;

  honkSound.pause();
  honkSound.currentTime = 0;

  output.innerHTML = "";

  video.pause();
  video.currentTime = 0;

  mysteryBoxJingle.currentTime = 0;
  mysteryBoxJingle.play().catch(() => {});

  video.play().catch(() => {
    state = "idle";
  });
});


/* =========================
   VIDEO END RESULT HANDLER
========================= */

video.addEventListener("ended", () => {
  video.pause();

  const result = generateRelics();

  if (result === null) {
    output.innerText = "";

    mrPeeksImage.style.display = "block";
    mrPeeksNoseZone.style.display = "block";
    mrPeeksNoseZone.style.pointerEvents = "auto";

    boxLaugh.currentTime = 0;
    boxLaugh.play();
  } else {
    mrPeeksImage.style.display = "none";
    mrPeeksNoseZone.style.display = "none";
    mrPeeksNoseZone.style.pointerEvents = "none";
    output.innerHTML = result;
  }

  state = "idle";
});


/* =========================
   RESET BUTTON
========================= */

resetButton.addEventListener("click", () => {
  state = "idle";

  video.pause();
  video.currentTime = 0;

  mysteryBoxJingle.pause();
  mysteryBoxJingle.currentTime = 0;

  boxLaugh.pause();
  boxLaugh.currentTime = 0;

  honkSound.pause();
  honkSound.currentTime = 0;

  mrPeeksImage.style.display = "none";
  mrPeeksNoseZone.style.display = "none";
  mrPeeksNoseZone.style.pointerEvents = "none";

  tierButton.dataset.value = startingTier;
  tierButton.innerText = "Tier 1";
  tierMenu.classList.add("hidden");

  output.innerHTML = "";
});


/* =========================
   CREDITS MODAL
========================= */

creditsButton.addEventListener("click", () => {
  creditsModal.classList.remove("hidden");
});

function closeCredits() {
  creditsModal.classList.add("hidden");
}

creditsModal.addEventListener("click", (e) => {
  if (e.target === creditsModal) {
    closeCredits();
  }
});


/* =========================
   CONFIGURE MODAL
========================= */

configureButton.addEventListener("click", (e) => {
  e.stopPropagation();

  configureBox.classList.remove("shake");
  saveConfigButton.classList.remove("save-glow");

  configureModal.classList.remove("hidden");
});

function closeConfigure() {
  configureModal.classList.add("hidden");
}

saveConfigButton.addEventListener("click", closeConfigure);

configureModal.addEventListener("click", (e) => {
  if (e.target !== configureModal) return;

  configureBox.classList.remove("shake");
  saveConfigButton.classList.remove("save-glow");

  void configureBox.offsetWidth;
  void saveConfigButton.offsetWidth;

  configureBox.classList.add("shake");
  saveConfigButton.classList.add("save-glow");
});


/* =========================
   CONFIGURE BUTTONS
========================= */

deselectRelicsButton.addEventListener("click", () => {
  configureModal.querySelectorAll(".relic-checkbox").forEach((box) => {
    box.checked = false;
  });
});

resetConfigButton.addEventListener("click", () => {
  configureModal.querySelectorAll("input[type='checkbox']").forEach((box) => {
    box.checked = true;
  });
});


/* =========================
   TIER DROPDOWN
========================= */

document.addEventListener("click", (e) => {
  if (!e.target.closest("#tierDropdown")) {
    tierMenu.classList.add("hidden");
  }
});

tierButton.addEventListener("click", (e) => {
  e.stopPropagation();
  tierMenu.classList.toggle("hidden");
});

document.querySelectorAll(".tier-option").forEach((option) => {
  option.addEventListener("click", () => {
    option.classList.remove("selected-flash");
    void option.offsetWidth;
    option.classList.add("selected-flash");

    tierButton.dataset.value = option.dataset.value;
    tierButton.innerText = option.querySelector("span").innerText;

    setTimeout(() => {
      tierMenu.classList.add("hidden");
    }, 120);
  });
});


/* =========================
   RELIC DATA
========================= */

const relicData = {
  grim: [
    "Lawyer's Pen",
    "Dragon Wings",
    "Teddy Bear",
    "Gong",
    "Seed",
    "Rocket",
    "Power Switch",
    "Wrestler's Belt",
    "Gramophone",
    "Druid Stone"
  ],

  sinister: [
    "Vrill Sphere",
    "Sam's Drawing",
    "Focusing Stone",
    "Fang",
    "Matryoshka Dolls",
    "Summoning Key",
    "Stuffed Elephant",
    "Dancing Arnie",
    "Valkyrie Helmet",
    "Film Reel"
  ],

  wicked: [
    "Bus",
    "Dragon Head",
    "Blood Vials",
    "Golden Spork",
    "Civil Protector",
    "Mangler Helmet",
    "Agarthan Device",
    "Music Box",
    "Dragon Egg",
    "Mannequin Turret"
  ]
};

const relicValues = {
  grim: 1,
  sinister: 2,
  wicked: 3
};


/* =========================
   ENABLED MAP / RELIC READERS
========================= */

function getEnabledRelics() {
  const enabled = [];

  document.querySelectorAll(".relic-checkbox:checked").forEach((box) => {
    const name = box.parentElement.textContent.trim();

    for (const category in relicData) {
      if (relicData[category].includes(name)) {
        enabled.push({
          name,
          category,
          value: relicValues[category]
        });
      }
    }
  });

  return enabled;
}

function getEnabledMaps() {
  return Array.from(document.querySelectorAll(".map-checkbox:checked")).map((box) => {
    return box.parentElement.textContent.trim();
  });
}

function getRandomMap() {
  const maps = getEnabledMaps();

  if (maps.length === 0) {
    return null;
  }

  return maps[Math.floor(Math.random() * maps.length)];
}


/* =========================
   TIER VALUE LOGIC
========================= */

function getTargetValue() {
  if (tierButton.dataset.value === "tier1") return 3;
  if (tierButton.dataset.value === "tier2") return 6;
  if (tierButton.dataset.value === "tier3") return 9;
  if (tierButton.dataset.value === "tier3hard") return 9;

  return 3;
}


/* =========================
   RANDOMIZATION HELPERS
========================= */

function shuffleArray(array) {
  const shuffled = [...array];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
}

function findRandomCombination(relics, target) {
  const allCombinations = [];
  const maxCombinations = 500;
  const shuffledRelics = shuffleArray(relics);

  function backtrack(startIndex, total, currentCombo) {
    if (allCombinations.length >= maxCombinations) return;

    if (total === target) {
      allCombinations.push([...currentCombo]);
      return;
    }

    if (total > target) return;

    for (let i = startIndex; i < shuffledRelics.length; i++) {
      currentCombo.push(shuffledRelics[i]);
      backtrack(i + 1, total + shuffledRelics[i].value, currentCombo);
      currentCombo.pop();
    }
  }

  backtrack(0, 0, []);

  if (allCombinations.length === 0) {
    return null;
  }

  return allCombinations[Math.floor(Math.random() * allCombinations.length)];
}

function sortRelicsByOriginalOrder(relics) {
  const order = [
    ...relicData.grim,
    ...relicData.sinister,
    ...relicData.wicked
  ];

  relics.sort((a, b) => {
    return order.indexOf(a.name) - order.indexOf(b.name);
  });

  return relics;
}


/* =========================
   TIER 3 HARD LOGIC
========================= */

function findTier3HardCombination(relics) {
  const possibleTargets = [];

  for (let total = 10; total <= 60; total++) {
    possibleTargets.push(total);
  }

  const shuffledTargets = shuffleArray(possibleTargets);

  for (const target of shuffledTargets) {
    const result = findRandomCombination(relics, target);

    if (result) {
      return result;
    }
  }

  return null;
}


/* =========================
   FINAL RESULT GENERATOR
========================= */

function generateRelics() {
  const relics = getEnabledRelics();

  if (relics.length === 0) {
    return null;
  }

  let result;

  if (tierButton.dataset.value === "tier3hard") {
    result = findTier3HardCombination(relics);
  } else {
    const target = getTargetValue();
    result = findRandomCombination(relics, target);
  }

  if (!result) {
    return null;
  }

  result = sortRelicsByOriginalOrder(result);

  const selectedMap = getRandomMap();

  let html = "";

  if (selectedMap !== null) {
  html += `
    <div class="map-output">
      <div class="output-heading">Map:</div>
      <div class="map-name">${selectedMap}</div>
    </div>
  `;
  } else {
   html += `
     <div class="map-output map-placeholder"></div>
   `;
  }

  html += `<div class="output-heading">Relics:</div>`;

  for (let i = 0; i < result.length; i += 3) {
    html += '<div class="relic-row">';

    result.slice(i, i + 3).forEach((relic) => {
      html += `<div class="relic-item">${relic.name}</div>`;
    });

    html += "</div>";
  }

  return html;
}
