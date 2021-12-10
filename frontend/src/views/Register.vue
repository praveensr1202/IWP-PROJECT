<template>
    <div style="background-image: url('https://s3-ap-southeast-1.amazonaws.com/urbanclap-prod/categories/category_v2/category_3cb50750.jpeg')">
    <div id="main">
        <h1>Earn More . <div style="display:inline-block">Earn Respect .</div> <div style="display:inline-block">Safety Ensured</div></h1>
        <div id="txt1">
            <div style="display:inline-block">Start earning straight away.</div>
            <div style="display:inline-block"> Share your details and we'll reach out with next steps</div>
        </div>
        <form @submit.prevent="SendDetails" autocomplete="off" v-show="!message_sent">
            <input class="form_input" type="text" placeholder="Name" v-model="name" required>
            <input class="form_input" type="tel" placeholder="Phone Number" pattern="[0-9]{10}" v-model="ph_no" required>
            <input class="form_input" type="email" placeholder="Email" v-model="email" required>
            <input class="form_input" type="text" placeholder="What do you do ?" v-model="work" required>
            <input class="form_input" type="submit" id="submit_btn" value="Get in touch" style="cursor:pointer">        
        </form>
        <form autocomplete="off" @submit.prevent="verifyOTP" v-show="message_sent">
            <center><label><b style="font-size:19px;color:white;font-family:'Comfortaa', cursive;">Enter verification code</b><br/><span style="font-size:15px;color:white;margin-left:5px;display:inline-block;margin-top:20px">We have sent you an OTP on {{email}}</span><br/><p v-if="err_display != null" style="margin-top:15px;font-size:16px;font-family:'Comfortaa', cursive;color:red">{{err_display}}</p></label></center>
            <div v-show="message_sent" class="otp_field">
                <input class="otp_box" min="0" max="9" maxlength="1" type="text" id="11" :keyup="changefocus(10,'12')" v-model="OTP[0]" required>
                <input class="otp_box" maxlength="1" type="text" id="12" :keyup="changefocus(11,'13')" v-model="OTP[1]" required>
                <input class="otp_box" maxlength="1" type="text" id="13" :keyup="changefocus(12,'14')" v-model="OTP[2]" required>
                <input class="otp_box" maxlength="1" type="text" id="14" :keyup="changefocus(13,'15')" v-model="OTP[3]" required>
                <input class="otp_box" maxlength="1" type="text" id="15" :keyup="changefocus(14,'16')" v-model="OTP[4]" required>
                <input class="otp_box" maxlength="1" type="text" id="16"  v-model="OTP[5]" required> 
            </div>
            <div>
                <button style="width:30%;background-color:white;border:0;color:#1761ff;font-size:20px;margin-left:50%;transform:translateX(-50%);border-radius:10px;padding:10px;cursor:pointer" >Verify</button>
            </div>
        </form>
    </div>
    </div>
</template>
<script>
import axios from 'axios';

export default{
    name:"Register",
    data(){
        return{
            userid:this.getCookie("userid"),
            name:null,
            ph_no:null,
            email:null,
            work:null,
            message_sent:false,
            OTP:[],
            err_display:null,
        };
    },
    methods:{
        async verifyOTP(){
            this.$emit('loading')
            var str = ""
            for (var i=0;i<6;i++){
                str+=this.OTP[i]
            }
            this.otp_value = parseInt(str)
            axios.post("http://localhost:3000/register/checkOTP",{otp:this.otp_value,email:this.email,name:this.name,work:this.work,ph_no:this.ph_no})
            .then((responce)=>{
                if (responce.status == 200){
                    if (responce.data.otp_verified){
                        swal({
                            title: "Thank You",
                            text: "Please Check Your Email for Further Updates",
                            icon: "success",
                        })
                        this.clearLogin()
                    }
                    else{
                        this.err_display = "Invalid OTP";
                    }
                }
            })
            .finally(() => {
                this.$emit('loading')
            }); 

        },
        clearLogin(){
            this.name = null
            this.email = null
            this.ph_no = null
            this.OTP = []
            this.message_sent = false
        },
        changefocus(to,from){
            if (this.OTP[to-10] != null){
                document.getElementById(from).focus();
            }
        },
        getCookie(cname) {
            let name = cname + "=";
            let decodedCookie = decodeURIComponent(document.cookie);
            let ca = decodedCookie.split(';');
            for(let i = 0; i <ca.length; i++) {
                let c = ca[i];
                while (c.charAt(0) == ' ') {
                    c = c.substring(1);
                }
                if (c.indexOf(name) == 0) {
                    return c.substring(name.length, c.length);
                }
            }
            return null;
        },
        async SendDetails(){
            this.$emit('loading')
            axios.post("http://localhost:3000/register",{name:this.name,email:this.email,ph_no:this.ph_no,work:this.work})
            .then((responce)=>{
                console.log("ok googled")
                if (responce.status == 200){
                    if (responce.data.EmailValid == true){
                        this.message_sent = true
                    }
                    else{
                        swal({
                            title:"Email Already Exists",
                            icon:"warning",
                            dangerMode:true
                        })
                    }
                }
                else{
                    swal({
                        title: "Network Error",
                        text: "Please check your Internet Connection",
                        icon: "warning",
                        dangerMode: true,
                    })
                }
            })
            .finally(() => {
                this.$emit('loading')
            });  
        }
    }
}
</script>
<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Comfortaa:wght@700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Spartan:wght@600&display=swap');
.otp_box{
    margin:10px 7px;
    height: 35px;
    width: 8%;
    border: 0;
    border-bottom: 2px solid white;
    text-align: center;
    background-color: transparent;
    font-size: 20px;
    color: white;
}
.otp_field{
    display: flex;
    justify-content: center;
    margin: 25px 0;
}
.otp_box:focus{
  outline: none;
}
#main{
    min-height: 100vh;
    max-width: 800px;
    width: 95%;
    margin: 0 auto;
}
#submit_btn{
    margin-top: 15px;
    width: 40%;
    background-color: white;
    color: #1761ff;
    font-size: 20px;
    min-width: 170px;
}
.form_input{
    display: block;
    padding: 15px;
    font-size: 18px;
    width: 80%;
    max-width: 450px;
    margin: 5px auto;
    font-family: 'Comfortaa', cursive;
    border-radius: 10px;
    border: 1px solid white;
    background-color: rgba(255, 255, 255, 0.493);
    color: white;
    outline: none;
}
::placeholder {
  color: white;
  opacity: 1; /* Firefox */
}
form{
    background-color:#1761ff;
    max-width:500px;
    width: 96%;
    padding: 25px 0 20px;
    margin: 20px auto;
    border-radius: 10px;
}
h1{
    padding-top: 120px;
    text-align: center;
    font-size: 35px;
    font-family: 'Spartan', sans-serif;
    transition: 0.3s;
}
#txt1{
    font-family: 'Comfortaa', cursive;
    padding-top: 35px;
    line-height: 35px;
    font-size: 20px;
    text-align: center;
}
@media screen and (max-width:400px){
    h1{
        font-size: 30px;
    }
}
</style>