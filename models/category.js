const mongoose = require('mongoose');
const {decoder} = require('../helper');
const Schema = mongoose.Schema;


const CategorySchema = new Schema({
  name: String,
  description: String,
  icon: String
})

CategorySchema.virtual('url').get(function(){
  return `/category/${this._id}`;
});

CategorySchema.virtual('img_src').get(function(){
  return `/images/${this.icon}`;
})

CategorySchema.virtual('description_decoded').get(function(){
  return decoder(this.description);
})

module.exports = mongoose.model('Category', CategorySchema);