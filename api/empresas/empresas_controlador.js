import express from 'express';
import {body, param, validationResult} from 'express-validator'
import empresasMysql from './empresas_mysql.js';

var router = express.Router();
// Definición de reglas de validación para la creación de una empresa
let reglasEmpresa = [
    body('nombre').notEmpty() // El nombre de la empresa no debe estar vacío
]

let reglasEmpresaId = [
    param('id').notEmpty()
]

let reglasEmpresaPut = [
    body('empresaId').notEmpty()
]
//usamos async para poder usar en su interior instrucciones tipo wait.
// Ruta para crear una nueva empresa
router.post('/', reglasEmpresa, async (req, res, next) => {
    try {
        const result = validationResult(req)
        if (!result.isEmpty()) {
            // Devuelve errores de validación si existen
            res.status(400).send({ errors: result.array() })
            return
        }
        let empresa = req.body
        //Inserta la empresa en la base de datos
        empresa = await empresasMysql.postEmpresas(empresa)
        res.json(empresa); // Devuelve la empresa creada
    } catch (error) {
        next(error)
    }

});

//Ruta para obtener todas las empresas
router.get('/', async (req, res, next) => {
    try {
        // Obtiene todas las empresas de la base de datos
        let empresas = await empresasMysql.getEmpresasMsql();
        // Devuelve las empresas obtenidas
        res.status(200).json(empresas); // se puede poner 200 o no. Por defecto es 200
    } catch (error) {
        next(error)
    }
})

router.get('/:id', reglasEmpresaId, async (req, res, next) => {
    try {
        const result = validationResult(req)
        if (!result.isEmpty()) {
            res.status(400).send({ errors: result.array() })
            return
        }
        let empresa = await empresasMysql.getEmpresaById(req.params.id);
        if (empresa.length == 0) {
            // No hay empresa
            res.status(404).send(`La empresa con id ${req.params.id} no exixte en la base de datos`)
            return
        }
        res.json(empresa[0]); // Devuelve la empresa encontrada
    } catch (error) {
        next(error)
    }
})
// Ruta para actualizar una empresa
router.put('/', reglasEmpresaPut, async (req, res, next) => {
    try {
        const result = validationResult(req)
        if (!result.isEmpty()) {
            res.status(400).send({ errors: result.array() })
            return
        }
        let empresa = req.body;
        // Actualiza la empresa en la base de datos
        await empresasMysql.putEmpresasMsql(empresa)
        res.json(empresa); // Devuelve la empresa actualizada
    } catch (error) {
        next(error)
    }

});

// Ruta para eliminar una empresa por su ID
router.delete('/:id', reglasEmpresaId, async (req, res, next) => {
    try {
        const result = validationResult(req)
        if (!result.isEmpty()) {
            res.status(400).send({ errors: result.array() })
            return
        }
        // Elimina una empresa por su id
        let empresa = await empresasMysql.deleteEmpresaById(req.params.id);
        res.json(empresa); // Devuelve la empresa eliminada
    } catch (error) {
        next(error)
    }
})

//Ruta para buscar empresa por su código
router.post("/buscar-codigo", async (req, res, next) => {
    try {
        let empresa = req.body
        if (!empresa.codigo) {
            return res.status(400).json(`Debe incluir el código de empresa.`)
        }
        let r = await empresasMysql.buscarEmpresaPorCodigo(empresa.codigo)
        if (!r) return res.status(404).json(`No se ha encontrado una empresa con el código ${empresa.codigo}`)
        res.json(r)
    } catch (error) {
        next(error)
    }
})
export default router;