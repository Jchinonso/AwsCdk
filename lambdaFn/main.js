const createUser = require('./createUser');
const deleteUser = require('./deleteUser');
const listUsers = require('./listUsers');
const updateUser = require('./updateUser');



exports.handler = async (event) => {
    switch (event.info.fieldName) {
        case "createUser":
            return await createUser(event.arguments.user);
        case "listUsers":
            return await listUsers();
        case "deleteUser":
            return await deleteUser(event.arguments.userId);
        case "updateNote":
            return await updateUser(event.arguments.user);
        default:
            return null;
    }
}

