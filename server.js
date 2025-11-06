const path = require('path');
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Servir archivos estáticos desde public/
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => res.render('index'));
app.get('/services', (req, res) => res.render('services'));
app.get('/gallery', (req, res) => res.render('gallery'));
app.get('/booking', (req, res) => res.render('booking'));
app.get('/contact', (req, res) => res.render('contact'));

app.listen(port, () => console.log(`El servidor esta en el puerto 3000`));