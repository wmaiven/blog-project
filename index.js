const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const connection = require('./database/database');
const session = require('express-session');


const articlesControl = require('./articles/articlesController');
const categoriesControl = require('./categories/categoriesController');
const userControl = require('./user/userController')

const Articles = require('./articles/Article');
const Category = require('./categories/Category');
const User = require('./user/User');

const { set } = require('./database/database');


app.set('view engine', 'ejs');
app.use(session({
    secret: "qualquercoisa",
    cookie: { maxAge: 6000000 }
    }))
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'));
connection
    .authenticate()
    .then(() => {
        console.log("conennection made");
    }).catch((Error) => {
        console.log(Error);
    })
app.use('/', articlesControl);
app.use('/', categoriesControl);
app.use('/', userControl);


app.get("/", (req, res) => {
    Articles.findAll({
        order: [
            ['id', 'DESC']
        ],
        limit:4
    }).then(articles => {
           Category.findAll().then(category => {
                res.render("home", { article: articles, category: category })
            })
        });

    })


app.get("/:slug", (req, res) => {
    var slug = req.params.slug;
    Articles.findOne({
        where: { slug: slug }
    }).then(articles => {
        if (articles != undefined) {
            Category.findAll({
                order: [
                    ['id', 'DESC']
                ],
                limit: 4
                }).then(category => {
                res.render("bodyArticle", { article: articles, category: category })
            })
        } else { res.redirect("/") }
    })
})
app.get("/category/:slug", (req, res) => {
    var slug = req.params.slug
    Category.findOne({
        where: { slug: slug },
        include: [{
            model: Articles
        }]
    }).then(categori => {
        if (categori != undefined) {
            Category.findAll().then(category => {
                res.render("home", { article: categori.articles, category: category });         
            });
        } else {
            res.redirect("/");
        }
    });
});
app.listen(8080, () => {
    console.log("server running");
});