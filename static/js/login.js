
$(document).ready(function() {

});


$("#sign_in_button").click(function(){
    // get all the inputs into an array.
    var $inputs = $('#sign_in_form :input');

    //This object holds the username and password used to sign in with.
    var values = {};
    $inputs.each(function() {
        values[this.name] = $(this).val();
    });

    window.location = "index.html";//url
})