console.log("hello");

var inquirer = require("inquirer");
var fs = require("fs");

const questions =
[
    {
        type: "input",
        message: "What is your GitHub user name?",
        name: "username"
    },
    {
        type: "input",
        message: "What is your favorite color?",
        name: "color"
    }
]
inquirer
    .prompt(questions)
    .then(function (response) {
        console.log(JSON.stringify(response))
        console.log(response.username);
        console.log(response.color);
});