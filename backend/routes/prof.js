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
    console.log("Database Connected -login")
});

router.post('/add_service',async (req,res) => {
    if (req.body.name != null && req.body.price_type != null && req.body.price != null && req.body.additional_charges != null && req.body.userid != null){
        var sql = "SELECT * FROM professionals WHERE userid = "+mysql.escape(req.body.userid)
        con.query(sql,function(err,result){
            if (err) throw err;
            if (result.length > 0){
                var sql = "INSERT INTO services (service_name,price_type,price,time,additional_charges,prof_id) VALUES ("+mysql.escape(req.body.name)+","+mysql.escape(req.body.price_type)+","+mysql.escape(req.body.price)+","+mysql.escape(req.body.time)+","+mysql.escape(req.body.additional_charges)+","+mysql.escape(result[0].id)+")"
                con.query(sql,function(err,result1){
                    if (err) throw err;
                    var sql = "SELECT * FROM services WHERE prof_id = "+mysql.escape(result[0].id)+" AND status = 'ADDED' "
                    con.query(sql,function(err,result){
                        if (err) throw err;
                        res.json({"arr":result})
                    })
                })
            }

        })
    }
})

router.post('/get_services',async (req,res) => {
    if (req.body.userid != null){
        var sql = "SELECT * FROM professionals WHERE userid = "+mysql.escape(req.body.userid)    
        con.query(sql,function(err,result){
            if (err) throw err;
            if (result.length > 0){
                var sql = "SELECT * FROM services WHERE prof_id = "+mysql.escape(result[0].id)+" AND status != 'REMOVED' "
                con.query(sql,function(err,result){
                    if (err) throw err;
                    res.json({"arr":result})
                })
            }
            else{
                res.json({"arr":[]})
            }
        })
    }
})

router.post('/remove_service',async (req,res) => {
    if (req.body.id != null && req.body.userid != null){
        var sql = "UPDATE services SET status = 'REMOVED' WHERE id = "+mysql.escape(req.body.id)
        con.query(sql,function(err,result){
            if (err) throw err;
            var sql = "SELECT * FROM professionals WHERE userid = "+mysql.escape(req.body.userid)    
            con.query(sql,function(err,result){
                if (err) throw err;
                var sql = "SELECT * FROM services WHERE prof_id = "+mysql.escape(result[0].id)+" AND status = 'ADDED' "
                con.query(sql,function(err,result){
                    if (err) throw err;
                    res.json({"arr":result})
                })
            })
        })
    }
})

var dum1;
router.post('/online',async (req,res) =>{
    if (req.body.userid != null && req.body.pincode != null){
            var sql = "UPDATE professionals SET status = 1, pincode="+mysql.escape(req.body.pincode)+" WHERE userid = "+mysql.escape(req.body.userid)
            con.query(sql,function(err,result){
                if (err) throw err;
            })
            clearTimeout(dum1)
            dum1 = setTimeout(()=>{
                var sql = "UPDATE professionals SET status = 0, pincode = null WHERE userid = "+mysql.escape(req.body.userid)
                con.query(sql,function(err,result){
                    if (err) throw err;
                })
            },5000)
        
        res.json({})
    }
})

module.exports  = router;