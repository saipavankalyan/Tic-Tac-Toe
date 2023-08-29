const p1 = {
  id: 1,
  icon: "fa-x",
  color: "green",
};

const p2 = {
  id: 2,
  icon: "fa-o",
  color: "yellow",
};

const state = {
  player1OccupiedSquares: [],
  player2OccupiedSquares: [],
  playerinSqaures: [],
  matchWinners: [],
  currPlayer: p1,
};

const winningCombinations = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
  [1, 4, 7],
  [2, 5, 8],
  [3, 6, 9],
  [1, 5, 9],
  [3, 5, 7],
];

const squares = document.querySelectorAll(".square");
const turnP1 = document.querySelector(".turn-p1");
const turnP2 = document.querySelector(".turn-p2");
const p1Score = document.querySelector(".p1");
const p2Score = document.querySelector(".p2");
const tieScore = document.querySelector(".tie");
const modal = document.querySelector(".modal");
const modalContents = document.querySelector(".modal-contents");
const playAgainBtn = document.querySelector(".modal-btn");
const resetBtn = document.querySelector(".reset");
const newGameBtn = document.querySelector(".new-game");

//Methods
const otherPlayer = (player) => (player === p1 ? p2 : p1);

const countElem = (arr, elem) => arr.filter((el) => el === elem).length;

const countFilledSquares = (arr) => arr.filter((el) => el !== null).length;

const updatePlayerTurn = function (currPlayer = p2, newPlayer = p1) {
  if (currPlayer === newPlayer) return;

  if (currPlayer === p1) {
    turnP1.classList.add("hidden");
    turnP2.classList.remove("hidden");
  } else {
    turnP2.classList.add("hidden");
    turnP1.classList.remove("hidden");
  }
};

const checkWinner = function (moves) {
  return winningCombinations.some((combination) => {
    return combination.every((ele) => {
      return moves.includes(ele);
    });
  });
};

const checkGameOver = function () {
  if (checkWinner(state.player1OccupiedSquares)) {
    state.matchWinners.push(p1);
    return { status: true, winner: p1 };
  } else if (checkWinner(state.player2OccupiedSquares)) {
    state.matchWinners.push(p2);
    return { status: true, winner: p2 };
  } else if (countFilledSquares(state.playerinSqaures) === 9) {
    state.matchWinners.push(null);
    return { status: true, winner: null };
  } else return { status: false, message: "" };
};

const renderModal = function (message) {
  modalContents.firstElementChild.innerText = message;
  const bgColor = message.includes("1")
    ? "var(--green)"
    : message.includes("2")
    ? "var(--yellow)"
    : "var(--dark-gray)";
  modalContents.style.backgroundColor = bgColor;
  modal.classList.remove("hidden");
};

const hideGameOverModal = function () {
  modal.classList.add("hidden");
};

const clearBoard = function () {
  state.playerinSqaures = [];
  state.player1OccupiedSquares = [];
  state.player2OccupiedSquares = [];

  state.currPlayer = p1;

  squares.forEach((square) => {
    square.classList.remove(
      "fa-solid",
      "big",
      "icon",
      p1.icon,
      p2.icon,
      p1.color,
      p2.color
    );
  });
};

const updateScoreCard = function () {
  if (state.matchWinners.at(-1) === p1)
    p1Score.lastElementChild.innerText = `${countElem(
      state.matchWinners,
      p1
    )} wins`;
  else if (state.matchWinners.at(-1) === p2)
    p2Score.lastElementChild.innerText = `${countElem(
      state.matchWinners,
      p2
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

const addHandlerClickBoard = function () {
  squares.forEach((square) => {
    square.addEventListener("click", (e) => {
      const clickedSquare = e.target;
      const squareID = +clickedSquare.id;

      //If user clicked the square which is already filled
      if (state.playerinSqaures[squareID - 1]) return;

      state.playerinSqaures[squareID - 1] = state.currPlayer;

      state.currPlayer === p1
        ? state.player1OccupiedSquares.push(squareID)
        : state.player2OccupiedSquares.push(squareID);

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
        isGameOver.winner === p1
          ? "Player 1 Wins!"
          : isGameOver.winner === p2
          ? "Player 2 Wins!"
          : "It's a Tie!";
      renderModal(message);
    });
  });
};

const addHandlerPlayAgain = function () {
  playAgainBtn.addEventListener("click", (e) => {
    hideGameOverModal();

    clearBoard();

    updatePlayerTurn();
  });
};

const addHandlerReset = function () {
  resetBtn.addEventListener("click", (e) => {
    clearBoard();

    updatePlayerTurn();

    clearScoreCard();
  });
};

const addHandlerNewGame = function () {
  newGameBtn.addEventListener("click", (e) => {
    clearBoard();

    updatePlayerTurn();
  });
};

const init = function () {
  addHandlerClickBoard();
  addHandlerPlayAgain();
  addHandlerReset();
  addHandlerNewGame();
};

init();
