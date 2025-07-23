const assert = require('assert');

describe('About page', function() {
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
    let res = await fetch("http://localhost:8888/about");
    let body = await res.text();
    assert.ok(body.includes("<title>About</title>"));
    assert.ok(body.includes("<h1>About</h1>"));
  });
});
