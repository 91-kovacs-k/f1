import { Router } from "express";
import * as pilotRepo from "../repos/pilotRepo.js";
import { BackendError, ErrorType } from "../utils/error.js";

export const pilotRouter = Router();

pilotRouter
  .route("/")
  .get(async (req, res) => {
    const query = req.query;
    if (query.name === undefined && query.limit === undefined) {
      try {
        const data = await pilotRepo.get();
        return res.send(data);
      } catch (error) {
        if (
          error.type === ErrorType.NotFound ||
          error.type === ErrorType.NoRecords
        ) {
          return res.status(404).send(error);
        }
        return res.status(500).send(error);
      }
    } else {
      try {
        const nameQuery: string =
          query.name !== undefined ? (query.name as string) : "";
        let limitQuery: number = 0;
        if (query.limit !== undefined && !isNaN(+query.limit)) {
          limitQuery = +query.limit;
        }
        const ret = await pilotRepo.get(nameQuery, limitQuery);
        return res.send(ret);
      } catch (error) {
        if (
          error.type === ErrorType.NotFound ||
          error.type === ErrorType.NoRecords
        ) {
          return res.status(404).send(error);
        }
        if (
          error.type === ErrorType.AlreadyExists ||
          error.type === ErrorType.ArgumentError ||
          error.type === ErrorType.IdMismatch ||
          error.type === ErrorType.MultipleMatch
        ) {
          return res.status(400).send(error);
        }
        return res.status(500).send(error);
      }
    }
  })
  .post(async (req, res) => {
    let data;
    try {
      data = await pilotRepo.insert(req.body);
    } catch (error) {
      if (
        error.type === ErrorType.AlreadyExists ||
        error.type === ErrorType.MultipleMatch ||
        error.type === ErrorType.IdMismatch ||
        error.type === ErrorType.ArgumentError
      ) {
        return res.status(400).send(error);
      }
      if (
        error.type === ErrorType.NoRecords ||
        error.type === ErrorType.NotFound
      ) {
        return res.status(404).send(error);
      }
      return res.status(500).send(error);
    }
    return res.send(data);
  });

pilotRouter
  .route("/:id")
  .get(async (req, res) => {
    const id = Number(req.params.id);
    try {
      const data = await pilotRepo.getById(id);
      return res.status(200).send(data);
    } catch (error) {
      if (error.type === ErrorType.NotFound) {
        return res.status(404).send(error);
      }
      return res.status(500).send(error);
    }
  })
  .put(async (req, res) => {
    const id = Number(req.params.id);
    const updatedPilot = req.body;
    if (!(updatedPilot.id === null || updatedPilot.id === undefined)) {
      if (id !== Number(updatedPilot.id)) {
        return res
          .status(400)
          .send(
            new BackendError(
              ErrorType.IdMismatch,
              "id mismatch",
              "the id in url endpoint and request body does not match"
            )
          );
      }
    }

    let data;
    try {
      data = await pilotRepo.update(id, updatedPilot);
    } catch (error) {
      if (error.type === ErrorType.NotFound) {
        return res.status(404).send(error);
      }
      if (
        error.type === ErrorType.AlreadyExists ||
        error.type === ErrorType.IdMismatch ||
        error.type === ErrorType.MultipleMatch
      ) {
        return res.status(400).send(error);
      }
      return res.status(500).send(error);
    }

    res.send(data);
  })
  .delete(async (req, res) => {
    const id = Number(req.params.id);
    let data;
    try {
      data = await pilotRepo.remove(id);
    } catch (error) {
      if (error.type === ErrorType.NotFound) {
        return res.status(404).send(error);
      }
      return res.status(500).send(error);
    }
    return res.send(data);
  });
