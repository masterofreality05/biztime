const express = require("express");
const router = new express.Router();
const db = require("../db");
const ExpressError = require("../expressError");
const slugify = require("slugify")


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

        
        const industryResults = await db.query(
            `SELECT c.name, i.field FROM companies AS c
                 JOIN industries_companies AS ic ON c.code = ic.company_code
                 JOIN industries AS i ON ic.industry_code = i.code
                 WHERE c.code=$1;`, [code]
        )
        console.log("industry results are " + industryResults.rows[0])

        let { code2, name, description } = results.rows[0];
        let industries = industryResults.rows.map(r => r.field)
        console.log(industries)
        if(results.rows.length === 0){
            throw new ExpressError("this company was not found", 404) }

            return res.json({code2, name, description, industries})

    } catch(e){
        next(e)
    }
});

router.post("/", async function(req,res, next){

    try{
        const {name, description} = req.body;
        var code = slugify(name)

        const results = await db.query(
            `INSERT INTO companies (code, name, description) VALUES ($1, $2, $3) RETURNING *`, [code, name, description] 
        )
        console.log(results)
        return res.status(201).json(results.rows)

    } catch(e) {
        next(e)
    }
})


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