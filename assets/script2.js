var playerWinnings = "https://deckofcardsapi.com/api/deck/" + deckId + "/pile/playerWinnings/add/"
var cpuWinnings = "https://deckofcardsapi.com/api/deck/" + deckId + "/pile/cpuWinnings/add/"
var cpuWinningsList = "https://deckofcardsapi.com/api/deck/" + deckId + "/pile/cpuWinnings/list/"
// called when playerHand||cpuHand < 1.

function winLose(){
    var playerWinningsList = "https://deckofcardsapi.com/api/deck/" + deckId + "/pile/playerWinnings/list/"
    var cpuWinningsValue;
    var playerWinningsValue;
fetch(playerWinningsList)
.then(function (response){
    if(response.ok) {
        console.log(response)
        response.json().then(function (res) {
            console.log(res);
            playerWinningsValue = data.piles.playerWinnings.remaining
        })
    }
    fetch(cpuWinningsList)
    .then(function (response){
        if(response.ok) {
            console.log(response)
            response.json().then(function (res) {
                console.log(res);
                cpuWinningsValue = data.piles.cpuWinnings.remaining
                winLoseTieDisplay();
            })
        }
    });
    function winLoseTieDisplay(){
    if (playerWinningsValue > cpuWinningsValue) {
        console.log("YOU WIN!")
    }
    if (playerWinningsValue = cpuWinningsValue) {
        console.log("YOU TIED!")
    }
    else (console.log("YOU LOSE!"))}
})


// need to add in change of html depending on win lose tie
}