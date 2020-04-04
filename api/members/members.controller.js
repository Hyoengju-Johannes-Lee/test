const express = require('express');
const router = express.Router();
const memberService = require('./member.service');

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


// routes
router.post('/delete', deleteMember);
router.post('/register', registerMember);
router.get('/', getAll);

module.exports = router;

async function registerMember(req, res) {
    await memberService.registerMember(res, req.body)

}

async function deleteMember(req, res) {
    await memberService.deleteMember(res, req.body)
}


async function getAll(req, res) {
    await memberService.getAll(res)
}
