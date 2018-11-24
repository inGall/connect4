// Creates 2D array for Board
var arr = new Array();
var arrRows = 11;
for(var i=0; i<arrRows; i++) {
  arr[i] = new Array('','','','','','','','','','');
}

var remainingRow = [9,9,9,9,9,9,9,9,9]      // To keep track of remaining vacant rows in each column
var green = "green";
var purple = "purple";
var pink = "lightcoral";
var color;                                  // variable to store current color
var playerNum;                              // variable to store current player's number
var winner;                                 // boolean type to store status of winner   
var prevRow;                                // variable to store prev row (for undo purposes)
var prevCol;                                // variable to store prev col (for undo purposes)
var newGame;                                // variable to track if game has started (for undo purposes)                    
var undoLimitReached;                       // variable to limit undos at most once after each turn
var defaultStartMessage = "Player 1 starts";
var gameAlreadyOverMessage = "Game is already over! Press reset to restart the game";
var undoLimitReachedMessage = "Sorry, you can only undo your previous turn once."
var undoNotAvailableMessage = "It's a new game, there is nothing to undo!"
setInitialSettings();

function setInitialSettings() {
  for(var j=1; j<10; j++) { 
    for(var k=1; k<10; k++) {
      arr[j][k] = pink;
      document.getElementById(String(j) + String(k)).style.backgroundColor = pink;
    }
  }
  playerNum = 1;                            // Set default start number as Player 1
  color = purple;                           // Set default color as Purple
  winner = false;                           // Set default winner to false
  undoLimitReached = false;                 // Set default undo limit to false;
  newGame = true;                               
  remainingRow = [9,9,9,9,9,9,9,9,9]        // Set default vacancy as full 
  document.getElementById("status").innerHTML = defaultStartMessage;
}

function add(value) {
  if(!winner) {
    var row = remainingRow[value-1];
    document.getElementById(String(row) + String(value)).style.backgroundColor = color; 
    arr[row][value] = color;
    if(checkVictory(row, value)) {                        // Checks for victory every round
      openVictoryOverlay();
      winner = true;
    }
    color = (color === purple) ? green : purple;          // Swaps Color
    playerNum = (playerNum === 1) ? 2 : 1;                // Swaps player number
    remainingRow[value-1]--;                              // Updates vacancy in array
    document.getElementById("status").innerHTML = "Player " + playerNum + "'s turn";
    prevRow = row;
    prevCol = value;
    undoLimitReached = false;
    newGame = false;
  } else {
      alert(gameAlreadyOverMessage);
  }
}

/* Checks for victory using 4 different ways: Vertical, Horizontal, and both Diagonal directions */
function checkVictory(row, col) {
  var victory = false;
  victory = checkHorizontal(row, col) || checkVertical(row, col) || checkTopLeftDown(row, col) || checkBottomLeftUp(row, col)
  return victory;
}

function checkHorizontal(row, col) {
  const minCol = Math.max(1, col-3);
  const maxCol = Math.min(col+3, 9);

  if(maxCol - minCol < 3) {                       // Minimum is 4 columns
    return false;
  }

  var numSeries = 0;
  var prevColor;
  var currColor;

  for(var currCol=minCol; currCol<=maxCol; currCol++) { 
    currColor = arr[row][currCol];
    if(currColor == pink) {                       // Reset if empty row: Num series = 0 because its an empty cell
      numSeries = 0;
      prevColor = currColor;
    } else if(prevColor != currColor) {           // Reset if curr is diff from prev: Num series = 1 because its a new color
      numSeries = 1;
      prevColor = currColor;
    } else {                                      // Adds on to counter if curr is same as prev: Num series++  
      numSeries++;
      if(numSeries >= 4) {
        return true;
      }     
    } 
  }
  return false;
}

function checkVertical(row, col) {
  const minRow = Math.max(1, row-3);
  const maxRow = Math.min(row+3, 9);

  if(maxRow - minRow < 3) {                       
    return false;
  }

  var numSeries = 0;
  var prevColor;
  var currColor;

  for(var currRow=minRow; currRow<=maxRow; currRow++) { 
    currColor = arr[currRow][col];
    if(currColor == pink) {                      
      numSeries = 0;
      prevColor = currColor;
    } else if(prevColor != currColor) {          
      numSeries = 1;
      prevColor = currColor;
    } else {                                      
      numSeries++;
      if(numSeries >= 4) {
        return true;
      }     
    } 
  }
  return false;
}

function checkTopLeftDown(row, col) {
  const minRow = row - 3;
  const maxRow = Math.min(9, row+3);
  const minCol = col - 3;
  const maxCol = Math.min(9, col+3);

  var numSeries = 0;
  var prevColor;
  var currColor;

  for(var currRow=minRow, currCol=minCol; currRow<=maxRow, currCol<=maxCol; currRow++, currCol++) { 
    if(currRow >= 1  && currCol >= 1  && currRow <= maxRow && currCol <= maxCol) {
      currColor = arr[currRow][currCol];
      if(currColor == pink) {                      
        numSeries = 0;
        prevColor = currColor;
      } else if(prevColor != currColor) {           
        numSeries = 1;
        prevColor = currColor;
      } else {                                        
        numSeries++;
        if(numSeries >= 4) {
          return true;
        }     
      } 
    }
  }
  return false;
}

function checkBottomLeftUp(row, col) {
  const minRow = Math.max(1, row-3);
  const maxRow = row + 3;
  const minCol = col - 3;
  const maxCol = Math.min(9, col+3);

  var numSeries = 0;
  var prevColor;
  var currColor;

  for(var currRow=maxRow, currCol=minCol; currRow>=minRow, currCol<=maxCol; currRow--, currCol++) { 
    if(currRow <= 9 && currCol >= 1 && currRow >= minRow && currCol <= maxCol) {
      currColor = arr[currRow][currCol];
      if(currColor == pink) {                       
        numSeries = 0;
        prevColor = currColor;
      } else if(prevColor != currColor) {          
        numSeries = 1;
        prevColor = currColor;
      } else {                                      
        numSeries++;
        if(numSeries >= 4) {
          return true;
        }     
      }
    } 
  }
  return false;
}

function resetGame() {
  setInitialSettings();
  color = purple;
}

function undoTurn() {
  if(newGame) {
    alert(undoNotAvailableMessage);
  } else if(undoLimitReached) {
    alert(undoLimitReachedMessage);
  } else {
    document.getElementById(String(prevRow) + String(prevCol)).style.backgroundColor = pink; 
    arr[prevRow][prevCol] = pink;
    color = (color === purple) ? green : purple;          // Swaps Color
    playerNum = (playerNum === 1) ? 2 : 1;                // Swaps player number
    remainingRow[prevCol-1]++;                              // Updates vacancy in array
    winner = false;
    undoLimitReached = true;
    document.getElementById("status").innerHTML = "Turn undo-ed. Player " + playerNum + "'s turn"; 
  }
}

/* Opens the translucent overlay */
function openVictoryOverlay() {
  document.getElementById("myNav").style.width = "100%";
  document.getElementById("gameOver").innerHTML = "GAME OVER!" + "<br/><br/>" + 
  "Player " + playerNum + " wins" + "<br/><br/><br/><br/>" +
  "Press reset button to restart the game"
}

/* Closes the translucent overlay */
function closeVictoryOverlay() {
  document.getElementById("myNav").style.width = "0%";
}