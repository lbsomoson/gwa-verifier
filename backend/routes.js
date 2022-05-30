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
  app.get("/viewusers", controller.findAllUsers);
  app.post("/deleteuser", controller.deleteUser);
  app.get("/viewstudents", controller.findAllStudents);
  app.post("/viewRecords", controller.findStudentRecord);

  app.post("/editRecord", controller.editStudentRecord);
  app.post("/addedithistory", controller.addEditHistory);
  app.get("/viewedithistory", controller.findAllEdits);
  app.post("/searchstudents", controller.searchStudents);

  app.post("/searchstudentsGwa", controller.searchStudentsByGwa);
  app.post("/searchstudentsID", controller.searchStudentsByID);
  app.get("/sortstudents", controller.sortBy);
  app.post("/deletestudent", controller.deleteStudent);
  app.post("/deleteallstudents", controller.deleteAllStudents);
  app.get("/downloadSummary", controller.downloadSummary);
  app.get("/getQualified", controller.findQualifiedStudents);
  app.get("/viewusers", controller.findAllUsers);
  app.post("/deleteuser", controller.deleteUser);
  app.post("/addactivity", controller.addActivity);
  app.get("/finduseractivities", controller.findUserActivities);
  app.get("/findallactivities", controller.findAllActivities);
  
  app.get("/finduser", controller.findUser);
  app.post("/updateuser", controller.updateUser);
  app.get("/finduseredits", controller.findUserEdits);
}