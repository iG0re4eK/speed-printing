const keyboard = document.querySelector(".keyboard");
const textfiled = document.querySelector(".text-filed");
const restartBtn = document.getElementById("restart");
const toggleLanguage = document.getElementById("languageToggle");
const toggleTimer = document.getElementById("timerToggle");
const settings = document.getElementById("settings");
const levelMode = document.getElementById("levelMode");
optionLevels = ["easy", "normal", "hard"];
const quantityWords = document.getElementById("quantityWords");
const optionsWords = [10, 25, 50, 100];
const quantitySeconds = document.getElementById("quantitySeconds");
const optionsSeconds = [10, 30, 60, 120];
const countWordInfo = document.querySelector(".count-word-info");
const timer = document.querySelector(".timer");
let buttonKey = document.querySelectorAll(".button-key");
const quantityMode = document.querySelector(".quantity-mode");

toggleLanguage.checked = true;
toggleTimer.checked = true;
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
let countSeconds = 10;
let currentCountWords = 0;
let isTimerOn = toggleTimer.checked;

let timerInterval;
let startTime;
let isTimerRunning = false;

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

restartBtn.addEventListener("click", function () {
  this.blur();
});

function createRadioButtons(container, options, name, defaultValue) {
  options.forEach((value) => {
    const id = `${name}-${value}`;

    const radio = document.createElement("input");
    radio.type = "radio";
    radio.id = id;
    radio.name = name;
    radio.value = value;
    if (value === defaultValue) radio.checked = true;

    const label = document.createElement("label");
    label.htmlFor = id;
    label.className = "choose";
    label.textContent = value;

    container.append(radio, label);
  });
}

createRadioButtons(quantityWords, optionsWords, "wordCount", 10);
createRadioButtons(quantitySeconds, optionsSeconds, "secondsCount", 10);
createRadioButtons(levelMode, optionLevels, "levels", "easy");

quantityWords.addEventListener("change", (e) => {
  console.log("gggg");

  if (!toggleTimer.checked) {
    const selectedValue = e.target.value;
    const countWord = countWordInfo.querySelector(".count-word");
    countWord.textContent = `/${selectedValue}`;
    countWords = selectedValue;
    loadText();
  }
});

quantitySeconds.addEventListener("change", (e) => {
  const selectedValue = e.target.value;
  countSeconds = selectedValue;
  timer.textContent = `${countSeconds}.00 s`;
});

levelMode.addEventListener("change", (e) => {
  const selectedValue = e.target.value;

  currentComplexity = complexity[selectedValue];
  loadText();
});

restartBtn.addEventListener("click", () => {
  restartBtn.style.animation = "rotateBtn 0.4s ease 1";
  initGame();

  setTimeout(() => {
    restartBtn.style.animation = "none";
  }, 400);
});

toggleLanguage.addEventListener("click", () => {
  currentLanguage = currentLanguage === "russian" ? "english" : "russian";
  toggleLanguage.checked = currentLanguage === "russian";
  initGame();
});

toggleTimer.addEventListener("change", (e) => {
  const countWord = countWordInfo.querySelector(".count-word");
  quantityMode.classList.toggle("reverse");
  if (toggleTimer.checked) {
    quantitySeconds.classList.remove("hide");
    quantityWords.classList.add("hide");
    countWord.classList.add("hide");
  } else {
    quantitySeconds.classList.add("hide");
    quantityWords.classList.remove("hide");
    countWord.classList.remove("hide");
  }
  initGame();
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

loadKeyboard();
function getWordsByLength(words, minLen, maxLen) {
  return words.filter((word) => word.length >= minLen && word.length <= maxLen);
}

function startTimer() {
  if (isTimerRunning) return;

  isTimerRunning = true;
  startTime = Date.now();

  timerInterval = setInterval(updateTimer, 10);
}

function updateTimer() {
  let elapsedTime;
  let seconds;

  if (toggleTimer.checked) {
    elapsedTime = countSeconds * 1000 - (Date.now() - startTime);
  } else {
    elapsedTime = Date.now() - startTime;
  }

  seconds = (elapsedTime / 1000).toFixed(2);
  timer.textContent = `${seconds} s`;
  if (seconds <= 0) endGame();
}

function stopTimer() {
  clearInterval(timerInterval);
  isTimerRunning = false;
  gameOver = true;
  if (toggleTimer.checked) {
    timer.textContent = "0.00 s";
  }
}

function resetTimer() {
  if (toggleTimer.checked) {
    timer.textContent = `${countSeconds}.00 s`;
  } else {
    timer.textContent = "0.00 s";
  }
}

function endGame() {
  gameOver = true;
  stopTimer();

  const timeInSeconds = toggleTimer.checked
    ? countSeconds
    : (Date.now() - startTime) / 1000;
  const wpm = Math.round(currentCountWords / (timeInSeconds / 60));
  alert(
    `Игра окончена! Напечатано слов: ${currentCountWords}, Время: ${timeInSeconds.toFixed(
      2
    )} с, Скорость: ${wpm} слов/мин`
  );
}

function loadText() {
  fetch(`../data/${currentLanguage}.txt`)
    .then((response) => {
      if (!response.ok) throw new Error("Не удалось загрузить текст");
      return response.text();
    })
    .then((data) => {
      const words = data.toLowerCase().split(/\s+/);
      const filterWords = getWordsByLength(
        words,
        currentComplexity.min,
        currentComplexity.max
      );

      arrayText = [];
      let n = toggleTimer.checked ? 500 : countWords;

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
          html += `<div class="word">${wordHtml}</div>`;
        }
      });

      textfiled.innerHTML = html;
      arrayText = arrayText.join("");
    })
    .catch((error) => {
      console.error("Ошибка:", error);
      alert("Ошибка загрузки текста. Попробуйте позже.");
      initGame();
    });
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Control" || e.key === "Alt" || e.key === "Meta" || gameOver) {
    return;
  }

  buttonKey.forEach((btn) => {
    if (btn.textContent === e.key) {
      btn.classList.add("press");
    }
  });

  if (!isTimerRunning && currentIndex === 0) {
    startTimer();
    settings.classList.add("hide");
  }

  const currentElement = document.querySelector(
    `[data-index="${currentIndex}"]`
  );
  if (!currentElement) return;

  const expectedChar = arrayText[currentIndex];

  if (e.key === expectedChar) {
    currentElement.classList.add("correct");
    currentElement.classList.remove("incorrect", "current");
    currentIndex++;

    if (e.key === " " && currentElement.dataset.type === "space") {
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
    const currentCountWordValue = countWordInfo.querySelector(".current-word");
    currentCountWords++;
    currentCountWordValue.textContent = currentCountWords;
    gameOver = true;
    stopTimer();
    endGame();
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

function initGame() {
  settings.classList.remove("hide");
  const currentCountWordValue = countWordInfo.querySelector(".current-word");
  const countWord = countWordInfo.querySelector(".count-word");
  currentCountWordValue.textContent = "0";
  countWord.textContent = `/${countWords}`;
  stopTimer();
  loadText();
  resetTimer();
  gameOver = false;
  currentCountWords = 0;
  currentIndex = 0;
  textfiled.innerHTML = ``;
  if (toggleTimer.checked) {
    quantitySeconds.classList.remove("hide");
    quantityWords.classList.add("hide");
    countWord.classList.add("hide");
    timer.textContent = `${countSeconds}.00 s`;
  } else {
    quantitySeconds.classList.add("hide");
    quantityWords.classList.remove("hide");
    countWord.classList.remove("hide");
  }
}

initGame();
