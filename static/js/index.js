$(document).ready(function(){


});

$("#menu_button").click(function(){
    console.log("menu button clicked");
});


$("#add_class_button").click(function(){
    console.log("add class button clicked");
});

$("#0").click(function(){
    console.log("test");
    //Put in request to get class information
    getClass(0);
    window.location = "class.html";//url
});

function getClass(id){
    $.ajax({
        type: "get",
        url:"/get_class" + id,
        success: function(data){
            console.log(data);
        }
    })
}


function getData(){
    $.ajax({
        type: "get",
        url:"/all_data",
        success: function(data){
            console.log(data);
        }
    })
}