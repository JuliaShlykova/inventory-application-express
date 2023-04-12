const mongoose = require('mongoose');
const {decoder} = require('../helper');
const Schema = mongoose.Schema;

const ItemSchema = new Schema({
  name: String,
  description: String,
  quantity: Number,
  category: {type: Schema.Types.ObjectId, ref: 'Category'},
  price: {type: Schema.Types.Decimal128}
});

ItemSchema.virtual('url').get(function(){
  return `/item/${this._id}`;
})

// ItemSchema.virtual('price_formatted').get(function(){
//   const price_f = this.price.toFixed(2);
//   return `$${price_f}`;
// })

ItemSchema.virtual('description_decoded').get(function(){
  return decoder(this.description);
})

module.exports = mongoose.model('Item', ItemSchema);