const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ 
    return true;
}

const authenticatedUser = (username,password)=>{ 
    let validusers = users.filter((user)=>{
        return (user.username === username && user.password === password)
    });
    return (validusers.length > 0);
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (!username || !password) {
        return res.status(404).json({message: "Error logging in"});
    }
   if (authenticatedUser(username,password)) {
      let accessToken = jwt.sign({
        data: password
      }, 'access', { expiresIn: 60 * 60 });
      req.session.authorization = {
        accessToken,username
    }
    return res.status(200).send("Customer successfully logged in");
    } else {
      return res.status(208).json({message: "Invalid Login. Check username and password"});
    }});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  let review = req.body.review;
  let username = req.session.authorization['username'];
  let book = books[req.params.isbn];
  if (book) {
    book.reviews[username] = review;
    res.send("The review for book with ISBN " + req.params.isbn + " has been added/updated.")
    }
    return res.status(404).json({ message: "Invalid ISBN" });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    let username = req.session.authorization['username'];
    let book = books[req.params.isbn];
    if(book){
        delete book.reviews[username];
        res.send("The review for book with ISBN " + req.params.isbn + " posted by the user " + username + " has been deleted.")
    }
    else{
        return res.status(404).json({ message: "Invalid ISBN" });
    }
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
