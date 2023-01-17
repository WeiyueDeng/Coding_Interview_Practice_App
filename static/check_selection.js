$(document).ready(function () {
  $("#customized_topic_input").keyup(function (event) {
    content = $(this).val();
    if (content.trim().length > 0) {
      $("input[type='radio']:checked").prop("checked", false);
      $("input[type='radio']").attr("disabled", true);
    } else {
      $("input[type='radio']").attr("disabled", false);
    }
  });
  $("#submit_btn").click(function () {
    $("#submit_btn_div").html(
      "<div class='w-25 mx-auto text-center'><img style='width: 50px;' src='https://media.tenor.com/On7kvXhzml4AAAAi/loading-gif.gif'/></div>"
    );
    window.location.href = "/question_set";
  });
});
