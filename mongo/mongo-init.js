db = db.getSiblingDB('admin')
db.createUser({
    user: 'admin',
    pwd: '0!PW*o9TYmnBm9MdUtwKw7AL',
    roles: [{ role: 'dbOwner', db: 'UserManagement' }]
})
