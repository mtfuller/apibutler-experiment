const express = require('express');
const controller = express.Router();
const PetService = require('../services/PetService');

const petService = new PetService();

controller.get('/', async (req, res) => {
  try {
    const pets = await petService.getAllPets();
    res.json(pets);
  } catch (err) {
    res.status(500).send(err);
  }
});

controller.get('/:id', async (req, res) => {
  try {
    const pet = await petService.getPetById(req.params.id);
    res.json(pet);
  } catch (err) {
    res.status(500).send(err);
  }
});

controller.post('/', async (req, res) => {
  try {
    const pet = await petService.createPet(req.body);
    res.status(201).json(pet);
  } catch (err) {
    res.status(500).send(err);
  }
});

controller.put('/:id', async (req, res) => {
  try {
    const pet = await petService.updatePetById(
      req.params.id,
      req.body
    );
    res.json(pet);
  } catch (err) {
    res.status(500).send(err);
  }
});

controller.delete('/:id', async (req, res) => {
  try {
    await petService.deletePetById(req.params.id);
    res.sendStatus(204);
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = controller;