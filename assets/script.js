$(document).ready(function () {
    var deckId;
    var cardMap = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "JACK", "QUEEN", "KING", "ACE"]
    var playerHandData = [];
    var cpuHandData = [];
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
        document.querySelector("#playwar").style.display="none";
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
                getCurrentPiles(pileId);
                try{
                remaining = data.piles.cpuHand.remaining
                console.log(1, remaining)
                if (remaining < 26)
            {
                updateScore();
                console.log(remaining);
            }}
            catch{
                console.log("Hands not yet populated")
            }
             
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
            document.querySelector("#playbtn").style.display="none";
            document.querySelector('#war').style.display="block";
                            $("#war").delay(2000).queue(function(){
                        document.querySelector('#war').style.display="none";
                        document.querySelector("#playbtn").style.display="block";
                        draw(2, handId[0], handId[1], true);
                        $("#war").dequeue();
                        })
                        
            
        } 
    }
      function appendCard(inPlay, imgUrl) {
        console.log($(`.${inPlay} img:nth-child(2)`))
        if ($(`.${inPlay} img:nth-child(2)`).length >= 1) {
            $(`.${inPlay} img:nth-child(2)`).attr('src', imgUrl)
        } else {
            $(`.${inPlay}`).append(`<img id='${inPlay}Stack' src="${imgUrl}"/>`)
        }
        // var img = document.createElement("img");
        // img.src = imgUrl
    }


    function draw(number = 1, handId, cpuHandId, isWar) {
        console.log(isWar)
        drawCards = `https://deckofcardsapi.com/api/deck/${deckId}/pile/${handId}/draw/?count=${number}`;
        fetch(drawCards)
            .then(function (resu) {
                return resu.json()
            })
            .then(function (data) 
            {

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
                
                if(isWar){
                appendCard('playerImgContainer', `${data.cards[1].image}`);
                
                }
                else {
                appendCard('playerImgContainer', `${data.cards[0].image}`);
             
                }
                
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
                        
                        appendCard('cpuImgContainer', `${data.cards[0].image}`);
                        
                        if (isWar) {
                            compareValues(0, cpuHandData, playerHandData, true);
                            appendCard('cpuImgContainer', `${data.cards[1].image}`);
                            
                        } else {
                            appendCard('cpuImgContainer', `${data.cards[0].image}`);
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
                        document.querySelector("#playbtn").setAttribute("style", "display:block");
                        document.querySelector("#play").style.display = "block";
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

    function updateScore(){
        var playerWinnings = "https://deckofcardsapi.com/api/deck/" + deckId + "/pile/playerWinnings/list/";
        var cpuWinningsVal;
        var playerWinningsVal;
        fetch (playerWinnings)
        .then(function (res){
            if (res.ok)
            res.json().then(function(data){
                try {
                playerWinningsVal = data.piles.playerWinnings.remaining;
                cpuWinningsVal = data.piles.cpuWinnings.remaining
                document.getElementById("CPU").innerHTML = `<h1 id = 'CPU'> Computer: ${cpuWinningsVal}`;
                document.getElementById("Player").innerHTML = `<h1 id = 'Player'> Player: ${playerWinningsVal}`;
            }
            catch{
                console.log("Winnings piles unpopulated")
            }   
            })
        })
    }

    function winLose() {
        var playerWinningsList = "https://deckofcardsapi.com/api/deck/" + deckId + "/pile/playerWinnings/list/"
        var cpuWinningsValue;
        var playerWinningsValue;
        fetch(playerWinningsList)
            .then(function (response) {
                if (response.ok) {
                    response.json().then(function (res) {
                        try{
                        playerWinningsValue = res.piles.playerWinnings.remaining
                        cpuWinningsValue = res.piles.cpuWinnings.remaining
                        console.log("winnings",cpuWinningsValue,playerWinningsValue)
                        winLoseTieDisplay(playerWinningsValue, cpuWinningsValue);
                        }
                        catch{
                            console.log("Oops, winLose() at line 252 trying to run too soon!\n"
                            + "let's check how many cards the player has, and then try again\nRemaining: ", remaining);
                            
                        }
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
                else if(cpuWinningsValue > playerWinningsValue){
                document.querySelector("#lose").setAttribute("style", "display:box");}
                // add display message ,YOU LOSE!
                else if (cpuWinningsValue === playerWinningsValue){
                    console.log("YOU TIED!")
                    document.querySelector("#tied").setAttribute("style", "display:box");
                    // add display message ,YOU TIED!
                }
                
            }
    }

});