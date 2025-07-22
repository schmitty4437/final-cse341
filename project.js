const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI);

const db = mongoose.connection;
db.on("error", (error) => console.error(error));

const User = mongoose.model('User', { displayName: String, googleId: String, email: String })

module.exports = { User }