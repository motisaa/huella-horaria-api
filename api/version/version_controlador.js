import { Router } from 'express';
const router = Router();
import pk from '../../package.json' assert {type: 'json'};


router.get('/', (req, res) => {
    let version = {
        name: pk.name,
        version: pk.version,
        description: pk.description
    };
    res.json(version);
});

export default router;