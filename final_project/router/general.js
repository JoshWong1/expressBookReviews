const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const doesExist = (username)=>{
        let userswithsamename = users.filter((user)=>{
          return user.username === username
        });
        if(userswithsamename.length > 0){
          return true;
        } else {
          return false;
        }
      }
    let username = req.body.username;
    let password = req.body.password;
    if (username && password){
        if (!doesExist[username]){
            users.push({"username":username,"password":password})
            res.send("Customer successfully registered. Now you can login.");

        }
        else{
            return res.status(404).json({messsage: "User already exists."});
        }
    }
    else{
        return res.status(404).json({message:"Unable to register user."});
    }
  
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
    await new Promise((resolve, reject) => {
        resolve(res.send(JSON.stringify(books,null,4)));
    });
    
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const getisbn = new Promise((resolve, reject)=>{
        resolve(res.send(books[req.params.isbn]));
    });
    getisbn.then(()=>console.log("Promise for Task 11 resolved"));
    
 });
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
   
    await new Promise((resolve, reject) => {
        let author = req.params.author;
        let isbns = Object.keys(books);
        let booksbyAuthor = [];
        for (let i = 1; i< isbns.length+1; i++){
            if (books[i].author == author){
                booksbyAuthor.push(books[i])
            } 
        }
        resolve(res.send({"BooksbyAuthor":booksbyAuthor}));
    });    
    

});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
    
    await new Promise((resolve, reject) => {
        let title = req.params.title;
        let isbns = Object.keys(books);
        let booksbyTitle = [];
        for (let i = 1; i< isbns.length+1; i++){
            if (books[i].title == title){
                booksbyTitle.push(books[i])
            } 
        }
        resolve(res.send({"BooksbyTitle":booksbyTitle}));
    });  
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    let isbn = req.params.isbn;
    res.send(books[isbn].reviews);
});

module.exports.general = public_users;
