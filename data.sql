\c biztime
/*

Add a table that allows an industry to be connected to several companies and to have a company belong to several industries.

Add some sample data (by hand in psql is fine).

Change this route:
when viewing details for a company, you can see the names of the industries for that company
Add routes for:

adding an industry
listing all industries, which should show the company code(s) for that industry
associating an industry to a company
*/
DROP TABLE IF EXISTS industries_companies;
DROP TABLE IF EXISTS industries;
DROP TABLE IF EXISTS invoices;
DROP TABLE IF EXISTS companies;

CREATE TABLE companies (
    code text PRIMARY KEY,
    name text NOT NULL UNIQUE,
    description text
);

CREATE TABLE invoices (
    id serial PRIMARY KEY,
    comp_code text NOT NULL REFERENCES companies ON DELETE CASCADE,
    amt float NOT NULL,
    paid boolean DEFAULT false NOT NULL,
    add_date date DEFAULT CURRENT_DATE NOT NULL,
    paid_date date,
    CONSTRAINT invoices_amt_check CHECK ((amt > (0)::double precision))
);

CREATE TABLE industries (
  code text PRIMARY KEY,
  field text NOT NULL
);

CREATE TABLE industries_companies (
  industry_code text REFERENCES industries ON DELETE CASCADE,
  company_code text REFERENCES companies ON DELETE CASCADE,
  PRIMARY KEY (industry_code, company_code)

);

INSERT INTO companies
  VALUES ('apple', 'Apple Computer', 'Maker of OSX.'),
         ('ibm', 'IBM', 'Big blue.');

INSERT INTO invoices (comp_code, amt, paid, paid_date)
  VALUES ('apple', 100, false, null),
         ('apple', 200, false, null),
         ('apple', 300, true, '2018-01-01'),
         ('ibm', 400, false, null);

INSERT INTO industries (code, field)
   VALUES ('fsh', 'fishing industry'),
          ('cpt', 'computing industry'),
          ('elc', 'electronix industry');

INSERT INTO industries_companies (industry_code, company_code)
   VALUES('cpt','ibm'),
         ('cpt','apple'),
         ('fsh','apple');
         
  
