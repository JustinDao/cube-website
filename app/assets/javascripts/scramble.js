$(document).ready( function()
{
  $("#scramble").text(GetScramble());
});

function GetScramble()
{
  var nextMoveMap = 
  {
    'R' : ['U', 'D', 'F', 'B'] ,
    'L' : ['U', 'D', 'F', 'B'] ,
    'U' : ['R', 'L', 'F', 'B'] ,
    'D' : ['R', 'L', 'F', 'B'] ,
    'F' : ['R', 'L', 'U', 'D'] ,
    'B' : ['R', 'L', 'U', 'D'] 
  };

  var availableMoves = Object.keys(nextMoveMap);
  var scramble = "";

  for (var i = 0; i < 25; i ++)
  {
    var nextTurn = availableMoves[Math.floor(Math.random() * availableMoves.length)];    
    var shouldAddDoubleTurn = Math.random() >= 0.5;

    scramble += nextTurn;

    if (shouldAddDoubleTurn)
    {
      scramble += "2";
    }

    if (i != 24)
    {
      scramble += " ";
    }

    availableMoves = nextMoveMap[nextTurn];
  }

  return scramble;
}