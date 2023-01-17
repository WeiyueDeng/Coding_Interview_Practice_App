function submitTopic(){
    // get checked radio.val
    option = $("input[type='radio']:checked");
    console.log("choose:", option);
    customize_topic= $("#customized_topic_input").val();
    console.log("type in:", customize_topic);
    if(option.length == 0 && customize_topic.trim().length == 0){
        alert("You should either choose a topic or type a topic you want to practice!")
    }else{
        topic_selected = "";
        if(option.length>0){
            topic_selected = option.val()
        }else{
            topic_selected = customize_topic
        }
        topic_to_save = {
            "topic": topic_selected
        }
        console.log("sending:",topic_selected)
        $.ajax({
            type: "POST",
            url: "/topic",                
            dataType : "json",
            contentType: "application/json; charset=utf-8",
            data : JSON.stringify(topic_to_save),
            success: function(result){
                console.log("save:",topic_selected)
                window.location.href = "/check_selection"
            },
            error: function(request, status, error){
                console.log("Error");
                console.log(request)
                console.log(status)
                console.log(error)
            }
        });

    }
}
$(document).ready(function(){
    $("#customized_topic_input").keyup(function(event){
      content = $(this).val()
      if( content.trim().length >0){
        $("input[type='radio']:checked").prop("checked", false);
        $("input[type='radio']").attr("disabled", true);
      }else{
        $("input[type='radio']").attr("disabled", false);
      }
    }); 
    $("#submit_btn").click(function(){
        submitTopic()
    });
});