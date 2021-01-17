const Sauce = require('../models/sauce');
const fs = require('fs'); 

exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce); //on extrait l'objet json de sauce, req.body devient sauceObject
  delete sauceObject._id // suppression de l'id envoyé par le frontend
  const sauce = new Sauce({ //nouvelle instance du modèle Sauce
    ...sauceObject, //utilisation de l'opérateur spread qui permet de faire une copie de tous les éléments de req.body
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });
  sauce.save() //fonction qui permet d'enregistrer la sauce dans la base de données
    .then(() => res.status(201).json({ message: 'Sauce enregistrée !'}))
    .catch(error => res.status(400).json({ error }));
};

exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file ? {//opérateur ternaire : req.file existe ou non 
    ...JSON.parse(req.body.sauce),
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body }; //si non, copie de req.body
  Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Sauce modifiée !'}))
    .catch(error => res.status(400).json({ error }));
};

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Sauce supprimée !'}))
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
};

//Route permettant de renseigner les Tableaux (place l'userID où il faut) & incrémente ou décrémente les likes
exports.likeSauce = (req, res, next) => {
  const sauceObject = req.body 
  const userId = sauceObject.userId
  const like = sauceObject.like 

  Sauce.findOne ({_id : req.params.id})
    .then((sauce) => {
      if (like == 1) {
        sauce.usersLiked.push(userId) //Ajout au tableau usersLiked
        sauce.likes++ //Incrémente les likes
      } else if (like == -1) {
        sauce.usersDisliked.push(userId) //Ajout au tableau usersDisliked
        sauce.dislikes++
      } else if (like == 0 && sauce.usersLiked.includes(userId)) { //On vérifie si l'id user est présent
        sauce.likes--
        let pos = sauce.usersLiked.indexOf(userId) //On récupère l'index du userId ciblé
        sauce.usersLiked.splice(pos, 1) //On supprime l'ancien userId
      } else if (like == 0 && sauce.usersDisliked.includes(userId)) {
        sauce.dislikes--
        let pos = sauce.usersDisliked.indexOf(userId)
        sauce.usersDisliked.splice(pos, 1)
      }
      Sauce.updateOne({ _id: req.params.id }, { usersLiked: sauce.usersLiked, usersDisliked: sauce.usersDisliked, dislikes: sauce.dislikes, likes: sauce.likes, _id: req.params.id }) //On update notre sauce
          .then(() => res.status(200).json({ message: 'Objet modifié !' })) //Retour de notre promesse
          .catch(error => res.status(400).json({ error })); 
     })
     .catch(error => res.status(400).json({ error })); 
}

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({_id: req.params.id})
  .then((sauce) => {res.status(200).json(sauce)})
  .catch((error) => {res.status(404).json({error: error}) });
};

exports.getAllSauce = (req, res, next) => {
  Sauce.find()
    .then((sauces) => {res.status(200).json(sauces)})
    .catch((error) => {res.status(400).json({error: error})})
};