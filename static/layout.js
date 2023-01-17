$(document).ready(function(){
    $("#reset_btn").click(function(){
        $.ajax({
            type: "POST",
            url: "/delete",                
            dataType : "json",
            contentType: "application/json; charset=utf-8",
            data : JSON.stringify(),
            success: function(result){
                console.log("delete")
                window.location.href = "/"
            },
            error: function(request, status, error){
                console.log("Error");
                console.log(request)
                console.log(status)
                console.log(error)
            }
        });
        window.location.href="/"
    });
});