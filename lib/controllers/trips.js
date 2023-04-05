const { Router } = require('express');
const authenticate = require('../middleware/authenticate.js');
const Trip = require('../models/Trip.js');

module.exports = Router().get('/', authenticate, async (req, res, next) => {
  try {
    const data = await Trip.getAll(req.user.id);
    res.json(data);
  } catch (e) {
    console.error(e);
    next(e);
  }
});
