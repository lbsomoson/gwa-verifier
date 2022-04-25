const authController = require('./auth-controller');

module.exports = (app) => {

   /* signUp is a limited function to admin users */
  app.get("/signup", authController.signUp);

  app.post("/loginUser", authController.login);
  //app.get("/checkifloggedin", authController.checkIfLoggedIn);

  app.get("/viewstudents", authController.findAllStudents);

  app.get("/searchstudents", authController.searchStudents);

  app.get("/sortstudents", authController.sortBy);
  
  app.post("/deletestudent", authController.deleteStudent);
}