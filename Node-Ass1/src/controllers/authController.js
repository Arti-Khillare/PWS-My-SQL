const userService = require('../services/userServices');
const tokenService = require('../services/tokenServices')


exports.registerUser = async (req, res, next) => {
   try{
      if(!(req.body.email == process.env.ADMIN_EMAIL)){
        res.status(400).send({status : false, msg : "email must admin email"})
        return
      }
  
      const users = await userService.registerUser(req.body);
      res.json({  status: "success", message : "user registered successfully", data: users});

    }
    catch (err) {
      next(err);
    }
}


  exports.loginUserWithEmailAndPassword = async (req, res, next) => {
    try {
     const user = await userService.getUserByEmail(req.body.email);
     if (!user || !(await user.isPasswordMatch(req.body.password))) {
       return res.status(400).send({ status : 'failure', message : 'Invalid password or email'})
     }
     const token = await tokenService.generateToken(user._id, user.role)
     res.setHeader("x-access-token", token);
     const saveToken = await tokenService.saveToken(user._id, user.role, token)
     return res.status(200).send({ status : 'success', message : 'login successfully', data : saveToken})
    }
    catch (err) {
     next(err);
    }
   };