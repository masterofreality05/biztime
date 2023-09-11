const express = require("express");
const router = new express.Router();
const db = require("../db");
const ExpressError = require("../expressError");


/** GET /users: get list of users */

router.get("/", async function(req, res, next) {
try {
    const results = await db.query(
        `SELECT * FROM companies`);

        return res.json({companies: results.rows})  
} catch(e) {
    next(e)

}

});

router.get("/search/:code", async function(req, res, next){
    try {
        const {code} = req.params
        const results = await db.query(
            `SELECT * FROM companies  WHERE code=$1`, [code]);

        if (results.rows.length < 1){      
            throw  new ExpressError("Company cannot be found", 404)
        }
            return res.json(results.rows)

    } catch(e){
        next(e)
    }
});

router.post("/", async function(req,res, next){

    try{
        const {code, name, description} = req.body;
        console.log(code)
        console.log(name)
        console.log(description)

        const results = await db.query(
            `INSERT INTO companies (code, name, description) VALUES ($1, $2, $3) RETURNING *`, [code, name, description] 
        )
        console.log(results)
        return res.status(201).json(results.rows)

    } catch(e) {
        next(e)
    }
})

router.patch("/:code", async function (req, res, next) {
    try {
      const {name, description } = req.body;
  
      const result = await db.query(
            `UPDATE companies SET name=$1, description=$2
             WHERE code = $3
             RETURNING code, name, description`,
          [name, description, req.params.code]
      );
  
      return res.json(result.rows[0]);
    }
  
    catch (err) {
      return next(err);
    }
  });

router.put("/:code", async function (req, res, next) {
    try {
      const {name, description } = req.body;
  
      const result = await db.query(
            `UPDATE companies SET name=$1, description=$2
             WHERE code = $3
             RETURNING code, name, description`,
          [name, description, req.params.code]
      );
  
      return res.json(result.rows[0]);
    }
  
    catch (err) {
      return next(err);
    }
  });

  router.delete("/:code", async function (req, res, next) {
    try {
      const {code} = req.params;
  
      const result = await db.query(
        "DELETE FROM companies WHERE code = $1",
        [code]
            
      );
  
      return res.json({message: "Deleted"});
    }

    catch (err) {
      return next(err);
    }
  });

module.exports = router;