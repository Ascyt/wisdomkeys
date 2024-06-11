import express from "express";
import {Unit} from "../database/unit"
import {StatusCodes} from "http-status-codes";
import {CollectionRepository} from "../repositories/repository_collection";
import {Collection} from "../models/model_collection";
import {collectionDB, collectionDBInsert} from "../models/model_db";

export const collectionRouter = express.Router();

collectionRouter.get('/getAll/:id', async (req, res) => {
  const unit = await Unit.create(true);

  try {
    const collRepo: CollectionRepository = new CollectionRepository(unit);
    const idInput: number = Number(req.params.id);

    if(Number(idInput)) {
      const collections: Collection[] | null = await collRepo.getCollectionsByUserId(idInput);
      if(collections !== null) {
        res.status(StatusCodes.OK).json(collections);
      }
      res.status(StatusCodes.NOT_FOUND).send();
    } else {
      res.status(StatusCodes.BAD_REQUEST);
    }
  } catch (e) {
    console.log(e);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send();
  } finally {
    await unit.complete();
  }
})

collectionRouter.get('/:id', async (req, res) => {
  const unit = await Unit.create(true);

  try {
    const collRepo: CollectionRepository = new CollectionRepository(unit);
    const idInput: number = Number(req.params.id);

    if(Number(idInput)) {
      const collection: Collection | null = await collRepo.getCollectionById(idInput);
      if(collection !== null) {
        res.status(StatusCodes.OK).json(collection);
      }
      res.status(StatusCodes.NOT_FOUND).send();
    } else {
      res.status(StatusCodes.BAD_REQUEST);
    }
  } catch (e) {
    console.log(e);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send();
  } finally {
    await unit.complete();
  }
})

collectionRouter.post('/', async (req, res) => {
  const unit: Unit = await Unit.create(false);

  try {
    const collRepo = new CollectionRepository(unit);
    let success: boolean = false;
    const collection: collectionDBInsert = {
      collectionname: req.body.collectionname,
      avgspeed: req.body.avgspeed,
      bestspeed: req.body.bestspeed,
      raceamount: req.body.raceamount,
      userid: req.body.userid
    }

    success = await collRepo.insertCollection(collection);

    if(success) {
      await unit.complete(true);
      res.status(StatusCodes.CREATED).json(collection);
    } else {
      await unit.complete(false);
      res.status(StatusCodes.BAD_REQUEST).send();
    }
  } catch (e) {
    console.log(e);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send();
  } finally {
    await unit.complete(false);
  }
})

collectionRouter.put('/:id', async (req, res) => {
  const unit: Unit = await Unit.create(false);

  try {
    const collRepo = new CollectionRepository(unit);
    let success: boolean = false;
    const idInput: number = Number(req.params.id);

    if(!Number(idInput)) {
      await unit.complete(false);
      res.status(StatusCodes.BAD_REQUEST).send();
    }

    const collection: Collection = new Collection(
      idInput,
      req.body.collectionname,
      req.body.avgspeed,
      req.body.bestspeed,
      req.body.raceamount,
      req.body.userid,
      []
    );

    success = await collRepo.updateCollection(collection);

    if(success) {
      await unit.complete(true);
      res.status(StatusCodes.OK).json(collection);
    } else {
      await unit.complete(false);
      res.status(StatusCodes.BAD_REQUEST).send();
    }
  } catch (e) {
    console.log(e);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send();
  } finally {
    await unit.complete(false);
  }
})

collectionRouter.delete('/:id', async (req, res) => {
  const unit = await Unit.create(false);

  try {
    const collRepo = new CollectionRepository(unit);
    const idInput = Number(req.params.id);
    let success: boolean = false;

    if(Number(idInput)) {
      const collection: Collection | null = await collRepo.getCollectionById(idInput);
      if(collection !== null) {
        success = await collRepo.deleteCollection(idInput);
      }

      if(success) {
        await unit.complete(true);
        res.status(StatusCodes.OK).send();
      } else {
        await unit.complete(false);
        res.status(StatusCodes.NOT_FOUND).send();
      }
    } else {
      await unit.complete(false);
      res.status(StatusCodes.BAD_REQUEST);
    }
  } catch (e) {
    console.log(e);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send();
  } finally {
    await unit.complete(false);
  }
})
