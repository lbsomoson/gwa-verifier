const authController = require('./auth-controller');

module.exports = (app) => {

   /* signUp is a limited function to admin users */
  //app.post("/signup", authController.signUp);

  app.get("/login", authController.login);
  //app.get("/checkifloggedin", authController.checkIfLoggedIn);
}