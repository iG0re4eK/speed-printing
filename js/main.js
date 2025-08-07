const keyboard = document.querySelector(".keyboard");
const textfiled = document.querySelector(".text-filed");
const restartBtn = document.getElementById("restart");
const toggleLanguage = document.querySelector(".toggle-language");
const toggleCircle = document.querySelector(".toggle-circle");
const levels = document.querySelectorAll(".level");
const quantityWords = document.querySelectorAll(".quantity");
const countWordInfo = document.querySelector(".count-word-info");
let buttonKey = document.querySelectorAll(".button-key");

let currentLanguage = "russian";
let arrayText = [];
let currentIndex = 0;
let gameOver = false;
let complexity = {
  easy: { min: 3, max: 5 },
  normal: { min: 5, max: 7 },
  hard: { min: 7, max: 9 },
};
let currentComplexity = complexity.easy;
let countWords = 10;
let currentCountWords = 0;

const keyboardLayout = {
  row1: [
    { key: ["`", "ё"], rect: "square" },
    { key: ["1", "!"], rect: "square" },
    { key: ["2", "@"], rect: "square" },
    { key: ["3", "#"], rect: "square" },
    { key: ["4", "$"], rect: "square" },
    { key: ["5", "%"], rect: "square" },
    { key: ["6", "^"], rect: "square" },
    { key: ["7", "&"], rect: "square" },
    { key: ["8", "*"], rect: "square" },
    { key: ["9", "("], rect: "square" },
    { key: ["0", ")"], rect: "square" },
    { key: ["-", "_"], rect: "square" },
    { key: ["=", "+"], rect: "square" },
    { key: ["Backspace", "Backspace"], rect: "rect" },
  ],
  row2: [
    { key: ["Tab", "Tab"], rect: "rect" },
    { key: ["q", "й"], rect: "square" },
    { key: ["w", "ц"], rect: "square" },
    { key: ["e", "у"], rect: "square" },
    { key: ["r", "к"], rect: "square" },
    { key: ["t", "е"], rect: "square" },
    { key: ["y", "н"], rect: "square" },
    { key: ["u", "г"], rect: "square" },
    { key: ["i", "ш"], rect: "square" },
    { key: ["o", "щ"], rect: "square" },
    { key: ["p", "з"], rect: "square" },
    { key: ["[", "х"], rect: "square" },
    { key: ["]", "ъ"], rect: "square" },
    { key: ["\\", "|"], rect: "square" },
  ],
  row3: [
    { key: ["CapsLock", "CapsLock"], rect: "rect" },
    { key: ["a", "ф"], rect: "square" },
    { key: ["s", "ы"], rect: "square" },
    { key: ["d", "в"], rect: "square" },
    { key: ["f", "а"], rect: "square" },
    { key: ["g", "п"], rect: "square" },
    { key: ["h", "р"], rect: "square" },
    { key: ["j", "о"], rect: "square" },
    { key: ["k", "л"], rect: "square" },
    { key: ["l", "д"], rect: "square" },
    { key: [";", "ж"], rect: "square" },
    { key: ["'", "э"], rect: "square" },
    { key: ["Enter", "Enter"], rect: "rect" },
  ],
  row4: [
    { key: ["Shift", "Shift"], rect: "rect" },
    { key: ["z", "я"], rect: "square" },
    { key: ["x", "ч"], rect: "square" },
    { key: ["c", "с"], rect: "square" },
    { key: ["v", "м"], rect: "square" },
    { key: ["b", "и"], rect: "square" },
    { key: ["n", "т"], rect: "square" },
    { key: ["m", "ь"], rect: "square" },
    { key: [",", "б"], rect: "square" },
    { key: [".", "ю"], rect: "square" },
    { key: ["/", "."], rect: "square" },
    { key: ["Shift", "Shift"], rect: "rect" },
  ],
  row5: [{ key: [" ", " "], rect: "rect" }],
};
const allKeys = [...Object.values(keyboardLayout)];

levels.forEach((level) => {
  level.addEventListener("click", () => {
    levels.forEach((lvl) => lvl.classList.add("not-choosed"));
    level.classList.remove("not-choosed");
    const levelName = level.textContent.trim().toLowerCase();
    currentComplexity = complexity[levelName];
    loadText();
  });
});

quantityWords.forEach((quantity) => {
  quantity.addEventListener("click", () => {
    quantityWords.forEach((qua) => qua.classList.add("not-choosed"));
    quantity.classList.remove("not-choosed");
    const quantityNum = Number(quantity.textContent.trim());
    countWords = quantityNum;
    const countWordValue = countWordInfo.querySelector(".count-word");
    countWordValue.textContent = countWords;
    loadText();
  });
});

restartBtn.addEventListener("click", () => {
  restartBtn.style.animation = "rotateBtn 0.4s ease 1";
  loadText();
  setTimeout(() => {
    restartBtn.style.animation = "none";
  }, 400);
});

toggleLanguage.addEventListener("click", () => {
  currentLanguage = currentLanguage === "russian" ? "english" : "russian";
  updateUI();
  toggleCircle.classList.toggle("left");
  toggleCircle.classList.toggle("right");
});

function loadKeyboard() {
  keyboard.innerHTML = "";
  allKeys.forEach((row, rowIndex) => {
    let rowHtml = "";
    row.forEach((btn) => {
      const charToShow =
        currentLanguage === "russian" ? btn.key[1] : btn.key[0];
      const keyClass = btn.key[0] === " " ? "space" : btn.rect;

      rowHtml += `
        <div class="button-key ${keyClass}" >${charToShow}</div>
      `;
    });
    keyboard.innerHTML += `
      <div class="row row-${rowIndex}">${rowHtml}</div>
    `;
  });
  buttonKey = document.querySelectorAll(".button-key");
}

function updateUI() {
  gameOver = false;
  loadKeyboard();
  loadText();
}

function getWordsByLength(words, minLen, maxLen) {
  return words.filter((word) => word.length >= minLen && word.length <= maxLen);
}

function loadText() {
  const currentCountWordValue = countWordInfo.querySelector(".current-word");
  currentCountWordValue.textContent = "0";
  gameOver = false;
  currentCountWords = 0;
  currentIndex = 0;
  arrayText = [];
  textfiled.innerHTML = ``;
  fetch(`../data/${currentLanguage}.txt`)
    .then((response) => response.text())
    .then((data) => {
      const words = data.toLowerCase().split(/\s+/);
      const filterWords = getWordsByLength(
        words,
        currentComplexity.min,
        currentComplexity.max
      );
      const n = countWords;

      for (let i = 0; i < n; i++) {
        const randomIndex = Math.floor(Math.random() * filterWords.length);
        arrayText.push(filterWords[randomIndex]);
        if (i < n - 1) arrayText.push(" ");
      }

      let html = "";
      let globalIndex = 0;

      arrayText.forEach((item) => {
        if (item === " ") {
          const isCurrent = globalIndex === 0;
          const classes = isCurrent ? "space current" : "space";
          html += `<div class="${classes}" data-index="${globalIndex}" data-type="space"> </div>`;
          globalIndex++;
        } else {
          let wordHtml = "";
          for (let i = 0; i < item.length; i++) {
            const isCurrent = globalIndex === 0;
            const classes = isCurrent ? "letter current" : "letter";
            wordHtml += `<div class="${classes} letter-${i}" data-index="${globalIndex}" data-type="letter">${item[i]}</div>`;
            globalIndex++;
          }
          html += `<div class="word" >${wordHtml}</div>`;
        }
      });

      textfiled.innerHTML = html;
      arrayText = arrayText.join("");
      console.log(arrayText);
    })
    .catch((error) => console.error("Ошибка:", error));
}

updateUI();

document.addEventListener("keydown", (e) => {
  if (
    e.key === "Shift" ||
    e.key === "Control" ||
    e.key === "Alt" ||
    e.key === "Meta" ||
    gameOver
  ) {
    return;
  }

  buttonKey.forEach((btn) => {
    if (btn.textContent === e.key) {
      btn.classList.add("press");
    }
  });

  const currentElement = document.querySelector(
    `[data-index="${currentIndex}"]`
  );
  if (!currentElement) return;

  const expectedChar = arrayText[currentIndex];

  if (e.key === expectedChar) {
    currentElement.classList.add("correct");
    currentElement.classList.remove("incorrect", "current");
    currentIndex++;

    if (e.key === " ") {
      currentCountWords++;
      const currentCountWordValue =
        countWordInfo.querySelector(".current-word");
      currentCountWordValue.textContent = currentCountWords;
    }

    moveCursor();
  } else {
    currentElement.classList.add("incorrect");
  }
});

function moveCursor() {
  document
    .querySelectorAll(".current")
    .forEach((el) => el.classList.remove("current"));

  if (currentIndex >= arrayText.length) {
    alert("Текст пройден!");
    gameOver = true;
    return;
  }

  const nextElement = document.querySelector(`[data-index="${currentIndex}"]`);
  if (nextElement) {
    nextElement.classList.add("current");

    nextElement.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }
}

document.addEventListener("keyup", (e) => {
  buttonKey.forEach((btn) => {
    btn.classList.remove("press");
  });
});
