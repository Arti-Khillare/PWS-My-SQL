const express = require("express");
const roleModel = require("../models/roleModel");
const router = express.Router();

router.post("/addrole",  async (req, res, next) => {
  try {
    const roles = await roleModel.create(req.body);
    return res
    .status(200)
      .send({ status: true, message: "created", data: roles });
  } catch (err) {
    return res
    .status(500)
    .send({ status: false, message: "Error", err: err.message });
    
  }
});

router.get("/getrole", async (req, res) => {
  try {
    const roles = await roleModel.find({ isDeleted: false });
    return res
      .status(200)
      .send({ status: true, message: "getall roles", data: roles });
  } catch (err) {
    return res
      .status(500)
      .send({ status: false, message: "Error", err: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const roles = await roleModel.findById(id);
    return res
      .status(200)
      .send({ status: true, message: "get details by id", data: roles });
  } catch (err) {
    return res
      .status(500)
      .send({ status: false, message: "Error", err: err.message });
  }
});
router.put("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const body = req.body;
    const roles = await roleModel.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { $set: body },
      { new: true }
    );
    return res
      .status(200)
      .send({ status: true, message: "updated", data: roles });
  } catch (err) {
    return res
      .status(500)
      .send({ status: false, message: "Error", err: err.message });
  }
});
router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const roles = await roleModel.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { $set: { isDeleted: true } },
      { new: true }
    );
    return res
      .status(200)
      .send({ status: true, message: "deleted", data: roles });
  } catch (err) {
    return res
      .status(500)
      .send({ status: false, message: "Error", err: err.message });
  }
});
module.exports = router;
