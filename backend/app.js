const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const mongoSanitize = require('express-mongo-sanitize');
const dotenv = require('dotenv').config()
const path = require('path');

//connexion à la base de données Mongoose
const connectMongoDB = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.f7zyd.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
mongoose.connect(connectMongoDB,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express(); 

const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');

// middleware pour la gestion des erreurs CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use(bodyParser.json());
// To remove data, use:
app.use(mongoSanitize());
// Or, to replace prohibited characters with _, use:
app.use(mongoSanitize({
  replaceWith: '_'
}));

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);

module.exports = app;