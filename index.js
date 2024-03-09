/**                         To make easier to find section
 * ***********************************************************************************************************************************************************************************************************
 * *******         ***********    **************      **********************       **********************              ****    **********    ****        **********    *********        **********************
 * *******    **    **********    *************        ******************            ********************              ****    **********    ****    *    *********    *******            ********************
 * *******    ****    ********    ************    **    ***************    *******    *******************    **************    **********    ****    **    ********    *****    ********    ******************
 * *******    *****    *******    ***********    ****    ************    *********    *******************    **************    **********    ****    ***    *******    ****    **********    *****************
 * *******    *******    *****    **********    ******    **********    *********************************    **************    **********    ****    ****    ******    ***    ********************************
 * *******    *******    *****    *********    ********    ********    **********************************           *******    **********    ****    *****    *****    ***    ********************************
 * *******    *******    *****    ********                  *******    **********************************    **************    **********    ****    ******    ****    ***    ********************************
 * *******    *******    *****    *******    ************    ******    ******         *******************    **************    **********    ****    *******    ***    ***    ********************************
 * *******    ******    ******    ******    **************    ******    **********    *******************    ***************    *********    ****    ********    **    ****    **********    *****************
 * *******    ****    ********    *****    ****************    ******    ********    ********************    ****************    *******    *****    *********    *    *****    *******    *******************
 * *******          **********    ****    ******************    *******             *********************    ******************           *******    **********        *******           *********************
 * ***********************************************************************************************************************************************************************************************************
 */
/**
 *  Diagnostic functions
 */

let infiniteLoopProtectionCounter1 = 0;
let infiniteLoopProtectionCounter2 = 0;
let infiniteLoopProtectionCounter3 = 0;

const TESTING_MODE = true;
function testPoints(message, arg1 = '', arg2 = '', arg3 = '', arg4 = '') {
    if (TESTING_MODE === true) {
        console.log(message, arg1, arg2, arg3, arg4);
    }
}

/**
 *  End Diagnostic Functions
 */

/**                         To make easier to find section
 * 
 * **************************************************************************************************************************************************
 * **************************************************************************************************************************************************
 * ************      ******   ****************      ***********        ********        **************************************************************
 * **********   ****   ****   ***************   **   *********   ****   ******   ****   *************************************************************
 * *********   ******   ***   **************   ****   ********   *************   ********************************************************************
 * *********   ************   *************   ******   ********      **********       ***************************************************************
 * *********   ************   ************              ************    ************    *************************************************************
 * **********   ****   ****   ***********   **********   *****   ****   ******   ****   *************************************************************
 * ************       *****          ***   ************   *****        ********        **************************************************************
 * **************************************************************************************************************************************************
 * **************************************************************************************************************************************************
 */

class TicTacToe {

    // Private variables for internal use by class and class methods 

    // Table of grid pattern combinations and corresponding index values
    #winningPatternLookupTable = [
        {IndexSequence: [0, 1, 2], GridPattern: 'Left Column'},
        {IndexSequence: [0, 3, 6], GridPattern: 'Top Row'},
        {IndexSequence: [0, 4, 8], GridPattern: 'Diagonal from Top Left'},
        {IndexSequence: [1, 4, 7], GridPattern: 'Middle Row'},
        {IndexSequence: [2, 4, 6], GridPattern: 'Diagonal from Bottom Left'},
        {IndexSequence: [2, 5, 8], GridPattern: 'Bottom Row'},
        {IndexSequence: [3, 4, 5], GridPattern: 'Middle Column'},
        {IndexSequence: [6, 7, 8], GridPattern: 'Right Column'}
    ];

    #turnsCounter = 0; // To track player turns
    #turnsCounterLatestBeforeEnd;

    // For testing on console, computer vs computer
    #computerMovesCounter = 0; // To act as a factor in delaying computer actions for viewer to keep track of progression of game

    // Array to hold current running game board selections
    #gameBoard = new Array(9).fill(undefined);

    // Array to hold winning patterns when discovered
    #winningPatternResults = [];

    // Token variables for convenience for testing
    #x = 'X'; 
    #y = 'Y';

    // Game running status
    #isInProgress = false;

    // Winner object
    #winner = {
            Name: '',
            Token: '',
            PatternIndices: [] // Possible win by multiple rows
        };


    #MAX_PLAYERS = 2;
    
    #gameBoardPaused = false;
    
    // Expecting JSON object to include player count and player details
    constructor() {

        let x = this.#x;
        let y = this.#y;

        this.players = [
            {
                Name: '',
                Token: ''
            }
        ];
    }

    pauseGame(booleanVal) {
        // Flag for external use to indicate request exists for pausing game. Does not impact object directly except for boolean value from flag
        if (booleanVal === true) {
            this.#gameBoardPaused = true;
        } else {
            this.#gameBoardPaused = false;
        }
    }

    isPaused() {
        return this.#gameBoardPaused; // Returns pause status
    }

    // Rolls dice to determine first player
    whosFirst() {
        let playerIndex = parseInt(Math.random() * 100) % this.#MAX_PLAYERS; // Random index returns 0 or 1
        testPoints(`Class Method: whosFirst, player index to start is ${playerIndex}`);
        return playerIndex;
    }

    // Returns index of player currently in turn
    whoseTurnIndex(option) {
        let turnIndex = this.#turnsCounter;

        if (option === 'latest' && this.#isInProgress === false) {
            return this.#turnsCounterLatestBeforeEnd % this.#MAX_PLAYERS;
        }

        if (turnIndex === undefined) {
            return turnIndex; // Undefined indicates game is stopped and nobody's turn
        } else {
            turnIndex = this.#turnsCounter % this.#MAX_PLAYERS; // Returns turn of current index corresponding to player

            return turnIndex;
        }
    }

    // Used as a factor to delay "computer" player's moves each turn
    getComputerMovesCounter() {
        return this.#computerMovesCounter++; // return count then increment
    }

    // Initializes game board and counters
    startRound(playersObjectArray) {

        // Initialize game with player object array
        this.players = playersObjectArray;

        // testPoints are test point messages sent to the console used for debugging and development
        testPoints(`Class Method: startRound, Players Object contains ${this.players} of size ${this.players.length}`);
        testPoints(`Class Method: startRound, Players index 0 Name: ${this.players[0].Name}, Token: ${this.players[0].Token}`);
        testPoints(`Class Method: startRound, Players index 1 Name: ${this.players[1].Name}, Token: ${this.players[1].Token}`);

        // Get starting player
        let players = this.players;
        testPoints(`Class Method: startRound, players object contains ${players.length} items`);
        testPoints(`Class Method: startRound, players Name for index 0 is ${players[0].Name}`);
        testPoints(`Class Method: startRound, players Token for index 0 is ${players[0].Token}`);

        // Can only start game if no game in progress and not stopped
        if (this.#turnsCounter === 0 && this.#isInProgress === false) {
            testPoints(`Class Method startRound: Getting whoseFirstIndex: ${this.whosFirst()}`);
            this.#turnsCounter = this.whosFirst(); // Sets turns counter to index of starting player
            this.#isInProgress = true; // set game status to started

            let playerIndex = this.whoseTurnIndex();
            testPoints(`Class Method: startRound, player index is ${playerIndex} of type ${typeof(playerIndex)}`);
            testPoints(`Class Method: startRound, player Name is ${this.players[playerIndex].Name}`);

            return this.#turnsCounter; // return starting player index

        } else {
            return "A game is already in progress";
        }
    }

    // Method to simulate a selection made by the computer. Method extracts a collection of available game board indexes and randomly selects one and returns value
    computerSelectsMove(playerIndex) {
        // Logic for computer selection
        // Need to select a random square ID on game board from available selections
        
        // Lets get all available indexes, those where value is undefined. Using method to return a collection of index values corresponding to undefined elements in game board
        let available = getPlayerSelectionIndices(this.#gameBoard, undefined); // Returns an array of index values matching criteria
        testPoints(`Class method: computerMakesMove, Expecting array of index values for undefined elements. Results Count: ${available.length}`);

        testPoints(`Class Method: computerMakesMove. Showing available indexes: ${available.join(', ')}`);

        // Get random value from array of available 
        let random = parseInt(Math.random() * 100) % available.length;
        let selectionIndex = available[random]; // selectionIndex from collection of index values in available

        testPoints(`Class Method: computerSelectsMove, players index ${playerIndex} selects gameboard index ${selectionIndex}`);
        
        // Returns chosen gameboard index required for making a move with playerMove method
        return selectionIndex;
    }

    // Method to initiate player's selected move and record it into the current gameboard array
    makeMove(playerIndex, selectionIndex) {

        // Check if game is not over. Returns message if game is over.
        if (this.isGameOver() === true) {

            // Check if winner found
            if (this.getWinner() !== undefined) {
                let patterns = () => {
                    let patterns = [];
                    this.#winner.PatternIndices.forEach(patternIndex => {
                        patterns.push(this.#winningPatternLookupTable[patternIndex].GridPattern);
                    });

                    return patterns.join(' and '); // In case more than one.
                }
                return `Game over. ${this.#winner.Name} is the winner with 3 in a row at:\n${patterns()}`;

            } else {
                // No winner
                return 'Game over. No winner.'
            }
        }

        // Check if player index has valid turn to prevent player taking double turns
        if (playerIndex !== this.whoseTurnIndex()) {
            return 'Not your turn';
        } 

        // Attempt to reserve selection for player

        let players = this.players;
        testPoints(`Class Method: makeMove, players object contains ${players[playerIndex]}`);
        testPoints(`Class Method: makeMove, players object contains ${this.players[playerIndex]}`);
        let selection = this.#gameBoard[selectionIndex];
        
        // Checks to see if player's selection is not currently assigned
        if (selection === undefined) {
            this.#gameBoard[selectionIndex] = players[playerIndex].Token;
            testPoints(`Class Method: makeMove. Player ${players[playerIndex].Name} selected gameboard index ${selectionIndex}. Game Board value in selected index is ${this.#gameBoard[selectionIndex]}`);

            testPoints(`Class Method: makeMove. Showing current game board: ${this.#gameBoard.join(', ')}`);
            // Test for winning matches
            // Get player's current selections
            let playerSelections = this.#getPlayerSelections(this.#gameBoard, players[playerIndex].Token, true); // gets binary representation of board according to player selections
            let winningPatterns = this.get3inRowMatchesA(playerSelections);

            if (winningPatterns.length > 0) {
                
                // Player wins. Stop game.
                this.#winner.Name = players[playerIndex].Name;
                this.#winner.Token = players[playerIndex].Token;
                this.#winner.PatternIndices = winningPatterns;
                this.endGame();
                return 1; // Indicate end of game with winner

            } else if (this.#getPlayerSelections(this.#gameBoard, undefined).length === 0) {
                // Game board is full and game is over
                this.endGame();
                return -1; // Indicate end of game with no winner
            }

            this.#turnsCounter++; // Increment turn
            return 0; // indicate success
        } else {
            return `Selection already filled by ${this.#gameBoard[selectionIndex]}`;
        }
    }

    endGame() {
        // Stop Game without resetting data
        this.#isInProgress = false;
        this.#turnsCounterLatestBeforeEnd = this.#turnsCounter; // Main counter is set to undefined to indicate that game is over but not reset. Copying counter to still be able to last turn index via option parameter in method.
        this.#turnsCounter = undefined;
    }

    isGameOver() {
        return !this.#isInProgress; // Returns opposite of this.#isRunning
    }

    resetGame() {
        // Reset game data but keep players object to restart match
        this.#gameBoard.fill(undefined);
        this.#turnsCounter = 0;
        this.#isInProgress = false;

        // Clear winner object data
        this.#winner = {
            Name: '',
            Token: '',
            PatternIndices: [] // Possible win by multiple rows
        };
    }

    getWinner(itemName) {
        
        testPoints(`Class Method: getWinner, Reading winner object ${this.#winner.PatternIndices}`)
        testPoints(`Class Method: getWinner, Reading winner object length of array of winning indeces = ${this.#winner.PatternIndices.length}`)
        // If winner exists, returned array should have length > 0
        if (this.#winner.PatternIndices.length > 0) {
            
            // If no parameter, return winner object
            if (itemName === undefined) {
                return this.#winner; // Return winner object
            
            } else if (itemName == 'Name') {
                return this.#winner.Name;

            } else if (itemName === 'PatternIndices') {
                return this.#winner.PatternIndices;

            } else if (itemName === 'Token') {
                return this.#winner.Token;
            }

        } else {
            return undefined; // make it easier to understand no winner
        }
    }

    getPatternFromIndex(patternIndex) {
        return this.#winningPatternLookupTable[patternIndex]; // Return pattern object at pattern index. Object includes index array and string value of winning pattern.
    }
    /** 
     *  Returns array of index values chosen by player (default) or 
     *  returns array of 0s and 1s correlating to player's choices 
     *  on current game board. Private function used internally
    */
    #getPlayerSelections(array, tokenValue /* X or O */, convertToBinary = false) {

        let tempArray = [];
    
        array.map((element, index) => {
            
            if (convertToBinary) {
                if (element === tokenValue) {
                    tempArray[index] = 1;
                } else {
                    tempArray[index] = 0;
                }
            } else {
                if (element === tokenValue) {
                    tempArray.push(index);
                }
            }
        });
    
        return tempArray;
    }

    getPlayer(playerIndex) {
        return this.players[playerIndex];
    }

    getPlayers() {
        return this.players;
    }

    getPlayerName(playerIndex) {
        return this.players[playerIndex].Name;
    }

    getPlayerToken(playerIndex) {
        return this.players[playerIndex].Token;
    }

    getGameBoard() {
        // Return copy of game board array
        return this.#gameBoard.slice(0);
    }

    // Return all 3-in-a-row matches
    get3inRowMatchesA(playerArray) {

        /**
         *  In an array representing a tic-tac-toe grid with the index order laid out along the columns, such as:
         * 
         *      0   3   6
         *      1   4   7
         *      2   5   8 
         * 
         *  The diagonals are represented by index values [0, 4, 8] and [2, 4, 6]. 
         *  When the same array is flattened with the index values in ordinal sequence, such as below:
         * 
         *      0   1   2   3   4   5   6   7   8 
         * 
         *  One of the diagonals is represented by the outer extremes of the array, index values 0, 8. Similarily,
         *  if we extract the inner 5 elements and discard the first and last 2, we again have a diagonal represented
         *  by the extremes of the array. In both cases, the middle index is common to both sets of test points we need
         *  to check for detecting a diagonal.
         * 
         *  Now, on the same grid pattern, when we look at the rows and columns, the index values are as follows:
         * 
         *  For rows, the sets of index values are [0, 3, 6], [1, 4, 7], and [2, 5, 8]
         * 
         *  For columns, the sets of index values are [0, 1, 2], [3, 4, 5], and [6, 7, 8]
         * 
         *  If we look closely, we can observe that if we constrain the playing grid array to the extremes of the testing
         *  set of points, we encounter the same relationship as in our observations of diagonals. The outer values along
         *  with the middle (center) value are the indicators of a successful three-in-a-row arrangement.
         * 
         *  Example: for 3 in a row at bottom row, represented by index values [2, 5, 8] and constraining game board array
         *  as [2, 3, 4, 5, 6, 7, 8] (NOTE: the actual index values would shift by 2 so this is only for illustrative purposes),
         *  we can observe, that the points in our testing set are indeed represented by the outer values of the contstrained
         *  array, and the center value of our testing set is also the center value of our constrained array.
         * 
         *  Now for the actual testing algorithm. In a loop, iterating through the possible patterns represented by their
         *  corresponding set of index values to match, we will slice a copy of the player's selections along the game board
         *  array, converting player's selections to binary 1s and 0s, then constraining the resulting array to the limits 
         *  defined of in our current test values, then test for whether the player has selected those values. We simply
         *  test for a truthy condition of (1 && 1 && 1) corresponding to the outer index values plus the center value then
         *  cast to a strict boolean value of true or false. A Boolean true indicates a successful match to the pattern. Upon
         *  a successful match, we push the index value which corresponds to the current test pattern to our collection of 
         *  winning index values. The collection alows us to indicate to the players by which pattern or patterns the winning 
         *  player has won.
         */
    
        let matchedIndexes = [];
        let patternsArray = this.#winningPatternLookupTable;
    
        for (let winningPatternIndex = 0; winningPatternIndex < patternsArray.length; winningPatternIndex++) {
            
            let startIndex = patternsArray[winningPatternIndex].IndexSequence[0];
            let endIndex = patternsArray[winningPatternIndex].IndexSequence[2];
            
            let testingPlayerArray = playerArray.slice(startIndex, endIndex + 1);
            
            testPoints(`Class Method: get3inRowMatchesA, Testing set =`, patternsArray[winningPatternIndex].IndexSequence.join(', '), `and player slections are ${playerArray.join(', ')}`);
            testPoints(`Class Method: get3inRowMatchesA, Player Test Array start index = ${startIndex}, end index = ${endIndex}, size of array = ${endIndex - startIndex + 1}\n`);
    
            let testForMatch = (index) => {
                testPoints(testingPlayerArray.length)
                let start = 0;
                let end = testingPlayerArray.length - 1;
                let center = parseInt(testingPlayerArray.length / 2);
                testPoints(`Class Method: get3inRowMatchesA, Start = ${start}, Center = ${center}; End = ${end}\n***\n`)
        
                let isMatch = Boolean( testingPlayerArray[start] && testingPlayerArray[center] && testingPlayerArray[end] ) // Testing outer and center index values which represent a possible 3-in-a-row sequence
                
                if (isMatch) {
                    matchedIndexes.push(index);
                }
            };
    
            testForMatch(winningPatternIndex); 
        }
    
        return matchedIndexes;    
    }

}

/**
 *  Supplemental Functions Requires emoji.js included in html for collection of emoji values;
 */

let randomEmoji = () => {
    let random = parseInt(Math.random() * emojis.length) % emojis.length;
    testPoints(`Returning random emoji at index ${random}`);
    return emojis[random];
}

function getEmojiObject(hexValue) {

    let emoji;

    if (hexValue !== undefined) {
        // If value was passed in U+hex format, such as U+1f912, then extract just the hex value
        if (hexValue.toLowerCase().startsWith('u+')) {
            hexValue = hexValue.substring(2);
        }
        testPoints(`Hex Value = ${hexValue}`);

        // Convert to unicode so we can test by finding value in emojis array
        let unicode = String.fromCodePoint('0x' + hexValue);

        testPoints(`Unicode value = ${unicode}`);
        // if successfull, returns emoji, else returns undefined
        let testForValidUnicode = emojis.find(value => value === unicode);
        emoji = testForValidUnicode;
    }

    testPoints(`Test for valid unicode result is ${emoji}`);
    if (emoji === undefined) {
        // Test failed, so generate random emoji and derive hex value
        emoji = randomEmoji();
        hexValue = emoji.codePointAt(0).toString(16);
        testPoints("Random Emoji is " + emoji);
    }

    // At this point emoji and hex value are valid, so build emoji object

    // imgTag is an image from Google Fonts that returns an animated gif image version of the emoji
    let imgURL = `https://fonts.gstatic.com/s/e/notoemoji/latest/${hexValue}/512.gif`;
    
    let object = {emoji: emoji, hexValue: hexValue, imgURL: imgURL};

    testPoints(`Object: emoji = ${object.emoji}, Hex = ${object.hexValue}, ImgURL = ${object.imgURL}`);
    return object;
}

// Instantiate object
var game = new TicTacToe();

/**                         To make easier to find section
 * ***********************************************************************************************************************************************************************************************************
 * ****                **********            ********            ********       ********************       ***************************************************************************************************
 * ****                ********    *******    *******    *****    *******        ******************        ***************************************************************************************************
 * ****    *******************    *********    ******    ******    ******    *    ****************    *    ***************************************************************************************************
 * ****    ******************    ***********    *****    *******    *****    **    **************    **    ***************************************************************************************************
 * ****    *****************    *************    ****    *******    *****    ***    ************    ***    ***************************************************************************************************
 * ****                *****    *************    ****    ******    ******    ****    **********    ****    ***************************************************************************************************
 * ****    *****************    *************    ****            ********    *****    ********    *****    ***************************************************************************************************
 * ****    ******************    ***********    *****    ******    ******    ******    ******    ******    ***************************************************************************************************
 * ****    *******************    *********    ******    *******    *****    *******    ****    *******    ***************************************************************************************************
 * ****    ********************    *******    *******    ********    ****    ********    **    ********    ***************************************************************************************************
 * ****    **********************           *********    *********    ***    *********        *********    ***************************************************************************************************
 * ***********************************************************************************************************************************************************************************************************
 */


/**
 *  Form Control Functions
 */

// ----------------Event Handlers-----------------------------------------------------

// Close alert div when clicked
onClick('alert', 'click', () => {

    if (game.isGameOver() === true) {
        let alertDiv = document.getElementById('alert');

        setTimeout(() => {
            if (alertDiv.classList.contains('collapse') == false) {
                alertDiv.classList.add('collapse');
            }
        }, 1000);
    }
});

onClick('gameStartButton', 'click', () => {
    let numberOfPlayers = document.getElementById('formNumberOfPlayersSelected').value;
    testPoints(`Number of Players Selected = ${numberOfPlayers}`);

    let player1 = document.getElementById('formNamePlayer1').value;
    let tokenPlayer1 = document.getElementById('tokenPlayer1Selected').value;

    if (tokenPlayer1 === 'emoji') {
        tokenPlayer1 = document.getElementById('formEmojiUnicodePlayer1').value;
    }

    let player2 = document.getElementById('formNamePlayer2').value
    let tokenPlayer2 = document.getElementById('tokenPlayer2Selected').value;

    if (tokenPlayer2 === 'emoji') {
        tokenPlayer2 = document.getElementById('formEmojiUnicodePlayer2').value;
    }

    numberOfPlayers = parseInt(numberOfPlayers);  // Vaue from form field is string, convert to number

    // Set up required values for Computer Player 2 when 1 or 0 players is playing
    if (numberOfPlayers <= 1) {
        player2 = 'Computer';
    }

    // Set up required values for Computer Player 1 when 0 players are playing
    if (numberOfPlayers === 0) {
        player1 = 'Computer';
    }

    let players = [
        {
            PlayerCount: parseInt(numberOfPlayers) 
        },
        {
            Name: player1,
            Token: tokenPlayer1
        },
        {
            Name: player2,
            Token: tokenPlayer2
        }
    ]

    testPoints(`Function: onClick for playerStartButton, Player1 Name: ${players[1].Name}, Player1 Token: ${players[1].Token}`);
    testPoints(`Function: onClick for playerStartButton, Player2 Name: ${players[2].Name}, Player2 Token: ${players[2].Token}`);

    let formErrors = false;

    if (numberOfPlayers == 2) {  // Form validation for Player 2
        if (player2 === '') {
            document.getElementById('requiredPlayer2').removeAttribute('hidden'); // Show input validation error
            formErrors = true;
        } else {
            document.getElementById('requiredPlayer2').setAttribute('hidden', 'hidden'); // Hide input validation error
        }

        if (tokenPlayer2 == '') {
            // tokenRequiredPlayer2
            document.getElementById('tokenRequiredPlayer2').removeAttribute('hidden'); // Show input validation error
            formErrors = true;
        } else {
            document.getElementById('tokenRequiredPlayer2').setAttribute('hidden', 'hidden'); // Hide input validation error
        }
    }

    if (numberOfPlayers >= 1) { // Form validation for Player 1
        testPoints(`Function: onClick for gameStart. Number of players = 1. Checking for player1 name = ${player1}`);
        if (player1 === '') {
            testPoints(`Function: onClick for gameStart. Player1 name is empty`);
            document.getElementById('requiredPlayer1').removeAttribute('hidden'); // Show input validation error
            formErrors = true;
        } else {
            document.getElementById('requiredPlayer1').setAttribute('hidden', 'hidden'); // Hide input validation error
        }

        if (tokenPlayer1 == '') {
            // tokenRequiredPlayer1
            document.getElementById('tokenRequiredPlayer1').removeAttribute('hidden'); // Show input validation error
            formErrors = true;
        } else {
            document.getElementById('tokenRequiredPlayer1').setAttribute('hidden', 'hidden'); // Hide input validation error
        }
    }

    // If no form errors, then hide input form and proceed with game
    if (formErrors === false) {
        document.getElementById('gameForm').classList.add('collapse');
        // Game Start
        startGame(players);
    }

});

onClick('formPlayer1RandomToken', 'click', () => {
    let emoji = randomEmoji();

    let emojiHexValue = emoji.codePointAt(0).toString(16);
    
    let emojiObject = getEmojiObject(emojiHexValue);

    testPoints(`Emoji hex value = ${emojiHexValue}; (emoji === emojiObject.emoji) is ${emoji === emojiObject.emoji}`);

    let field = document.getElementById('formEmojiUnicodePlayer1')
    field.value = emojiObject.hexValue;

    let img = document.getElementById('emojiPlayer1');
    img.setAttribute('src', emojiObject.imgURL);
    img.setAttribute('alt', emojiObject.emoji)
});

onClick('formPlayer2RandomToken', 'click', () => {
    let emoji = randomEmoji();

    let emojiHexValue = emoji.codePointAt(0).toString(16);
    
    let emojiObject = getEmojiObject(emojiHexValue);

    testPoints(`Emoji hex value = ${emojiHexValue}; (emoji === emojiObject.emoji) is ${emoji === emojiObject.emoji}`);

    let field = document.getElementById('formEmojiUnicodePlayer2')
    field.value = emojiObject.hexValue;

    let img = document.getElementById('emojiPlayer2');
    img.setAttribute('src', emojiObject.imgURL);
    img.setAttribute('alt', emojiObject.emoji)
});

let radiosForNumberOfPlayers = document.getElementById('formNumberOfPlayers').getElementsByTagName('input');
let radiosTokenPlayer1 = document.getElementById('formPlayer1_Token').getElementsByTagName('input');
let radiosTokenPlayer2 = document.getElementById('formPlayer2_Token').getElementsByTagName('input');

onClick(radiosTokenPlayer1, 'click', () => {

    let selectedRadioItem;

    // Determin ID of radio selection for Player 1 token
    for (let radio of radiosTokenPlayer1) {
        if (radio.checked) {
            selectedRadioItem = radio.id;
        }
    }

    // Selecting emoji token enables input field for unicode value
    if (selectedRadioItem === 'radioPlayer1_Emoji') {
        document.getElementById('formEmojiUnicodePlayer1').removeAttribute('disabled'); // Enable form field for emoji hex value
        document.getElementById('formPlayer1RandomToken').removeAttribute('disabled');  // Enable emoji generator button
        document.getElementById('formPlayer1RandomToken').classList.remove('btn-secondary'); // 'Gray' color = disabled 
        document.getElementById('formPlayer1RandomToken').classList.add('btn-danger');  // 'Red' color = enabled
        document.getElementById('tokenPlayer1Selected').value = 'emoji'; // Record selection for form data collection
    } else {
        document.getElementById('formEmojiUnicodePlayer1').value = ''; // Clear emoji hex field if selecting other tokens
        document.getElementById('formEmojiUnicodePlayer1').setAttribute('disabled', 'disabled'); // Disable hex field
        document.getElementById('formPlayer1RandomToken').setAttribute('disabled', 'disabled'); // Disable emoji generator button
        document.getElementById('formPlayer1RandomToken').classList.remove('btn-danger'); // Remove button 'enabled' color class
        document.getElementById('formPlayer1RandomToken').classList.add('btn-secondary'); // Set button to 'disabled' color class
    }

    // Selecting X or O tokens causes token for player 2 to automatically change to the opposite token if the same token is selected.
    if (selectedRadioItem === 'radioPlayer1_X' || selectedRadioItem === 'radioPlayer1_O') {

        let token = selectedRadioItem[selectedRadioItem.length - 1]; // Get token from last character of element id

        let tokens = ['X', 'O'];
        let tokenIndex = tokens.indexOf(token);
        let oppositeTokenIndex = (tokenIndex + 1) % 2; // Calculate the index of opposite token. If player 1 selects 'X', If player 2 also has 'X' selected we want to force change to 'O'

        let tokenPlayer2 = document.getElementById('radioPlayer2_' + tokens[tokenIndex]); // Testing if player 2 has the same token selected. We only need to change if they are the same.
        
        // If player 1 selects a token selected by player 2, overwrite player 2 selection
        if (tokenPlayer2.checked === true) {
            tokenPlayer2.checked = false;
            
            document.getElementById('radioPlayer2_' + tokens[oppositeTokenIndex]).checked = true;
            document.getElementById('tokenPlayer2Selected').value = tokens[oppositeTokenIndex];
        }

        document.getElementById('tokenPlayer1Selected').value = tokens[tokenIndex];
    } 
});

onClick(radiosTokenPlayer2, 'click', () => {

    testPoints(`Function: onClick for player 2 token selection`);
    let selectedRadioItem;

    // Error message is hidden on all click events unless triggered at end of function
    document.getElementById('tokenError').setAttribute('hidden', 'hidden');

    // Determin ID of radio selection for Player 2 token
    for (let radio of radiosTokenPlayer2) {
        if (radio.checked) {
            selectedRadioItem = radio.id;
        }
    }

    // Selecting emoji token enables input field for unicode value
    if (selectedRadioItem === 'radioPlayer2_Emoji') {
        document.getElementById('formEmojiUnicodePlayer2').removeAttribute('disabled');  // Enable form field for emoji hex value
        document.getElementById('formPlayer2RandomToken').removeAttribute('disabled');  // Enable emoji generator button
        document.getElementById('formPlayer2RandomToken').classList.remove('btn-secondary'); // 'Gray' color indicates disabled 
        document.getElementById('formPlayer2RandomToken').classList.add('btn-danger');  // 'Red' color indicates enabled
        document.getElementById('tokenPlayer2Selected').value = 'emoji'; // Record selection for form data collection
    } else {
        document.getElementById('formEmojiUnicodePlayer2').value = '';  // Clear emoji hex field if selecting other tokens
        document.getElementById('formEmojiUnicodePlayer2').setAttribute('disabled', 'disabled'); // Disable hex field
        document.getElementById('formPlayer2RandomToken').setAttribute('disabled', 'disabled'); // Disable emoji generator button
        document.getElementById('formPlayer2RandomToken').classList.remove('btn-danger'); // Remove button 'enabled' color class
        document.getElementById('formPlayer2RandomToken').classList.add('btn-secondary'); // Set button to 'disabled' color class
    }

    // Selection of X or O availability is determined by Player 1's selections to avoid duplicate tokens
    if (selectedRadioItem === 'radioPlayer2_X' || selectedRadioItem === 'radioPlayer2_O') {

        let token = selectedRadioItem[selectedRadioItem.length - 1]; // Get token from last character of element id

        let tokens = ['X', 'O'];
        let tokenIndex = tokens.indexOf(token);
        let oppositeTokenIndex = (tokenIndex + 1) % 2; // Calculate the index of opposite token. If player 1 selects 'X', If player 2 also has 'X' selected we want to force change to 'O'

        let tokenPlayer1 = document.getElementById('radioPlayer1_' + tokens[tokenIndex]); // Testing if player 2 has the same token selected. We only need to change if they are the same.
        let tokenPlayer2 = document.getElementById(selectedRadioItem);
        
        if (tokenPlayer1.checked === true) {  // If Player 2 has selected a token already chosen by Player 1, 
            tokenPlayer2.checked = false;     // remove Player 2's selection and change to the opposite token.
            document.getElementById('radioPlayer2_' + tokens[oppositeTokenIndex]).checked = true;
            document.getElementById('tokenError').removeAttribute('hidden'); // Indicate why selection cannot be granted
            document.getElementById('tokenPlayer2Selected').value = tokens[oppositeTokenIndex]; // Record selection for form data acquisition
        } else {
            document.getElementById('tokenError').setAttribute('hidden', 'hidden'); // Hide all error prompts
            document.getElementById('tokenPlayer2Selected').value = tokens[tokenIndex]; // Record selection for form data acquisition
        }
    } 

    testPoints(`Function onClick for Player2 token selection. Player 2 Token value in hidden field at exit of function: ${document.getElementById('tokenPlayer2Selected').value}`)
});

onClick(radiosForNumberOfPlayers, 'click', () => {

    let selectedRadioItem;

    for (let radio of radiosForNumberOfPlayers) {
        if (radio.checked) {
            selectedRadioItem = radio.id;
        }
    }

    let showDiv = (id) => {
        let divElement = document.getElementById(id);

        if (divElement.classList.contains('collapse') === true) {
            divElement.classList.remove('collapse');
        }
    };

    let hideDiv = (id) => {
        let divElement = document.getElementById(id);

        if (divElement.classList.contains('collapse') === false) {
            divElement.classList.add('collapse');
        }
    };

    switch(selectedRadioItem) {
        case 'radioOption1':  // 1 Player
            showDiv('formPlayerEntry')
            hideDiv('formPlayer2')
            document.getElementById('formNumberOfPlayersSelected').value = 1;
            document.getElementById('radioPlayer1_X').checked = true;
            document.getElementById('radioPlayer2_O').checked = true;
            break;
        case 'radioOption2':  // 2 Players
            showDiv('formPlayerEntry');
            showDiv('formPlayer2');
            document.getElementById('formNumberOfPlayersSelected').value = 2;
            break;
        case 'radioOption3': // Demo Mode (0 Players)
            hideDiv('formPlayerEntry');
            document.getElementById('formNumberOfPlayersSelected').value = 0;
            document.getElementById('radioPlayer1_X').checked = true;
            document.getElementById('radioPlayer2_O').checked = true;
            break;
    }
    
});

function onClick(elementObjectOrID, eventType = 'click', action) {

    if (elementObjectOrID instanceof HTMLCollection) {
        let collection = elementObjectOrID;
        for (let element of collection) {
            element.addEventListener(eventType, action);
        }
        return collection;

    } else if (typeof(elementObjectOrID) === 'string') {
        let element = document.getElementById(elementObjectOrID);
        element.addEventListener(eventType, action);
        return element;
    }
}
// ------Form Functions------------------------------------------------

let announementCounter = 0;
let announce = {
    Title: (announceTitle) => {
        let title = document.getElementById("alert-title");
        title.innerHTML = announceTitle;
        document.getElementById('alert').getElementsByTagName('p').item(0).innerHTML = '';
    },
    Info: (announceMessage) => {
        let messageElement = document.getElementById('alert');
        let messageArea = messageElement.getElementsByTagName('p');
        messageArea.item(0).innerHTML = announceMessage;
    },
    sendAlert(timeoutValue = 0) {
        let messageID = announementCounter; // ID to track message relevancy
        let alertDiv = document.getElementById('alert');

        if (alertDiv.classList.contains('collapse') == true) {
            alertDiv.classList.remove('collapse');
        }

        announementCounter++;

        testPoints(`Alert Message Sent ID: ${announementCounter}`);
        if (timeoutValue > 0) {
            
            let messageID = announementCounter; // ID to track message relevancy

            setTimeout((id) => {
                testPoints(`Testing if alert timeout is ignored, respecting outdated message ID: ${id}: Latest message ID: ${announementCounter}`)
                if (id === announementCounter) {
                    let alertDiv = document.getElementById('alert');

                    if (alertDiv.classList.contains('collapse') == false) {
                        
                        alertDiv.classList.add('collapse');
                        announce.clear(); // Clear alert contents

                        testPoints(`Alert Message Timeout for Message ID: ${id}`);
                    }
                }
            },timeoutValue, messageID);
        }
    },
    clear() {  // Clear contents of alert div
        document.getElementById("alert-title").innerHTML = '';
        document.getElementById('alert').getElementsByTagName('p').item(0).innerHTML = '';
    }
};

// Send message to game status board
function sendGameStatus(message) {

    document.getElementById('statusMessage').innerHTML = message;

}

function buttonClicked(id) {

    testPoints(`Game Board Button ${id} Clicked`)

    // check if button already taken
    let tokenElementID = 'token-' + id[id.length - 1];
    let tokenElement = document.getElementById(tokenElementID);
    let tokenContent = tokenElement.innerText;

    if (tokenContent != '?') {
        return; // Button is already taken. Ignore event
    }

    // Check if game is paused
    // If game is paused, ignore controls
    if (game.isPaused() === false && game.isGameOver() === false) {
        
        playerMove(id); // Initiate player actions

    } else {
        
        testPoints(`Game Board Button Clicked, but game is paused or game is over. Ignoring events.`)
    }
}

function computerMove() {
    // Computer's move
    
    let movesCounter = game.getComputerMovesCounter(); // Will act as a delay factor when incremented

    // Pause game until computer makes move
    game.pauseGame(true);

    // Need to delay computer play to be able to follow game progress
    setTimeout(() => {
        // Some action by computer here
        let computerPlayerIndex = game.whoseTurnIndex();
        let computerPlayerMove = game.computerSelectsMove();

        testPoints(`Function: computerMakesMove, inside timeout function.`)
        game.pauseGame(false); // unpause game board and send values to playermove function
        playerMove(computerPlayerMove, computerPlayerIndex);

    }, 3500);
}

function playerMove(playerSelectionIndex, playerIndex) {
    // Player's move

    let selectionIndex;
    let buttonID;
    let tokenElementID;
    let playerTokenImgURL;

    // If player index is undefined, this means a button was pressed on game board, which only sends selection index derived from button ID
    if (playerIndex === undefined) {
        buttonID = playerSelectionIndex; // Value sent from button needs to be parsed for selection index
        selectionIndex = parseInt(buttonID[buttonID.length - 1]); // get number value from button id string
        testPoints(`Function: playerMove, Getting selection index from button id ${selectionIndex}`);

        playerIndex = game.whoseTurnIndex();

    } else {
        selectionIndex = playerSelectionIndex;
        buttonID = 'button-' + playerSelectionIndex;
    }

    // Now we have basic data

    // Trigger button animation
    document.getElementById('button-grid-' + selectionIndex).animate([{rotate: '0 0 0 1deg'}, {rotate: '0 10 0 180deg'}], 1000);
    
    // Change color
    document.getElementById('button-grid-' + selectionIndex).classList.remove('bg-primary');
    document.getElementById('button-grid-' + selectionIndex).classList.add('bg-danger');

    // Scroll to grid to see play
    document.getElementById('gameBoard').scrollIntoView({behavior: "instant"});

    // Update token on button face
    let playerToken = game.getPlayerToken(playerIndex);

    // Player token is a string, update token text on button face. Value will be 'X', 'O', or emoji hex value
    tokenElementID = 'token-' + selectionIndex;

    let tokenElement = document.getElementById(tokenElementID);
    tokenElement.innerHTML = playerToken;

    if (playerToken !== 'X' && playerToken !== 'O') {
        // Player token is emoji
        
        tokenElementID = 'token-image-' + selectionIndex; // Token is emoji
        testPoints(`Function: playerMove, Getting token-image-id = ${tokenElementID}`);

        playerTokenImgURL = getEmojiObject(playerToken).imgURL;

        let tokenElement = document.getElementById(tokenElementID);
        testPoints(`Function: playerMove, Getting img element = ${tokenElement}`);

        tokenElement.setAttribute('src', playerTokenImgURL);
        tokenElement.removeAttribute('hidden');

        document.getElementById('token-' + selectionIndex).setAttribute('hidden', 'hidden');
    }

    testPoints(`Function: playerMove, Checking for turn index equality between current variable and oject data. ${playerIndex === game.whoseTurnIndex()}`);

    let moveResult = game.makeMove(playerIndex, selectionIndex);
    testPoints(`Function: playerMove. Player Index ${playerIndex} sends move data to game object. Result is ${moveResult}. Turn counter is now ${game.whoseTurnIndex()}`)
    
    if (moveResult != 0) {

        if (typeof(moveResult) === 'string') { // Message returned from game object
            testPoints(`Function: playerMove. Player move results in non 0 return value.`)
            sendGameStatus(moveResult);
        } else {
            if (moveResult === -1) { // Game over. No winner
                testPoints(`Function: playerMove. Player move results in non -1 return value. Game over with no winner`)
                sendGameStatus(`Game over. No winner.`);

                // Send to alert div
                announce.Title('Game Over - No Winner');
                announce.sendAlert();
            }
        }
    } else {
        // Player move is successfull
        let color = "text-primary" // Change color between player 1 and player 2 to make it more distinguishable
        if (game.whoseTurnIndex() === 1) {
            color = 'text-danger';
        }
        
        let announceDelay = 1500; // Delay change turn notifaction. When computer makes move, notifications seems to appear too quickly
        
        let turnIndex = game.whoseTurnIndex();
        if (turnIndex != undefined) {
            setTimeout(() => {
                sendGameStatus(`<span class="${color}" >Player ${game.getPlayerName(turnIndex)}'s move</span>`)
                announce.Title(`${game.getPlayerName(turnIndex)}'s turn`);
                announce.sendAlert(1500);
            }, announceDelay);
        }

    }

    if (game.whoseTurnIndex() === undefined){
        // Check for winner
        if (game.getWinner() != undefined) {

            // Game has winner, send to alert div
            let winner = game.getWinner();
            announce.Title(`!!!!Winner!!!!`);
            let patterns = () => {
                let patternNames = [];
                winner.PatternIndices.forEach((item) => {
                    patternNames.push(game.getPatternFromIndex(item).GridPattern);
                });

                return patternNames.join('\n');
            }

            let winnerToken = winner.Token;

            // Get emoji token from hex value if token not X or O
            if (winnerToken != 'X' && winnerToken != 'O') {
                winnerToken = getEmojiObject(winnerToken).emoji;
            }
            
            announce.Info(`${winner.Name} wins with 3 ${winnerToken}'s in a row:<br/>${patterns()}`);
            announce.sendAlert();

            // Send notice to status board
            sendGameStatus(`<span class="text-danger">Winner<br/> </span> ${winner.Name} with Token ${winnerToken}`);
        }
    } else {

        if (game.getPlayerName(game.whoseTurnIndex()) === 'Computer') {
            computerMove();
        }

    }

}

function startGame(formDataObject, startingPlayerIndex) {  // First parameter is players object built from form data. Second parameter is starting player's index for when game is reset and player data already exists.

    const gridSize = 9;
    let columnCount = 3;

    // Build game board content

    let gameBoard = document.getElementById('gameBoard');
    let content = '';
    

    for (let index = 0; index < gridSize; index++) {

        /**
         * The class was designed around index values sequenced along the columns rather than the rows, but our grid pattern must be built row-by-row.
         * We need to remap our button ids to correspond to the correct location on the 3x3 grid pattern. Modifying the class to accomodate an alternate 
         * sequence risks overcomplicating and breaking it and is unnecessary. Better to accomodate the index translation here.
        */

        let columnIndex = index % columnCount; 
        let rowIndex = parseInt((index - columnIndex) / columnCount);
        let buttIDValueOffset = parseInt(columnIndex * columnCount);
        let buttonIndexIDValue = rowIndex + buttIDValueOffset;
        testPoints(`Function: startGame, Translating index value to button ID value. Current Index = ${index}`);
        testPoints(`Function: startGame, Translating index value to button ID value. ID = ${buttonIndexIDValue}`);
        testPoints(`Function: startGame, Translating index value to button ID value. Column Index = ${columnIndex}`);
        testPoints(`Function: startGame, Translating index value to button ID value. Row Index = ${rowIndex}`);
        testPoints(`Function: startGame, Translating index value to button ID value. ID Offset = ${buttIDValueOffset}`);

        let classAppendList = '';

        testPoints(`Building Game Board At Index ${index}`);
        
        
        // Every start of first row, build "row" element of grid
        if (index % 3 === gridSize % 3) {
            content += `<div class="row">`;
        }

        // For animation effect, every alternating grid square will share an animation sequence (i.e., even vs odd squares)
        if (buttonIndexIDValue % 2 === 0) {
            // Even indexes will spin horizontally. Odds will spin vertically
            classAppendList += 'spin-horizontal ';
        } else {
            classAppendList += 'spin-vertical ';
        }

        content += `
        <div class="col-4">
            <div class="card glow bg-transparent border-0">
                <div id="button-grid-${buttonIndexIDValue}" class="${classAppendList} jumbotron grid-box bg-primary hover-shadow my-3 m-0 text-center text-white">
                    <div id="button-${buttonIndexIDValue}" class="jumbotron grid-button card glow bg-primary border-5 p-0 text-center" onclick="buttonClicked(this.id);">
                        <h1 id="token-${buttonIndexIDValue}" class="token text-center">?</h1>
                        <img id="token-image-${buttonIndexIDValue}" class="mx-auto" src="" hidden />
                    </div>
                </div>
            </div>
        </div>
        `;

        // Every last member of a row needs to append the clossing tag of the "row" div.
        if (index % (gridSize / 3) === 2) { // Result of this operation should yield 0, 1, or 2
            content += '</div>'
        }

    }

    gameBoard.innerHTML = content;

    // Now we need some game controls
    let statusBoard = document.getElementById('statusBoard');

    content = `
        <div id="status-board-container" class="jumbotron col-12 bg-white shadow">
            <div class="row">
                <div class="col-6 text-center mb-4">
                    <input id="buttonReset" type="button" class="btn-primary btn-lg" value="Cancel Game" /> 
                </div>
                <div class="col-6 text-center mb-4">
                    <input id="buttonReplay" type="button" class="btn-primary btn-lg" value="Restart Match" /> 
                </div>
                <div class="col-12">
                    <div class="container card jumbotron border-5 border-primary bg-white my-4">
                        <div class="container">
                            <div class="row">
                                <div class="col-sm-12 col-md-4 text-danger card py-2 m-auto text-center border-0" >
                                    <h3>Game Board Stats</h3>
                                </div>
                                
                                <div class="col-sm-12 col-md-5 card border-danger w-75 m-auto mb-2 pl-2 text-center text-primary jumbotron" >
                                    <h3 id="statusMessage" class="text-primary">&nbsp;</h3>
                                </div>
                            </div>
                        </div><br/>
                        <div id="statusBoardContent" class="container card py-4 bg-transparent">
                            <div class="row">
                                <div class="col-6">
                                    <div class="card pt-4 border-0 bg-transparent">
                                        <div id="cardPlayer1" class="card-title text-center">
                                            <h5 class="text-primary">Player1</h5>
                                            <h6 id="namePlayer1" class="card-subtitle mb-2 text-muted">Card subtitle</h6> 
                                        </div>
                                        <div class="token-statusboard card text-center m-auto bg-primary">
                                            <div id="tokenSymbolDivPlayer1" class="text-white glow m-auto">
                                                <span id="tokenSymbolPlayer1" class="py-4">X</span>
                                            </div>
                                            <div id="tokenImageDivPlayer1" class="collapse text-white glow m-auto">
                                                <img id="tokenImagePlayer1" class="mx-auto" src="https://fonts.gstatic.com/s/e/notoemoji/latest/1f60c/512.gif" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-6">
                                    <div class="card pt-4 border-0 bg-transparent">
                                        <div id="cardPlayer2" class="card-title text-center">
                                            <h5 class="text-danger">Player2</h5>
                                            <h6 id="namePlayer2" class="card-subtitle mb-2 text-muted">Card subtitle</h6>
                                        </div>
                                        <div class="token-statusboard card text-center m-auto bg-danger">
                                            <div id="tokenSymbolDivPlayer2" class="text-white glow m-auto">
                                                <span id="tokenSymbolPlayer2" class="">X</span>
                                            </div>
                                            <div id="tokenImageDivPlayer2" class="collapse text-white glow m-auto">
                                                <img id="tokenImagePlayer2" class="mx-auto" src="https://fonts.gstatic.com/s/e/notoemoji/latest/1f60c/512.gif" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class=col-1></div>
            </div>
        </div>
    `
    statusBoard.innerHTML = content;

    // Reset button event listeners
    onClick('buttonReset', 'click', () => {
        location.reload();
    });

    // Replay button event listener
    onClick('buttonReplay', 'click', () => {
        game.pauseGame(true);
        game.endGame();
        game.resetGame();

        let playersCountObject = {
            PlayerCount: 2
        };

        gamers.unshift(playersCountObject);
        
        startGame(gamers);
    });
    
    let buttonBoard = gameBoard.getElementsByClassName('grid-button');
    testPoints(`Function: startGame, Collecting elements of grid buttons. Inspecting contents: ${buttonBoard} is instance of HTML Collection (${buttonBoard instanceof HTMLCollection}), Item count = ${buttonBoard.length}`);
    
    
    // Form data argument expected in array with player count object at index 0 and player details in objects at index 1 and 2
    let players = formDataObject;
    testPoints(`Function: startGame, Player count = ${players[0].PlayerCount}`)

    if (players[0].PlayerCount === 2) {
        // Set up board content for Player 2
        
        testPoints(`Function: startGame, Player1 Name: ${players[1].Name}, Player1 Token: ${players[1].Token}`);
        testPoints(`Function: startGame, Player2 Name: ${players[2].Name}, Player2 Token: ${players[2].Token}`);
        // { Name: name, Token: token}
        let playerName = players[2].Name;
        let playerToken = players[2].Token; 
        document.getElementById('namePlayer2').innerHTML = playerName;

        // X and O tokens use text for tokens, so hide image related elements reserved for emoji tokens
        if (playerToken === 'X' || playerToken === 'O') {
            let imageDiv = document.getElementById('tokenImageDivPlayer2');

            // Hide token image if not emoji
            if (imageDiv.classList.contains('collapse') === false) {
                imageDiv.classList.add('collapse');
            }

            // Show token div for font-based token
            let symbolDiv = document.getElementById('tokenSymbolDivPlayer2');
            if (symbolDiv.classList.contains('collapse') == true) {
                symbolDiv.classList.remove('collapse');
            }

            // Assign symbol to game status board 
            document.getElementById('tokenSymbolPlayer2').outerText = playerToken;

        } else {
            // Show token images for emoji tokens
            let imageDiv = document.getElementById('tokenImageDivPlayer2');

            // Show token image if token is emoji
            if (imageDiv.classList.contains('collapse') === true) {
                imageDiv.classList.remove('collapse');
            }

            // Hide div for font-based token
            let symbolDiv = document.getElementById('tokenSymbolDivPlayer2');
            if (symbolDiv.classList.contains('collapse') == false) {
                symbolDiv.classList.add('collapse');
            }

            // Get src URL for emoji and set src attribute for image tag
            let emojiObject = getEmojiObject(playerToken);
            document.getElementById('tokenImagePlayer2').setAttribute('src', emojiObject.imgURL);
        }
    }

    if (players[0].PlayerCount >= 1) {
        // Set up board content for Player 1
        
        // { Name: name, Token: token}
        let playerName = players[1].Name;
        let playerToken = players[1].Token;
        document.getElementById('namePlayer1').innerHTML = playerName;

        // X and O tokens use text for tokens, so hide image related elements reserved for emoji tokens
        if (playerToken === 'X' || playerToken === 'O') {
            let imageDiv = document.getElementById('tokenImageDivPlayer1');

            // Hide token image if not emoji
            if (imageDiv.classList.contains('collapse') === false) {
                imageDiv.classList.add('collapse');
            }

            // Show token div for font-based token
            let symbolDiv = document.getElementById('tokenSymbolDivPlayer1');
            if (symbolDiv.classList.contains('collapse') == true) {
                symbolDiv.classList.remove('collapse');
            }

            // Assign symbol to game status board 
            document.getElementById('tokenSymbolPlayer1').outerText = playerToken;

        } else {
            // Show token images for emoji tokens
            let imageDiv = document.getElementById('tokenImageDivPlayer1');

            // Show token image if token is emoji
            if (imageDiv.classList.contains('collapse') === true) {
                imageDiv.classList.remove('collapse');
            }

            // Hide div for font-based token
            let symbolDiv = document.getElementById('tokenSymbolDivPlayer1');
            if (symbolDiv.classList.contains('collapse') == false) {
                symbolDiv.classList.add('collapse');
            }

            // Get src URL for emoji and set src attribute for image tag
            let emojiObject = getEmojiObject(playerToken);
            document.getElementById('tokenImagePlayer1').setAttribute('src', emojiObject.imgURL);
        }
    }

    // Setup game board for Computer player as Player2 if player count is 1
    if (players[0].PlayerCount <= 1) {
        // Set up board content for Player 2 as Computer (For 1 player mode or demo mode)
        
        // { Name: name, Token: token}
        let playerName = "Computer";
        let playerToken = players[2].Token;
        document.getElementById('namePlayer2').innerHTML = playerName;

        // Assign symbol to game status board 
        document.getElementById('tokenSymbolPlayer2').outerText = playerToken;
    }

    // Setup game board for Computer player as Player1 for Demo Mode or 0 players
    testPoints(`Function: startGame, Setting up Demo Player 1, Player Number Count = ${players[0].PlayerCount}`)
    if (players[0].PlayerCount == 0) {
        // Set up board content for Demo or Computer Player 2
        
        // { Name: name, Token: token}
        let playerName = "Computer";
        
        document.getElementById('namePlayer1').innerHTML = playerName;

        // Demo Player 1 using default symbols. No assignment necessary
    }

    // Scroll to status board after a second of board animation
    setTimeout(() => {
        document.getElementById('status-board-container').scrollIntoView({behavior: "smooth"});
        
        // Delay announcement until after the scroll
        setTimeout(() => {
            announce.Title('Start Game');
            announce.sendAlert(3000);
        }, 1500);
    }, 1000);

    ////////Starting game play////////////

    testPoints(`Function: startGame, testing current players object. Players: ${players} with length ${players.length} and Player Count: ${players[0].PlayerCount}`);
    testPoints(`Function: startGame, testing current players object. Players: ${players[1].Name} with ${players[1].Token} and ${players[2].Name} with ${players[2].Token}`);

    let gamers = players.slice(1); // Adjusting players object for class constructo argument expectations
    testPoints(`Function: startGame, testing current players object. Players: ${gamers[0].Name} with ${gamers[0].Token} and ${gamers[1].Name} with ${gamers[1].Token}, ${gamers.length} players total`);

    let playerTurnsIndex = game.startRound(gamers); // Instructs game object to initialize game and returns random index representing first player to begin
    
    // Pause game and Delay player turn announcement until after initial board animations and first message
    game.pauseGame(true);
    setTimeout((message) => {
        announce.Title(message);
        announce.sendAlert(2500);

        // Unpause game
        game.pauseGame(false);

        // Update status board
        let playerName = game.getPlayerName(game.whoseTurnIndex());
        sendGameStatus(`Player ${playerName} starts`);

        // If computer player's move then let computer make move
        if (playerName === 'Computer') {
            computerMove();
        }

        // Scroll to game grid after a second at the game status board
        setTimeout(() => {
            document.getElementById('gameBoard').scrollIntoView({behavior: "smooth"});
        }, 1500);

    }, 4000, `Player ${game.getPlayerName(game.whoseTurnIndex())}'s Turn`);
    
}

/**
 *  End Form Controls
 */

/**
 * ***********************************************************************************************************************************************************************************************************
 * *****            ******                ***    ******************    ************************************************************************************************************************************************************************
 * *****    *****    *****    ****************    ****************    *************************************************************************************************************************************************************
 * *****    ******    ****    *****************    **************    **************************************************************************************************************************************************************
 * *****    *******    ***    ******************    ************    ***************************************************************************************************************************************************************
 * *****    *******    ***            ***********    **********    ************************************************************************************************************************************************
 * *****    *******    ***    ********************    ********    *****************************************************************************************************************************************************************
 * *****    *******    ***    *********************    ******    *******************************************************************************************************************************************************************
 * *****    ******    ****    **********************    ****    ********************************************************************************************************************************************************************
 * *****    *****    *****    ***********************    **    ********************************************************************************************************************************************************************
 * *****            ******                ************        *********************************************************************************************************************************************************
 * ***********************************************************************************************************************************************************************************************************
 */

/**     
 *  Gameplay Functions in Development ** Skip to Class Section for game logic Line #648. Everything below this point is WIP and not yet functional
 */

/**
 *  Developing algorithm for pattern detection on game grid. The current class is using another idea I came up with after working on this one and was 
 *  faster to develop.
 */

function getPlayerSelectionIndices(array, value, convertToBinary = false) {

    let tempArray = [];

    array.map((element, index) => {
        
        if (convertToBinary) {
            if (element === value) {
                tempArray[index] = 1;
            } else {
                tempArray[index] = 0;
            }
        } else {
            if (element === value) {
                tempArray.push(index);
            }
        }
    });

    return tempArray;
}

function getWinningPatternIndices(baseValueIndex, TestPatternIndex) {
    
    /** 
     * We need to derive the index value of the winning sequence(s) within WINNING_INDEX_PATTERNS that 
     * correlates to the successful test pattern within the decision tree testing array. The order of 
     * sets of testing values in the testing tree corresponds with the order of sets of index sequences
     * stored within the patterns array. This means that the index value of our successful base index
     * along with the index value of the actual successful test can help us derive the matching pattern 
     * among the objects stored within WINNING_INDEX_PATTERNS.
    */

    /** 
     * Flattenning the testing tree one level from 3-dimensions to 2-dimensions brings all testing sets
     * to the same level. This also removes the empty index falues, leaving only valid test sets of
     * indices. By slicing the array at the index of the successful test, we are left with an array
     * of all preceeding test sets of indices. The length of that resulting array represents the number
     * of test sets that are located before the successful base value of our test. This number plus
     * the testing index of our actual test results in the desired index for locating the winning
     * pattern object. 
    */
    let flattenedTestArray = TEST_PATTERNS.slice(0, baseValueIndex).flat(1);
    let numberOfPreceedingTests = flattenedTestArray.length;
    let resultPatternIndex = numberOfPreceedingTests + TestPatternIndex;

    return resultPatternIndex;
}

let x = 'X';
let o = 'O';
let arr1 = [x,o,o,x,x,o,o,o,x];
let playerSelections = getPlayerSelectionIndices(arr1, x);
// Expected: [0, 3, 4, 8]


// Winning index patterns and corresponding game definitions
const WINNING_INDEX_PATTERNS = [
    {Array: [0, 1, 2], Pattern: 'Top Row'},
    {Array: [0, 3, 6], Pattern: 'Left Column'},
    {Array: [0, 4, 8], Pattern: 'Diagonal from Top Left'},
    {Array: [1, 4, 7], Pattern: 'Middle Row'},
    {Array: [2, 4, 6], Pattern: 'Diagonal from Bottom Left'},
    {Array: [2, 5, 8], Pattern: 'Bottom Row'},
    {Array: [3, 4, 5], Pattern: 'Middle Column'},
    {Array: [6, 7, 8], Pattern: 'Right Column'}
];

/** 
* Decision tree for testing patterns formatted in 3-dimensional array
* Tree length mathes game array length of 9 values. If a test value in 
* any of the tests fails, the value of this tree at the index matching 
* the failed test value will be replaced with a strict false, thereby 
* informing the testing procudure to skip any further testing involving 
* that value represented by the index holding the 'false' boolean.
*/

const TEST_PATTERNS = [
    [ [1, 2], [3, 6], [4, 8] ], // index 0 - Combinations starting with 0
    [ [4, 7] ],                 // index 1 - Combinations starting with 1
    [ [4, 6], [5, 8] ],         // index 2 - Combinations starting with 2
    [ [4, 5] ],                 // index 3 - Combinations starting with 3
    [],                            // index 4 - No patterns to test
    [],                            // index 5 - No patterns to test
    [ [7, 8] ],                 // index 6 - Combinations starting with 6
    [],                            // index 5 - No patterns to test
    []                             // index 5 - No patterns to test
]

// To track all found winning combinations since player might win with more than one combination 
let foundPatterns = [];

let arr2 = [2, 3, 4, 6];


/* 
* *** This is an attempt at developing a working algorithm on my own for the testing of
* *** winning tic-tac-toe combinations effectively while aiming for a linear time complexity.
* 
* *** My goal is to reach a working algorithm before searching online for established
* *** algorithms that may already perform with a linear time complexity. This part of
* *** my project is simply a personal challenge and not part of any requirements.
* 
* *** My Observations Below ***
* 
* If you layout the tic-tac-toe grid by index values, such that
* 
*     0   3   6                X   X   X
*     1   4   7   so that in   1   4   7    Here, the 'X' would occupy indices [0, 3, 6]   
*     2   5   8                2   5   8
* 
*                     or
* 
*     X   3   6
*     1   X   7   Here, the 'X' would occupy indices [0, 4, 8]
*     2   5   X
* 
* Using the index arrangement above, any desired grid patterns of X (three in a row) can 
* be represented by any one of 8 unique combinations of index values, so the goal here is
* to test for these patterns against the current collection of a player's selected index 
* values within the game board array, hopefully in an efficient manner. 
*
*
* Winning patterns starting at index 0 are [0, 1, 2], [0, 3, 6], and [0, 4, 8] 
* i.e, Top Row, Left Column, and Diagonal from Top Left
* 
* When testing a player's index selections for a winning index patterm,
* if index 0 exists in the subset of a player's selected indices, we continue testing for
* the next index in the current set of indices that include 0 until we reach a condition 
* that disqualifies the current set. On the first set we test for indices 0, 1, and 2. If
* 0 was successful, but 1 was not, we would not need to test for index 2, except that
* index 2 is also a member of another winning pattern. If we skip testing index 2, we would
* have to keep track and return to it for eventual testing. However we can continue with
* index 2, since we are already at index 1, which failed and invalidated the first set
* of 0-based index patterns. We proceed with index 2, then 3. We just keep track of the
* sets we disqualify. After index 4, if all previous index groups have been disqualified,
* we skip to index 6 because no other potential patterns begin with index 5, so no need
* to test for 5. Finally we test for indices 6, 7, and 8 which represent the last of the
* winning patters.

 */

function checkForWinningPattern(playerSelections = []) {
    testPoints(`Test Point 1: Player selections = `, playerSelections);
    /**
     * We will iterate through a testing tree, but we will disqualify base-index values
     * as we test to avoid duplicate testing and avoid unnecessarily exponential 
     * complexity operations. When a base value is disqualified, we do not need to test
     * any patterns that begin with the disqualified index value.
    */
    /**
     * We need to track failed index values. We could track these values in an array, but
     * that would mean having to iterate through the array to check whether the current 
     * index to test has been disqualifed. Iterating through another array works against 
     * the intended goal to maintain or lean toward a linear complexity. So, the approach
     * to take will be to ensure our tree array's indices correspond to our base index
     * values, so that the tree array at index 0 corresponds to all test patterns that 
     * begin with 0, and the tree array at index 1 corresponds to testing patterns starting
     * with 1, and so on. Each index position within the tree will include the test patterns
     * if any for that particular index value. We will disqualify failed test bases by 
     * removing all tests from the index corresponding to our current test index value.
     * If there are no tests present, we continue onto the next index while avoiding 
     * unnecessary tests. Since this will involve mutating our tree, we will make a copy
     * at the start of the test.
     */

    // Copy decision tree for testing combinations
    let tree = TEST_PATTERNS.slice(0); // We will be mutating tree as we test, so we need a disposable copy
    testPoints('Test Point 2: tree is copy of', tree);

    let foundWinningPatterns = []; // Array to hold the index of the winning patterns found - (to be returned)

    // Jumping to first index value in player's collection and skip irrelevant tests

    let baseValueIndex = playerSelections.slice(0, 1); // first value to test and first index of testing tree to follow
    for (let baseValueIndex = 0; baseValueIndex < tree.length; baseValueIndex++) {  // Setup loop for iterating through testing tree

        let testIndexCounter = 0
        testPoints('Test Point 3: Testing Tree has length =', tree.length);
        //testPoints('Test Poinit 4:')
        // Even though we start at index 0, we will jump to first index value in collection
        // and skip irrelevant tests.

        
        
        testPoints(`Test Point 4: Testing for base value ${baseValueIndex} with ${tree[baseValueIndex].length} sets of tests`);
        
        if (baseValueIndex != undefined) {  // At least 1 value exists in player's collection, so proceed with testing
            
            testPoints(`Test Point 5: Sets of tests at index ${baseValueIndex} =`, tree[baseValueIndex]);

            let testingSeries = tree[baseValueIndex]; // Get collection of test value sets
            let testValues = testingSeries[testIndexCounter]; // Get first set of test values from testing series if available
            
            testPoints('Test Point 6: Series at index %s has', baseValueIndex, testingSeries.length, 'sets of tests.');
            
            testPoints('Test Point 7: Entering while loop with test values =', testValues, `for index ${baseValueIndex}`);
            while (testValues != undefined) { // undefined when there are no remaining sets of test values

                let playerValues = playerSelections.slice(0); // Temp copy of player selected values to be consumed in while loop
                
                // get next index value from player's collection. First value determined test index. Now we test remaining values
                let playerValue = playerValues.shift(); // Get next of player's values

                testPoints(`Test Point WL1-1: player values = ${playerValues}. Current player value = ${playerValue}. Current base index = ${baseValueIndex}. Current set of test values include `, testingSeries[testIndexCounter]);

                let testValue = testValues.shift() // Extract next value from current testing set
                
                let isValid = () => (tree[testValue] !== false) ? true : false; // function to test validity of current test value. Testing for strict false.
                /**
                 *  The isValid function checks to see if the test tree at the index matching the base number to be tested 
                 *  has been overwritten with a false value boolean to disqualify it.
                 */
                testPoints(`Test Point WL1-2: Testing isValid function = ${isValid()}`);

                let currentTestSetValid = true;

                let testSuccess = () => {
                    // function to perform if test value passed test
                    testPoints(`Test Point WL1-3(SFA1): Entering Success function.`)
                    
                    if (testValue === undefined) { // testValue is undefined when there are no more values left in the current test
                        // If we made it to the end of testing set without disqualification, we must have a successful pattern
                        
                        // send both index values to function to determine pattern index then push returned value to collection of successful tests
                        let winningPattern = getWinningPatternIndices(baseValueIndex, testIndexCounter);
                        foundWinningPatterns.push(winningPattern); 
                                                                                                               
                        testPoints(`Test Point WL1-3(SFA2): Winning pattern = ${winningPattern}`);
                    } else {
                        testValue = testValues.shift(); // There remain more test values in current set of tests. Get next value
                        testPoints(`Test Point WL1-3(SFB1): Test was successful but not completed with test set. Next test value = ${testValue} at index ${baseValueIndex}`);
                    }
                }
    
                let testFail = () => {
                    // function to perform if test value failed test
                    testPoints(`Test Point WL1-4(FF1): Entering fail function.`);
                    tree[testValue] = false; // This will cause isValid() function to return false
                    
                    // If any test value within current set of test values fails, all remaining test values are also disqualified. Move to next set.
                    testValues = testingSeries[++testIndexCounter];  
                    
                    testPoints(`Test Point WL1-4(FF2): Test series disqualified. Moving on to sets`, testValues);
                }
                
                testPoints(`Test Point WL1-5: Entering 2nd while loop.`);
                while (testValue != undefined && isValid()) {

                    if (playerValue != undefined) {
                        testPoints(`Test Point WL2-A1: Player value exists and = ${playerValue}. Testing value = ${testValue}. Index at ${baseValueIndex}`);

                        // If test value is less than player's current value then mark test a falure
                        (testValue < playerValue) ? testFail() : (testValue === playerValue) ? testSuccess() : playerValue = playerValues.shift(); 

                        // If player value equaled test value the test is marked successful. If test value was equal to player value, we mark
                        // test as successful. If test value is greater, then get next player value and proceed with testing.
                    } else {
                        testPoints(`Test Point WL2-B1: Player value is undefined. Testing value = ${testValue}. Index at ${baseValueIndex}`);
                        testValue = testingSeries[testIndexCounter];
                    }

                    testPoints(`Test Point WL2-2: We should be starting new iteration or exiting while-loop 2. Test value = ${testValue}. Testing set validity = ${isValid()}. Base Index = ${baseValueIndex}. Testing index = ${testIndexCounter}`);
                    // While loop ends iteration. If test value still good, new iteration will begin with new player value and test value will remain unchanged.

                    infiniteLoopProtectionCounter3++;
                    if (infiniteLoopProtectionCounter3 >= 100) {
                        throw ("I think we have reached infinity at while loop-2")
                        break;
                    }
                }

                // We exit the previous loop when all test values have been tested for the current set of test values
                testIndexCounter++; // Increment testing index counter to proceed with the next set of test values

                infiniteLoopProtectionCounter1++;
                if (infiniteLoopProtectionCounter1 >= 100) {
                    throw ("I think we have reached infinity at while-loop 1")
                    break;
                }
            }
        }

        infiniteLoopProtectionCounter1++;
        if (infiniteLoopProtectionCounter1 >= 10) {
            throw ("I think we have reached infinity at for-loop 1")
            break;
        }
    }

    return foundWinningPatterns;
}


/** 
 *  End Gameplay Functions in Development
 */





