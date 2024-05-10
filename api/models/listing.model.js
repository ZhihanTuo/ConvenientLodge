import mongoose from "mongoose";

const listingSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true
    },
    bedrooms: {
      type: Number,
      required: true
    },
    bathrooms: {
      type: Number,
      required: true
    },
    furnished: {
      type: Boolean,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    utilsIncluded: {
      type: Boolean,
      required: true
    },
    utilitiesPrice: {
      type: Number
    },
    parking: {
      type: Boolean,
      required: true
    },
    type: {
      type: String,
      required: true
    },
    pets: {
      type: Boolean,
      required: true
    },
    shared: {
      type: Boolean,
      required: true
    },
    imageUrls: {
      type: Array,
      required: true
    },
    userRef: {
      type: String,
      required: true
    }
  }, {timestamps : true}
)

const Listing = mongoose.model('Listing', listingSchema);

export default Listing;