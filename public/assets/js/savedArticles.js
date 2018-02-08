//document ready
$(() => {

    //DELETE EVENT
    $(".saved-options").on('click', '.delete-note', function () {
        const id = $(this).data("id");

        $.ajax({
            url: `/articles/${id}`,
            type: 'DELETE',
            success: (result) => console.log(result)
            
        })
        .catch((err) => console.log(err));
    });

});