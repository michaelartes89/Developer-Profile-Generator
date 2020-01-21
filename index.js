const inquirer = require("inquirer");
const fs = require("fs");
const axios = require("axios");
const htmlToPdf = require("html-pdf")
let profileObj = {}

/*-----create array of questions for inquirer ----*/

const questions = [
    {
        type: "input",
        message: "What is your GitHub user name?",
        name: "username"
    },
    {
        type: "list",
        message: "What color is your lightsaber?",
        choices: ["blue", "green", "red", "purple", "black"],
        name: "color",
        default: "blue"
    },
    {
        type: "input",
        message: "Enter your github access token",
        name: "token",



    }
]
/*------------- HTML here--------------*/
function generateHTML(answers) {
    return `<!DOCTYPE html>
    <html lang='en'>
    <head>
    <meta charset='UTF-8'>
    <meta name='viewport' content="width=device-width, initial-scale=1">
    <script src='https://kit.fontawesome.com/a076d05399.js'></script>
    <style>
    #header {
        background-color: ${answers.color};
        color:white;
        text-align: center;
    }
    img {
        border: 1px solid ${answers.color};
    }   
        
        
    
    h1 {
        font-family: "Times New Roman", Times, serif;

    }
    p {
        font-family: "Times New Roman", Times, serif;
        color:${answers.color};
    }

    </style>
    <title>${answers.username} Resume Profile</title>
    </head>
    <body>
    <div id="header">
    <h1><i class='fab fa-github' style='font-size:36px'></i>${answers.username}</h1>
    </div>
    <img src=${answers.avatar}>
    <p>Bio: ${answers.bio}</p>
 
    <a href=${answers.blog} target="_blank">Blog</a>
    <br>
    <p>Locatation: <a href="${answers.google_map}">${answers.location}</a>
    <p>Repositories: ${answers.num_repositories}<p>
    <p>Followers: ${answers.followers}</p>
    <p>Following: ${answers.following}</p>
 


    
   
    
    </body>
    </html>`
}
/*------------start question with inquirer-------*/
inquirer
    .prompt(questions)
    .then(async function (response) {
        profileObj = {
            color: response.color,
            username: response.username
        }
        /*------------get request from github api number of repos-------*/
        await axios
            .get(`https://api.github.com/users/${response.username}/repos?per_page=100`)
            .then(function (axios_response) {

                profileObj.num_repositories = axios_response.data.length

            })
            .catch(function (err) {
                console.log(err)
            });
        /*------------get number of followers-------*/
        let num_followers;
        await axios
            .get(`https://api.github.com/users/${response.username}/followers`)
            .then(function (axios_response) {
                num_followers = axios_response.data.length
                console.log("num_followers: " + num_followers)
            })
            .catch(function (err) {
                console.log(err)
            })
        /*------------get number of following-------*/
        let num_following;
        await axios
            .get(`https://api.github.com/users/${response.username}/following`)
            .then(function (axios_response) {
                num_following = axios_response.data.length
                console.log("num_following: " + num_following)
            })

        await axios
            .get(`https://api.github.com/users/${response.username}`)
            .then(function (response) {
                console.log(response.data)
                profileObj.blog = response.data.blog
                profileObj.location = response.data.location
                profileObj.google_map = "https://www.google.com/maps/place/" + response.data.location.replace(/\s+/g, '+')
                profileObj.bio = response.data.bio
                profileObj.avatar = response.data.avatar_url
                profileObj.followers = num_followers;
                profileObj.following = num_following;





            })


    })
    .then(async function () {

        let filename = `${profileObj.username}_profile.html`
        await fs.writeFile(filename, generateHTML(profileObj), function () { console.log("finished writing file") })

        let options = { format: "Landscape" };
        await htmlToPdf.create(generateHTML(profileObj), options).toFile("profile.pdf", function (err, res) {
            if (err) return console.error(err);
            console.log("wrotePDF")
        });
    })
    .catch(function (err) {
        console.log(err)
    });
