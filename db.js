const mongoose = require("mongoose");

var mongoURL = 'mongodb+srv://arefin:arefin@cluster0.bk8chzg.mongodb.net/book-rooms'

mongoose.connect( mongoURL, { useUnifiedTopology : true, useNewUrlParser : true })

var connection = mongoose.connection

connection.on('error' , () => {
    console.log('Mongo DB Connection Failed')
})

connection.on('connected', () => {
    console.log('Mongo DB Connection Successful')
})

module.exports = mongoose