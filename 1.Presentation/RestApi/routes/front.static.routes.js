const express = require('express');
const path = require('path');
require('dotenv').config();


const router = express.Router();
const basePath = path.join(__dirname, process.env.FRONTEND_PATH);

/* ------------- Ruta para obtener la configuracion del backend desde el frontend ------------- */
router.get('/config', (req, res) => {
    console.log('front.static.routes: Solicitud recibida en /api/config');
    try {
        const config = {
            backendUrl: process.env.BACKEND_URL
        };
        console.log('front.static.routes: Enviando configuración:', config);
        res.json(config);

    } catch (error) {
        console.error('front.static.routes: Error al obtener la configuración:', error);
        res.status(500).json({ error: 'front.static.routes: Error al obtener la configuración del backend' });
    }

});

/* ---------- Rutas estaticas del front -------------- */
router.get('/registro.html', (req, res) => {
    res.sendFile(path.join(basePath, 'registro.html'));
});

router.get('/perfil.html', (req, res) => {
    res.sendFile(path.join(basePath, 'perfil.html'));
});

router.get('/login.html', (req, res) => {
    res.sendFile(path.join(basePath, 'login.html'));
});

router.get('/catalogo.html', (req, res) => {
    res.sendFile(path.join(basePath, 'catalogo.html'));
});

router.get('/productos.html', (req, res) => {
    res.sendFile(path.join(basePath, 'productos.html'));
});

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});


module.exports = router;

