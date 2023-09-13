process.env.NODE_ENV = "test";

const request = require("supertest");
const app = require("./app");
const db = require("./db");


beforeEach(function() {
 db.query(`INSERT INTO companies
  VALUES ('test', 'test_company', 'this is a test company')`);
  db.query(
    `INSERT INTO invoices 
    VALUES (1, 'test', 300, true, '2018-01-01')`);
})

afterEach(function() {
  // make sure this *mutates*, not redefines, `cats`
db.query(
    `DELETE FROM companies WHERE code = 'test'`)
db.query(
    `DELETE FROM invoices WHERE comp_code = 'test'`)
    

});

describe("company tests", function(){
    test("Get list of all companies", async function(){
        const resp = await request(app).get(`/companies/`)
        console.log("resp body +++++++++++" + resp.text)
        expect(resp.statusCode).toBe(200)
        var obj = JSON.parse(resp.text.replace(/\r?\n|\r/g, ''));
        expect(obj).toEqual({
            "companies": [
                {
                    "code": "test",
                    "name": "test_company",
                    "description": "this is a test company"
                }
            ]
        })
    })

    test("Search company by code", async function(){
        const resp = await request(app).get(`/companies/search/test`)
        var obj = JSON.parse(resp.text.replace(/\r?\n|\r/g, ''))
        expect(resp.statusCode).toBe(200)
        expect(obj[0]).toEqual({
            "code": "test",
            "name": "test_company",
            "description": "this is a test company"
        });

    });

    test("Responds with 404 if can't find company in search", async function() {
        const response = await request(app).get(`/companies/search/none`);
        expect(response.statusCode).toEqual(404);
      });
 

    test("update existing company selected by code", async function(){
        const resp = await request(app).put(`/companies/test`).send({
            "name": "updatedtestcomapny",
            "description": "updatedtestdescription"

        })
        expect(resp.statusCode).toBe(200)
        var obj = JSON.parse(resp.text.replace(/\r?\n|\r/g, ''))
        expect(obj).toEqual(
            {
                "code": "test",
                "name": "updatedtestcomapny",
                "description": "updatedtestdescription"
            }
        )
        
        
    });

    test("delete selected by code", async function(){
        const resp = await request(app).delete(`/companies/test`)
        expect(resp.statusCode).toBe(200)

        var obj = JSON.parse(resp.text.replace(/\r?\n|\r/g, ''))
        expect(obj).toEqual(
            {"message": "Deleted"}
            
        )

        })
    })
describe("invoice tests", function(){
    test("get all invoice list", async function(){
        const resp = await request(app).get(`/invoices/`)
        expect(resp.statusCode).toBe(200)
        var obj = JSON.parse(resp.text.replace(/\r?\n|\r/g, ''))
        expect(obj).toEqual([{
            "id": 1,
            "comp_code": "test",
            "amt": 300,
            "paid": true,
            "add_date": "2017-12-31T23:00:00.000Z",
            "paid_date": null
        }],)
    })

    test("get invoice by searching id", async function(){
        const resp = await request(app).get(`/invoices/1`)
        expect(resp.statusCode).toBe(200)
        var obj = JSON.parse(resp.text.replace(/\r?\n|\r/g, ''))
        expect(obj).toEqual([{
            "id": 1,
            "comp_code": "test",
            "amt": 300,
            "paid": true,
            "add_date": "2017-12-31T23:00:00.000Z",
            "paid_date": null
        }])
    })
    
    test("update invoice object by id", async function(){
        const resp = await (await request(app).put(`invoices/1`)).send({
        "comp_code": "test",
        "amt": 600,
        "paid": true,
        "add_date": "2017-12-31T23:00:00.000Z",
        "paid_date": null})
    
        expect(resp.statusCode).toBe(200)
        var obj = JSON.parse(resp.text.replace(/\r?\n|\r/g, ''))
        expect(obj).toEqual([{
            "id": 1,
            "comp_code": "test",
            "amt": 600,
            "paid": true,
            "add_date": "2017-12-31T23:00:00.000Z",
            "paid_date": null
        }])
    })
  
    

})
