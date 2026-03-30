import Product from "../models/Product.js";

export const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      discount,
      category,
      brand,
      stock,
      specifications
    } = req.body;

    const imageData = req.files.map(file => ({
      url: file.path,
      public_id: file.filename
    }));

    const product = await Product.create({
      name,
      description,
      price,
      discount,
      category,
      brand,
      stock,
      images: imageData,
      specifications: JSON.parse(specifications),
      createdBy: req.user._id
    });

    res.status(201).json(product);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// get all products
export const getProducts = async (req, res) => {
  try {
    const {
      category,
      minPrice,
      maxPrice,
      brand,
      sort,
      page = 1,
      limit = 6,
      keyword
    } = req.query;

    let filter = {};

    // Category
    if (category) {
      filter.category = category;
    }

    // Brand
    if (brand) {
      filter.brand = brand;
    }

    // Price range
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    // Search by name (case insensitive)
    if (keyword) {
      filter.name = { $regex: keyword, $options: "i" };
    }

    // Sorting
    let sortOption = {};
    if (sort === "low-high") sortOption.price = 1;
    else if (sort === "high-low") sortOption.price = -1;
    else if (sort === "newest") sortOption.createdAt = -1;

    const pageNumber = Number(page);
    const pageSize = Number(limit);

    const totalProducts = await Product.countDocuments(filter);

    const products = await Product.find(filter)
      .sort(sortOption)
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize);

    res.json({
      products,
      currentPage: pageNumber,
      totalPages: Math.ceil(totalProducts / pageSize),
      totalProducts
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// get single products
export const getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  res.json(product);
};

// delete products
import cloudinary from "../config/cloudinary.js";

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Delete images from Cloudinary
    for (const image of product.images) {
      await cloudinary.uploader.destroy(image.public_id);
    }

    await product.deleteOne();

    res.json({ message: "Product and images deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const {
      name,
      description,
      price,
      discount,
      category,
      brand,
      stock,
      specifications
    } = req.body || {};

    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.discount = discount || product.discount;
    product.category = category || product.category;
    product.brand = brand || product.brand;
    product.stock = stock || product.stock;

    if (specifications) {

      if (typeof specifications === "string") {
        product.specifications = JSON.parse(specifications);
      } else {
        product.specifications = specifications;
      }

    }

    await product.save();

    res.json(product);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};