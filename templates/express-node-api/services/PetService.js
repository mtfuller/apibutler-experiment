const Pet = require('../models/Pet');

class PetService {
  constructor() {}

  async getAllPets() {
    const pets = await Pet.find({});
    return pets;
  }

  async getPetById(id) {
    const pet = await Pet.findById(id);
    if (!pet) {
      throw new Error("Pet with ID " + id + " not found");
    }
    return pet;
  }

  async createPet(petData) {
    const pet = new Pet(petData);
    await pet.save();
    return pet;
  }

  async updatePetById(id, petData) {
    const pet = await Pet.findByIdAndUpdate(
      id,
      petData,
      { new: true }
    );
    if (!pet) {
      throw new Error("Pet with ID " + id + " not found");
    }
    return pet;
  }

  async deletePetById(id) {
    const pet = await Pet.findByIdAndDelete(id);
    if (!pet) {
      throw new Error("Pet with ID " + id + " not found");
    }
  }
}

module.exports = PetService;