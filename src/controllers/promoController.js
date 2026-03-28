import Promo from "../models/Promo.js";

/* GET PROMOS */

export const getPromos = async (req, res) => {

  const promos = await Promo.find({ active: true }).sort({ createdAt: -1 });

  res.json(promos);

};


/* ADMIN CREATE PROMO */

export const createPromo = async (req, res) => {

  const { title, link } = req.body;

  const image = {
    url: req.file.path,
    public_id: req.file.filename
  };

  const promo = await Promo.create({
    title,
    image,
    link
  });

  res.status(201).json(promo);

};


/* ADMIN UPDATE PROMO */

export const updatePromo = async (req, res) => {

  const promo = await Promo.findById(req.params.id);

  if (!promo) {
    return res.status(404).json({ message: "Promo not found" });
  }

  promo.title = req.body.title || promo.title;
  promo.link = req.body.link || promo.link;

  await promo.save();

  res.json(promo);

};


/* ADMIN DELETE PROMO */

export const deletePromo = async (req, res) => {

  const promo = await Promo.findById(req.params.id);

  if (!promo) {
    return res.status(404).json({ message: "Promo not found" });
  }

  await promo.deleteOne();

  res.json({ message: "Promo deleted" });

};