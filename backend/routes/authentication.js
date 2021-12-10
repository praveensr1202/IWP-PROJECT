const express = require('express')
const router = express.Router()
const mysql = require('mysql');

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database:"workforce"
});
con.connect(function (err) {
    if (err) throw err;
    console.log("Database Connected -auth")
});

var name = "mahesh";
var password = 1234;

router.post('/',async (req,res) => {
    if (req.body.session_id != null){
        var sql = "SELECT userid FROM sessions WHERE id = "+mysql.escape(req.body.session_id)
        con.query(sql, function (err, result) {
            if (err) throw err;
            if (result.length == 1){
                var sql = "SELECT status FROM users WHERE id = "+mysql.escape(result[0].userid)
                con.query(sql,function(err,result2){
                    if (err) throw err;
                    res.json({"SessionPresent":result[0].userid,"user_status":result2[0].status})
                })
            }
            else{
                res.json({"SessionPresent":null})
            }
        });
    }
})

router.post('/logout',async (req,res) => {
    if (req.body.remove_id != null){
        var sql = "DELETE FROM sessions WHERE id = "+mysql.escape(req.body.remove_id)
        con.query(sql,function(err,result){
            if (err) throw err;
            res.json({"removeStatus":true})
        })
    }
    else{
        res.json({"removeStatus":true})
    }
})

router.post('/admin',async (req,res)=>{
    if (req.body.name != null && req.body.password != null){
        if (req.body.name == name && req.body.password == password){
            var sql = "SELECT * FROM prof_requests"
            con.query(sql,function(err,result){
                if (err) throw err;
                res.json({"valid":true,"arr":result})
            })
        }
        else{
            res.json({"valid":false,"arr":[]})
        }
    }
})

router.post('/operation',async (req,res)=>{
    if (req.body.name != null && req.body.password != null && req.body.id != null && req.body.operation != null){
        if (req.body.name == name && req.body.password == password){
            var sql = "SELECT * FROM prof_requests WHERE id = "+mysql.escape(req.body.id)
            con.query(sql,function(err,result){
                if (err) throw err;
                if (result.length > 0){
                    if (req.body.operation == "accept"){
                        var sql = "SELECT * FROM users WHERE email = "+mysql.escape(result[0].email)
                        con.query(sql,function(err,result1){
                            if (err) throw err;
                            if (result1.length == 0){
                                var sql = "INSERT INTO users (email,status) VALUES ("+mysql.escape(result[0].email)+", 1 )"
                                con.query(sql,function(err,result2){
                                    if (err) throw err;
                                    var sql = "INSERT INTO professionals (email,name,ph_no,userid ) VALUES ("+mysql.escape(result[0].email)+","+mysql.escape(result[0].name)+","+mysql.escape(result[0].ph_no)+","+mysql.escape(result2.insertId)+")"
                                    con.query(sql,function(err,result3){
                                        if (err) throw err;
                                    })
                                })
                            }
                            else{
                                var sql = "UPDATE users SET status = 1 WHERE email = "+mysql.escape(result[0].email)
                                con.query(sql,function(err,result2){
                                    if (err) throw err;
                                    var sql = "INSERT INTO professionals (email,name,ph_no,userid ) VALUES ("+mysql.escape(result[0].email)+","+mysql.escape(result[0].name)+","+mysql.escape(result[0].ph_no)+","+mysql.escape(result1[0].id)+")"
                                    con.query(sql,function(err,result3){
                                        if (err) throw err;
                                    })
                                })
                            }
                        })
                        
                    }
                    var sql = "DELETE FROM prof_requests WHERE id = "+mysql.escape(req.body.id)
                    con.query(sql,function(err,result){
                        if (err) throw err;
                        var sql = "SELECT * FROM prof_requests"
                        con.query(sql,function(err,result){
                            if (err) throw err;
                            res.json({"valid":true,"arr":result})
                        })
                    })
                }
                else{
                    var sql = "SELECT * FROM prof_requests"
                    con.query(sql,function(err,result){
                        if (err) throw err;
                        res.json({"valid":true,"arr":result})
                    })
                }
            })

        }
        else{
            res.json({"valid":false,"arr":[]})
        }
    }
})

module.exports  = router;