import { Router } from 'express';
import { ObjectId } from 'mongodb';
import type {
  CreateReviewApiModel,
  ReviewApiModel,
} from './listing.api-model.js';
import { createListingRepository } from '#dals/listing/index.js';
import { mapListingToListItem, mapListingToDetail } from './listing.mappers.js';
import type { UpdateListingApiModel } from './listing.api-model.js';

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
  .put('/:id', async (req, res) => {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      res.status(400).send('Invalid id');
      return;
    }

    const body = req.body as Partial<UpdateListingApiModel>;

    // Normalizar/limpiar
    const update = {
      name: body.name?.trim(),
      description: body.description?.trim(),
      imageUrl: body.imageUrl ?? undefined,
      amenities: body.amenities,
      price: body.price ?? undefined,
      address: body.address
        ? {
            street: body.address.street?.trim() ?? body.address.street,
          }
        : undefined,
    };
    console.log({ update });
    // Detectar si update viene vacío
    const hasAnyField =
      update.name !== undefined ||
      update.description !== undefined ||
      update.imageUrl !== undefined ||
      update.amenities !== undefined ||
      update.price !== undefined ||
      update.address?.street !== undefined;

    // Validaciones mínimas
    if (!hasAnyField) {
      res.status(400).send('At least one field must be provided');
      return;
    }

    if (update.amenities !== undefined && !Array.isArray(update.amenities)) {
      res.status(400).send('amenities must be an array of strings');
      return;
    }

    if (
      update.price !== undefined &&
      update.price !== null &&
      typeof update.price !== 'number'
    ) {
      res.status(400).send('price must be a number or null');
      return;
    }

    const updated = await listingRepository.updateListing(id, update);

    if (!updated) {
      res.sendStatus(404);
      return;
    }

    res.sendStatus(204);
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
