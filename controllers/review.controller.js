import createError from "../utils/createError.js";
import Review from "../models/review.model.js";
import Gig from "../models/gig.model.js";
import Order from "../models/order.model.js"; // Import the Order model

export const createReview = async (req, res, next) => {
  if (req.isSeller)
    return next(createError(403, "Sellers can't create a review!"));

  try {
    // Check if the user has purchased the gig
    const order = await Order.findOne({
      gigId: req.body.gigId,
      buyerId: req.userId,});

    if (!order) {
      return next(
        createError(403, "You can only review gigs you have purchased!")
      );
    }

    // Check if the user has already left a review for this gig
    const existingReview = await Review.findOne({
      gigId: req.body.gigId,
      userId: req.userId,
    });

    if (existingReview) {
      return next(
        createError(403, "You have already created a review for this gig!")
      );
    }

    // Create the new review
    const newReview = new Review({
      userId: req.userId,
      gigId: req.body.gigId,
      desc: req.body.desc,
      star: req.body.star,
    });

    const savedReview = await newReview.save();

    // Update the gig's star ratings
    await Gig.findByIdAndUpdate(req.body.gigId, {
      $inc: { totalStars: req.body.star, starNumber: 1 },
    });

    res.status(201).send(savedReview);
  } catch (err) {
    next(err);
  }
};

export const getReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ gigId: req.params.gigId });
    res.status(200).send(reviews);
  } catch (err) {
    next(err);
  }
};

export const deleteReview = async (req, res, next) => {
  try {
    // Implement delete logic if needed
  } catch (err) {
    next(err);
  }
};
