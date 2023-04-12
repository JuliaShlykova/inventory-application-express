const async = require('async');
const fs = require('fs');
const path = require('path');
const {body, validationResult} = require('express-validator');
const {capitalization} = require('../helper');
const Category = require('../models/category');
const Item = require('../models/item');

exports.index = async (req,res,next) => {
  try {
    const categories = await Category.find({});
    return res.render('index', { title: 'Zombie Apocalypse Inventory', categories });
  } catch (err) {
    return next(err);
  }
}

exports.category_detail = (req,res,next) => {
  async.parallel({
    category(callback) {
      Category.findById(req.params.id).then(result=>{
        callback(null, result);
      }).catch(err=>{
        callback(err, null);
      })
    },
    items(callback) {
      Item.find({category: req.params.id}).then(results=>{
        callback(null, results);
      }).catch(err=>{
        callback(err, null);
      })
    }
  }, (err, results) => {
    if(err) {
      return next(err);
    }
    return res.render('category_detail', {title: results.category.name, ...results});
  })
}

exports.category_create_get = (req,res,next) => {
  let imgList = fs.readdirSync(path.join(__dirname,'../public/images/'));
  return res.render('category_form', {title: 'Create Category', imgList})
}

exports.category_create_post = [
  body('category_name')
    .trim()
    .isLength({min: 1})
    .escape()
    .withMessage('category title must be specified')
    .isLength({max: 40})
    .withMessage('category name mustn\'t exceed 40 characters'),
  body('category_description')
    .trim()
    .isLength({min: 1})
    .escape()
    .withMessage('category descirption must be specfied')
    .isLength({max: 400})
    .withMessage('category description mustn\'t exceed 400 characters'),
  body('category_icon')
    .trim()
    .isLength({min: 1})
    .escape()
    .withMessage('please, choose an icon'),
  async (req,res,next) => {
    const errors = validationResult(req);
    const category = new Category({
      name: capitalization(req.body.category_name),
      description: req.body.category_description,
      icon: req.body.category_icon
    });
    if(!errors.isEmpty()) {
      let imgList = fs.readdirSync(path.join(__dirname,'../public/images/'));
      return res.render('category_form', {
        title: 'Create Category', 
        imgList, 
        category, 
        errors: errors.array()
      });
    }
    try{
      await category.save();
      res.redirect(category.url);
    } catch(err) {
      return next(err);
    }
  }
]

exports.category_delete_get = async(req, res, next) => {
  try{
    const [category,items] = await Promise.all([Category.findById(req.params.id), Item.find({category: req.params.id})]);
    return res.render('category_delete', {title: 'Delete Category',category, items})
  } catch(err) {
    return next(err);
  }
}

exports.category_delete_post = async (req, res, next) => {
  try{
    const [category,items] = await Promise.all([Category.findById(req.body.categoryid), Item.find({category: req.body.categoryid})]);
    if (items.length>0) {
      return res.render('category_delete', {title: 'Delete Category',category, items});
    }
    await Category.findByIdAndRemove(req.body.categoryid);
    res.redirect('/');
  } catch(err) {
    return next(err);
  }
}

exports.category_update_get = async (req, res, next) => {
  try{
    let imgList = fs.readdirSync(path.join(__dirname,'../public/images/'));
    const category = await Category.findById(req.params.id);
    return res.render('category_form', {title: 'Update Category', imgList, category});
  } catch(err) {
    return next(err);
  }
}

exports.category_update_post = [  
body('category_name')
.trim()
.isLength({min: 1})
.escape()
.withMessage('category title must be specified')
.isLength({max: 40})
.withMessage('category name mustn\'t exceed 40 characters'),
body('category_description')
.trim()
.isLength({min: 1})
.escape()
.withMessage('category descirption must be specfied')
.isLength({max: 400})
.withMessage('category description mustn\'t exceed 400 characters'),
body('category_icon')
.trim()
.isLength({min: 1})
.escape()
.withMessage('please, choose an icon'),
async (req,res,next) => {
const errors = validationResult(req);
const category = new Category({
  name: capitalization(req.body.category_name),
  description: req.body.category_description,
  icon: req.body.category_icon,
  _id: req.params.id
});
if(!errors.isEmpty()) {
  let imgList = fs.readdirSync(path.join(__dirname,'../public/images/'));
  return res.render('category_form', {
    title: 'Update Category', 
    imgList, 
    category, 
    errors: errors.array()
  });
}
try{
  await Category.findByIdAndUpdate(req.params.id, category);
  res.redirect(category.url);
} catch(err) {
  return next(err);
}
}]