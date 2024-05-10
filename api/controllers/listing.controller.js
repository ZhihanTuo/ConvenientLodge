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

export const updateListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);
  
  if (!listing) {
    return next(errorHandler(404, 'Listing not found'));
  }

  if (req.user.id !== listing.userRef) {
    return next(errorHandler(401, 'Unauthorized update attempt'));
  }

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
}