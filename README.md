Coursepoint
===========

Hello!

To run the project locally, install:

express
mongodb
socket.io

You'll need to fire up the node.js server and mongodb server in order to run the application. Now there's two parts to Coursepoint: the teacher and the student. As a teacher, your responsibilities are to manage courses, administer quizzes, and view results. As a student, you wait patiently until you receive a quiz, and then answer it.

In order to run the application properly, please visit: http://localhost:8889/static/views/teacher/index.html. Create a course, and then add some questions.

Now, go to: http://localhost:8889/static/views/student/index.html. Enroll yourself in a course.

Back in the teacher side, click Administer Question in one of the questions, and go to the quiz page @student/index.html, and answer the question. You can view the results of previous quizzes via the Show Results button @teacher/index.html.


Required Elements:

Javascript
Files: All of student_index.js, teacher_index.js, app.js

jQuery
Files: Throughout student_index.js, teacher_index.js.

HTML
Files: index.html (teacher), index.html (student)

CSS
Files: app.css, class.css, class_selector.css, index.css, login.css, reset.css, teacher.css

DOM Manipulation
Files: student_index.js, teacher_index.js
Line Numbers: (student_index.js) 303-332, 334-368, 404-440 (teacher_index.js) 178-412

AJAX (client)
Files: student_index.js, teacher_index.js
Line Numbers: (teacher_index.js) 72-152, (student_index.js) 191-301

AJAX (server)
Files: app.js
Line Numbers: 175-379, 491-694

node.js
Files: app.js

websockets
Files: app.js, teacher_index.js, student_index.js

MongoDB
Files: app.js
Line Number: 175-379, 419-486, 550-694

gRaphael (graphing)
Files: teacher_index.js
Line Number: 13-14, 23-34, 260



Note: The student index.html was tested using the iOS simulator via XCode.