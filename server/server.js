const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

//3001 is the Dev port
const port = process.env.PORT || 3001;

//app instance
const app = express();
app.use(express.static(__dirname + '/../public'));
app.use(bodyParser.json());

//set up Mongoose promises:
mongoose.Promise = global.Promise;

//connect to database
mongoose.connect('mongodb://localhost:27017/book_db');

//get the models in...
const {Book} = require('./models/books');
//NB The above ^ is the same as
// const Book = require('./models/books').Book;
const {Store} = require('./models/stores');

//###################################################### ROUTING and API ##############################################
//ADD A NEW STORE
app.post('/api/add/store', (req, res)=>{
    
    let store = new Store({
        name: req.body.name,
        address: req.body.address,
        phone:req.body.phone
    });

    store.save((err, doc)=>{
        if(err){ res.status(400).send();}
        res.status(200).send();

    })

})  

//ADD A NEW BOOK
app.post('/api/add/book', (req, res)=>{

    let book = new Book({
        name:req.body.name,
        author:req.body.author,
        pages:req.body.pages,
        price:req.body.price,
        stores:req.body.stores
    })

    book.save((err, doc)=>{
        if(err){ res.status(400).send();}
        res.status(200).send();
    })
});

//GET REQUEST ON BOOKS PAGE
app.get('/api/stores', (req, res)=>{

    Store.find((err, docs)=>{
        if(err){ res.status(400).send();}

        res.send(docs);
    })

});

//GET REQUEST ON HOME PAGE
app.get('/api/books', (req, res)=>{

    let limit = req.query.limit? parseInt(req.query.limit) : 10; 
    let sortOrder = req.query.orderBy? req.query.orderBy : 'asc';

    Book.find().sort({
        _id:sortOrder
    }).limit(limit).exec((err, doc)=>{
        if(err) res.status(400).send(err);
        res.send(doc);
    })
});

//GET REQUEST FOR A SINGLE BOOK EDIT
app.get('/api/books/:id', (req, res)=>{

    Book.findById(req.params.id, (err, doc)=>{
        if(err) res.status(400).send(err);
        res.send(doc);
    });

});


//UPDATE A SINGLE BOOK
app.patch('/api/books/:id', (req, res)=>{

    Book.findByIdAndUpdate(req.params.id, {$set:req.body}, {new:true}, (err, doc)=>{
        if(err) res.status(400).send(err);
        res.send(doc);
    })
})

//DELETE A BOOK
app.delete('/api/books/delete/:id', (req, res)=>{

    Book.findByIdAndRemove(req.params.id, (err, doc)=>{
        if(err) res.status(400).send(err);
        res.status(200).send();
    })
})

app.listen(port, ()=> {
    console.log("Application started");
})