const express = require('express');
const router = express.Router();
const paymentsController = require("../controllers/payments");
const auth = require("../auth");

router.post('/create-payment-intent', auth.verificatoken, paymentsController.crearPaymentIntent);

router.post('/confirm', auth.verificatoken, paymentsController.confirmarPago);

router.get('/historial', auth.verificatoken, paymentsController.historial);

module.exports = router;