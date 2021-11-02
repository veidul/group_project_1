$(document).ready(function () {
    var cpuInPlay;
    var url = "http://deckofcardsapi.com/api/deck/new/";
    var deckId;
    var playBtn = document.querySelector("playbtn")
    var startBtn = document.querySelector("startbtn")


    var pullCard = "https://deckofcardsapi.com/api/deck/" + deckId + "/draw/?count=2"
    var splitPlayerHand = "https://deckofcardsapi.com/api/deck/" + deckId + "/draw/?count=26"
    // var cpuHand = "https://deckofcardsapi.com/api/deck/" + deckId + "/pile/cpuHand/draw/?count=1"
    var cpuPlayPile = "https://deckofcardsapi.com/api/deck/" + deckId + "/pile/cpuPlayPile/draw/"
    var cpuWinnings = "https://deckofcardsapi.com/api/deck/" + deckId + "/pile/cpuWinnings/add/"
    var playerHand = "https://deckofcardsapi.com/api/deck/" + deckId + "/pile/playerHand/draw/?count=1"
    var playPile = ["playerPlayPile", "cpuPlayPile"]
    var playerWinnings = "https://deckofcardsapi.com/api/deck/" + deckId + "/pile/playerWinnings/add/"
    var pileId = ["playerPlayPile", "cpuPlayPile", 'playerWinnings', 'cpuWinnings'];
    // var cpuHand = "cpuHand";
    var playerHand = "playerHand";
    var handId = ["playerHand", "cpuHand"]
    var drawCards;
    var codes;
    var value;
    var image;
    var cardImg;

    $('#startbtn').on("click", function (event) {
        event.preventDefault();
        newDeck();
    })

    $('#playbtn').on("click", function (event) {
        event.preventDefault();
        draw(1, handId[0], playPile[0]);
        draw(1, handId[1], playPile[1]);
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

    function addToPile(codes, playPile) {
        var playerHandApi = `https://deckofcardsapi.com/api/deck/${deckId}/pile/${playPile}/add/?cards=${codes
            // .join(",")
            }`
        fetch(playerHandApi)
            .then(function (resu) {
                return resu.json()
            })
            .then(function (data) {
                console.log(data)
            })
    }

    function appendCard(inPlay) {
        var img = document.createElement("img");
        img.src = cardImg
        $("#" + inPlay).append(img)
    }

    function draw(number = 1, handId, playPile) {
        drawCards = `https://deckofcardsapi.com/api/deck/${deckId}/pile/${handId}/draw/?count=${number}`;
        if(playPile == playPile[0]) {inPlay = "playerPlayPile"}
        else {inPlay = "cpuPlayPile"}
        fetch(drawCards)
            .then(function (resu) {
                return resu.json()
            })
            .then(function (data) {
                console.log(data)
                codes = data.cards[0].code
                value = data.cards[0].value
                cardImg = `${data.cards[0].image}`
                // var src = document.getElementById(playerPlayPile)
                // src.appendChild(img);
                console.log(codes, value, image)
                addToPile(codes, playPile)
                appendCard(inPlay);
            })
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

                        console.log(res);
                        var cpuCodes = res.cards.map(function (item) {
                            return item.code
                        })
                        addToPile(cpuCodes, "cpuHand")

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
                        console.log(resu);
                        var playerCodes = resu.cards.map(function (item) {
                            return item.code
                        })

                        addToPile(playerCodes, "playerHand")

                    })
                }
            })

    }


    // this statement will be added to everytime the pull card is pressed
    // if (data.piles.playerhand.remaining < 1) {
    //     winLose()
    // }

    function winLose() {
        var playerWinningsList = "https://deckofcardsapi.com/api/deck/" + deckId + "/pile/playerWinnings/list/"
        var cpuWinningsValue;
        var playerWinningsValue;
        fetch(playerWinningsList)
            .then(function (response) {
                if (response.ok) {
                    console.log(response)
                    response.json().then(function (res) {
                        console.log(res);
                        playerWinningsValue = data.piles.playerWinnings.remaining
                    })
                }
                fetch(cpuWinningsList)
                    .then(function (response) {
                        if (response.ok) {
                            console.log(response)
                            response.json().then(function (res) {
                                console.log(res);
                                cpuWinningsValue = data.piles.cpuWinnings.remaining
                                winLoseTieDisplay();
                            })
                        }
                    });
                function winLoseTieDisplay() {
                    if (playerWinningsValue > cpuWinningsValue) {
                        console.log("YOU WIN!")
                    }
                    if (playerWinningsValue = cpuWinningsValue) {
                        console.log("YOU TIED!")
                    }
                    else (console.log("YOU LOSE!"))
                }
            })
    }


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


    // document.addEventListener("click", newDeck);

    // response.json().then(function (cpuHand) {
    //     console.log(cpuHand)

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

    // console.log(cpuHandPile)
    // fetch(cpuHandApi)
    //     .then(function (res) {

    // console.log(cpuHandPile)
    // fetch(cpuHandApi)
    //     .then(function (res) {
});

