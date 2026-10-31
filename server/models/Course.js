const mongoose = require('mongoose');

// Course schema mapped to MongoDB Atlas 'Course_Collection'
const CourseSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: [true, 'Course image is required']
    },
    title: {
      type: String,
      required: [true, 'Course title is required'],
      trim: true
    },
    shortDescription: {
      type: String,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    rating: {
      type: Number,
      required: [true, 'Course rating is required'],
      min: [0, 'Rating must be at least 0'],
      max: [5, 'Rating cannot exceed 5']
    },
    amount: {
      type: Number,
      min: [0, 'Amount must be positive']
    },
    price: {
      type: Number,
      min: [0, 'Price must be positive']
    },
    currency: {
      type: String,
      default: 'INR'
    },
    buyNowLink: {
      type: String,
      trim: true,
      default: '#'
    },
    buttonText: {
      type: String,
      default: 'Buy Now'
    }
  },
  {
    timestamps: true,
    strict: false,
    collection: 'Course_Collection'
  }
);

// Synchronize description & amount aliases before saving
CourseSchema.pre('save', function (next) {
  if (this.shortDescription && !this.description) {
    this.description = this.shortDescription;
  } else if (this.description && !this.shortDescription) {
    this.shortDescription = this.description;
  }

  if (this.amount !== undefined && this.price === undefined) {
    this.price = this.amount;
  } else if (this.price !== undefined && this.amount === undefined) {
    this.amount = this.price;
  }
  next();
});

module.exports = mongoose.model('Course', CourseSchema, 'Course_Collection');
