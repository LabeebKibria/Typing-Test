const RANDOM_QUOTE_API_URL = 'http://api.quotable.io/random'
const quoteDisplayElement = document.getElementById('quoteDisplay')
const quoteInputElement = document.getElementById('quoteInput')
const timerElement = document.getElementById('timer')
const wordCountElement = document.getElementById('wordCountValue');

let timerInterval // To keep reference of the interval for clearing
let startTime // To keep track of when the timer started


quoteInputElement.addEventListener('input', () => {
  const arrayQuote = quoteDisplayElement.querySelectorAll('span')
  const arrayValue = quoteInputElement.value.split('')

  let correct = true
  arrayQuote.forEach((characterSpan, index) => {
    const character = arrayValue[index]
    if (character == null) {
      characterSpan.classList.remove('correct')
      characterSpan.classList.remove('incorrect')
      correct = false
    } else if (character === characterSpan.innerText) {
      characterSpan.classList.add('correct')
      characterSpan.classList.remove('incorrect')
    } else {
      characterSpan.classList.remove('correct')
      characterSpan.classList.add('incorrect')
      correct = false
    }
  })
  // working on figuring how to update the word count
  let wordCount = 0
  for(let i = 1; i < arrayValue.length(); i++){
    if(arrayValue[i] == ' ')
        wordCount++
    wordCountElement.textContent = wordCount;
  }
  if (correct) renderNewQuote()
})

function getRandomQuote() {
  return fetch(RANDOM_QUOTE_API_URL)
    .then(response => response.json())
    .then(data => data.content)
}

async function renderNewQuote() {
  const quote = await getRandomQuote()
  quoteDisplayElement.innerHTML = ''
  quote.split('').forEach(character => {
    const characterSpan = document.createElement('span')
    characterSpan.innerText = character
    quoteDisplayElement.appendChild(characterSpan)
  })
  quoteInputElement.value = null
    // Start timer only if it's not already running
    if (!startTime) {
    startTimer()
  }
}


function startTimer() {
    clearInterval(timerInterval) // Clear previous interval if exists
    timerElement.innerText = 60 // Set initial timer value to 60
    startTime = new Date()
  
    timerInterval = setInterval(() => {
      const elapsedTime = Math.floor((new Date() - startTime) / 1000)
      const secondsLeft = Math.max(60 - elapsedTime, 0) // Ensure timer doesn't go negative
  
      if (secondsLeft >= 0) {
        timerElement.innerText = secondsLeft
      } else {
        clearInterval(timerInterval) // Stop the timer when it reaches 0
      }
    }, 1000)
  }

function getTimerTime() {
  return Math.floor((new Date() - startTime) / 1000)
}

//changes the pages
document.addEventListener('DOMContentLoaded', function() {
    const introPage = document.getElementById('introPage');
    const gamePage = document.getElementById('gamePage');
    const startButton = document.getElementById('startButton');
    // const wordCountElement = document.getElementById('wordCountValue');
    gamePage.classList.add('hidden')

    let wordCount = 0;

    startButton.addEventListener('click', function() {
        introPage.classList.add('hidden')
        gamePage.classList.remove('hidden')
        renderNewQuote()
        startTimer()
    })
})

/*quoteInputElement.addEventListener('input', function() {
    const words = quoteInputElement.value.trim().split(" ");
    wordCount = words.length;
    wordCountElement.textContent = wordCount;
})*/
renderNewQuote()