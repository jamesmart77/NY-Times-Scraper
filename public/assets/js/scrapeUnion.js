//document ready
$(() => {

    //scrape function with ajax
    const scrapeUnion = () => {
        // alert("testing");
        $.ajax({
                method: "GET",
                url: "/scrape"
            })
            .done((articles) => {
                //function to display articles
                displayArticles(articles);

            })
            .catch((err) => {
                console.log("ERROR");
                console.log(err);
            });
    }

    //button click to scrape data
    $("#scrape").on('click', scrapeUnion)
    //==================================================
    //FUNCTION TO ADD ARTICLES TO PAGE

    const displayArticles = (articles) => {

        //clear table body
        $("#articles").empty();

        // For each one
        articles.forEach(article => {

            // adding to table body
            $("#articles")
                .append($('<tr>')
                    // title & summary
                    .append($('<td class="article-cell">')
                        .html(`<h5>${article.title}</h5><p>${article.summary}</p>`)
                    )
                    // save button
                    .append($('<td class="article-cell">')
                        .append($('<a class="waves-effect waves-yellow btn green saveArticle">Save Article</a>')
                            .data('id', article.link)
                            .attr('data-title', article.title)
                            .attr('data-summary', article.summary)
                        )
                    )

                )
        });
    }
});