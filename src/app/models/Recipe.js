const db = require('../../config/db')
const Base = require('./Base')

Base.init({ table: 'recipes' })

module.exports = { 

    ...Base,

    //Função para SELECIONAR todas as Receitas
    async findAllRecipes(){
        try {
            const query = `
                SELECT recipes.*, chefs.name AS chef_name
                FROM recipes
                LEFT JOIN chefs ON (recipes.chef_id = chefs.id)   
                ORDER BY recipes.created_at DESC
            ` 
            const results = await db.query(query)
            return results.rows
        } catch (error) {
            console.log(error)
        }
    },

    async nameChef(id){
        try {
            const query = `
                SELECT chefs.name AS chef_name
                FROM recipes
                LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
                WHERE recipes.id = $1
            `
            const results = await db.query(query, [id])
            return results.rows[0].chef_name
            
        } catch (error) {
            
        }
    },

    //Função para RETORNAR os dados das Receitas
    // showDataRecipes(id){
    //     try {
    //         const query = `
    //             SELECT recipes.*, chefs.name AS chef_name
    //             FROM recipes
    //             LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
    //             WHERE recipes.id = $1
    //         `
    //         return db.query(query, [id])
    //     } catch (error) {
    //         console.log(error)
    //     }

    // },

    //Função que CARREGA os nomes dos Chefs para o Form das Receitas
    chefSelectOptions(){

        try {
            const query = `SELECT name, id FROM chefs`
            return db.query(query)
        } catch (error) {
            console.log(error)
        }
    },

    //Função para CRIAR as imagens das Receitas no Banco de Dados
    createImageRecipe(recipeId, fileId){

        try {
            const query = `INSERT INTO recipe_files (recipe_id, file_id) VALUES ($1,$2) RETURNING id`
            const values = [recipeId, fileId]

            return db.query(query, values)
            
        } catch (error) {
            console.log(error)
        } 

    },

    //Função para RETORNAR as Receitas suas respectivas Imagens
    async findImageRecipe(id){

        try {
            const query =`
            SELECT files.* FROM files 
            LEFT JOIN recipe_files ON (files.id = recipe_files.file_id)
            LEFT JOIN recipes ON (recipes.id = recipe_files.recipe_id) 
            WHERE recipes.id = $1`;

            const results = await db.query(query, [id]);
            return results.rows

        } catch (error) {
            console.error(error);
            console.log("Erro recipeFile")
        }
    },

    //Função para APAGAR as imagens do Banco de Dados
    async deleteImageRecipe({ recipeId, fileId }){

        try{
            return db.query(`
                DELETE FROM recipe_files 
                WHERE recipe_id = $1 AND file_id = $2`, [recipeId, fileId]);
        }catch (error) {
            console.log(error)
        }

    },

    //Função para ENCONTRAR as receitas de um Usuário
    findAllRecipesUser(id){
        try {
            const query = `
                SELECT recipes.* FROM recipes WHERE user_id = $1
            `
            return db.query(query, [id])
            
        } catch (error) {
            console.error(error);
            console.log("Erro findAllRecipesUser")
        }
    },

    //Função relacionado a PAGINAÇÃO das Receitas
    paginate(params){
        try {
            const { filter, limit, offset } = params

            let query = "",
                filterQuery = "",
                totalQuery = `(
                    SELECT count(*) FROM recipes
                ) AS total
                `
    
            if( filter ){
                filterQuery = `WHERE recipes.title ILIKE '%${filter}%'`
    
                totalQuery = `(
                    SELECT count(*) FROM recipes
                    ${filterQuery}
                ) AS total`
            }
    
            query = `
                SELECT recipes.*, ${totalQuery}, chefs.name AS chef_name
                FROM recipes
                LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
                ${filterQuery}
                ORDER BY recipes.id ASC LIMIT $1 OFFSET $2
            `
    
            return db.query(query, [limit, offset])         

        } catch (error) {
            console.log(error)
        }

    }
 }