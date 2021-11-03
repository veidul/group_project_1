$(document).ready(function () {

    var url = "http://deckofcardsapi.com/api/deck/new/";
    var deckId;



    var pullCard = "https://deckofcardsapi.com/api/deck/" + deckId + "/draw/?count=2"
    var splitPlayerHand = "https://deckofcardsapi.com/api/deck/" + deckId + "/draw/?count=26"
    var cpuHandApi = "https://deckofcardsapi.com/api/deck/" + deckId + "/pile/cpuHand/add/?cards=" + data.cards.code
    var cpuPlayPile = "https://deckofcardsapi.com/api/deck/" + deckId + "/pile/cpuPlayPile/add/"
    var cpuWinnings = "https://deckofcardsapi.com/api/deck/" + deckId + "/pile/cpuWinnings/add/"
    var playerHandApi = "https://deckofcardsapi.com/api/deck/" + deckId + "/pile/playerHand/add/"

    var playerWinnings = "https://deckofcardsapi.com/api/deck/" + deckId + "/pile/playerWinnings/add/"


    function newDeck(){
        fetch("https://deckofcardsapi.com/api/deck/new/shuffle/")
        .then(function(res){
            return res.json()  
        }).then(function(data){
            console.log("deck", data);
            deckId = data.deck_id;
            splitDeck();
        })
    }

    function splitDeck() {
        var splitCpuHand = "https://deckofcardsapi.com/api/deck/" + deckId + "/draw/?count=26"
        fetch(splitCpuHand)
        // need to get the deck_id added before this will run
        .then(function (response) {
            if (response.ok) {
                console.log(response);
                //build new url based on response;
                response.json().then(function (res) {
                    // console.log(cpuHandPile)
                    // fetch(cpuHandApi)
                    //     .then(function (res) {
                        
                        console.log(res);
                        var cpuCodes = res.cards.map(function(item){
                            return item.code
                        }).join(",");
                        
                       var cpuHandApi = "https://deckofcardsapi.com/api/deck/" + deckId + "/pile/cpuHand/add/?cards=" + cpuCodes
                                    console.log(cpuCodes)
                                    fetch(cpuHandApi)
                                    .then(function(res){
                                        return res.json()
                                    })
                                    .then(function(cpuHandData){
                                        console.log(cpuHandData)
                                    })

                                    // response.json().then(function (cpuHand) {
                                    //     console.log(cpuHand)
                    })
                }
            })
            var splitPlayerHand = "https://deckofcardsapi.com/api/deck/" + deckId + "/draw/?count=26"
        fetch(splitPlayerHand)
        // need to get the deck_id added before this will run
        .then(function (response) {
            if (response.ok) {
                console.log(response);
                //build new url based on response;
                response.json().then(function (resu) {
                    // console.log(cpuHandPile)
                    // fetch(cpuHandApi)
                    //     .then(function (res) {
                        
                        console.log(resu);
                        var playerCodes = resu.cards.map(function(item){
                            return item.code
                        }).join(",");
                        
                       var playerHandApi = "https://deckofcardsapi.com/api/deck/" + deckId + "/pile/cpuHand/add/?cards=" + playerCodes
                                    console.log(playerCodes)
                                    fetch(playerHandApi)
                                    .then(function(resu){
                                        return resu.json()
                                    })
                                    .then(function(playerHandData){
                                        console.log(playerHandData)
                                    })

                                    // response.json().then(function (cpuHand) {
                                    //     console.log(cpuHand)
                    })
                }
            })

    }
    document.addEventListener("click", newDeck);
    
    function war() {
    var playerValue;
    var cpuValue;
    do{
        draw(2, playerHand); // Dependent on draw logic, though this is how I enivision it.
        playerValue = playerPlayPile[1];
        draw(2, cpuHand); // ^
        cpuValue = cpuPlayPile[1];
    } while (playerValue == cpuValue);
 
    
    if (playerValue > cpuValue)
    {
        fetch(moveToPlayerWinnings)
        .then(function(data) {
            console.log(data);
        })
    }
    else if (cpuValue > playerValue)
    {
     fetch(moveToCPUWinnings)
     .then(function(data) {
         console.log(data);
     })
 }
 }


function compareValues(){
    var cpuPlayPile = "https://deckofcardsapi.com/api/deck/" + deckId + "/pile/cpuPlayPile/list/";
    var playerPlayPile = "https://deckofcardsapi.com/api/deck/" + deckId + "/pile/playerPlayPile/list/";
    var moveToPlayerWinnings;
    var moveToCPUWinnings;
    var playerValue;
    var cpuValue;

    fetch(cpuPlayPile)
    .then (function (res)
    {
        return res.json()
    }).then(function(data){
        console.log("CPU Card: ", data);
        cpuValue = data.cards[0].value;
        var cpuCode = data.cards[0].code;
        moveToCPUWinnings = "https://deckofcardsapi.com/api/deck/" + deckId + "/pile/CPUPlayPile/add/?cards=" + playerCode + "," + cpuCode;
        fetch (playerPlayPile)
    .then (function(res)
    {
        return res.json()
    }).then(function(data){
        console.log("Player Card: ", data);
        playerValue = data.cards[0].value;
        var playerCode = data.cards[0].code;
        moveToPlayerWinnings = "https://deckofcardsapi.com/api/deck/" + deckId + "/pile/playerPlayPile/add/?cards=" + playerCode + "," + cpuCode;

    })
    if (playerValue > cpuValue)
    {
        fetch(moveToPlayerWinnings)
        .then (function(data)
        {
            console.log(data);
        })
        
    }
    else if (cpuValue > playerValue)
    {
        fetch(moveToCPUWinnings)
        .then(function(data) {
            console.log(data);
        })
    }
    else if (cpuValue == playerValue)
    {
        war();
    }
   
    
    
}

});    
