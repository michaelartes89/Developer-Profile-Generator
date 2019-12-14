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
        console.log(generateHTML(response));
});

function generateHTML(answers){
    return `<!DOCTYPE html>
    <html lang='en'>
    <head>
        <meta charset='UTF-8'>
        <meta name='viewport' content="width=device-width, initial-scale=1">
        <link href="assets/css/style.css" rel="stylesheet">
        <style>
            body {
                background-color: ${answers.color}
            }
        </style>
        <title>${answers.username} Resume Profile Profile</title>
    </head>
    <body>
        <h1>${answers.username}</h1>
    </body>
    </html>`
}
