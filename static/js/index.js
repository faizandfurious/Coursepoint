$(document).ready(function(){


});

$("#menu_button").click(function(){
    console.log("menu button clicked");
})


$("#add_class_button").click(function(){
    console.log("add class button clicked");
})


function getData(){
    $.ajax({
        type: "get",
        url:"/all_data",
        success: function(data){
            console.log(data);
        }
    })
}