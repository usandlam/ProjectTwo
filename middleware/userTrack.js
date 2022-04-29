const app = require("../app.js");

module.exports = function() {
    return (req, res, next) => {
      if (req.isAuthenticated()) {
          console.log('Hit');
          console.log(app.locals);
        app.locals.userSession = req.session.passport;
        return next();
      }else{
          return next();
      }
    }
  }