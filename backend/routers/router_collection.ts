import express from "express";
import {Unit} from "../database/unit"
import {StatusCodes} from "http-status-codes";
import {CollectionRepository} from "../repositories/repository_collection";
import {EntryRepository} from "../repositories/repository_entry";
import {Collection} from "../models/model_collection";
import {Entry} from "../models/model_entry";
import {entryDBInsert} from "../models/model_db";
import {collectionDB, collectionDBInsert} from "../models/model_db";

export const collectionRouter = express.Router();

collectionRouter.get('/getAll/:id', async (req, res) => {
  const unit = await Unit.create(true);

  try {
    const collRepo: CollectionRepository = new CollectionRepository(unit);
    const entrRepo: EntryRepository = new EntryRepository(unit);
    const idInput: number = Number(req.params.id);

    if(Number(idInput)) {
      const collections: Collection[] | null = await collRepo.getCollectionsByUserId(idInput);
      if(collections !== null) {
        for(let i = 0; i < collections.length; i++) {
          let entryList: Entry[] | null = await entrRepo.getEntriesByCollectionId(collections[i].collectionId);
          if(entryList !== null) {
            collections[i].entries = entryList;
          }
        }
        res.status(StatusCodes.OK).json(collections);
      } else {
        res.status(StatusCodes.NOT_FOUND).send();
      }
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
    const entrRepo: EntryRepository = new EntryRepository(unit);
    const idInput: number = Number(req.params.id);

    if(Number(idInput)) {
      const collection: Collection | null = await collRepo.getCollectionById(idInput);
      if(collection !== null) {
        let entryList: Entry[] | null = await entrRepo.getEntriesByCollectionId(idInput);
        if(entryList !== null) {
          collection.entries = entryList;
        }

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
      wordamount: req.body.wordamount,
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
    const entrRepo = new EntryRepository(unit);
    let success: boolean = false;
    const idInput: number = Number(req.params.id);

    if(!Number(idInput)) {
      await unit.complete(false);
      res.status(StatusCodes.BAD_REQUEST).send();
    }

    await entrRepo.deleteEntries(idInput);

    for(let i = 0; i < req.body.entries.length; i++) {
      let tempEntry: entryDBInsert = {
        word: req.body.entries[i].word,
        answer: req.body.entries[i].answer,
        collectionid: idInput
      }
      await entrRepo.insertEntry(tempEntry);
    }

    let entries: Entry[] | null = await entrRepo.getEntriesByCollectionId(idInput);
    if(entries === null) {
      entries = [];
    }

    const collection: Collection = new Collection(
      idInput,
      req.body.collectionname,
      req.body.avgspeed,
      req.body.bestspeed,
      req.body.wordamount,
      req.body.userid,
      entries
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
