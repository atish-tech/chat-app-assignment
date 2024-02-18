let users = [];

exports.addUser = ({id , name , room}) => {
    const user = {id , name , room};

    users.push(user);

    return {user}
}

exports.removeUser = (id) => {
    const index = users.findIndex(user => user.id === id)

    return users[index];
}