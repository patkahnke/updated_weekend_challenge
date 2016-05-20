$(document).ready(function () {
    //Declare global variables
    var totalAnnualSalaries = 0;
    var totalMonthlySalaries = 0;
    var employeeCounter = 0;
    var salaryToBeRemoved = 0;

    $('#container').on('click', 'button', function () {
      var $el=$(this).parent()
    });
    //listen for "submit" events triggered by the button on the employee info form
    $('#employeeinfo').on('submit', function (event) {
      event.preventDefault();

      //serialize an array of objects, each object containing a newly entered employee
      var values = {};
      $.each($('#employeeinfo').serializeArray(), function (i, field) {
        values[field.name] = field.value;
      });

      // clear out inputs
      $('#employeeinfo').find('input[type=text]').val('');

      // send the form data to the server
      $.ajax({
        type: 'POST',
        url: '/employeeData',
        data: values,
        success: function (response) {
          console.log(response);

          //call the function to push new employee info to the DOM
          appendDom(values);
        },//Close the success function
      });//Close the AJAX POST request

      //call the function to increase employeeCounter variable by 1
      increaseEmployeeCounter();
    });

    //All of the functions being used in the event handlers, above, are built below
    function appendDom() {
      $.ajax({
        type: 'GET',
        url: '/employeeData',
        success: function (employees) {
          console.log(employees);
          employeeCounter = 0;
          $('#table').empty();
          $('#table').append('<tr>' +
            '<th>Delete</th>' +
            '<th>#</th>' +
            '<th>First Name</th>' +
            '<th>Last Name</th>' +
            '<th>Employee Number</th>' +
            '<th>Title</th>' +
            '<th>Salary</th>' +
            '</tr>');
          employees.forEach(function (employee) {
            employeeCounter++;
            $('#container').append('<tr>' +
              '<td><button type="button">Delete</button>' +
              '<td>' + employeeCounter + '</td>' +
              '<td>' + employee.first_name + '</td>' +
              '<td>' + employee.last_name + '</td>' +
              '<td>' + employee.employee_number + '</td>' +
              '<td>' + employee.title + '</td>' +
              '<td>' + employee.salary + '</td>' +
              '</tr>');
            $('#table').children().last().data('salary', employee.salary);
          });

          //call the function to calculate monthly salaries based on annual salaries
          getMonthlySalary(employees);

          // call the function to update the monthly salary field on the page
          reportMonthlySalary();
        },
      });
    }

    function getMonthlySalary(employees) {
      totalAnnualSalaries = 0;
      employees.forEach(function (employee) {
        totalAnnualSalaries += employee.salary;
      });

      totalMonthlySalaries = totalAnnualSalaries / 12;
    }

    function increaseEmployeeCounter() {
      employeeCounter += 1;
    }

    function reportMonthlySalary() {
      $('.monthly-salary').text(parseInt(totalMonthlySalaries));
    }

    function retrieveSalaryData() {
      salaryToBeRemoved = $(this).closest('.person').data('salary');
    }

    function subtractSalaryFromTotal() {
      totalAnnualSalaries -= salaryToBeRemoved;
      getMonthlySalary();
    }
  });
