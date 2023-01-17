function storeDifficulty(level_value){
    level_to_save = {
        "level" : level_value
    }
    console.log("sending:", level)
    $.ajax({
        type: "POST",
        url: "",                
        dataType : "json",
        contentType: "application/json; charset=utf-8",
        data : JSON.stringify(level_to_save),
        success: function(result){
            console.log("save:", level)
            window.location.href = "/topic"
        },
        error: function(request, status, error){
            console.log("Error");
            console.log(request)
            console.log(status)
            console.log(error)
        }
    });
}

$(document).ready(function(){
    $("#easy_btn").click(function(){
        level = "Easy"
        storeDifficulty(level)
    });
    $("#medium_btn").click(function(){
        level = "Medium"
        // console.log("1", level)
        storeDifficulty(level)
    });
    $("#hard_btn").click(function(){
        level = "Hard"
        storeDifficulty(level)
    });
});
    