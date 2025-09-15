const AddressBook = require("../models/addressBook");
const User = require("../models/user");

const addAddress = async (req, res) => {
  try {
    const userID = req.user._id;
    const addressData = req.body;
    //reset all addresses when default
    if (addressData.isDefault === true) {
      await AddressBook.updateMany(
        { user: userID, isDefault: true },
        { $set: { isDefault: false } }
      );
    }
    // Save address
    const newAddress = new AddressBook({
      ...addressData,
      user: userID,
    });
    await newAddress.save();
    // update user
    await User.findByIdAndUpdate(userID, {
      $push: { addresses: newAddress._id },
    });
    return res.status(201).json({
      message: "Address saved successfully",
      address: newAddress,
    });
  } catch (error) {
    console.log("add-address-error");
    return res
      .status(501)
      .json({ message: "Something wrong with the server!", error });
  }
};

const updateAddress = async (req, res) => {
  try {
    const userID = req.user._id;
    const updatedData = req.body;
    // Ensure the address belongs to the user
    const address = await AddressBook.findOne({
      _id: updatedData._id,
      user: userID,
    });
    if (!address) {
      return res
        .status(404)
        .json({ message: "Address not found or not yours!" });
    }
    // reset isDefault on all other addresses
    if (updatedData.isDefault === true) {
      await AddressBook.updateMany(
        { user: userID, _id: { $ne: updatedData._id } },
        { $set: { isDefault: false } }
      );
    }
    // Update the address
    const updatedAddress = await AddressBook.findByIdAndUpdate(
      updatedData._id,
      { $set: updatedData },
      { new: true }
    );
    return res.status(200).json({
      message: "Address updated successfully!",
      updatedAddress,
    });
  } catch (error) {
    console.log("Update-Address-Error");
    return res.status(500).json({
      message: "Something went wrong while updating address!",
      error: error.message,
    });
  }
};

const deleteAddress = async (req, res) => {
  try {
    const addressId = req.params.id;
    const userID = req.user._id;
    // Delete the address
    const deletedAddress = await AddressBook.findOneAndDelete({
      _id: addressId,
      user: userID,
    });
    if (!deletedAddress) {
      return res.status(404).json({ message: "Address not found!" });
    }
    // Remove the address form user
    await User.findByIdAndUpdate(userID, {
      $pull: { addresses: addressId },
    });
    return res.status(200).json({ message: "Address deleted successfully" });
  } catch (error) {
    console.log("Delete-Address-Error");
    return res.status(500).json({
      message: "Something went wrong while deleting address!",
      error: error.message,
    });
  }
};

module.exports = { addAddress, updateAddress, deleteAddress };
