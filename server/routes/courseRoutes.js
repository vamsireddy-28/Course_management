const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Course = require('../models/Course');

// Find document by ObjectId or custom 'id'
const findCourse = async (id) => {
  if (mongoose.Types.ObjectId.isValid(id)) {
    const byId = await Course.findById(id);
    if (byId) return byId;
  }
  return await Course.findOne({ id });
};

// Normalize document fields for frontend
const normalizeDoc = (doc) => {
  const d = doc.toObject ? doc.toObject() : doc;
  return {
    ...d,
    _id: d._id ? d._id.toString() : (d.id || ''),
    id: d.id || (d._id ? d._id.toString() : ''),
    shortDescription: d.shortDescription || d.description || '',
    description: d.description || d.shortDescription || '',
    amount: d.amount !== undefined ? d.amount : d.price,
    price: d.price !== undefined ? d.price : d.amount,
    buyNowLink: d.buyNowLink || '#'
  };
};

// GET /api/courses - List all courses
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: courses.length, data: courses.map(normalizeDoc) });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error retrieving courses', error: error.message });
  }
});

// GET /api/courses/:id - Single course
router.get('/:id', async (req, res) => {
  try {
    const course = await findCourse(req.params.id);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }
    res.status(200).json({ success: true, data: normalizeDoc(course) });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error retrieving course', error: error.message });
  }
});

// POST /api/courses - Create course
router.post('/', async (req, res) => {
  try {
    const { image, title, shortDescription, description, rating, amount, price, buyNowLink, currency, buttonText } = req.body;
    const finalDesc = shortDescription || description;
    const finalAmount = amount !== undefined ? amount : price;

    if (!image || !title || !finalDesc || rating === undefined || finalAmount === undefined) {
      return res.status(400).json({ success: false, message: 'Image, title, description, rating, and amount are required' });
    }

    const course = await Course.create({
      image,
      title,
      shortDescription: finalDesc,
      description: finalDesc,
      rating: Number(rating),
      amount: Number(finalAmount),
      price: Number(finalAmount),
      currency: currency || 'INR',
      buyNowLink: buyNowLink || '#',
      buttonText: buttonText || 'Buy Now'
    });

    res.status(201).json({ success: true, message: 'Course created successfully', data: normalizeDoc(course) });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// PUT /api/courses/:id - Update course
router.put('/:id', async (req, res) => {
  try {
    const course = await findCourse(req.params.id);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    const { image, title, shortDescription, description, rating, amount, price, buyNowLink, currency, buttonText } = req.body;

    if (image !== undefined) course.image = image;
    if (title !== undefined) course.title = title;
    
    const finalDesc = shortDescription !== undefined ? shortDescription : description;
    if (finalDesc !== undefined) {
      course.shortDescription = finalDesc;
      course.description = finalDesc;
    }

    if (rating !== undefined) course.rating = Number(rating);

    const finalAmount = amount !== undefined ? amount : price;
    if (finalAmount !== undefined) {
      course.amount = Number(finalAmount);
      course.price = Number(finalAmount);
    }

    if (buyNowLink !== undefined) course.buyNowLink = buyNowLink;
    if (currency !== undefined) course.currency = currency;
    if (buttonText !== undefined) course.buttonText = buttonText;

    const updatedCourse = await course.save();
    res.status(200).json({ success: true, message: 'Course updated successfully', data: normalizeDoc(updatedCourse) });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// DELETE /api/courses/:id - Delete course
router.delete('/:id', async (req, res) => {
  try {
    const course = await findCourse(req.params.id);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    await Course.deleteOne({ _id: course._id });
    res.status(200).json({ success: true, message: 'Course deleted successfully', data: { id: course._id.toString() } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error deleting course', error: error.message });
  }
});

module.exports = router;
