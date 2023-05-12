const alphabet = [
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z",
];

const lettersDiv = document.querySelector(".letters");
alphabet.forEach((letter) => {
  const btn = document.createElement("button");
  btn.classList.add("btn_letter");
  btn.textContent = letter;
  btn.setAttribute("disabled", true);
  lettersDiv.appendChild(btn);
});

const MAX_LIVES = 10;
let lives = MAX_LIVES;
let word = "";

const getRandomWord = async () => {
  const response = await fetch(
    "https://random-word-api.herokuapp.com/word?number=1"
  );
  const data = await response.json();
  console.log(data[0]);
  return data[0];
};

const guessedLetters = new Set();

const handleGuess = (event) => {
  const guessedLetter = event;
  if (word.includes(guessedLetter)) {
    // correct guess
    if (guessedLetters.has(guessedLetter)) {
      alert("Letter already guessed but don't worry, you won't lose a life :)");
      return;
    } else {
      fillInGuess(guessedLetter);
      guessedLetters.add(guessedLetter);
    }
  } else {
    const drawSpans = document.querySelectorAll(".draw span");
    drawSpans[10 - lives].style.display = "inline-block";
    lives--;
    const livesSpan = document.querySelector("#lives");
    livesSpan.textContent = `lives: ${lives}`;
    guessedLetters.add(guessedLetter);
    if (lives <= 0) {
      const resultDiv = document.querySelector("#result");
      resultDiv.style.display = "flex";
      resultDiv.textContent = `Game Over!, the word was ${word}`;
      const alphabetBtn = document.querySelectorAll(".btn_letter");
      alphabetBtn.forEach((btn) => {
        btn.setAttribute("disabled", true);
      });
    }
  }
};

const lettersBtns = document.querySelectorAll(".btn_letter");
lettersBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    handleGuess(btn.textContent);
  });
});

const displayWord = (word) => {
  const guessDiv = document.querySelector(".guess");
  guessDiv.innerHTML = "";
  for (let i = 0; i < word.length; i++) {
    const letterInput = document.createElement("input");
    letterInput.classList.add("letter_input");
    guessDiv.appendChild(letterInput);
  }
};

const fillInGuess = (letter) => {
  const letterInputs = document.querySelectorAll(".letter_input");
  let found = false;
  for (let i = 0; i < word.length; i++) {
    if (word[i] === letter) {
      letterInputs[i].value = letter;
      found = true;
    }
  }
  return found;
};

const startGame = async () => {
  lives = MAX_LIVES;
  const resultDiv = document.querySelector("#result");
  resultDiv.style.display = "none";
  const alphabetDiv = document.querySelector(".letters");
  alphabetDiv.style.display = "flex";
  const alphabetBtn = document.querySelectorAll(".btn_letter");
  alphabetBtn.forEach((btn) => {
    btn.removeAttribute("disabled");
  });
  const guessDiv = document.querySelector(".guess");
  guessDiv.style.display = "flex";
  word = await getRandomWord();
  displayWord(word);
};
const startBtn = document.querySelector("#start");
startBtn.addEventListener("click", () => {
  startGame();
  startBtn.setAttribute("disabled", true);
});

const resetBtn = document.querySelector("#reset");
resetBtn.addEventListener("click", () => {
  startBtn.removeAttribute("disabled");
  const alphabetBtn = document.querySelectorAll(".btn_letter");
  alphabetBtn.forEach((btn) => {
    btn.setAttribute("disabled", true);
  });
  guessedLetters.clear();
  const drawSpans = document.querySelectorAll(".draw span");
  drawSpans.forEach((span) => {
    span.style.display = "none";
  });
  const livesSpan = document.querySelector("#lives");
  livesSpan.textContent = `lives: ${MAX_LIVES}`;
  const guessDiv = document.querySelector(".guess");
  guessDiv.textContent = "";
  const resultDiv = document.querySelector("#result");
  resultDiv.style.display = "none";
});
