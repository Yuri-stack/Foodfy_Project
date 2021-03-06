const express = require('express')
const routes = express.Router() 

const multer = require('../../app/middlewares/multer')
const { onlyUsers, isAdmin } = require('../../app/middlewares/session')

const Chefs = require('../../app/controllers/ChefsController')

// Rotas para a Administração dos Chefs
routes.get("/", onlyUsers, isAdmin, Chefs.index)                                // Mostrar a lista de Chefs
routes.get("/create", onlyUsers, isAdmin, Chefs.redirectCreate)                 // Mostrar formulário de novo chef
routes.get("/:id", onlyUsers, isAdmin, Chefs.show)                              // Exibir detalhes de um chef
routes.get("/:id/edit", onlyUsers, isAdmin, Chefs.edit)                         // Mostrar formulário de edição de chef
routes.post("/", onlyUsers, isAdmin, multer.array("photos", 1), Chefs.post)     // Cadastrar um novo chef
routes.put('/', onlyUsers, isAdmin, multer.array("photos", 1), Chefs.put)       // Editar um chef
routes.delete("/", onlyUsers, isAdmin, Chefs.delete)                            // Deletar um chef

module.exports = routes