$(document).ready(function () {

    var url = "http://deckofcardsapi.com/api/deck/new/";
    var deckID = '00fn7jnq5a7b';
    
    function getApi() {
        fetch(url)
        .then(function (response){
            if (response.ok) {
                console.log(response);
                response.json().then(function (deckID) {
                    console.log(deckID)
                })
            }
        }
        )
    }
getApi()
})