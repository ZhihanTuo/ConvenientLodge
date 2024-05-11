import Listing from '../models/listing.model.js'
import { errorHandler } from '../utils/error.js';

/* Create a listing and returns status 201 if no error, otherwise passes error to middleware */
export const createListing = async (req, res, next) => {
  try {
    const listing = await Listing.create(req.body);
    return res.status(201).json(listing);
  } catch (error) {
    next(error);
  }
};

/* Delete listing if the listing exists and belongs to the user */
export const deleteListing = async (req, res, next) => {
  // Find the listing by id
  const listing = await Listing.findById(req.params.id);
  // Error code 404 if listing not found
  if (!listing) {
    return next(errorHandler(404, 'Listing not found'));
  }
  // Error code 401 if listing does not belong to user
  if (req.user.id !== listing.userRef) {
    return next(errorHandler(401, 'Unauthorized delete attempt'));
  }
  // Delete listing and returns status 200 if no error, otherwise pass error to middleware
  try {
    await Listing.findByIdAndDelete(req.params.id);
    res.status(200).json('Listing has been deleted');
  } catch (error) {
    next(error); // Handled by middleware 
  }
};
/* Update listing if it exists and belongs to the user */
export const updateListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);
  // Error 404 if listing is not found
  if (!listing) {
    return next(errorHandler(404, 'Listing not found'));
  }
  // Error 401 if listing does not belong to user
  if (req.user.id !== listing.userRef) {
    return next(errorHandler(401, 'Unauthorized update attempt'));
  }
 // Updatelisting and returns status 200 if no error, otherwise pass error to middleware
  try {
    const updateListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updateListing);
  } catch (error) {
    next(error);
  }
};
/* Gets the listing if it exists, 404 if not found, 200 if success; errors handled by middleware */
export const getListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id)
    if (!listing) {
      return next(errorHandler(404, 'Listing not found'))
    }
    res.status(200).json(listing);
  } catch (error) {
    next(error);
  }
};
/* Gets listings based on query properties */
export const getListings = async(req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = parseInt(req.query.startIndex) || 0;
    // Search all offer options(T/F) by default
    let shared = req.query.shared;
    if (shared === undefined || shared === 'false') {
      shared = {$in: [false, true]};
    }
    // Search all furnished(T/F) options by default
    let furnished = req.query.furnished;
    if (furnished === undefined || furnished === 'false') {
      furnished = {$in: [false, true]};
    }
    // Search all parking(T/F) options by default
    let parking = req.query.parking;
    if (parking === undefined || parking === 'false') {
      parking = {$in: [false, true]};
    }
    // Search all utilsIncluded(T/F) options by default
    let utilsIncluded = req.query.utilsIncluded;
    if (utilsIncluded === undefined || utilsIncluded === 'false') {
      utilsIncluded = {$in: [false, true]};
    }
    // Search all pets(T/F) options by default
    let pets = req.query.pets;
    if (pets === undefined || pets === 'false') {
      pets = {$in: [false, true]};
    }
    // Search all type(T/F) options by default
    let type = req.query.type;
    if (type === undefined || type === 'all') {
      type = {$in: ['sale', 'rent']};
    }
    // Default search for nothing
    const searchTerm = req.query.searchTerm || '';
    // Default sort by recent creation
    const sort = req.query.sort || 'createdAt';
    // Default descending order
    const order = req.query.order || 'desc';

    const listings = await Listing.find({
      // Search for names containing {searchTerm} without regard for casing
      name: {$regex: searchTerm, $options: 'i' },
      furnished,
      parking,
      type,
      pets,
      utilsIncluded,
      shared
    }).sort(
      {[sort]: order}
    ).limit(limit).skip(startIndex);

    return res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
}