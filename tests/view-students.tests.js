const assert = require('assert');

describe('View Students page', function() {
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
    let res = await fetch("http://localhost:8888/students");
    let body = await res.text();
    assert.ok(body.includes("<h1>Registered Students</h1>"));
  });
  
  it('Students list', async function() {
    let res = await fetch("http://localhost:8888/students");
    let body = await res.text();
    assert.ok(body.includes("<ul><li>Steve (steve@gmail.com)</li><li>Tina (tina@yahoo.com)</li></ul>"));
  });
});
