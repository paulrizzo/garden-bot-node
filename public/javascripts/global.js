function runAction(action) {

    var data = {action: action};

    // Use AJAX to post the object to our action service
    $.ajax({
        type: 'POST',
        data: data,
        url: '/control/action',
        dataType: 'JSON'
    }).done(function( response ) {
        // Check for successful (blank) response
        if (response.msg === '') {
            alert('Success');
        } else {
            // If something goes wrong, alert the error message that our service returned
            alert('Error: ' + response.msg);
        }
    });
}