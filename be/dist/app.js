var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import teamRepo from './repos/teamRepo';
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.route('/api/team')
    .get((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield teamRepo.get(null, null);
        return res.send(data);
    }
    catch (error) {
        if (error === 'no team in database') {
            return res.status(404).send({ error });
        }
        return res.status(500).send({ error });
    }
}))
    .post((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.body.type === 'search') {
        try {
            const ret = yield teamRepo.get(req.body.name, req.body.limit);
            return res.send(ret);
        }
        catch (error) {
            if (error === `there is no match to search term of '${req.body.name.toLowerCase()}'`)
                return res.status(404).send({ error });
            return res.status(500).send({ error });
        }
    }
    let data;
    try {
        data = yield teamRepo.insert(req.body);
    }
    catch (error) {
        return res.status(500).send({ error });
    }
    res.send(data);
}));
app.route('/api/team/:id')
    .get((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    const data = yield teamRepo.getById(id);
    if (!data) {
        return res.status(404).send({ error: `no team with id of ${id}` });
    }
    return res.status(200).send(data);
}))
    .put((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    const updatedTeam = req.body;
    if (id !== updatedTeam.id) {
        return res.status(400).send({ error: "the id in url endpoint and request body does not match" });
    }
    let data;
    try {
        data = yield teamRepo.update(id, updatedTeam);
    }
    catch (error) {
        if (error === `team with id of ${id} not exists in database`) {
            return res.status(404).send({ error });
        }
        return res.status(500).send({ error });
    }
    return res.send(data);
}))
    .delete((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    let data;
    try {
        data = yield teamRepo.remove(id);
    }
    catch (error) {
        if (error === `team with ${id} not exists in database`) {
            return res.status(404).end();
        }
        return res.status(500).send({ error });
    }
    res.send(data);
}));
app.listen(4000, () => {
    console.log('--->BE listening on port 4000.');
});
//# sourceMappingURL=app.js.map