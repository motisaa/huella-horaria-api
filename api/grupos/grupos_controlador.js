import express from 'express';
import {body, param, validationResult} from 'express-validator'
import gruposMysql from './grupos_mysql.js'

var router = express.Router();

let reglasGrupos = [
    body('nombre').notEmpty()
]

let reglasGrupoId = [
    param('grupoId').notEmpty()
]
let reglasGrupoPut = [
    body('grupoId').notEmpty()
]

router.post('/', reglasGrupos, async (req, res, next) => {
    try {
        const result = validationResult(req)
        if (!result.isEmpty()) {
            res.status(400).send({ errors: result.array() })
            return
        }
        let grupo = req.body
        grupo = await gruposMysql.postGrupos(grupo);
        res.json(grupo);
    } catch (error) {
        next(error)
    }
});

router.get('/', async (req, res, next) => {
    try {
        let grupos = await gruposMysql.getGrupos();
        res.json(grupos);
    } catch (error) {
        next(error)
    }
});

router.get('/:grupoId', reglasGrupoId, async (req, res, next) => {
    try {
        const result = validationResult(req)
        if (!result.isEmpty()) {
            res.status(400).send({ errors: result.array() })
            return
        }
        let grupo = await gruposMysql.getGrupoById(req.params.grupoId);
        if (!grupo) {
            // No hay grupo
            res.status(404).send(`El grupo con id ${req.params.grupoId}
            no exixte en la base de datos`)
            return
        }
        res.json(grupo);
    } catch (error) {
        next(error)
    }
})

router.put('/', reglasGrupoPut, async (req, res, next) => {
    try {
        const result = validationResult(req)
        if (!result.isEmpty()) {
            res.status(400).send({ errors: result.array() })
            return
        }
        let grupos = req.body;
        await gruposMysql.putGrupos(grupos)
        res.json(grupos);
    } catch (error) {
        next(error)
    }

});

router.delete('/:grupoId', reglasGrupoId, async (req, res, next) => {
    try {
        const result = validationResult(req)
        if (!result.isEmpty()) {
            res.status(400).send({ errors: result.array() })
            return
        }
        let grupo = await gruposMysql.deleteGrupoById(req.params.grupoId);
        res.json(grupo);
    } catch (error) {
        next(error)
        /*  ERROR http response status 405.
            MDN: The request method 
            is known by the server but is not supported by the target resource.
            For example, an API may not allow calling DELETE to remove a resource. */
            return res.status(405).json({ error: 'Method not Allowed' });
    }
})

export default router;