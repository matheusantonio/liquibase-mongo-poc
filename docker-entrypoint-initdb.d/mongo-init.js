db.createUser({
    user: "liquibase",
    pwd: "liquibase",
    roles: [
        { role: "dbOwner", db: "liquibase-docker"}
    ]
});
