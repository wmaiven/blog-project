const express = require('express');
const router = express.Router();
const Category = require('../categories/Category');
const Article = require('./Article');
const slugify = require('slugify');
const { count } = require('../categories/Category');
const adminAuth = require('../middleware/adminAuth');

router.get('/admin/articles', adminAuth,(req, res) => {
    Article.findAll({
        include: [{
            model: Category
        }]
    }).then(articles => {
        res.render("adm/articles/index", { articles: articles });
    })
})

router.get('/admin/articles/new', adminAuth, (req, res) => {
    Category.findAll().then(categories => {
        res.render("adm/articles/new", {
            category: categories
            });
    })
})
router.post('/article/save', adminAuth, (req, res) => {
    var title = req.body.title;
    var body = req.body.body;
    var select = req.body.select;
    Article.create({
        title: title,
        slug: slugify(title),
        body: body,
        categoryId: select
    }).then(() => {
        res.redirect('/admin/articles');
    })
})

router.post('/article/delete', adminAuth,(req, res) => {
    var id = req.body.id;
    if (id != undefined) {
        if (!isNaN(id)) {

            Article.destroy({
                where: {
                    id: id
                }
            }).then(() => {
                res.redirect('/admin/articles');
            })
        } else {
            res.redirect('/admin/articles');
        }
    } else {
        res.redirect('/admin/articles');
    }

});


router.get('/admin/articles/edit/:id', adminAuth, (req, res) => {
    var id = req.params.id;
    if (isNaN(id)) {
        res.redirect('/admin/articles');
    }
    Article.findByPk(id).then(articles => {
        if (id != undefined) {
            Category.findAll().then(category => {
                res.render('../views/adm/articles/edit', {
                    articles: articles,
                    category: category
                });
            })
        } else {
            res.redirect('/admin/articles');
        }
    }).catch(() => {
        res.redirect('/admin/articles');
    })
})

router.post('/article/update', adminAuth, (req, res) => {
    var id = req.body.id;
    var title = req.body.title;
    var body = req.body.body;
    var categoryId = req.body.select;
    Article.update({ title: title, slug: slugify(title), body: body, categoryId: categoryId }, {
        where: { id: id }
    }).then(() => {
        res.redirect('/admin/articles');
    }).catch(() => {
        res.redirect('/');

    })
})

router.get('/articles/page/:num', (req, res) => {
    var page = req.params.num;
    var offset;
    if (isNaN(page) || page <= 1) {
        offset = 0;
    } else { offset = parseInt((page)-1)*4 }
    Article.findAndCountAll({
        order: [['id','DESC']],
        limit: 4,
        offset: offset
    }).then(articles => {

        var next;
        if (offset + 4 > articles.count) {
            next = false;
        } else {
            next = true;
        }
        var result = {
            page: parseInt(page),
            articles: articles,
            next: next
            
        }
        Category.findAll().then(category => {
            res.render('../views/adm/articles/page', {
                result: result,
                category: category
            })
        })
    })
})





module.exports = router;