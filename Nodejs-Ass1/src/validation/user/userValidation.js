const { user } = require("../user/userSchema");

module.exports = {
  addUserValidation: async (req, res, next) => {
    const value = await user.validate(req.body);
    if (value.error) {
      res.json({
        status: false,
        message: value.error.details[0].message,
      });
    } else {
      next();
    }
  },
};
