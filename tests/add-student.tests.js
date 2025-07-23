const assert = require('assert');

describe('Add Students page', function() {
  let server;
  before(function() {
    let students = [
      {"name" : "Steve", "email" : "steve@gmail.com"},
      {"name" : "Tina", "email" : "tina@yahoo.com"}
    ];
    const express = require('express');
    const app = express();
    server = require('http').createServer(app);
    app.set('view engine', 'pug');
    app.use(require('body-parser').urlencoded({extended:true}));
    const studentsController = require("../controllers/students-controller");
    studentsController.setup(app, students);
    server.listen(8888);
  });
  after(function() {
    server.close();
  });

  it('Page title', async function() {
    let res = await fetch("http://localhost:8888/add-student");
    let body = await res.text();
    assert.ok(body.includes("<h1>Register New Student</h1>"));
  });

  it('Students HTML form', async function() {
    let res = await fetch("http://localhost:8888/add-student");
    let body = await res.text();
    
    let nameFieldFound = body.includes('<input id="name" type="text" name="name"/>');
    assert.ok(nameFieldFound, "Field 'name' is missing");

    let emailFieldFound = body.includes('<input id="email" type="email" name="email"/>');
    assert.ok(emailFieldFound, "Field 'email' is missing");

    let buttonAddFound = body.includes('<button type="submit">Add</button>');
    assert.ok(buttonAddFound, "Button [Add] is missing");
  });

  it('Add valid student', async function() {
    let res = await fetch(
      "http://localhost:8888/add-student",
      {
        method: 'POST',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: "name=Peter&email=peter%40gmail.com"
      }
    );
    let body = await res.text();
    let studentsReturned = body.includes(
		"<ul><li>Steve (steve@gmail.com)</li><li>Tina (tina@yahoo.com)</li><li>Peter (peter@gmail.com)</li></ul>");
    assert.ok(studentsReturned, "Add student failed");
  });

  it('Add invalid student', async function() {
     let res = await fetch(
      "http://localhost:8888/add-student",
      {
        method: 'POST',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: "name=Kate&email="
      }
    );
    let body = await res.text();
    let errMsg = body.includes("Cannot add student. Name and email fields are required!");
    assert.ok(errMsg, "Add invalid student should display an error message");

    res = await fetch("http://localhost:8888/");
    body = await res.text();
	assert.ok(body.includes("Registered students: <b>2</b>"), 
		"Add invalid student should not change the students count");
  });
});
