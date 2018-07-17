const mongoose = require('mongoose');
const { Schema } = mongoose;

const weatherSchema = new Schema({
  coord: {
    lng: {
      type: mongoose.Schema.Types.Number,
      required: true
    },
    lat: {
      type: mongoose.Schema.Types.Number,
      required: true
    }
  },
  current: {
    clouds: {
      all: {
        type: mongoose.Schema.Types.Number,
        required: true
      }
    },
    main: {
        temp: {
          type: mongoose.Schema.Types.Number,
          required: true
        },
        temp_max: {
          type: mongoose.Schema.Types.Number,
          required: true
        },
        temp_min: {
          type: mongoose.Schema.Types.Number,
          required: true
        },
        humidity: {
          type: mongoose.Schema.Types.Number,
          required: true
        }
    },
    weather: [
      {
        description: {
          type: mongoose.Schema.Types.String,
          required: true
        },
        icon: {
          type: mongoose.Schema.Types.String,
          required: true
        }
      }
    ],
    wind: {
      speed: {
        type: mongoose.Schema.Types.Number,
        required: true
      },
      deg: {
        type: mongoose.Schema.Types.Number,
        required: true
      }
    }
  }
});

const Weather = mongoose.model('Weather', weatherSchema);

module.exports = Weather;
