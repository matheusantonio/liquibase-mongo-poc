db.createDatabase("");
db.createUser({
    user: "liquibase",
    pwd: "liquibase",
    roles: [
        { role: "dbOwner", db: "liquibase-hlg"},
        { role: "dbOwner", db: "liquibase-prd"}
    ]
});