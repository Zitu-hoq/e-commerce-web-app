const mongoose = require('mongoose');

module.exports = () => {
    mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('[+] Connected to MongoDB Database'))
    .catch((err) =>{
        console.log(err);
        console.error(err.stack);
        console.log("[-] MongoDB connection Error!!!");
    });
}
