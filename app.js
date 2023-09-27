const express = require('express');
const bodyParser = require('body-parser');
// const request = require('request');
const https = require('https');

//! initializing express app
const app = express();
//! telling app to use public folder and all the static files to link together and show static webpage.
app.use(express.static(`${__dirname}/public`));
//! using bodyparser to parse the form data
app.use(bodyParser.urlencoded({extended:true}));

//! home route - signup page
app.get("/", (req, res) => {
    res.sendFile(`${__dirname}/public/signup.html`);
});

//! signup post route
app.post("/", (req, res) => {
    // with the help of bodyparser we can extract body data
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const email = req.body.email;


    const data = {
        members: [
           {
            email_address: email,
            status: "subscribed",
            merge_fields:{
                FNAME: firstname,
                LNAME: lastname
            }
           } 
        ]
    };

    const jsonData = JSON.stringify(data);

    const url =  `https://us21.api.mailchimp.com/3.0/lists/d0df6d5c81`;
    const options = {
        method: "POST",
        auth: "Dinesh1:08c175427c77cd3f6e8690758825523f-us21"
    }

    const request = https.request(url, options, (response) => {
        const statusCode = response.statusCode;

        if(statusCode === 200){
            res.sendFile(`${__dirname}/success.html`);
        }
        else{
            res.sendFile(`${__dirname}/failure.html`);
        }

        response.on("data", (data) => {
            console.log(JSON.parse(data));
        });
    });

    request.write(jsonData);
    request.end();
})


//! failure route - redirects to signup page
app.post("/failure", (req, res) => {
    res.redirect("/");
})

//! process.env.PORT is used for heroku to dynamically chnge the port where it wants it to listen on.
//! we can use OR oprtr and add a local port to listen on our local machine for testing purposes.
app.listen(process.env.PORT || 8080, (err) => {
    if(err){
        console.log(err);
    }
    else{
        console.log("server is up and running.");
    }
});


module.exports = app;

// API-Key
// 08c175427c77cd3f6e8690758825523f-us21

// list id
// d0df6d5c81