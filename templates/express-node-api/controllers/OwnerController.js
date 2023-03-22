const express = require('express');
const controller = express.Router();
const OwnerService = require('../services/OwnerService');

const ownerService = new OwnerService();

controller.get('/', async (req, res) => {
  try {
    const owners = await ownerService.getAllOwners();
    res.json(owners);
  } catch (err) {
    res.status(500).send(err);
  }
});

controller.get('/:id', async (req, res) => {
  try {
    const owner = await ownerService.getOwnerById(req.params.id);
    res.json(owner);
  } catch (err) {
    res.status(500).send(err);
  }
});

controller.post('/', async (req, res) => {
  try {
    const owner = await ownerService.createOwner(req.body);
    res.status(201).json(owner);
  } catch (err) {
    res.status(500).send(err);
  }
});

controller.put('/:id', async (req, res) => {
  try {
    const owner = await ownerService.updateOwnerById(
      req.params.id,
      req.body
    );
    res.json(owner);
  } catch (err) {
    res.status(500).send(err);
  }
});

controller.delete('/:id', async (req, res) => {
  try {
    await ownerService.deleteOwnerById(req.params.id);
    res.sendStatus(204);
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = controller;