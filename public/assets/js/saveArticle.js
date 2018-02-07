//document ready
$(() => {

    const addArticleToMongo = () => {
        // alert("testing");
        $.ajax({
                method: "POST",
                url: "/save",
                data: {
                    // Value taken from title input
                    title: $("#saveArticle").data('title'),
                    link: $("#saveArticle").data('link'),
                    summary: $("#saveArticle").data('summary')
                  }
            })
            .done((response) => {
                //TODO -- get the materialize confirmations working
                console.log("Saved successfully")

            })
            .catch((err) => {
                console.log("ERROR");
                console.log(err);
            });
    }

    $(".savebtn").on('click', '#saveArticle', () => {
        if($(this).data('link')){
            addArticleToMongo();
        }
    })

});