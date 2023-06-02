const roleModel = require("../models/roleModel");

const addRole = async (req, res) => {
    try {
        const roles = await roleModel.create(req.body);
        return res
        .status(200)
          .send({ status: true, message: "Role created Successfully", data: roles });
      } catch (err) {
        return res
        .status(500)
        .send({ status: false, message: "Server Error", err: err.message });
        
      }
}
const getRole = async (req, res) => {
    try {
        const roles = await roleModel.find({ isDeleted: false });
        return res
          .status(200)
          .send({ status: true, message: "Fetched All Roles Successfully", data: roles });
      } catch (err) {
        return res
          .status(500)
          .send({ status: false, message: "Server Error", err: err.message });
      }
}

const getRolebyId = async (req, res) => {
    try {
        const id = req.params.id;
        const roles = await roleModel.findById(id);
        return res
          .status(200)
          .send({ status: true, message: "Fetched Role details by Id Successfully", data: roles });
      } catch (err) {
        return res
          .status(500)
          .send({ status: false, message: "Server Error", err: err.message });
      }
}

const updateRolebyId = async (req, res) => {
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
          .send({ status: true, message: "Updated Role Successfully", data: roles });
      } catch (err) {
        return res
          .status(500)
          .send({ status: false, message: "Server Error", err: err.message });
      }
}
const deleteRolebyId = async ( req, res) => {
    try {
        const id = req.params.id;
        const roles = await roleModel.findOneAndUpdate(
          { _id: id, isDeleted: false },
          { $set: { isDeleted: true } },
          { new: true }
        );
        return res
          .status(200)
          .send({ status: true, message: "Role Deleted by Id Successfully", data: roles });
      } catch (err) {
        return res
          .status(500)
          .send({ status: false, message: "Server Error", err: err.message });
      }
}

module.exports = {
    addRole,
    getRole,
    getRolebyId,
    updateRolebyId,
    deleteRolebyId
}
