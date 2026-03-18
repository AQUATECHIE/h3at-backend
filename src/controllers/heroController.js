// controllers/heroController.js
import Hero from "../models/Hero.js";
import cloudinary from "../config/cloudinary.js";

export const updateHeroImages = async (req, res) => {
  try {
    const files = req.files;

    const uploadedImages = [];

    for (let file of files) {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: "hero",
      });

      uploadedImages.push({
        url: result.secure_url,
        public_id: result.public_id,
      });
    }

    let hero = await Hero.findOne();

    if (!hero) {
      hero = await Hero.create({ images: uploadedImages });
    } else {
      hero.images = uploadedImages;
      await hero.save();
    }

    res.json(hero);
  } catch (error) {
    res.status(500).json({ message: "Upload failed" });
  }
};

export const getHeroImages = async (req, res) => {
  const hero = await Hero.findOne();
  res.json(hero);
};

export const deleteHeroImage = async (req, res) => {
  try {
    const { public_id } = req.body;

    const hero = await Hero.findOne();

    if (!hero) {
      return res.status(404).json({ message: "Hero not found" });
    }

    // 🔥 delete from cloudinary
    await cloudinary.uploader.destroy(public_id);

    // 🔥 remove from DB
    hero.images = hero.images.filter(
      (img) => img.public_id !== public_id
    );

    await hero.save();

    res.json(hero);
  } catch (error) {
    res.status(500).json({ message: "Delete failed" });
  }
};