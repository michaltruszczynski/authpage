const Employee = require("../model/Employee");

const getAllEmployees = async (req, res) => {
   const employees = await Employee.find();
   if (!employees)
      return res.status(204).json({ message: "No employees found." });
   res.json(employees);
};

const createNewEmployee = async (req, res) => {
   if (!req?.body?.firstname || req?.body?.lastname) {
      return res
         .status(400)
         .json({ message: "First and last names are required." });
   }

   try {
      const result = await Employee.create({
         firstname: req.body.firstname,
         lastname: req.body.lastname,
      });
      console.log(result);
      res.status(201).json(result);
   } catch (err) {
      console.log(err);
   }
};

const updateEmployee = async (req, res) => {
   if (!req?.body?.id) {
      return res.status(400).json({ message: "ID parameter is required." });
   }

   const employee = await Employee.findOne({ _id: req.body.id }).exec();

   if (!employee) {
      return res
         .status(204)
         .json({ message: `no employee matches Employee ID ${req.body.id}.` });
   }

   if (req.body?.firstname) employee.firstname = req.body.firstname;
   if (req.body?.lastname) employee.lastname = req.body.lastname;

   // TODO sorting to be checked
   //    data.setEmployees(
   //       unsortedArray.sort((a, b) => (a.id > b.id ? 1 : a.id < b.id ? -1 : 0))
   //    );

   const result = await employee.save();
   res.json(result);
};

const deleteEmployee = async (req, res) => {
   if (!req?.body?.id) {
      return res.status(400).json({ message: "ID parameter is required." });
   }
   const employee = await Employee.findOne({ _id: req.body.id }).exec();

   if (!employee) {
      return res
         .status(204)
         .json({ message: `no employee matches Employee ID ${req.body.id}.` });
   }
   const result = Employee.deleteOne({ _id: req.body.id });

   res.json(result);
};

const getEmployee = async (req, res) => {
   if (!req?.params?.id) {
      return res.status(400).json({ message: "ID parameter is required." });
   }

   const employee = await Employee.findOne({ _id: req.params.id }).exec();

   res.json(employee);
};

module.exports = {
   getAllEmployees,
   createNewEmployee,
   updateEmployee,
   deleteEmployee,
   getEmployee,
};
