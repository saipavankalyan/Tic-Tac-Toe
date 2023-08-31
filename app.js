import { TIMEOUT_IN_MILLISEC } from "./config.js";

const state = {
  p1: {
    id: 1,
    icon: "fa-x",
    color: "green",
    occupiedSquares: [],
  },
  p2: {
    id: 2,
    icon: "fa-o",
    color: "yellow",
    occupiedSquares: [],
  },
  validMoves: {
    1: [2, 4, 5],
    2: [1, 3, 5],
    3: [2, 5, 6],
    4: [1, 5, 7],
    5: [1, 2, 3, 4, 6, 7, 8, 9],
    6: [3, 5, 9],
    7: [4, 5, 8],
    8: [5, 7, 9],
    9: [5, 6, 8],
  },
  playerinSqaures: [],
  matchWinners: [],
  currentMode: null,
  prevSquare: null,
  winningCombinations: [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
    [1, 4, 7],
    [2, 5, 8],
    [3, 6, 9],
    [1, 5, 9],
    [3, 5, 7],
  ],
};
state.currPlayer = state.p1;

//DOM elements
const classicModeBtn = document.querySelector(".classic");
const endlessModeBtn = document.querySelector(".endless");
const board = document.querySelector(".board");
const squares = document.querySelectorAll(".square");
const turnP1 = document.querySelector(".turn-p1");
const turnP2 = document.querySelector(".turn-p2");
const p1Score = document.querySelector(".p1");
const p2Score = document.querySelector(".p2");
const tieScore = document.querySelector(".tie");
const gameMode = document.querySelector(".mode");
const gameOver = document.querySelector(".game-over");
const modalContents = document.querySelector(".modal-contents");
const playAgainBtn = document.querySelector(".modal-btn");
const resetBtn = document.querySelector(".reset");
const newGameBtn = document.querySelector(".new-game");
const toast = document.querySelector(".toast");
const displayMode = document.querySelector(".show-mode");
const rulesPage = document.querySelector(".modal[data-page='rules']");
const rulesClassic = document.querySelector(".rules[data-mode='classic']");
const rulesEndless = document.querySelector(".rules[data-mode='endless']");
const rulesClassicBtn = document.querySelector(
  ".rules-button[data-mode='classic']"
);
const rulesEndlessBtn = document.querySelector(
  ".rules-button[data-mode='endless']"
);

// Methods
const otherPlayer = (player) => (player === state.p1 ? state.p2 : state.p1);

const countElem = (arr, elem) => arr.filter((el) => el === elem).length;

const countFilledSquares = (arr) => arr.filter((el) => el !== null).length;

const updatePlayerTurn = function (
  currPlayer = state.p2,
  newPlayer = state.p1
) {
  if (currPlayer === newPlayer) return;

  if (currPlayer === state.p1) {
    turnP1.classList.add("hidden");
    turnP2.classList.remove("hidden");
  } else {
    turnP2.classList.add("hidden");
    turnP1.classList.remove("hidden");
  }
};

const checkWinner = function (moves) {
  return state.winningCombinations.some((combination) => {
    return combination.every((ele) => {
      return moves.includes(ele);
    });
  });
};

const checkGameOver = function () {
  if (checkWinner(state.p1.occupiedSquares)) {
    state.matchWinners.push(state.p1);
    return { status: true, winner: state.p1 };
  } else if (checkWinner(state.p2.occupiedSquares)) {
    state.matchWinners.push(state.p2);
    return { status: true, winner: state.p2 };
  } else if (countFilledSquares(state.playerinSqaures) === 9) {
    state.matchWinners.push(null);
    return { status: true, winner: null };
  } else return { status: false, message: "" };
};

const renderResultModal = function (message) {
  modalContents.firstElementChild.innerText = message;
  const bgColor = message.includes("1")
    ? "var(--green)"
    : message.includes("2")
    ? "var(--yellow)"
    : "var(--dark-gray)";
  modalContents.style.backgroundColor = bgColor;
  showModal(gameOver);
};

const hideModal = function (modal) {
  modal.classList.add("hidden");
};

const showModal = function (modal) {
  modal.classList.remove("hidden");
};

const showBoard = function () {
  board.classList.remove("hidden");
};

const hideBoard = function () {
  board.classList.add("hidden");
};

const showToast = function (message) {
  toast.innerHTML = `<p>${message}</p>`;
  toast.classList.remove("hidden");
};

const hideToast = function () {
  toast.classList.add("hidden");
};

const showGameMode = function (gameMode) {
  displayMode.innerText = `${gameMode} mode`;
  displayMode.classList.remove("hidden");
};

const hideGameMode = function () {
  displayMode.classList.add("hidden");
};

const showRules = function () {
  hideModal(gameMode);

  showModal(rulesPage);

  state.currentMode === "classic"
    ? showModal(rulesClassic)
    : showModal(rulesEndless);
};

const startGame = function () {
  hideModal(rulesPage);

  state.currentMode === "classic"
    ? hideModal(rulesClassic)
    : hideModal(rulesEndless);

  showGameMode(state.currentMode);

  showBoard();
};

const clearBoard = function () {
  state.playerinSqaures = [];
  state.p1.occupiedSquares = [];
  state.p2.occupiedSquares = [];
  state.currPlayer = state.p1;
  state.prevSquare = null;
  state.currSquare = null;

  squares.forEach((square) => {
    square.classList.remove(
      "fa-solid",
      "big",
      "icon",
      state.p1.icon,
      state.p2.icon,
      state.p1.color,
      state.p2.color
    );
  });
};

const updateScoreCard = function () {
  if (state.matchWinners.at(-1) === state.p1)
    p1Score.lastElementChild.innerText = `${countElem(
      state.matchWinners,
      state.p1
    )} wins`;
  else if (state.matchWinners.at(-1) === state.p2)
    p2Score.lastElementChild.innerText = `${countElem(
      state.matchWinners,
      state.p2
    )} wins`;
  else
    tieScore.lastElementChild.innerText = `${countElem(
      state.matchWinners,
      null
    )}`;
};

const clearScoreCard = function () {
  state.matchWinners = [];
  p1Score.lastElementChild.innerText = `0 wins`;
  p2Score.lastElementChild.innerText = `0 wins`;
  tieScore.lastElementChild.innerText = `0`;
};

const validateSquareInCurrentPlayer = function (squareID) {
  return state.currPlayer.occupiedSquares.some((el) => el === squareID);
};

const validateEmptySquare = function (squareID) {
  return [...state.p1.occupiedSquares, ...state.p2.occupiedSquares].every(
    (el) => el !== squareID
  );
};

const validateMove = function (prevSquareID, currSquareID) {
  return state.validMoves[prevSquareID].some((el) => el === currSquareID);
};

const highlightPrevSquare = function (square) {
  square.classList.add(`highlight-${state.currPlayer.color}`);
};

const unhighlightPrevSquare = function (square) {
  square.classList.remove(`highlight-${state.currPlayer.color}`);
};

// Handlers to all the buttons
const addHandlerClickBoard = function () {
  squares.forEach((square) => {
    square.addEventListener("click", (e) => {
      const clickedSquare = e.target;
      const squareID = +clickedSquare.id;

      hideToast();

      if (
        state.currentMode === "endless" &&
        state.currPlayer.occupiedSquares.length > 2
      ) {
        //All three pieces of the player are now active on the board
        if (!state.prevSquare) {
          if (!validateSquareInCurrentPlayer(squareID)) {
            showToast("You need to move one of your existing piece");
            setTimeout(hideToast, TIMEOUT_IN_MILLISEC);
            return;
          }
          state.prevSquare = squareID;
          highlightPrevSquare(squares[squareID - 1]);
          return;
        } else {
          //retreat
          if (squareID === state.prevSquare) {
            state.prevSquare = null;
            unhighlightPrevSquare(squares[squareID - 1]);
            return;
          }
          //check if new square is empty
          if (!validateEmptySquare(squareID)) {
            showToast("Move your piece to an empty square");
            setTimeout(hideToast, TIMEOUT_IN_MILLISEC);
            return;
          }
          //check if new square is traversable from previous square
          if (!validateMove(state.prevSquare, squareID)) {
            showToast("Invalid move ⚠️");
            setTimeout(hideToast, TIMEOUT_IN_MILLISEC);
            return;
          }

          state.playerinSqaures[state.prevSquare - 1] = null;

          //remove previous piece
          state.currPlayer.occupiedSquares =
            state.currPlayer.occupiedSquares.filter(
              (el) => el !== state.prevSquare
            );

          squares[state.prevSquare - 1].classList.remove(
            "fa-solid",
            "big",
            "icon",
            `${state.currPlayer.icon}`,
            `${state.currPlayer.color}`
          );

          unhighlightPrevSquare(squares[state.prevSquare - 1]);

          state.prevSquare = null;
        }
      } else {
        //If user clicked the square which is already filled in classic mode
        if (state.playerinSqaures[squareID - 1]) return;
      }

      state.playerinSqaures[squareID - 1] = state.currPlayer;

      state.currPlayer.occupiedSquares.push(squareID);

      clickedSquare.classList.add(
        "fa-solid",
        "big",
        "icon",
        `${state.currPlayer.icon}`,
        `${state.currPlayer.color}`
      );

      updatePlayerTurn(state.currPlayer, otherPlayer(state.currPlayer));

      state.currPlayer = otherPlayer(state.currPlayer);

      //Game can't be over at this point
      if (countFilledSquares(state.playerinSqaures) < 5) return;

      //Check if Game is over
      let isGameOver = checkGameOver();
      if (!isGameOver.status) return;

      clearBoard();

      updateScoreCard();

      const message =
        isGameOver.winner === state.p1
          ? "Player 1 Wins!"
          : isGameOver.winner === state.p2
          ? "Player 2 Wins!"
          : "It's a Tie!";
      renderResultModal(message);
    });
  });
};

const addHandlerPlayAgain = function () {
  playAgainBtn.addEventListener("click", (e) => {
    hideModal(gameOver);

    clearBoard();

    updatePlayerTurn();
  });
};

const addHandlerReset = function () {
  resetBtn.addEventListener("click", (e) => {
    clearBoard();
    state.currentMode = null;

    updatePlayerTurn();

    clearScoreCard();

    hideBoard();

    hideToast();

    hideGameMode();

    showModal(gameMode);
  });
};

const addHandlerNewGame = function () {
  newGameBtn.addEventListener("click", (e) => {
    clearBoard();

    updatePlayerTurn();
  });
};

const addHandlerSelectGameMode = function () {
  classicModeBtn.addEventListener("click", (e) => {
    state.currentMode = "classic";
    showRules();
  });
  endlessModeBtn.addEventListener("click", (e) => {
    state.currentMode = "endless";
    showRules();
  });
};

const addHandlerShowRules = function () {
  rulesClassicBtn.addEventListener("click", (e) => startGame());

  rulesEndlessBtn.addEventListener("click", (e) => startGame());
};

const init = function () {
  addHandlerSelectGameMode();
  addHandlerShowRules();
  addHandlerClickBoard();
  addHandlerPlayAgain();
  addHandlerReset();
  addHandlerNewGame();
};

init();
