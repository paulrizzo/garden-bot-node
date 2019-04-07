function loadState() {
    // find all controls
    var controls = $("input.control:checkbox");
    // load state of each control
    for (const action of controls) {
        loadAction(action.id);
    }
}

function loadAction(action) {
    $.ajax({
        type: 'GET',
        url: '/control/action/' + action,
        dataType: 'JSON'
    }).done(function(response) {
        var checked = response === false;
        console.log('Setting action ' + action + ' to ' + checked);
        setAction(action, checked);
    });
}

function setAction(action, checked) {
    const input = document.getElementById(action);
    if (checked) {
        input.bootstrapToggle('toggle');
    }
}

$(document).ready(function() {
    loadState();
});