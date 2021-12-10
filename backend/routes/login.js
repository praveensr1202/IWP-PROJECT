const express = require('express')
const router = express.Router()
const mysql = require('mysql');
const nodemailer = require('nodemailer')


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

async function SendEmail(rec_email,rec_otp){
    let transporter = nodemailer.createTransport({
        service:"hotmail",
        port:587,
        secure:false,
        auth:{
            user:"workforce-services@outlook.com",
            pass:"Iphone369@"
        },
    });
    let info = await transporter.sendMail({
        from:"workforce-services@outlook.com",
        to:rec_email,
        subject:"WorkForce Verification OTP",
        text:"Your OTP is : "+rec_otp 
    });

    console.log("Message sent: "+info.messageId);
}

function sessionPart(result,session_required,res){
    if (session_required == true){
        var sql = "SELECT * FROM sessions WHERE userid = "+mysql.escape(result[0].id)
        con.query(sql,function(err,result2){
            if (err) throw err;
            if (result2.length > 0){
                res.json({"otp_verified":true,"userid":result[0].id,"session_id":result2[0].id})
            }
            else {
                var sql = "INSERT INTO sessions (userid) VALUES ("+mysql.escape(result[0].id)+")"
                con.query(sql,function(err,result1){
                    if (err) throw err;
                    res.json({"otp_verified":true,"userid":result[0].id,"session_id":result1.insertId})
                })
            }
        })
    }
    else{
        res.json({"otp_verified":true,"userid":result[0].id})
    }
}

router.post('/',async (req,res) => {
    var email_present = false;
    var OTP = Math.floor(100000 + Math.random() * 900000);
    if (req.body.email != null){
        var sql = "SELECT id FROM otp_auth WHERE email = "+mysql.escape(req.body.email)
        con.query(sql,function(err,result){
            if (err) throw err;
            if (result.length > 0){
                email_present = true;
            }
            if (email_present == false){
                var sql = "INSERT INTO otp_auth (email,otp) VALUES ("+mysql.escape(req.body.email)+","+mysql.escape(OTP)+")"
                con.query(sql,function(err,result){
                    if (err) throw err;
                })
                SendEmail(req.body.email,OTP).catch(console.error);
                res.json({"OTP_sent":true})
            }
            if (email_present == true){
                var sql = "UPDATE otp_auth SET otp ="+mysql.escape(OTP)+" WHERE email = "+mysql.escape(req.body.email)
                con.query(sql,function(err,result){
                    if (err) throw err;
                })
                SendEmail(req.body.email,OTP).catch(console.error);
                res.json({"OTP_sent":true})
            }
        })
    }
    

})

router.post('/checkOTP',async (req,res) => {
    if(req.body.otp != null && req.body.vemail != null){
        var sql = "SELECT * FROM otp_auth WHERE email = "+mysql.escape(req.body.vemail)+" AND otp = "+mysql.escape(req.body.otp)
        con.query(sql,function(err,result){
            if (err) throw err;
            if (result.length == 1){
                var sql = "SELECT * FROM users WHERE email = "+mysql.escape(req.body.vemail)
                con.query(sql,function(err,result){
                    if (err) throw err;
                    if (result.length == 0){
                        var sql = "INSERT INTO users (email) VALUES ("+mysql.escape(req.body.vemail)+")"
                        con.query(sql,function(err,result){
                            if (err) throw err;
                            var sql = "SELECT id FROM users WHERE email = "+mysql.escape(req.body.vemail)
                            con.query(sql,function(err,result){
                                if (err) throw err;
                                sessionPart(result,req.body.session_required,res);
                            })
                        })
                    }
                    else{
                        sessionPart(result,req.body.session_required,res);
                    }
                })
            }
            else{
                res.json({"otp_verified":false})
            }
        })
    }
})

module.exports  = router;