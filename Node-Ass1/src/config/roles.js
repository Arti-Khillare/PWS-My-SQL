const allRoles = {
    user: [],
    admin: [ 'getUsers', 'manageUsers'],
  };
  
  const roles = Object.keys(allRoles);
  
  module.exports = {
    roles
  };