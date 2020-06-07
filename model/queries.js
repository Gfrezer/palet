const {
    Pool
} = require('pg')
const pool = new Pool({
    user: 'gael',
    host: 'localhost',
    database: 'palet',
    password: '4millions',
    port: 5432,
})

module.exports = {
    query: (text, params, callback) => {
        return pool.query(text, params, callback)
    }
}