const title = $("#title");
const hint = $("#hint");
const display = $("#display");
const button = $("#button");
const reset = $("#reset");
let questions = null;

console.log(title)

$(document).ready(() => {
  getQuestions();
  bindReset();
});

function bindReset() {
  reset.click(() => {
    // reset entire workflow
  });
}
function addButton(id, prompt) {
  button.empty();
  button.html(
    `<button type="button" id="${id}" class="btn btn-primary col mx-4" disabled>${prompt}</button>`
  );
}

function addTitle(text) {
  title.empty();
  title.html(text);
}

function addHint() {
  hint.empty();
  hint.html("Click here for a hint.");
  hint.click(() => {
    hint.off();
    hint.html(
      "<div class='w-25 mx-auto text-center'><img style='width: 50px;' src='https://media.tenor.com/On7kvXhzml4AAAAi/loading-gif.gif'/></div>"
    );
    $.ajax({
      type: "POST",
      url: "get_hint",
      data: JSON.stringify({}),
      dataType: "json",
      contentType: "application/json; charset=utf-8",
      success: function (result) {
        hint.html(`Here is the hint: ${result["hint"].replace(/\r?\n/g, "<br>")}`);
      },
      error: function (request, status, error) {
        console.log("Error");
        console.log(request);
        console.log(status);
        console.log(error);
      },
    });
  });
}

function addDisplay(html) {
  display.empty();
  display.html(html);
}

function addSolutionBox() {
  let solutionBox = $("#solution");
  solutionBox.on("change keyup paste", () => {
    let answer = solutionBox.val();
    if (answer.length == 0) {
      $("#submitSolutionButton").prop("disabled", true);
    } else {
      $("#submitSolutionButton").prop("disabled", false);
    }
  });
}

function getOfficialSolution(answer) {
  let solutionObj = $("#officialSolution");
  solutionObj.html(
    "<div class='w-25 mx-auto text-center'><img style='width: 50px;height:50px;' src='https://media.tenor.com/On7kvXhzml4AAAAi/loading-gif.gif'/></div>"
  );
  $.ajax({
    type: "POST",
    url: "solution",
    data: JSON.stringify({ answer: answer }),
    dataType: "json",
    contentType: "application/json; charset=utf-8",
    success: function (result) {
      solutionObj.html(
        $(`<div>${result["answer"].replace(/\r?\n/g, "<br>")}</div>`)
      );
      finish(answer);
    },
    error: function (request, status, error) {
      console.log("Error");
      console.log(request);
      console.log(status);
      console.log(error);
    },
  });
}

function startAnsweringWorkflow(question) {
  addTitle(question);
  addHint();
  addDisplay(`<div class="pt-3">
    <h6>Have a solution? Put it here:</h6>
    <div class="form-floating" id="answerBox">
      <textarea class="form-control" placeholder="Your Solution" id="solution" style="height: 200px"></textarea>
      <label for="solution"></label>
    </div><div id="correctTeller"></div></div>`);
  addSolutionBox();

  addButton("submitSolutionButton", "Submit");
  $("#submitSolutionButton").click(() => {
    let answer = $("#solution").val();
    let correctObj = $("#correctTeller");
    $("#submitSolutionButton").prop("disabled", true);
    correctObj.html(
      "<div class='w-25 pt-3 mx-auto text-center'><img style='width: 50px;height:50px;' src='https://media.tenor.com/On7kvXhzml4AAAAi/loading-gif.gif'/></div>"
    );
    $.ajax({
      type: "POST",
      url: "check",
      data: JSON.stringify({ answer: answer }),
      dataType: "json",
      contentType: "application/json; charset=utf-8",
      success: function (result) {
        let correct = result["correct"];
        let correctObj = $("#correctTeller");
        correctObj.empty();
        if (correct) {
          correctObj.append(
            $(
              "<div><div class='text-center py-2'><b>Your answer is correct!</b></div> <br> <b>Here is the official solution:</b><br></div><div id='officialSolution'></div>"
            )
          );
          getOfficialSolution(answer);
        } else {
          $("#submitSolutionButton").prop("disabled", false);
          correctObj.append(
            "Unfortunately your answer is not correct. Try again by submitting another answer. Want to give up? <button id='gaveUp'>Click here.</button><div id='officialSolution'></div>"
          );
          $("#gaveUp").click(() => {
            getOfficialSolution(answer);
          });
        }
      },
      error: function (request, status, error) {
        console.log("Error");
        console.log(request);
        console.log(status);
        console.log(error);
      },
    });
  });
}

function finish() {
  addButton("newQuestion", "Select new question");
  $("#newQuestion").prop("disabled", false);
  $("#newQuestion").click(() => {
    displayQuestions(questions);
  });
}

function setQuestion(question) {
  startAnsweringWorkflow(question);
  $.ajax({
    type: "POST",
    url: "set_question",
    data: JSON.stringify({ question: question }),
    dataType: "json",
    contentType: "application/json; charset=utf-8",
    success: function (result) {
      console.log("succeed");
    },
    error: function (request, status, error) {
      console.log("Error");
      console.log(request);
      console.log(status);
      console.log(error);
    },
  });
}

function getQuestions() {
  button.empty();
  title.empty();
  $("#regen").empty();
  display.html(
    "<div class='w-50 pt-5 text-center'><img src='https://media.tenor.com/On7kvXhzml4AAAAi/loading-gif.gif'/></div>"
  );
  console.log(display);
  console.log("hi")
  $.ajax({
    type: "POST",
    url: "questions",
    data: JSON.stringify({}),
    dataType: "json",
    contentType: "application/json; charset=utf-8",
    success: function (result) {
      questions = result["questions"];
      displayQuestions(questions);
    },
    error: function (request, status, error) {
      console.log("Error");
      console.log(request);
      console.log(status);
      console.log(error);
    },
  });
}

function displayQuestions(questions) {
  addTitle("Choose a question");
  hint.empty();
  let form = "";
  questions.forEach((question, index) => {
    form += `<div class="form-check py-2"><input class="form-check-input" type="radio" name="questions" id="q${index}" value="${question}"><label class="form-check-label" for="q${index}">${question}</label></div>`;
  });
  addDisplay(`<form id="questionForm">${form}</form>`);

  addButton("chooseQuestionButton", "Submit");
  $(
    `<button type="button" class="btn btn-primary col mx-4" id="regen">Regenerate</button>`
  ).insertBefore("#chooseQuestionButton");
  $("#regen").click(() => {
    getQuestions();
  });
  $("#chooseQuestionButton").click(() => {
    setQuestion($("input[name=questions]:checked", "#questionForm").val());
  });
  $("#questionForm input").on("change", function () {
    $("#chooseQuestionButton").prop("disabled", false);
  });
}
