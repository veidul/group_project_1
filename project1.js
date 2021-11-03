$(document).ready(function () {

    var url = "http://deckofcardsapi.com/api/deck/new/";
    var deckID;

    var playerDrawCode;
    var playerHand;
    var cpuHand;
    var playerInPlay;
    var cpuInPlay;
    var playerId = "randomid";
    var cpuId = "cpuId"


    //start new game - make deck, add player pile and add cpu pile
    function startGame(){
        function newDeck(){
            fetch("https://deckofcardsapi.com/api/deck/new/shuffle/")
            .then(function(res){
                return res.json()
            }).then(function(data){
                console.log("deck", data);
                deckId = data.deck_id;
                splitDeck();
            })
            function splitDeck() {
                var splitCpuHand = "https://deckofcardsapi.com/api/deck/" + deckId + "/draw/?count=26"
                fetch(splitCpuHand)
                .then(function (response) {
                    if (response.ok) {
                        console.log(response);
                        response.json().then(function (res) {
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
                            })
                        }
                    })
                    var splitPlayerHand = "https://deckofcardsapi.com/api/deck/" + deckId + "/draw/?count=26"
                fetch(splitPlayerHand)
                .then(function (response) {
                    if (response.ok) {
                        console.log(response);
                        //build new url based on response;
                        response.json().then(function (resu) {
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
                            })
                        }
                    })
        
            }
            document.addEventListener("click", newDeck);
    }
                function drawCard() {
                    playerHand = "https://deckofcardsapi.com/api/deck/" + deckID + "/pile/playerHand/draw/?count=1";
                    fetch(playerHand)
                        .then(function (response) {
                            return response.json()
                                .then(function (data) {
                                    playerDrawCode = data.cards[0].code
                                })
            })
            function addPlayerInPlay() {
              playerInPlay = "https://deckofcardsapi.com/api/deck/" + deckID + "/pile/" + playerPlayPile + "/add/?cards=" + playerDrawCode;
                fetch(playerInPlay)
                .then(function (response) {
                    return response.json()
                    .then(function (data) {
                        console.log(data) //Insert Displays
                    })
                })
            }
            cpuHand = "https://deckofcardsapi.com/api/deck/" + deckID + "/pile/cpuHand/draw/?count=1";
                    fetch(cpuHand)
                        .then(function (response) {
                            return response.json()
                                .then(function (data) {
                                    cpuDrawCode = data.cards[0].code
                                })
            })
            function addCpuInPlay(codes) {
              cpuInPlay = "https://deckofcardsapi.com/api/deck/" + deckID + "/pile/" + cpuPlayPile + "/add/?cards=" + codes.join(',');
                fetch(cpuInPlay)
                .then(function (response) {
                    return response.json()
                    .then(function (data) {
                        console.log(data) //Insert Displays
                    })
                })
            }

            function addCardsToPile(codes, pile){
                var url = "https://deckofcardsapi.com/api/deck/" + deckID + "/pile/" + pile + "/add/?cards=" + codes.join(',');
                fetch(cpuInPlay)
                .then(function (response) {
                    return response.json()
                    .then(function (data) {
                        console.log(data) //Insert Displays
                    })
                })
            }
        addCpuInPlay();
        addPlayerInPlay();
        addCardsToPile(["F23"], "player")
        }
}});