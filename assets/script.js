$(document).ready(function () {
    var cpuInPlay;
    var url = "http://deckofcardsapi.com/api/deck/new/";
    var deckId;
    var playBtn = document.querySelector("playbtn")
    var startBtn = document.querySelector("startbtn")
    var cardMap = ["2","3","4","5","6","7","8","9","10","JACK","QUEEN","KING", "ACE"]
    var playerHandData = [];
    var cpuHandData = [];
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
        draw(1, handId[0], handId[1], playPile[0], playPile[1]);
        // draw(1, handId[1], playPile[1], cpuHandData);
        // console.log("value test ln 38", playerHandData[0], cpuHandData[0]);
        // setTimeout(function() {
        //     compareValues();
        //   }, 1000);

        
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
    };
    function compareValues(number, cpuCard, playerCard) {
        console.log("compareValues", cpuCard, playerCard)
        if (cardMap.indexOf(cpuCard) > cardMap.indexOf(playerCard)){
            console.log("cpu is greater")
        } else if (cardMap.indexOf(cpuCard) < cardMap.indexOf(playerCard)){
            console.log("player is greater")
        } else if (cardMap.indexOf(cpuCard) == cardMap.indexOf(playerCard)) {
            console.log("WAR!")
        } else { console.log("Something is broke")}
    }
        // make an array cardMap
        // if (cardMap.indexOf(cpuCard) > cardsMap.indexOf(playerCard)}
    function appendCard(inPlay, imgUrl) {
        var img = document.createElement("img");
        img.src = imgUrl
        $("#" + inPlay).append(img)
    }
    
    function draw(number = 1, handId, cpuHandId, playerPile, cpuPile) {
        drawCards = `https://deckofcardsapi.com/api/deck/${deckId}/pile/${handId}/draw/?count=${number}`;
        if (playPile == playerPile[0]) { inPlay = "playerPlayPile" }
        else { inPlay = "cpuPlayPile" }
        fetch(drawCards)
            .then(function (resu) {
                return resu.json()
            })
            .then(function (data) {
                console.log(data);
                //go to go
                playerHandData.push(data.cards[0].value);
                value = data.cards[0].value
                // var src = document.getElementById(playerPlayPile)
                // src.appendChild(img);
                // console.log(codes, value, image)
                addToPile(data.cards[0].code, playerPile)
                appendCard(inPlay,`${data.cards[0].image}`);

                
                //second call to draw card for cpu
                drawCards = `https://deckofcardsapi.com/api/deck/${deckId}/pile/${cpuHandId}/draw/?count=${number}`;
                fetch(drawCards)
                .then(function (resu) {
                    return resu.json()
                })
                .then(function (data) {
                    console.log(data);
                    //go to go
                    cpuHandData.push(data.cards[0].value);
                    console.log(playerHandData, cpuHandData)
                    // codes = data.cards[0].code
                    // value = data.cards[0].value
                    // cardImg = `${data.cards[0].image}`
                    // var src = document.getElementById(playerPlayPile)
                    // src.appendChild(img);
                    addToPile(data.cards[0].code, cpuPile)
                    appendCard(inPlay,`${data.cards[0].image}`);
                    compareValues(0, cpuHandData.slice(-1)[0], playerHandData.slice(-1)[0])
                })
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
                        document.querySelector("#playbtn").setAttribute("style", "display:block");
                        document.querySelector("#startbtn").setAttribute("style", "display:none");
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

