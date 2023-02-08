"use strict";

/** Memory game: find matching pairs of cards and flip both of them. */

const FOUND_MATCH_WAIT_MSECS = 1000;
const COLORS = [
  "red",
  "blue",
  "green",
  "orange",
  "purple",
  "red",
  "blue",
  "green",
  "orange",
  "purple",
];

const colors = shuffle(COLORS);

createCards(colors);

/** Shuffle array items in-place and return shuffled array. */

function shuffle(items) {
  // This algorithm does a "perfect shuffle", where there won't be any
  // statistical bias in the shuffle (many naive attempts to shuffle end up not
  // be a fair shuffle). This is called the Fisher-Yates shuffle algorithm; if
  // you're interested, you can learn about it, but it's not important.

  for (let i = items.length - 1; i > 0; i--) {
    // generate a random index between 0 and i
    let j = Math.floor(Math.random() * i);
    // swap item at i <-> item at j
    [items[i], items[j]] = [items[j], items[i]];
  }

  return items;
}

/** Create card for every color in colors (each will appear twice)
 *
 * Each div DOM element will have:
 * - a class with the value of the color
 * - a click event listener for each card to handleCardClick
 */

function createCards(colors) {
  const gameBoard = document.getElementById("game");
  for (let color of colors) {
    //create a div
    const newDiv = document.createElement("div");
    //add the class color to each div
    newDiv.classList.add(`${color}`);
    gameBoard.append(newDiv);
    newDiv.addEventListener("click", handleCardClick);
  }
}

/** Flip a card face-up. */

function flipCard(card, allClickedCards) {
  //change the background color to be the color of the class it has
  card.style.backgroundColor = `${card.classList[0]}`;
  //if two of the cards are not the same class then call unFlipCard
  if (allClickedCards[0] !== allClickedCards[1]) {
    setTimeout(function () {
      unFlipCard(allClickedCards);
    }, 1000);
  }
}

/** Flip a card face-down. */

function unFlipCard(cards) {
  for (const card of cards) {
    card.style.backgroundColor = "none";
  }
}

/** Handle clicking on a card: this could be first-card or second-card. */

function handleCardClick(evt) {
  const clickedCards = document.querySelectorAll(".clicked");
  //if all clicked cards list is < 2
  if (clickedCards.length < 2) {
    //add classList 'click'
    evt.target.classList.toggle("clicked");
    //run flipCard
    flipCard(evt.target, clickedCards);
  }
}
