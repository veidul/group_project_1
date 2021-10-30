$(document).ready(function () {
    var cpuInPlay;
    var url = "http://deckofcardsapi.com/api/deck/new/";
    var deckId;
    var playBtn = document.querySelector("playbtn")
    var startBtn = document.querySelector("startbtn")


    var pullCard = "https://deckofcardsapi.com/api/deck/" + deckId + "/draw/?count=2"
    var splitPlayerHand = "https://deckofcardsapi.com/api/deck/" + deckId + "/draw/?count=26"
    var cpuHand = "https://deckofcardsapi.com/api/deck/" + deckId + "/pile/cpuHand/draw/?count=1"
    var cpuPlayPile = "https://deckofcardsapi.com/api/deck/" + deckId + "/pile/cpuPlayPile/draw/"
    var cpuWinnings = "https://deckofcardsapi.com/api/deck/" + deckId + "/pile/cpuWinnings/add/"
    var playerHand = "https://deckofcardsapi.com/api/deck/" + deckId + "/pile/playerHand/draw/?count=1"
    var playerPlayPile = "https://deckofcardsapi.com/api/deck/" + deckId + "/pile/playerPlayPile/add/"
    var playerWinnings = "https://deckofcardsapi.com/api/deck/" + deckId + "/pile/playerWinnings/add/"





    // $('#playbtn').on("click", function (event) {
    //     event.preventDefault();
    //     ();
    // })

    $('#startbtn').on("click", function (event) {
        event.preventDefault();
        newDeck();
    })

    function newDeck() {
        fetch("https://deckofcardsapi.com/api/deck/new/shuffle/")
            .then(function (res) {
                return res.json()
            }).then(function (data) {
                console.log("deck", data);
                deckId = data.deck_id;
                splitDeck();
            })
    }

    function addToPile(codes, pileId){
        var playerHandApi = `https://deckofcardsapi.com/api/deck/${deckId}/pile/${pileId}/add/?cards=${codes.join(",")}`
        fetch(playerHandApi)
            .then(function (resu) {
                return resu.json()
            })
            .then(function (data) {
                console.log(data)
            })
    }

    function draw(number = 1, pileId){
        //api logic to draw number of cards
        //when done, addToPile(["ID"], pileId)
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
                        var cpuCodes = res.cards.map(function (item) {
                            return item.code
                        })
                        addToPile(cpuCodes, "cpuHand")
                        // var cpuHandApi = "https://deckofcardsapi.com/api/deck/" + deckId + "/pile/cpuHand/add/?cards=" + cpuCodes
                        // console.log(cpuCodes)
                        // fetch(cpuHandApi)
                        //     .then(function (res) {
                        //         return res.json()
                        //     })
                        //     .then(function (cpuHandData) {
                        //         console.log(cpuHandData)
                        //     })

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
                        var playerCodes = resu.cards.map(function (item) {
                            return item.code
                        })
                        // .join(",");

                        // var playerHandApi = "https://deckofcardsapi.com/api/deck/" + deckId + "/pile/playerHand/add/?cards=" + playerCodes
                        // console.log(playerCodes)
                        // fetch(playerHandApi)
                        //     .then(function (resu) {
                        //         return resu.json()
                        //     })
                        //     .then(function (playerHandData) {
                        //         console.log(playerHandData)
                        //     })

                        addToPile(playerCodes, "playerHand")

                        // response.json().then(function (cpuHand) {
                        //     console.log(cpuHand)
                    })
                }
            })

    }
    // document.addEventListener("click", newDeck);

});

