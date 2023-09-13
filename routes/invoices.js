const express = require("express");
const router = new express.Router();
const db = require("../db");
const ExpressError = require("../expressError");
let date_ob = new Date();
let date = (date_ob.getFullYear() + "-" + date_ob.getMonth() + "-" + date_ob.getDay())


router.get("/", async function(req, res, next) {
    try {
        const results = await db.query(
            `SELECT * FROM invoices`);
    
            return res.json(results.rows)  
    } catch(e) {
        next(e);
    
    }
});

router.get("/:id", async function(req, res, next) {
    try {
        var {id} = req.params
        const results = await db.query(
            `SELECT * FROM invoices
            WHERE id = $1`, [id]);
    
            return res.json(results.rows)  
    } catch(e) {
        next(e);
    
    }
});

router.post("/", async function(req,res, next){

    try{
        const {comp_code, amt, paid, add_date, paid_date} = req.body;

        const results = await db.query(
            `INSERT INTO invoices (comp_code, amt, paid, add_date, paid_date) VALUES ($1, $2, $3, $4, $5) RETURNING *`, [comp_code, amt, paid, add_date, paid_date] 
        )
        console.log(results)
        return res.status(201).json(results.rows)

    } catch(e) {
        next(e)
    }
    //comp_code text NOT NULL REFERENCES companies ON DELETE CASCADE,
   // amt float NOT NULL,
   // paid boolean DEFAULT false NOT NULL,
   // add_date date DEFAULT CURRENT_DATE NOT NULL,
   // paid_date date,
})

router.put("/:id", async function (req, res, next) {
    try {
    let {comp_code, amt, paid, add_date, paid_date} = req.body;

    const selectedInvoice = await db.query(
        `SELECT * FROM invoices WHERE id = $1`, [req.params.id]
    )
    console.log(selectedInvoice.rows[0].paid)
    if(selectedInvoice.rows[0].paid == false){
        console.log("trueeeeeee")
        paid = true
        paid_date = date
    } 
  
      const result = await db.query(
            `UPDATE invoices SET comp_code=$1, amt=$2, paid=$3, add_date=$4, paid_date=$5
             WHERE id = $6
             RETURNING *`,
          [comp_code, amt, paid, add_date, paid_date, req.params.id]
      );
      if(result.rows.length === 0){
        throw new ExpressError("The invoice could not be found", 404)
      }
  
      return res.json(result.rows[0]);
    }
  
    catch (err) {
      return next(err);
    }
  });

  router.delete("/:id", async function (req, res, next) {
    try {
      const {id} = req.params;
  
      const result = await db.query(
        "DELETE FROM invoices WHERE id = $1",
        [id]
            
      );
  
      return res.json({message: "Deleted"});
    }

    catch (err) {
      return next(err);
    }
  });
    

module.exports = router;