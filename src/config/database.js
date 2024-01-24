module.exports = {
    dialect: 'postgres',
    host: 'localhost',
    username: 'postgres',
    password: 'docker',
    database: 'dbodatabase',
    port: '7777',
    define: {
        timestamps: true,
        underscored: true,
    },
};