const authController = require('./auth-controller');
const controller = require('./controller');
const myModule = require('./index');
const {upload} = myModule.singleFile

module.exports = (app) => {

   /* signUp is a limited function to admin users */
  app.post("/signup", authController.signUp);

  app.post("/loginUser", authController.login);
  app.post("/checkifloggedin", authController.checkIfLoggedIn);
  app.post("/single", upload.array("files", 10), controller.uploadSingle);
  app.get("/viewstudents", controller.findAllStudents);
  app.get("viewRecords", controller.findStudentRecord);
  app.get("/searchstudents", controller.searchStudents);
  app.get("/sortstudents", controller.sortBy);
  app.post("/deletestudent", controller.deleteStudent);
  app.post("/deleteallstudents", controller.deleteAllStudents);
}