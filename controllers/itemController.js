const Category = require('../models/category');
const Item = require('../models/item');
const {capitalization} = require('../helper');
const async = require('async');
const { body, validationResult } = require('express-validator');

exports.item_detail = async (req,res,next) => {
  try{
    const item = await Item.findById(req.params.id).populate('category');
    res.render('item_detail', {title: item.name,item})
  } catch(err) {
    return next(err);
  }
}

exports.item_create_get = async (req,res,next) => {
  try{
    const categories = await Category.find();
    res.render('item_form',{title: 'Create Item', categories});
  } catch(err) {
    return next(err);
  }
}

exports.item_create_post = [
  body('item_name')
    .trim()
    .isLength({min: 1})
    .escape()
    .withMessage('item title must be specified')
    .isLength({max: 40})
    .withMessage('item name mustn\'t exceed 40 characters'),
  body('item_description')
    .trim()
    .isLength({min: 1})
    .escape()
    .withMessage('item title must be specified')
    .isLength({max: 400})
    .withMessage('item name mustn\'t exceed 40 characters'),
  body('item_quantity')
    .isInt({min:0})
    .escape()
    .withMessage('item quantity must be specified'),
  body('item_category')
    .trim()
    .isLength({min: 1})
    .escape()
    .withMessage('item category must be specified'),
  body('item_price')
    .isFloat({min:0})
    .escape()
    .withMessage('item price must be specified'),
  async (req, res, next) => {
    const errors = validationResult(req);
    const item = new Item({
      name: capitalization(req.body.item_name),
      description: req.body.item_description,
      quantity: req.body.item_quantity,
      category: req.body.item_category,
      price: parseFloat(req.body.item_price).toFixed(2)
    });
    if (!errors.isEmpty()) {
      try{
        const categories = await Category.find();
        res.render('item_form', {title: 'Create Item', item, categories, errors: errors.array()})
      } catch(err) {
        return next(err)
      }
    } else {
      try{
        await item.save();
        res.redirect(item.url);
      } catch(err) {
        return next(err)
      }
    }
  }
];

exports.item_delete_get = async (req, res, next) => {
  try{
    const item = await Item.findById(req.params.id);
    return res.render('item_delete', {title: 'Delete Item', item})
  } catch(err) {
    return next(err);
  }
}

exports.item_delete_post = async (req, res, next) => {
  try{
    const [itemid, categoryid] = [req.body.itemid, req.body.categoryid];
    await Item.findByIdAndRemove(itemid);
    res.redirect('/category/'+categoryid);
  } catch(err) {
    return next(err);
  }
}

exports.item_update_get = async (req, res, next) => {
  try{
    const [item, categories] = await Promise.all([Item.findById(req.params.id), Category.find()]);
    return res.render('item_form', {title: 'Update Item', item, categories});
  } catch(err) {
    return next(err);
  }
}

exports.item_update_post = [
  body('item_name')
    .trim()
    .isLength({min: 1})
    .escape()
    .withMessage('item title must be specified')
    .isLength({max: 40})
    .withMessage('item name mustn\'t exceed 40 characters'),
  body('item_description')
    .trim()
    .isLength({min: 1})
    .escape()
    .withMessage('item title must be specified')
    .isLength({max: 400})
    .withMessage('item name mustn\'t exceed 40 characters'),
  body('item_quantity')
    .isInt({min:0})
    .escape()
    .withMessage('item quantity must be specified'),
  body('item_category')
    .trim()
    .isLength({min: 1})
    .escape()
    .withMessage('item category must be specified'),
  body('item_price')
    .isFloat({min:0})
    .escape()
    .withMessage('item price must be specified'),
  async (req, res, next) => {
    const errors = validationResult(req);
    const item = new Item({
      name: capitalization(req.body.item_name),
      description: req.body.item_description,
      quantity: req.body.item_quantity,
      category: req.body.item_category,
      price: parseFloat(req.body.item_price).toFixed(2),
      _id: req.params.id
    });
    if (!errors.isEmpty()) {
      try{
        const categories = await Category.find();
        res.render('item_form', {title: 'Update Item', item, categories, errors: errors.array()})
      } catch(err) {
        return next(err)
      }
    } else {
      try{
        await Item.findByIdAndUpdate(req.params.id, item);
        res.redirect(item.url);
      } catch(err) {
        return next(err)
      }
    }
  }
];