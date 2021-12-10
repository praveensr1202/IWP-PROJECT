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
    console.log("Database Connected -register")
});

async function SendEmail(rec_email,rec_txt){
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
        text:"Your OTP is : "+rec_txt 
    });
    console.log("Message sent: "+info.messageId);
}

router.post('/',async (req,res) => {
    var OTP = Math.floor(100000 + Math.random() * 900000);

    if (req.body.email != null && req.body.ph_no != null && req.body.name != null && req.body.work){
        var sql = "SELECT * FROM professionals WHERE email = "+mysql.escape(req.body.email)+"OR"+mysql.escape(req.body.name)
        con.query(sql,function(err,result){
            if (err) throw err;
            if (result.length > 0){
                res.json({"EmailValid":false,"err_cause":"Email or Phone Number Already registered"})
            }
            else{
                var sql = "SELECT * FROM prof_otp_auth WHERE email = "+mysql.escape(req.body.email)
                con.query(sql,function(err,result2){
                    if (err) throw err;
                    if (result2.length > 0 ){
                        var sql = "UPDATE prof_otp_auth SET otp = "+mysql.escape(OTP)+" WHERE email = "+mysql.escape(req.body.email)
                        con.query(sql,function(err,result){
                            if (err) throw err;
                            SendEmail(req.body.email,OTP).catch(console.error);
                            res.json({"EmailValid":true})
                        })
                    }
                    else{
                        var sql = "INSERT INTO prof_otp_auth (otp,email) VALUES ("+mysql.escape(OTP)+","+mysql.escape(req.body.email)+")"
                        con.query(sql,function(err,result){
                            if (err) throw err;
                            SendEmail(req.body.email,OTP).catch(console.error);
                            res.json({"EmailValid":true})
                        })
                    }
                })
            }
        })
    }
})

router.post('/checkOTP',async (req,res) => {
    if (req.body.email != null && req.body.ph_no != null && req.body.name != null && req.body.work && req.body.otp != null){
        var sql = "SELECT * FROM prof_otp_auth WHERE email = "+mysql.escape(req.body.email)+" AND otp = "+mysql.escape(req.body.otp)
        con.query(sql,function(err,result){
            if (err) throw err;
            if (result.length == 1){
                var sql = "SELECT * FROM prof_requests WHERE email = "+mysql.escape(req.body.email)
                con.query(sql,function(err,result){
                    if (err) throw err;
                    if (result.length > 0){
                        var sql = "UPDATE prof_requests SET name = "+mysql.escape(req.body.name)+" , work_description = "+mysql.escape(req.body.work)+" , ph_no = "+mysql.escape(req.body.ph_no)+" WHERE email = "+mysql.escape(req.body.email)
                        con.query(sql,function(err,result){
                            if (err) throw err;
                            res.json({"otp_verified":true})
                        })
                    }
                    else{
                        var sql = "INSERT INTO prof_requests (name,email,ph_no,work_description) VALUES ("+mysql.escape(req.body.name)+","+mysql.escape(req.body.email)+","+mysql.escape(req.body.ph_no)+","+mysql.escape(req.body.work)+")"
                        con.query(sql,function(err,result){
                            if (err) throw err;
                            res.json({"otp_verified":true})
                        })
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