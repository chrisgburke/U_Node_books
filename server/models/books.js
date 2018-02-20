/* Books Schema */
const mongoose = require('mongoose');

const bookSchema = mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    author:{
        type:String,
        required:true,
        trim:true
    },
    price:Number,
    pages:Number,
    stores:{
        type:[],
        default:null
    }
});

const Book = mongoose.model('Book', bookSchema);

module.exports = {Book}