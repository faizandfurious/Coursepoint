$(document).ready(function(){

});

$("#get_data").click(function(){
    getData();
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