var express = require('express');
var router = express.Router();
var result = {};
var pg = require('pg');
var connectionString = 'postgres://localhost:5432/patkahnke';

router.get('/', function (req, res) {
  pg.connect(connectionString, function (err, client, done) {
    if (err) {
      res.sendStatus(500);
    }

    client.query('SELECT * FROM employees', function (err, result) {
      done();
      if (err) {
        res.sendStatus(500);
      }

      console.log(result.rows);

      res.send(result.rows);
    });
  });
});

router.post('/', function (req, res)  {
    var employee = req.body;
    pg.connect(connectionString, function (err, client, done) {
              if (err) {
                res.sendStatus(500);
              }

              client.query('INSERT INTO employees (first_name, last_name,' +
                'employee_number, title, salary) ' +
                  'VALUES ($1, $2, $3, $4, $5)',
                  [employee.employeefirstname, employee.employeelastname,
                  employee.employeeidnumber, employee.employeejobtitle,
                  employee.employeesalary], function (err, result) {
                  done();

                  if (err) {
                    res.sendStatus(500);
                    return;
                  }

                  res.sendStatus(201);
                }
              );
            });
  });

module.exports = router;
