const inquirer = require("inquirer");
const fs = require("fs");
const axios = require("axios");
const token = process.env.TOKEN 
let profileObj = { }
const htmlToPdf = require("html-pdf")
const questions = [
    {
        type: "input",
        message: "What is your GitHub user name?",
        name: "username",
        default: "kshep425"
    },
    {
        type: "input",
        message: "What is your favorite color?",
        name: "color",
        default: "tan"
    },
    {
        type: "input",
        message: "Enter your github access token",
        name: "token",
        default: token
        
        
    }
]
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
    <title>${answers.username} Resume Profile</title>
    </head>
    <body>
    <h1>${answers.username}</h1>
    <h1>${answers.bio}</h1>
    <h1>${answers.location}</h1>
    <h1>${answers.num_repositories}</h1>
    <a href="${answers.google_map}"> Location </a>
    
    <img src=${answers.avatar}>
    <a href=${answers.blog} target="_blank"></a>
    </body>
    </html>`
}
inquirer
.prompt(questions)
.then(async function (response) {
    profileObj = {
        color: response.color,
        username: response.username
     }
    /* console.log(JSON.stringify(response))
        console.log(JSON.stringify(response.username))
        console.log(JSON.stringify(response.color))*/
        // Get Num of repositories
        let num_repositories
        // Get Num of stargazers
        let num_stargazers = 0;
        await axios
        .get(`https://api.github.com/users/${response.username}/repos?per_page=100`)
        .then(function(axios_response){
           // console.log(Object.keys(axios_response))
            profileObj.num_repositories = axios_response.data.length
           // console.log(num_repositories)
            axios_response.data.forEach(repo => {
              //  console.log(repo.name, repo.stargazers_count)
                num_stargazers += repo.stargazers_count

            });
            profileObj.num_stargazers = num_stargazers
           // console.log(num_stargazers)
        })
        .catch(function(err) {
            console.log(err)
        });
        // Get Num of followers
        let num_followers;
        await axios
        .get(`https://api.github.com/users/${response.username}/followers`)
        .then(function(axios_response){
            num_followers = axios_response.data.length
          //  console.log("num_followers: "+ num_followers)
        })
        .catch(function(err){
            console.log(err)
        })
        // Get Num of following
        let num_following;
        await axios
        .get(`https://api.github.com/users/${response.username}/following`)
        .then(function(axios_response){
            num_following = axios_response.data.length
           // console.log("num_following: " + num_following)
        })
        
      await axios
      .get(`https://api.github.com/users/${response.username}`)
      .then(function(response){
          profileObj["blog"] = response.data.blog
          profileObj.location = response.data.location
          profileObj.google_map = "https://www.google.com/maps/place/" + response.data.location.replace(/\s+/g,'+')
          profileObj.bio = response.data.bio
          profileObj.avatar = response.data.avatar_url
          // console.log(response.data)
        })
        // let file÷=name = `${response.username}_profile.html`
        
    })
    .then(async function(){
        //console.log(profileObj);
        let filename = `${profileObj.username}_profile.html`
        await fs.writeFile(filename, generateHTML(profileObj), function (){console.log("finished writing file")})
        //htmlProfile = fs.readFile(filename, "utf8", function (){console.log("finished reading file")})
        //console.log(htmlProfile)
        let options = { format:"Landscape"};
        await htmlToPdf.create(generateHTML(profileObj),options).toFile("profile.pdf",function(err,res) {
            if (err) return console.error(err);
            console.log("wrotePDF")
        });
    })
    .catch(function(err) {
        console.log(err)
    });
    let htmlProfile;
function write_pdf(){
    console.log("Made it here")
    console.log(htmlProfile)
}