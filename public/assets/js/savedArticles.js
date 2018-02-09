//document ready
$(() => {

    $('#noteModal').modal();

    //DELETE ARTIICLE
    $(".saved-options").on('click', '.delete-article', function () {
        const id = $(this).data("id");

        $.ajax({
                method: "DELETE",
                url: `/articles/${id}`
            })
            .then((result) => {
                console.log(result);

                // after removed from DB, fade out and remove from client
                $(`#${id}`).fadeOut('slow', () => $(`#${id}`).remove());
            })
            .catch((err) => console.log(err));
    });
    //VIEW NOTES
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

                //clear div
                $("#saved-note-items").empty();

                // add each note if note array !== empty
                if (article.notes.length > 0) {

                    //loop through returned notes and add to modal
                    article.notes.forEach(note => {
                        // adding to table body
                        $("#saved-note-items")
                            .append($(`<div id=${note._id} class="row col 12 note-item">`)
                                // note text
                                .append($('<div class="col s9 note-text">')
                                    .text(note.note)
                                )
                                // delete note button
                                .append($('<a class="waves-effect waves-yellow btn red right col s2 deleteNote">X</a>')
                                    .data('id', note._id)
                                )
                            )

                    });
                } else {
                    // no notes returned
                    $("#saved-note-items")
                        .append($('<div class="row col 12 note-item">')
                            // note text
                            .append($('<p class="center-align note-text">')
                                .text("No Saved Notes")
                            )
                        )
                }

                //show modal
                $('#noteModal').modal('open');
            });
    });

    // SAVE ARTICLE NOTE
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
                $("#new-note").val('');
            });
    })

    //DELETE ARTIICLE NOTE
    $("#saved-note-items").on('click', ".deleteNote", function () {
        const id = $(this).data("id");

        $.ajax({
                method: "DELETE",
                url: `/notes/${id}`
            })
            .then((result) => {
                console.log(result)
                
                // after removed from DB, fade out and remove from client
                $(`#${id}`).fadeOut('slow', () => $(`#${id}`).remove());
            })
            .catch((err) => console.log(err));
    });

});