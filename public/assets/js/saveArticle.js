//document ready
$(() => {

    const addArticleToMongo = (item) => {
        // alert("testing");

        const data = {
            // Value taken from title input
            title: item.data('title'),
            link: item.data('id'),
            summary: item.data('summary')
        }

        //send article info to server to save
        $.post("/save", data, (response) => console.log(response))

    }

    $("#articles").on('click', '.saveArticle', function () {
        if ($(this).data('id')) {
            addArticleToMongo($(this));
        }
    })

});