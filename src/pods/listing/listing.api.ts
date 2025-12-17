import { Router } from 'express';
import { ObjectId } from 'mongodb';
import type {
  CreateReviewApiModel,
  ReviewApiModel,
} from './listing.api-model.js';
import { createListingRepository } from '#dals/listing/index.js';
import { mapListingToListItem, mapListingToDetail } from './listing.mappers.js';

export const listingApi = Router();

const listingRepository = createListingRepository();

listingApi
  .get('/', async (req, res) => {
    const country = String(req.query.country ?? '');

    if (!country) {
      res.status(400).send("Query param 'country' is required");
      return;
    }

    const page = Number(req.query.page ?? 1);
    const pageSize = Number(req.query.pageSize ?? 10);

    if (!Number.isInteger(page) || page < 1) {
      res.status(400).send("Query param 'page' must be an integer >= 1");
      return;
    }

    if (!Number.isInteger(pageSize) || pageSize < 1 || pageSize > 50) {
      res
        .status(400)
        .send("Query param 'pageSize' must be an integer between 1 and 50");
      return;
    }

    const listings = await listingRepository.getListingsByCountry(
      country,
      page,
      pageSize
    );

    res.send(listings.map(mapListingToListItem));
  })
  .get('/:id', async (req, res) => {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      res.status(400).send('Invalid id');
      return;
    }

    const listing = await listingRepository.getListingById(id);

    if (!listing) {
      res.sendStatus(400);
      return;
    }

    res.send(mapListingToDetail(listing));
  })
  .get('/:id/reviews', async (_req, res) => {
    res.sendStatus(501);
  })
  .post('/:id/reviews', async (req, res) => {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      res.status(400).send('Invalid id');
      return;
    }

    const body = req.body as Partial<CreateReviewApiModel>;

    const reviewerName = body.reviewerName?.trim();
    const comments = body.comments?.trim();

    if (!reviewerName || !comments) {
      res.status(400).send('reviewerName and comments are required');
      return;
    }

    const createdReview: ReviewApiModel = {
      id: new ObjectId().toHexString(),
      date: new Date().toISOString(),
      reviewerName,
      comments,
    };

    const inserted = await listingRepository.addReview(id, {
      reviewer_name: reviewerName,
      comments,
      date: new Date(createdReview.date),
    });

    if (!inserted) {
      res.sendStatus(404);
      return;
    }

    res.status(201).send(createdReview);
  });
