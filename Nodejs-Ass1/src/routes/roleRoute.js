const express = require("express");
const roleController = require("../controller/roleController");
const router = express.Router();

router.post("/addrole", roleController.addRole) 

router.get("/getrole", roleController.getRole) 

router.get("/:id", roleController.getRolebyId) 

router.put("/:id", roleController.updateRolebyId) 

router.delete("/:id", roleController.deleteRolebyId)

module.exports = router;
