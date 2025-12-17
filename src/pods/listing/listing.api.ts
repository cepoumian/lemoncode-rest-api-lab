import { Router } from 'express';
import { createListingRepository } from '#dals/listing/index.js';
import { mapListingToListItem } from './listing.mappers.js';

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
  .get('/:id', async (_req, res) => {
    res.sendStatus(501);
  })
  .get('/:id/reviews', async (_req, res) => {
    res.sendStatus(501);
  });
