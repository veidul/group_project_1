$(document).ready(function () {

    var url = "http://deckofcardsapi.com/api/deck/new/";
    var deckId;



    var pullCard = "https://deckofcardsapi.com/api/deck/" + deckId + "/draw/?count=2"
    var splitPlayerHand = "https://deckofcardsapi.com/api/deck/" + deckId + "/draw/?count=26"
    // var cpuHandApi = "https://deckofcardsapi.com/api/deck/" + deckId + "/pile/cpuHand/add/?cards=" + data.cards.code
    var cpuPlayPile = "https://deckofcardsapi.com/api/deck/" + deckId + "/pile/cpuPlayPile/add/"
    var cpuWinnings = "https://deckofcardsapi.com/api/deck/" + deckId + "/pile/cpuWinnings/add/"
    var playerHand = "https://deckofcardsapi.com/api/deck/" + deckId + "/pile/playerHand/add/"
    var playerPlayPile = "https://deckofcardsapi.com/api/deck/" + deckId + "/pile/playerPlayPile/add/"
    var playerWinnings = "https://deckofcardsapi.com/api/deck/" + deckId + "/pile/playerWinnings/add/"
    
    function getApi() {
        fetch(url)
        .then(function (response) {
            if (response.ok) {
                console.log(response);
                response.json().then(function (deckID) {
                    console.log(deckID)
                })
            }
        }
            )
        }

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

    
    // getApi();
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
});

