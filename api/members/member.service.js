const config = require('config.json');
const jwt = require('jsonwebtoken');

const fs = require('fs');
const data = fs.readFileSync('./database.json');
const mysql = require('mysql');
const conf = JSON.parse(data);

const connection = mysql.createConnection({
   host: conf.host,
   user: conf.user,
   password: conf.password,
   port: conf.port,
   database: conf.database
})

connection.connect();

module.exports = {
    registerMember,
    deleteMember,
    getAll
};


async function deleteMember(res, {id, typedPW}) {
    let sql = 'DELETE FROM MEMBER WHERE id=? and password=AES_ENCRYPT(?, HEX(SHA2(\'encrypt-key\',512)))';
    let params = [id, typedPW]
    await connection.query(sql, params,
        (err, rows, fields) => {
            if(rows.affectedRows){
                res.json({success: true})
            }
            else{
                res.json({success: false})
            }
        })
}

async function registerMember(res, {name, id, password, zion, unit}) {
    let sql = 'INSERT INTO MEMBER VALUES (?, ?, AES_ENCRYPT(?, HEX(SHA2(\'encrypt-key\',512))), ?, ?)';
    let params = [name, id, password, zion, unit];
    return await connection.query(sql, params,
        (err, rows, fields) => { res.send(rows) })
}

async function getAll(res) {
    await connection.query(
     "SELECT name, id, zion, unit FROM MEMBER",
       (err, rows, fields) => { res.send(rows); });
}
