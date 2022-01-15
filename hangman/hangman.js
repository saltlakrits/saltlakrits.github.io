let setOutput = (e, s) => {
    document.getElementById(e).innerText = `${s}`;
}

// too lazy to format this annoying string, just grabbed something online
// to use. technically a bad move to perform this computation every time
// instead of having a proper array though, TODO
const arrayOfNouns = () => {
    let s = "Actor Gold 	Painting    Advertisement 	Grass 	Parrot    Afternoon 	Greece 	Pencil    Airport 	Guitar 	Piano    Ambulance 	Hair 	Pillow    Animal 	Hamburger 	Pizza    Answer 	Helicopter 	Planet    Apple 	Helmet 	Plastic    Army 	Holiday 	Portugal    Australia 	Honey 	Potato    Balloon 	Horse 	Queen    Banana 	Hospital 	Quill    Battery 	House 	Rain    Beach 	Hydrogen 	Rainbow    Beard 	Ice 	Raincoat    Bed 	Insect 	Refrigerator    Belgium 	Insurance 	Restaurant    Boy 	Iron 	River    Branch 	Island 	Rocket    Breakfast 	Jackal 	Room    Brother 	Jelly 	Rose    Camera 	Jewellery 	Russia    Candle 	Jordan 	Sandwich    Car 	Juice 	School    Caravan 	Kangaroo 	Scooter    Carpet 	King 	Shampoo    Cartoon 	Kitchen 	Shoe    China 	Kite 	Soccer    Church 	Knife 	Spoon    Crayon 	Lamp 	Stone    Crowd 	Lawyer 	Sugar    Daughter 	Leather 	Sweden    Death 	Library 	Teacher    Denmark 	Lighter 	Telephone    Diamond 	Lion 	Television    Dinner 	Lizard 	Tent    Disease 	Lock 	Thailand    Doctor 	London 	Tomato    Dog 	Lunch 	Toothbrush    Dream 	Machine 	Traffic    Dress 	Magazine 	Train    Easter 	Magician 	Truck    Egg 	Manchester 	Uganda    Eggplant 	Market 	Umbrella    Egypt 	Match 	Van    Elephant 	Microphone 	Vase    Energy 	Monkey 	Vegetable    Engine 	Morning 	Vulture    England 	Motorcycle 	Wall    Evening 	Nail 	Whale    Eye 	Napkin 	Window    Family 	Needle 	Wire    Finland 	Nest 	Xylophone    Fish 	Nigeria 	Yacht    Flag 	Night 	Yak    Flower 	Notebook 	Zebra    Football 	Ocean 	Zoo    Forest 	Oil 	Garden    Fountain 	Orange 	Gas    France 	Oxygen 	Girl    Furniture 	Oyster 	Glass    Garage 	Ghost ";
    let reg = /([A-Za-z]+)/g;
    return s.match(reg);
}

// returns random number between 0 and max
const getRandInt = (max) => Math.floor(Math.random() * max);

const winMessage = () => ` You won! It took you ${numberOfGuesses}
    ${(numberOfGuesses == 1 ? "guess" : "guesses")} ${descriptiveEmoji}`;


// vars required for game state
let randomWord = arrayOfNouns()[getRandInt(184)].toLowerCase();
// if you want to cheat, you can look at the log to see the word to guess
console.log(randomWord);
let currentGuess = "";
let whitelistedLetters = "";
let win = false;
let numberOfGuesses = 0;
let guessedLetters = "";
let guessedWords = [];
let descriptiveEmoji = "";


// this is overdoing it since you can just reload the page, but that's unimportant
let reInitialize = () => {
    randomWord = arrayOfNouns()[getRandInt(184)].toLowerCase();
    // if you want to cheat, you can look at the log to see the word to guess
    console.log(randomWord);
    currentGuess = "";
    whitelistedLetters = "";
    win = false;
    numberOfGuesses = 0;
    guessedLetters = "";
    guessedWords = [];
    descriptiveEmoji = "";


    setOutput("hangmanOutput", buildString());
    setOutput("hangmanSecondary",
        "Enter a letter to guess a letter, or try to guess the entire word!");

    document.getElementById("playAgainButton").style.display = "none";
}

// builds a string of either correctly guessed characters or underscores,
// separated by spaces and capitalized
let buildString = () => {
    let retVal = "";
    for (let i = 0; i < randomWord.length; i++) {
        retVal += ((whitelistedLetters.includes(randomWord[i])) ?
            randomWord[i] : "_") + " ";
    }
    return retVal.toUpperCase();
}

// check if your guess has any characters that are included in the randomized word
// currently lets you input as many as you like, so you could win in one go by inputting entire alphabet...
// should probably limit user to inputting 1 char or guessing the entire word. if length > 1 check entire word,
// else check guess[0]

// TODO flatten this nested if
let checkGuess = (guess) => {

    numberOfGuesses++;

    if (guess.length == 1) {
        if (guessedLetters.includes(guess)) {
            setOutput("hangmanSecondary",
                "You already guessed that! I'm counting it anyway.");
        }
        else {
            if (randomWord.includes(guess)) {
                setOutput("hangmanSecondary", "That guess was correct! :)");
                whitelistedLetters += guess;
                guessedLetters += guess;
            }
            else {
                setOutput("hangmanSecondary", "That letter is not correct.")
                guessedLetters += guess;
            }
        }
    }
    else {
        if (guess == randomWord) {
            whitelistedLetters += guess;
            setOutput("hangmanSecondary", "You got it!");
        }
        else if (guessedWords.includes(guess)) {
            setOutput("hangmanSecondary",
                "You already guessed that! I'm counting it anyway.");
        }
        else {
            setOutput("hangmanSecondary", "That is not the word, keep at it!");
            guessedWords.push(guess);
        }
    }
}

let checkWin = () => {
    return (buildString().replace(/ /g, "").toLowerCase() == randomWord);
}



// hijacks the default behavior of form to run javascript
// instead of trying to send off the info to somewhere else and
// reloading the page. realistically this lets you kinda do
// whatever you want by overriding behavior with js though?

// now that i am a tiny bit wiser -- do i really need to listen for load..?
// TODO experiment with that
window.addEventListener("load", () => {

    setOutput("hangmanOutput", buildString());
    setOutput("hangmanSecondary",
        "Enter a letter to guess a letter, or try to guess the entire word!\n(If you're a filthy cheater, check the log)");

    const form = document.getElementById("hangmanForm");
    form.addEventListener("submit", (event) => {
        event.preventDefault();


        if (!win) {
            currentGuess = document.getElementById("hangmanInput").value;
            checkGuess(currentGuess.toLowerCase());
            setOutput("hangmanOutput", buildString());
            win = checkWin();
            descriptiveEmoji = (numberOfGuesses > 15 ?
                "🐌" : (numberOfGuesses > 7 ? "🐗" : "🐎"));

            if (win) {
                document.getElementById("hangmanSecondary").innerText += winMessage();
                document.getElementById("playAgainButton").style.display = "inline-block";
            }
        }

        document.getElementById("hangmanInput").value = "";
    })

    showNav.addEventListener('click', () => {
        let element = document.getElementById("nav");
        element.classList.toggle("open");
        console.log(element.classList);
    })
});