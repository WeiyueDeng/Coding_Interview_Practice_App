function submitRefinedQuestions(){
    refined_ques = $("input[type = 'checkbox]:checked");
    refined_ques = refined_ques.length == 0 ? [] : refined_ques;
    refined_ques_to_save = {
        "refined_questions": refined_ques
    }
    $.ajax({
        type: "POST",
        url: "/question_set",                
        dataType : "json",
        contentType: "application/json; charset=utf-8",
        data : JSON.stringify(refined_ques_to_save),
        success: function(result){
            console.log("save refined questions")
            window.location.href = "/answering_workflow"
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
    $("#submit_btn").click(function(){
        submitRefinedQuestions()
    });
});