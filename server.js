

require('dotenv').config();
const session = require('express-session');
const exphbs = require('express-handlebars');
const hbs = exphbs.create({});
const path = require('path');
const express = require('express');
const routes = require('./controllers');
const sequelize = require('./config/connection');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const sess = {
    secret: (process.env.ES_SESS),
    cookie: {},
    resave: false,
    saveUninitialized: true,
    store: new SequelizeStore({
        db: sequelize
    })
};


const app = express();
const PORT = process.env.PORT || 3001;

app.use(session(sess));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(routes);

sequelize.sync({ force: false }).then(() => {
    app.listen(PORT, () => console.log('Now listening'));
});

