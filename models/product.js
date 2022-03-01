
const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
      },
      category: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },

  author: {
    type: String,
    required: true,
  },
      img: {
        type: String,
        required: false,
        default: null,
      },
      joinDate: {
        type: Date,
        required: true,
        default: Date.now,
      },
    });

module.exports = mongoose.model('Product',productSchema)