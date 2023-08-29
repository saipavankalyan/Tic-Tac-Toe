const state = {
  occupiedSquares: [], //starts with p1
  matchWinners: [],
};

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
const turn = document.querySelector(".turn");
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

const updatePlayerTurn = function (currPlayer = p2, newPlayer = p1) {
  if (currPlayer === newPlayer) return;

  //TODO: please make it display: none.
  turn.firstElementChild.classList.remove(
    `${currPlayer.icon}`,
    `${currPlayer.color}`
  );
  turn.firstElementChild.classList.add(
    `${newPlayer.icon}`,
    `${newPlayer.color}`
  );

  turn.lastElementChild.innerText = `Player ${newPlayer.id}'s turn`;
  turn.lastElementChild.classList.remove(`${currPlayer.color}`);
  turn.lastElementChild.classList.add(`${newPlayer.color}`);
};

const checkWinner = function (moves) {
  return winningCombinations.some((combination) => {
    return combination.every((ele) => {
      return moves.includes(ele);
    });
  });
};

const checkGameOver = function () {
  const p1Moves = state.occupiedSquares.filter((id, index) => !(index % 2));
  const p2Moves = state.occupiedSquares.filter((id, index) => index % 2);

  if (checkWinner(p1Moves)) {
    state.matchWinners.push(p1);
    return { status: true, message: "Player 1 wins!" };
  } else if (checkWinner(p2Moves)) {
    state.matchWinners.push(p2);
    return { status: true, message: "Player 2 wins!" };
  } else if (state.occupiedSquares.length === 9) {
    state.matchWinners.push(null);
    return { status: true, message: "It's a tie" };
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

const hideModal = function () {
  modal.classList.add("hidden");
};

const clearBoard = function () {
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
      p2
    )}`;
};

const addHandlerClickBoard = function () {
  squares.forEach((square) => {
    square.addEventListener("click", (e) => {
      const currPlayer = state.occupiedSquares.length % 2 === 0 ? p1 : p2;

      const clickedSquare = e.target;
      const squareID = +clickedSquare.id;

      let isGameOver;

      if (state.occupiedSquares.includes(squareID)) return;

      state.occupiedSquares.push(squareID);

      clickedSquare.classList.add(
        "fa-solid",
        "big",
        "icon",
        `${currPlayer.icon}`,
        `${currPlayer.color}`
      );

      const nextPlayer = otherPlayer(currPlayer);
      updatePlayerTurn(currPlayer, nextPlayer);

      if (state.occupiedSquares.length < 5) return;

      //Check if Game is over
      isGameOver = checkGameOver();
      if (!isGameOver.status) return;

      state.occupiedSquares = [];

      updateScoreCard();
      renderModal(isGameOver.message);
    });
  });
};

const addHandlerPlayAgain = function () {
  playAgainBtn.addEventListener("click", (e) => {
    hideModal();

    clearBoard();

    let currWinner = state.matchWinners.at(-1);
    if (!currWinner) currWinner = p1;
    updatePlayerTurn(otherPlayer(currWinner), p1);
  });
};

const addHandlerReset = function () {
  resetBtn.addEventListener("click", (e) => {
    window.location.reload();
  });
};

const addHandlerNewGame = function () {
  newGameBtn.addEventListener("click", (e) => {
    state.occupiedSquares.splice(0, state.occupiedSquares.length);
    clearBoard(squares);
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
