const reviewModel = require("../models/reviewModel")
const bookModel = require("../models/bookModel")
const mongoose = require("mongoose")



const createReview = async function (req, res) {
    try {
        let bookId = req.params.bookId;
        let data = req.body;

        //mandatory validation
        const { reviewedBy, rating } = data

        if (Object.keys(data).length == 0) {
            return res.status(400).send({ status: false, msg: "No Parameters Passed in requestBody" })
        }

        isValid = mongoose.Types.ObjectId.isValid(bookId)
        if (!isValid) {
            return res.status(400).send({ status: false, msg: "Not a valid bookId" })
        }

        if (!data.bookId) {
            return res.status(400).send({ status: false, msg: "BookId is required" })
        }
        if (!reviewedBy) {
            return res.status(400).send({ status: false, msg: "Reviewer name is required" })
        }
        if (!rating) {
            return res.status(400).send({ status: false, msg: "Rating is required" })
        }
        if (!(rating > 0 && rating < 6)) {
            return res.status(400).send({ status: false, msg: "Invalid Ratings" })
        }

        let searchBookId = await bookModel.findById(bookId)
        if (!searchBookId) {
            return res.status(404).send({ status: false, msg: "No Book is Exist" })
        }

        let { reviews,title, excerpt, ISBN, userId, category, subcategory, releasedAt, isDelated, createdAt, updatedAt } = searchBookId //destruturing object

        let saveReview = await reviewModel.create(data)
        if (saveReview) {
            let updateBooks = await bookModel.findOneAndUpdate({ _id: bookId, isDeleted: false }, { reviews: reviews + 1 })
        }

        let bookDocument = {title, excerpt, ISBN, userId, category, subcategory, reviews, releasedAt, isDelated, createdAt, updatedAt,saveReview}

        res.status(201).send({ status: true, msg: "Reviewed Successfully", data: bookDocument })

    }
    catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }
}



const updateReviews = async function (req, res) {
    try {
        let bookId = req.params.bookId;
        let reviewId = req.params.reviewId;
        let data = req.body;

        if (Object.keys(data).length == 0) {
            return res.status(400).send({ status: false, msg: "No Parameters Passed in requestBody" })
        }

        isValid = mongoose.Types.ObjectId.isValid(bookId)
        if (!isValid) {
            return res.status(400).send({ status: false, msg: "Not a valid bookId" })
        }

        isValid = mongoose.Types.ObjectId.isValid(reviewId)
        if (!isValid) {
            return res.status(400).send({ status: false, msg: "Not a valid reviewId" })
        }

        let checkBook = await bookModel.findOne({ _id: bookId, isDeleted: false })

        if (!checkBook) {
            return res.status(404).send({ status: false, msg: "Book is already Deleted" })
        }
        else {
            let checkReview = await reviewModel.findOne({ _id: reviewId, isDeleted: true })
            if (checkReview) {
                return res.status(404).send({ status: false, msg: "Review already is Deleted" })
            }
            else {
                let updateReview = await reviewModel.findOneAndUpdate({ _id: reviewId, isDeleted: false }, { $set: data }, { new: true })

                const { title, excerpt, ISBN, userId, category, subcategory, reviews, releasedAt, isDelated, createdAt, updatedAt } = checkBook

                const bookWithReviews = { title, excerpt, ISBN, userId, category, subcategory, reviews, releasedAt, isDelated, createdAt, updatedAt, updateReview }

                return res.status(200).send({ status: true, msg: "Review Updated", data: bookWithReviews })
            }
        }
    }
    catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }
}



const deleteReviews = async function (req, res) {
    try {
        let bookId = req.params.bookId;
        let reviewId = req.params.reviewId;

        isValid = mongoose.Types.ObjectId.isValid(bookId)
        if (!isValid) {
            return res.status(400).send({ status: false, msg: "Not a valid bookId" })
        }

        isValid = mongoose.Types.ObjectId.isValid(reviewId)
        if (!isValid) {
            return res.status(400).send({ status: false, msg: "Not a valid reviewId" })
        }

        let checkBookId = await bookModel.findOne({ _id: bookId, isDeleted: false })

        if (!checkBookId) {
            return res.status(404).send({ status: false, msg: "Book is already Deleted" })
        }

        else {
            const { reviews, title, excerpt, ISBN, userId, category, subcategory, releasedAt, isDelated, createdAt, updatedAt } = checkBookId

            let checkReview = await reviewModel.findOne({ _id: reviewId, isDeleted: false })
            if (!checkReview) {
                return res.status(404).send({ status: false, msg: "review is already Deleted" })
            }
            else {
                let deleteReview = await reviewModel.findOneAndUpdate({ _id: reviewId, isDeleted: false }, { isDeleted: true, deletedAt: Date() }, { new: true })
                if (deleteReview) {
                    let deleteBook = await bookModel.findOneAndUpdate({ _id: bookId }, { reviews: reviews - 1 })
                }

                let bookDocument = { title, excerpt, ISBN, userId, category, subcategory, reviews, releasedAt, isDelated, createdAt, updatedAt, deleteReview }
                return res.status(200).send({ status: true, msg: "Review Deleted Successfully", data: bookDocument })
            }
        }
    }
    catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }
}

module.exports.createReview = createReview;
module.exports.updateReviews = updateReviews;
module.exports.deleteReviews = deleteReviews;