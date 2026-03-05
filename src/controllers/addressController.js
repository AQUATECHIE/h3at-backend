import User from "../models/Users.js";

export const saveAddress = async (req, res) => {
  try {
    const {
      country,
      address,
      apartment,
      city,
      state,
      postalCode,
      phone
    } = req.body;

    const user = await User.findById(req.user._id);

    user.address = {
      country,
      address,
      apartment,
      city,
      state,
      postalCode,
      phone
    };

    await user.save();

    res.json({
      message: "Address saved",
      address: user.address
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    res.json(user.address || {});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};