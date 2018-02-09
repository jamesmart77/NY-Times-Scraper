//document ready
$(() => {

    $('#noteModal').modal();

    //DELETE EVENT
    $(".saved-options").on('click', '.delete-note', function () {
        const id = $(this).data("id");

        $.ajax({
                method: "DELETE",
                url: `/articles/${id}`
            })
            .then((result) => console.log(result))
            .catch((err) => console.log(err));
    });
    //EDIT EVENT
    $(".view-note").on('click', function () {
        var id = $(this).data("id");

        $.ajax({
                method: "GET",
                url: "/articles/" + id
            })
            .done(function (article) {
                console.log("ARTICLE INFO\n\n" + JSON.stringify(article));

                // update data-id for the modal save button 
                $("#addNote").attr("data-id", id);

                //set global to allow for PUT save event
                // eventID = event.id;

                $('#noteModal').modal('open');
            });
    });

    $(".save").on('click', function () {

        const note = $("#new-note").val();

        // ensure note has value
        if (!note) {
            alert("Please enter note before saving...")
            return false;
        }

        const id = $(this).data("id");

        // Run a POST request to change the note, using what's entered in the inputs
        $.ajax({
                method: "POST",
                url: "/articles/" + id,
                data: {
                    // Value taken from note textarea
                    note: note
                }
            })
            // With that done
            .then(function (data) {
                // Log the response
                console.log(data);
                // Empty the notes section
                $("#new-note").empty();
            });
    })

});