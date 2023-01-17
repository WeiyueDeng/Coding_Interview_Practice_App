from xml.etree.ElementInclude import default_loader
from flask import Flask, request_finished
from flask import render_template
from flask import Response, request, jsonify
import openai
import re

app = Flask(__name__)
openai.api_key = "PUT YOUR OPENAI KEY HERE"


defualt_topics={
    "Data_Structure": ["Linked Lists","Stacks", "Queues", "Heaps"],
    "Algorithm": ["Depth-first search", "Breath-first search", "Binary Search", "Graph Traversal"],
    "Categories":["Sorting", "Dynamic Programming", "Recursion", "Math"]
}
level = None
topic = None
first_question_set = None
refined_questions = None

# ROUTES
@app.route('/', methods=['GET', 'POST'])
def choose_level():
    global level
    if request.method =="GET":
        return render_template('difficulty.html')   
    else:
        # save level selected
        json_data = request.get_json()
        level = json_data["level"]
        print(level,"saved")
        return jsonify(data = json_data)

# @app.route('/topic', methods=['GET', 'POST'])
# def save_level():
#     global level
#     # save level selected
#     json_data = request.get_json()
#     level = json_data["level"]
#     return jsonify(data = json_data)

@app.route('/topic', methods=['GET', 'POST'])
def choose_topic():
    global defualt_topics
    global topic
    if request.method =="GET":
        return render_template('topic.html', data = defualt_topics) 
    else:
        # save topic selected
        json_data = request.get_json()
        topic = json_data["topic"]
        print(topic,"saved")
        return jsonify(data = json_data)

@app.route('/check_selection')
def check():
    global topic
    global level
    data_level = {"level": level}
    data_topic = {"topic": topic}
    print(level)
    print(topic)
    return render_template('check_selection.html', level = data_level, topic = data_topic)

@app.route('/answering_workflow')
def workflow():
    return render_template('answering_workflow.html')

@app.route('/question_set',  methods=['GET', 'POST'])
def question_set():
    global topic
    global level
    if request.method =="GET":
        prompt = "Give me a list of 10 algorithm coding interview questions for "+level+" that is specifically about "+ topic + ". Here is an example of a question: Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target."
        completion = openai.Completion.create(engine="text-davinci-002", max_tokens=500, prompt=prompt)
        refiningQuestions = re.split('\n', completion.choices[0].text.strip())
        refiningQuestions = [question for question in refiningQuestions if question]
        first_question_set = refiningQuestions
        first_five = []
        second_five =[]
        for i in first_question_set:
            if len(first_five) <5:
                first_five.append(i)
            else:
                second_five.append(i)
        data = {
            "first": first_five,
            "second": second_five
        }
        return render_template('question_set.html', data = data)
    else:
        #save refined questions
        json_data = request.get_json()
        refined_questions = json_data["refined_questions"]
        print(type(refined_questions))
        return jsonify(data = {})


@app.route('/get_hint', methods=['POST'])
def hint():
    prompt = f"Explain the terms in the following problem: {question}. Make sure not to give a solution. Do not give away the answer. Give me only the first two steps to solving it, but do not give the full solution."
    completion = openai.Completion.create(engine="text-davinci-002", max_tokens=256, prompt=prompt)
    hint = completion.choices[0].text.strip()
    return jsonify({"hint": hint})

@app.route('/solution', methods=['POST'])
def solution():
    prompt = f"What is the solution to this problem: {question}. Be detailed and provide a step by step explanation in list form"
    completion = openai.Completion.create(engine="text-davinci-002", max_tokens=500, prompt=prompt)
    official_answer = completion.choices[0].text.strip()
    return jsonify({"answer": official_answer})

@app.route('/check', methods=['POST'])
def checkCorrect():
    data = request.get_json()
    prompt = f"Here is the question: {question}. \n Here is my answer: '{data['answer']}'. \n Does my given answer solve the problem? State yes or no."
    completion = openai.Completion.create(engine="text-davinci-002", max_tokens=256, prompt=prompt)
    correct = True if "yes" in completion.choices[0].text.strip().lower() else False
    return jsonify({"correct": correct})

@app.route('/set_question', methods=['POST'])
def set_question():
    global question
    data = request.get_json()
    question = data.get("question")
    return jsonify({"question": question})


@app.route('/questions', methods=['POST'])
def questions():
    prompt = f"Give me a list of 5 coding technical algorithm questions for {level} using {topic}. Make the questions specific enough and require coding. Make sure these are algorithm questions."
    if refined_questions:
        prompt += f"Here are some example questions: {','.join(refined_questions)}"
    completion = openai.Completion.create(
        engine="text-davinci-002", max_tokens=256, prompt=prompt)
    questions = re.split('\n', completion.choices[0].text.strip())
    questions = [question for question in questions if question]
    return jsonify({"questions": questions})



@app.route('/delete', methods=['GET', 'POST'])
def delete():
    global topic
    global level
    global refined_questions

    level = None
    topic = None
    refined_questions = None
    return jsonify(data = {})

if __name__ == '__main__':
   app.run(debug = True)




