"use strict";

/** Memory game: find matching pairs of cards and flip both of them. */

const FOUND_MATCH_WAIT_MSECS = 1000;
const COLORS = [
  "red",
  "red",
  "blue",
  "blue",
  "green",
  "green",
  "purple",
  "purple",
  "orange",
  "orange",
  "yellow",
  "yellow",
  "maroon",
  "maroon",
  "black",
  "black",
  "pink",
  "pink",
  "teal",
  "teal",
];

// const colors = shuffle(COLORS);

// createCards(colors);

/** Shuffle array items in-place and return shuffled array. */

function shuffle(items, cardAmt) {
  // This algorithm does a "perfect shuffle", where there won't be any
  // statistical bias in the shuffle (many naive attempts to shuffle end up not
  // be a fair shuffle). This is called the Fisher-Yates shuffle algorithm; if
  // you're interested, you can learn about it, but it's not important.
  if (items.length !== cardAmt) {
    items = items.slice(0, -(items.length - cardAmt));
  }
  for (let i = items.length - 1; i > 0; i--) {
    // generate a random index between 0 and i
    let j = Math.floor(Math.random() * i);
    // swap item at i <-> item at j
    [items[i], items[j]] = [items[j], items[i]];
  }
  createCards(items);
}

/** Create card for every color in colors (each will appear twice)
 *
 * Each div DOM element will have:
 * - a class with the value of the color
 * - a click event listener for each card to handleCardClick
 */
let cardClicks = 0;
let flips = 0;

function createCards(colors) {
  const gameBoard = document.getElementById("game");
  for (let color of colors) {
    const newCardContainer = createCardContainer(color, gameBoard);
    newCardContainer.addEventListener("click", function (e) {
      flips++;
      displayFlipCount();
      cardClicks++;
      cardClicks <= 2 ? handleCardClick(e) : (cardClicks = 0);
    });
  }
}

function createCardContainer(color, parentNode) {
  const cardContainer = document.createElement("div");
  cardContainer.classList.add(`${color}`, `card`);
  parentNode.append(cardContainer);
  createChildImgs(color, cardContainer);
  return cardContainer;
}

function createChildImgs(color, cardContainer) {
  const newFrontImg = document.createElement("img");
  newFrontImg.src = `images/${color}.png`;
  newFrontImg.classList.toggle("front-face");
  const newBackImg = document.createElement("img");
  newBackImg.src = `images/alien.gif`;
  newBackImg.classList.toggle("back-face");
  cardContainer.append(newFrontImg, newBackImg);
}

function displayFlipCount() {
  const flip = document.querySelector("#flip-count");
  flip.innerText = `Flips: ${flips}`;
}

/** Flip a card face-up. */

function flipCard(card, allClickedCards) {
  if (allClickedCards.length <= 1) return;
  //if two of the cards are not the same class then call unFlipCard
  if (allClickedCards[0].classList[0] !== allClickedCards[1].classList[0]) {
    setTimeout(function () {
      unFlipCard(allClickedCards);
    }, FOUND_MATCH_WAIT_MSECS);
  } else {
    for (const clickedCard of allClickedCards) {
      clickedCard.classList.toggle("matched");
      clickedCard.classList.toggle("clicked");
      cardClicks = 0;
    }
  }
  gameOver();
}

/** Flip a card face-down. */

function unFlipCard(cards) {
  for (const card of cards) {
    card.style.backgroundColor = "";
    card.classList.toggle("clicked");
    cardClicks = 0;
  }
}

/** Handle clicking on a card: this could be first-card or second-card. */

function handleCardClick(evt) {
  const card = evt.target.parentNode;
  card.classList.add("clicked");
  const clickedCards = document.querySelectorAll(".clicked");
  console.log(card);
  if (clickedCards.length <= 2) {
    //run flipCard
    flipCard(card, clickedCards);
  }
}

/* Restart Game after all matched pairs are found*/
function gameOver() {
  const matchedPairs = document.querySelectorAll(".matched");
  const cardNumber = parseInt(document.getElementById("card-number").value);
  if (matchedPairs.length === cardNumber) {
    createNewModal();
  }
}

function createNewModal() {
  const newModal = document.createElement("dialog");
  newModal.classList.toggle("end-modal");
  const newHeading = document.createElement("h3");
  newHeading.innerText = "Yay! You found all matching pairs!";
  const newParagraph = document.createElement("p");
  newParagraph.innerText = "Would you like to play again?";
  const restartBtn = document.createElement("button");
  restartBtn.innerText = "Play Again";
  restartBtn.classList.toggle("play-again-btn");
  newModal.append(newHeading, newParagraph, restartBtn);
  const mainContainer = document.querySelector("main");
  mainContainer.append(newModal);
  newModal.showModal();
  restartBtn.addEventListener("click", function () {
    location.reload();
  });
}

/** Open modal on page load */

window.onload = (event) => {
  const modal = document.querySelector(".start-modal");
  modal.showModal();
  const form = document.getElementById("modal-form");
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const cardNumber = parseInt(document.getElementById("card-number").value);
    shuffle(COLORS, cardNumber);
    const cardsGrid = document.querySelector(".cards-grid");
    cardsGrid.style.display = "inline-block";
    modal.close();
  });
};
