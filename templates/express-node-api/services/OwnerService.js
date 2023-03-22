const Owner = require('../models/Owner');

class OwnerService {
  constructor() {}

  async getAllOwners() {
    const owners = await Owner.find({});
    return owners;
  }

  async getOwnerById(id) {
    const owner = await Owner.findById(id);
    if (!owner) {
      throw new Error("Owner with ID " + id + " not found");
    }
    return owner;
  }

  async createOwner(ownerData) {
    const owner = new Owner(ownerData);
    await owner.save();
    return owner;
  }

  async updateOwnerById(id, ownerData) {
    const owner = await Owner.findByIdAndUpdate(
      id,
      ownerData,
      { new: true }
    );
    if (!owner) {
      throw new Error("Owner with ID " + id + " not found");
    }
    return owner;
  }

  async deleteOwnerById(id) {
    const owner = await Owner.findByIdAndDelete(id);
    if (!owner) {
      throw new Error("Owner with ID " + id + " not found");
    }
  }
}

module.exports = OwnerService;