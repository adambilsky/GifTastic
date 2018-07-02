    // Giphy API Assignment

    $(document).ready(function() {

        // *** PRE-POPULATED BUTTON CREATION ARRAY. Last pre-determined term is "Vision":::
        // User-defined search terms are added to the array but are NOT used 
        var searchTerms = ["Ironman", "Captain America", "Thor", "Hulk", "Black Widow", "Hawkeye", "Spider Man", "Scarlet Witch", "Vision"];
        
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
                if ($("#superhero-input").val()!="") {
                    searchTerms.push(term);
                    // re-render the buttons
                    $("#superhero-input").val("");
                    renderButtons();
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
            console.log($(this).attr("data-name"));
            event.preventDefault();
            var searchTerm = $(this).attr("data-name");
            
            // Grab 10 static, non-animated gif images
            var queryURL = "https://api.giphy.com/v1/gifs/search?api_key=t97eJWx9EuEFie6hlf5u4l5zdIpOWhU3&q=" + searchTerm + "&limit=10";
        
            // // *** AJAX function (using ONLY the first index of the searchTerms array):::
            $.ajax({
                url: queryURL,
                method: "GET"
                }).then(function(response) {
                    console.log(response);
                    
                    // *** image-parsing and display loop:::
                    for (i=0;i<response.data.length;i++) {
                        var imageURL = response.data[i].images.fixed_height_still.url;
                        // var imageAnimURL = response.data[i].images.fixed_height.url;
                        var imageRating = response.data[i].rating;
                        var imageTitle = response.data[i].title;
                        var imageSrc = response.data[i].source_tld;
                        var imageDiv = $("<div>");
                        var p = $("<p>").text("Rating: " + imageRating);
                        var getImage = $("<img>");
                        var imageID = "imageResult" + i;
                        getImage.attr("src", imageURL);
                        getImage.attr("data-still", response.data[i].images.fixed_height_still.url);
                        getImage.attr("data-animate", response.data[i].images.fixed_height.url);
                        getImage.attr("data-state", "still");
                        imageDiv.addClass("imageFrame");
                        imageDiv.append(p);
                        imageDiv.append(getImage);
                        imageDiv.attr("id",imageID);
                        var b = $("<button>").addClass("make-favorite");
                        b.attr("id", imageID);
                        b.attr("src", response.data[i].images.fixed_height_still.url);
                        b.text("Add to Favorites");
                        imageDiv.append(b);
                        $("#image-space").prepend(imageDiv);
                    }
                });
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
        var favorites = [];
        $("#image-space").on("click", "button", function(event) {
            // event.preventDefault();
            console.log($(this).attr("src"));
            favorites.push($(this).attr("src"));
            console.log(favorites);
        });
        $("#show-favorites").on("click", function(event) {
            $("#image-space").empty();
                for (i=0; i<favorites.length; i++) {
                    var showFave = $("<img>")
                    showFave.attr("src",favorites[i]);
                    $("#image-space").prepend(showFave[i]);
                }
        });

    })