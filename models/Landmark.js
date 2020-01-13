const mongoose = require('mongoose');
const { Schema } = mongoose;

/* Define landmark schema */
const landmarkSchema = new Schema({
  coord: {
    lng: {
      type: mongoose.Schema.Types.Number,
      required: true,
    },
    lat: {
      type: mongoose.Schema.Types.Number,
      required: true,
    },
  },
  name: {
    type: mongoose.Schema.Types.String,
    required: true,
  },
});

const Landmark = mongoose.model('Landmark', landmarkSchema);

module.exports = Landmark;
