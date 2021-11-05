$(document).ready(function () {
    var deckId;
    var cardMap = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "JACK", "QUEEN", "KING", "ACE"]
    var playerHandData = [];
    var cpuHandData = [];
    var playerWinnings = 'playerWinnings';
    var cpuWinnings = 'cpuWinnings';
    var pileId = ["playerPlayPile", "cpuPlayPile", 'playerWinnings', 'cpuWinnings'];
    var handId = ["playerHand", "cpuHand"]
    var drawCards;
    var remaining;
    // var warDelay = warDelay();
    // function warDelay(){
        // document.querySelector("#war").innerHTML("<h1 style=font-size:200px>WAR!<h1>");
        //                     $("#war").delay(5000).hide(compareValues(0, cpuHandData, playerHandData, true))
    // }

    $('#startbtn').on("click", function (event) {
        event.preventDefault();
        newDeck();
    })

    $('#playbtn').on("click", function (event) {
        event.preventDefault();
        draw(1, handId[0], handId[1]);
    })

    function newDeck() {
        fetch("https://deckofcardsapi.com/api/deck/new/shuffle/")
            .then(function (res) {
                return res.json()
            }).then(function (data) {
                deckId = data.deck_id;
                splitDeck();
            })
    }

    function getCurrentPiles(pileId) {
        fetch(`https://deckofcardsapi.com/api/deck/${deckId}/pile/${pileId}/list`)
            .then(function (res) { return res.json() })
            .then(function (data) {
                console.log("DATA ---- ", data)
                if (data.piles.playerHand.remaining === 0) {
                    
                    winLose()
                };
            })
    }

    function addToPile(codes, pileId) {
        var playerHandApi = `https://deckofcardsapi.com/api/deck/${deckId}/pile/${pileId}/add/?cards=${codes.join(",")
            }`
        fetch(playerHandApi)
            .then(function (resu) {
                return resu.json()
            })
            .then(function (data) {
                document.getElementById("CPU").innerHTML = `<h1 id = 'CPU'> Computer: ${data.piles.cpuWinnings.remaining}`;
                document.getElementById("Player").innerHTML = `<h1 id = 'Player'> Player: ${data.piles.playerWinnings.remaining}`;
                getCurrentPiles(pileId);

                remaining = data.piles.cpuHand.remaining
            })

    }

    function compareValues(number, cpuCard, playerCard, isWar) {
        console.log(isWar)
        console.log("compareValues", cpuCard, playerCard);
        var pot = [];
        var val1, val2;
        if (isWar) {
            pot = cpuCard.map(function (a) {
                return a.code
            }).concat(playerCard.map(function (a) {
                return a.code
            }));
            val1 = cpuCard[2].value;
            val2 = playerCard[2].value;
        } else {
            pot = [playerCard.code, cpuCard.code];
            val1 = cpuCard.value;
            val2 = playerCard.value;
        }

        if (cardMap.indexOf(val1) > cardMap.indexOf(val2)) {
            console.log("CPU WINS", val1, val2);
            addToPile(pot, pileId[3]);
        } else if (cardMap.indexOf(val1) < cardMap.indexOf(val2)) {
            console.log("PLAYER WINS", val1, val2)
            addToPile(pot, pileId[2]);
        } else {
            console.log("WAR!");
            document.querySelector('#war').style.visibility="visible";
                            $("#war").delay(2000).queue(function(){
                        document.querySelector('#war').style.visibility="hidden";
                        draw(2, handId[0], handId[1], true);
                        $("#war").dequeue();
                        })
            
        } 
    }
    function appendCard(inPlay, imgUrl) {
        document.querySelector("#play").setAttribute("style", "display:block");
        var img = document.createElement("img");
        img.src = imgUrl
        $("#" + inPlay).html(img)
    }

    function draw(number = 1, handId, cpuHandId, isWar) {
        console.log(isWar)
        drawCards = `https://deckofcardsapi.com/api/deck/${deckId}/pile/${handId}/draw/?count=${number}`;
        fetch(drawCards)
            .then(function (resu) {
                return resu.json()
            })
            .then(function (data) {
                playerHandData = isWar ? playerHandData.concat(data.cards.map(function (card) {
                    
                    return {
                        value: card.value,
                        code: card.code

                    }
                })) : data.cards.map(function (card) {
                    return {
                        value: card.value,
                        code: card.code
                    }                    
                });
                
                appendCard('playerPlayPile', `${data.cards[0].image}`);
                
                drawCards = `https://deckofcardsapi.com/api/deck/${deckId}/pile/${cpuHandId}/draw/?count=${number}`;
                fetch(drawCards)
                    .then(function (resu) {
                        return resu.json()
                    })
                    .then(function (data) {
                        
                        cpuHandData = isWar ? cpuHandData.concat(data.cards.map(function (card) {
                            return {
                                value: card.value,
                                code: card.code
                            }
                        })) : data.cards.map(function (card) {
                            return {
                                value: card.value,
                                code: card.code,
                            }
                        });
                        
                        appendCard('cpuPlayPile', `${data.cards[0].image}`);
                        if (isWar) {
                            compareValues(0, cpuHandData, playerHandData, true);
                            
                        } else {
                            compareValues
                            compareValues(0, cpuHandData.slice(-1)[0], playerHandData.slice(-1)[0])
                        }
                    })
            })

    }

    function splitDeck() {
        var splitCpuHand = "https://deckofcardsapi.com/api/deck/" + deckId + "/draw/?count=26"
        fetch(splitCpuHand)
            .then(function (response) {
                if (response.ok) {
                    response.json().then(function (res) {
                        var cpuCodes = res.cards.map(function (item) {
                            return item.code
                        })
                        addToPile(cpuCodes, "cpuHand")
                        document.querySelector("#playbtn").setAttribute("style", "display:box");
                        document.querySelector("#startbtn").setAttribute("style", "display:none");
                    })
                }
            })
        var splitPlayerHand = "https://deckofcardsapi.com/api/deck/" + deckId + "/draw/?count=26"
        fetch(splitPlayerHand)
            .then(function (response) {
                if (response.ok) {
                    response.json().then(function (resu) {
                        var playerCodes = resu.cards.map(function (item) {
                            return item.code
                        })

                        addToPile(playerCodes, "playerHand")

                    })
                }
            })

    }

    if (remaining = 0) {
        console.log(remaining)
        winLose()
    };
    function loadWinHTML(){
            document.querySelector("#gameBody").setAttribute("style", "display:none");
            document.querySelector("#gameOver").setAttribute("style", "display:box")

    }
    function winLose() {
        var playerWinningsList = "https://deckofcardsapi.com/api/deck/" + deckId + "/pile/playerWinnings/list/"
        var cpuWinningsValue;
        var playerWinningsValue;
        fetch(playerWinningsList)
            .then(function (response) {
                if (response.ok) {
                    response.json().then(function (res) {
                        playerWinningsValue = res.piles.playerWinnings.remaining
                        cpuWinningsValue = res.piles.cpuWinnings.remaining
                        console.log("winnings",cpuWinningsValue,playerWinningsValue)
                        winLoseTieDisplay(playerWinningsValue, cpuWinningsValue);
                    })
                }

            })
            function winLoseTieDisplay() {
                loadWinHTML();
                if (playerWinningsValue > cpuWinningsValue) {
                    console.log("YOU WIN!") 
                    document.querySelector("#win").setAttribute("style", "display:box");
                    // add display message ,YOU WIN!
                }
                else if (playerWinningsValue === cpuWinningsValue) {
                    console.log("YOU TIED!")
                    document.querySelector("#tied").setAttribute("style", "display:box");
                    // add display message ,YOU TIED!
                }
                else (console.log("YOU LOSE!"))
                document.querySelector("#lose").setAttribute("style", "display:box");
                // add display message ,YOU LOSE!
            }
    }

});

