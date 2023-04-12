require('dotenv').config();
const async = require('async');
const Category = require('./models/category');
const Item = require('./models/item');

const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

main().catch(err=>{console.log(err)});
async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
}

let categories = [];
let items = [];

async function categoryCreate(name, description, icon, cb) {
  const category = new Category({ name, description, icon });
  try {
    await category.save();
    console.log('New Category: ', category);
    categories.push(category);
    cb(null, category);
  } catch(err) {
    cb(err, null);
    return;
  };
}

async function itemCreate(name, description, quantity, category, price, cb) {
  const item = new Item({name, description, quantity, category, price});
  try {
    await item.save();
    console.log('New item: ', item);
    items.push(item);
    cb(null, item);
  } catch(err) {
    cb(err, null);
    return;
  }
}

function createCategories(cb) {
  async.series([
    function(callback) {
      categoryCreate(
        'Clothing',
        'This is one of the most important thing for survival. People should keep themselves warm',
        't-shirt.svg',
        callback)
    },
    function(callback) {
      categoryCreate(
        'Tea',
        'What can be better to feel alive than drinking a cup of tea? It remains to find a kettle...',
        'tea.svg',
        callback)
    },
    function(callback) {
      categoryCreate(
        'Luxury food',
        'Something that is really rare these days. Not just anybody can afford it',
        'martini.svg',
        callback)
    }    
  ],
  cb)
};

function createItems(cb) {
  async.parallel([
    function(callback) {
      itemCreate(
        'Ski jacket',
        'Ski jackets are specificall made for winter sports. But what sports are there during the zombie apocalypse?',
        8,
        categories[0],
        10.00,
        callback)
    },
    function(callback) {
      itemCreate(
        'Scarf',
        'Even in time like this keep yourself warm!',
        25,
        categories[0],
        3.00,
        callback)
    },
    function(callback) {
      itemCreate(
        'Jasmine green tea, 20 tea bags',
        'It\'s standard favor. Maybe it will remind of good old times :)',
        9,
        categories[1],
        15.00,
        callback)
    },
    function(callback) {
      itemCreate(
        'Dark chocolate, 100g',
        'Let\'s just hope it\'s not expired.',
        1,
        categories[2],
        200.00,
        callback)
    }
  ],
  cb)
};

async.series([
  createCategories,
  createItems
  ],
  function(err, results) {
    if (err) {
      console.log('FINAL ERR: ',err);
    } else {
      console.log('Items: ', items);
    }
    mongoose.connection.close();
  }
)