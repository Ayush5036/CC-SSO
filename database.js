const mongoose = require('mongoose');


const connectDB = async () => {
    await mongoose.connect('mongodb+srv://guptaayushcse:HMYlA2k9SXyS4dvm@cluster0.g39t9p1.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster0'
    ).then((connection) => {
        console.log(`Databse connected`);
    }).catch ((error) => {console.log(error)})
}

module.exports = connectDB; 