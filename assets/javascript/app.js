    // Giphy API Assignment

    $(document).ready(function() {

        // *** PRE-POPULATED BUTTON CREATION ARRAY. Last pre-determined term is "Vision":::
        // User-defined search terms are added to the array but are NOT used 
        var searchTerms = ["Ironman", "Captain America", "Thor", "Hulk", "Black Widow", "Hawkeye", "Spider Man", "Scarlet Witch", "Vision"];
        var lastSearchTerm = [];
        var iMulti = 0;

        // *** DYNAMIC SEARCH BUTTON CREATION:::
        function renderButtons() {

            // Deletes the movie buttons prior to adding new movie buttons
            $("#button-space").empty();

            // Loops through the array of searchTerms
            for (var i = 0; i < searchTerms.length; i++) {

                // Then dynamicaly generate buttons for each search term in the array.
                var a = $("<button>");
                // Add a class *****
                a.addClass("superhero");
                // Add a data-attribute with a value of the search term at index i
                a.attr("data-name", searchTerms[i]);
                // Provide the button's text with a value of the search term at index i
                a.text(searchTerms[i]);
                // Add the button to the HTML
                $("#button-space").append(a);
                
            }
            
            // *** Additional Button Creation
            // Add click event listen listener to the "Add a Superhero" button/form
            $("#add-superhero").on("click", function(event) {
                
                // Prevent the form from trying to submit itself.
                event.preventDefault();
                // Grab and store the data-superhero property value from the button
                var term = $("#superhero-input").val().trim();
                // add the user-specified term to the array
                // Add safeguard against 
                if (term !="" && searchTerms.indexOf(term)===-1) {
                    searchTerms.push(term);
                    // re-render the buttons
                    $("#superhero-input").val("");
                    renderButtons();
                }
                else {
                    alert("Please enter a new, non-blank search term!");
                    $("#superhero-input").val("");

                }
            });

        }
        renderButtons(); 

        // *** BUTTON-BASED SEARCH AND DISPLAY:::
        // This will become an object with the stem, API key, and search parameters 'q', 'rating', and 'limit'.
        // 'limit' could be made into a drop-down menu.
        // 'rating' could be made into a drop-down filter.
            // NOTE: the user choice must include the ratings "below" it as well, 
            // i.e., PG = PG, G; PG-13 = PG-13, PG, G;

        $("#button-space").on("click", "button", function(event) {
            event.preventDefault();
            var searchTerm = $(this).attr("data-name");
            var apiKey = "t97eJWx9EuEFie6hlf5u4l5zdIpOWhU3";
            var searchLimit = 50;
            var queryURL = "https://api.giphy.com/v1/gifs/search?q=" + searchTerm + "&api_key=" + apiKey +  "&limit=" + searchLimit;
            
            if (lastSearchTerm.indexOf(searchTerm)===-1) {
                iMulti = 0;
                // Grab static, non-animated gif images but display only the first 10
                // // *** AJAX function (using ONLY the first index of the searchTerms array):::
                $.ajax({
                url: queryURL,
                method: "GET"
                }).then(function(response) {
                    
                    // *** image-parsing and display loop:::
                    for (i=0;i<10;i++) {
                        var imageURL = response.data[i + iMulti].images.fixed_height_still.url;
                        var imageRating = response.data[i + iMulti].rating;
                        var imageDiv = $("<div>");
                        var p = $("<p>").text("Rating: " + imageRating);
                        var getImage = $("<img>");
                        var imageID = "imageResult" + (i + iMulti);
                        
                        getImage.attr("src", imageURL);
                        getImage.attr("data-still", response.data[i + iMulti].images.fixed_height_still.url);
                        getImage.attr("data-animate", response.data[i + iMulti].images.fixed_height.url);
                        getImage.attr("data-state", "still");
                        imageDiv.addClass("imageFrame");
                        imageDiv.append(p);
                        imageDiv.append(getImage);
                        imageDiv.attr("id",imageID);
                        
                        var b = $("<button>").addClass("make-favorite");
                        b.attr("id", imageID);
                        b.attr("src", response.data[i + iMulti].images.fixed_height_still.url);
                        b.text("Add to Favorites");
                        imageDiv.append(b);
                        $("#image-space").prepend(imageDiv);
                    }
                    iMulti = 0;
                    lastSearchTerm.splice(0,1,searchTerm)
                    console.log(lastSearchTerm, iMulti);
    
                });

            }
            else {
                if (iMulti > 39) {
                    alert("You can display a maximum of 50 results per hero.");
                    iMulti = 0;
                }
                else {
                    iMulti+=10;
                    lastSearchTerm.splice(0,1,searchTerm);
                }
                $.ajax({
                url: queryURL,
                method: "GET"
                }).then(function(response) {
                    console.log(response);
                    for (i=0;i<10;i++) {
                        var imageURL = response.data[i + iMulti].images.fixed_height_still.url;
                        console.log(imageURL);
                        var imageRating = response.data[i + iMulti].rating;
                        var imageDiv = $("<div>");
                        var p = $("<p>").text("Rating: " + imageRating);
                        var getImage = $("<img>");
                        var imageID = "imageResult" + (i + iMulti);
                        getImage.attr("src", imageURL);
                        getImage.attr("data-still", response.data[i + iMulti].images.fixed_height_still.url);
                        getImage.attr("data-animate", response.data[i + iMulti].images.fixed_height.url);
                        getImage.attr("data-state", "still");
                        imageDiv.addClass("imageFrame");
                        imageDiv.append(p);
                        imageDiv.append(getImage);
                        imageDiv.attr("id",imageID);
                        
                        var b = $("<button>").addClass("make-favorite");
                        b.attr("id", imageID);
                        b.attr("src", response.data[i + iMulti].images.fixed_height_still.url);
                        b.text("Add to Favorites");
                        imageDiv.append(b);
                        $("#image-space").prepend(imageDiv);    
                    }
                        console.log(lastSearchTerm[0], iMulti);
                });
            };
        });
        
        // *** GIF IMAGE ANIMATION-TOGGLE:::
        // Clicking the image toggles between the still and animated versions of the gif
        $("#image-space").on("click", "img", function(event) {
            event.preventDefault();

            // log the current "state" 
            console.log($(this).attr("data-state"));

            var state = $(this).attr("data-state");
            
            // toggle between "data-still" and "data-animate" images
            if (state === "still") {
                $(this).attr("src", $(this).attr("data-animate"));
                $(this).attr("data-state", "animate");
            } else {
                $(this).attr("src", $(this).attr("data-still"));
                $(this).attr("data-state", "still");
            }
        });

        // *** PERSISTENCE ("favorites")
        // Create a "favorites" array, click to store images in the array
        var favorites = [];
        $("#image-space").on("click", ".make-favorite", function(event) {
            // event.preventDefault();
            console.log($(this).attr("src"));
            favorites.push($(this).attr("src"));
            console.log(favorites);
        });
        
        // SHOW FAVORITES
        function showFavorites() {
            $("#image-space").empty();
            for (i=0; i<favorites.length; i++) {
                var showFave = $("<img>").attr("src",favorites[i]);
                var imageDiv = $("<div>").append(showFave);
                var b = $("<button>").addClass("del-favorite");
                var faveID = favorites[i]
                b.attr("id", faveID);
                b.attr("src", favorites[i]);
                b.text("Remove");
                imageDiv.append(b);

                imageDiv.addClass("imageFrame");
                $("#image-space").prepend(imageDiv);
            }
        }

        // Click to show only the favorites
        $("#show-favorites").on("click", function(event) {
            showFavorites();
        });

        // Remove individual items from "favorites"
        $("#image-space").on("click", ".del-favorite", function(event) {
            var splicer = favorites.indexOf($(this).attr("src"))
            favorites.splice(splicer,1);
            console.log(favorites);
            showFavorites();
        });

        // Click to clear all favorites
        $("#clear-favorites").on("click", function(event) {
            $("#image-space").empty();
            favorites=[];
        });

    })