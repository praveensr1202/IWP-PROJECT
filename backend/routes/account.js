const express = require('express')
const router = express.Router()
const mysql = require('mysql')
const Fuse = require('fuse.js')

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database:"workforce"
});
con.connect(function (err) {
    if (err) throw err;
    console.log("Database Connected -account")
});

router.post('/',async (req,res) => {
    if (req.body.userid != null){
        var sql = "SELECT status FROM users WHERE id = "+mysql.escape(req.body.userid);
        con.query(sql, function (err, result) {
            if (err) throw err;
            if (result.length == 1){
                res.json({"status":result[0].status})
            }
        });
    }
})

router.post('/query',async(req,res)=>{
    if (req.body.query != null && req.body.pincode != null){
        var sql = "SELECT id FROM professionals WHERE status = 1 AND pincode = "+mysql.escape(req.body.pincode);
        var services = [];
        con.query(sql,function(err,result1){
            if (err) throw err;
            if (result1.length > 0){
                var txt = ""
                for(let x of result1){
                    txt += x.id+","
                }
                txt = txt.slice(0,-1)
                var sql = "SELECT * FROM services WHERE status = 'ADDED' AND prof_id IN ("+txt+")"
                con.query(sql,function(err,result2){
                    if (err) throw err;
                    const options = {
                        includeScore: true,
                        keys: ['service_name']
                    }
                    const fuse = new Fuse(result2, options)
                    const result3 = fuse.search(req.body.query)
                    for (var i=0; i<result3.length;i++){
                        services.push(result3[i].item)
                    }
                    res.json({"arr":services})
                })
            }
            else{
                res.json({"arr":[]})
            }
        })
    }
})

router.post('/book',async(req,res)=>{
    if (req.body.id != null && req.body.userid != null && req.body.address != null && req.body.customer_ph_no != null && req.body.service_name!= null && req.body.prof_id != null ){
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1;
  
        var yyyy = today.getFullYear();
        if (dd < 10) {
            dd = '0' + dd;
        }
        if (mm < 10) {
            mm = '0' + mm;
        }
        var today = dd + '-' + mm + '-' + yyyy;
        var sql = "SELECT name,ph_no from professionals WHERE id = "+mysql.escape(req.body.prof_id);
         con.query(sql,function(err,result0){
            if (err) throw err;
            var sql = "INSERT INTO bookings (service_id,user_id,date,customer_ph_no,prof_name,service_name,prof_ph_no,prof_id,address,status) VALUES ("+mysql.escape(req.body.id)+","+mysql.escape(req.body.userid)+","+mysql.escape(today)+","+mysql.escape(req.body.customer_ph_no)+","+mysql.escape(result0[0].name)+","+mysql.escape(req.body.service_name)+","+mysql.escape(result0[0].ph_no)+","+mysql.escape(req.body.prof_id)+","+mysql.escape(req.body.address)+",'BOOKED' )"
            con.query(sql,function(err,result){
                if (err) throw err;
                var sql = "UPDATE services SET status = 'BOOKED' WHERE id = "+mysql.escape(req.body.id);
                con.query(sql,function(err,result){
                    if (err) throw err;
                    res.json({})
                })
            })
        })
    }
})

router.post('/get_bookings',async(req,res)=>{
    if (req.body.id != null){
        var sql = "SELECT * FROM bookings WHERE user_id = "+mysql.escape(req.body.id);
        con.query(sql,function(err,result){
            if (err) throw err;
            res.json({"arr":result})
        })
    }
})

router.post('/get_orders',async(req,res)=>{
    if (req.body.id != null){
        var sql = "SELECT id FROM professionals WHERE userid = "+mysql.escape(req.body.id);
        con.query(sql,function(err,result){
            if (result.length > 0){ 
                var sql = "SELECT * FROM bookings WHERE prof_id = "+mysql.escape(result[0].id);
                con.query(sql,function(err, result1){
                    if (err) throw  err;
                    res.json({"arr":result1})
                })
            }
            else{
                res.json({"arr":[]})
            }
        })
    }

})

router.post('/cancel',async(req,res)=>{
    if (req.body.id != null && req.body.sid != null){
        var sql = "UPDATE bookings SET status = 'CANCELLED' WHERE id = "+mysql.escape(req.body.id);
        con.query(sql,function(err,result){
            if (err) throw err;
        })
        var sql = "UPDATE services SET status = 'ADDED' WHERE id = "+mysql.escape(req.body.sid);
        con.query(sql,function(err,result){
            if (err) throw err;
            res.json({})
        })
    }
})

router.post('/complete',async(req,res)=>{
    if (req.body.id != null && req.body.sid != null){
        var sql = "UPDATE bookings SET status = 'COMPLETED' WHERE id = "+mysql.escape(req.body.id);
        con.query(sql,function(err,result){
            if (err) throw err;
        })
        var sql = "UPDATE services SET status = 'ADDED' WHERE id = "+mysql.escape(req.body.sid);
        con.query(sql,function(err,result){
            if (err) throw err;
            res.json({})
        })
    }
})

module.exports  = router;
