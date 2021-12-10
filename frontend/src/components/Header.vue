<template>
  <header>
    <div v-show="mobileNav" id="screen"></div>
    <nav>
      <router-link to="/">
        <img alt="padao" src="@/assets/logo.jpeg"/>
      </router-link>
      <transition name="pc-nav">
        <ul v-show="!mobile" class="navigation">
          <li id="start_option"><router-link class="link" to="/">About</router-link></li>
          <li v-show="userid != null"><router-link class="link" to="/account">My Account</router-link></li>
          <li class="endnav_"><router-link class="link endnav" to="/register">Register as a Professional</router-link></li>
          <li v-show="userid == null"><a class="link" id="btn_signin" @click="login">Login / Sign Up</a></li>
          <li v-show="userid != null"><router-link class="link" style="border-bottom:0px" to="/" @click="logout">Log Out<i class="fas fa-sign-out-alt"></i></router-link></li>
        </ul>
      </transition>

      <div class="icon">
        <i
          @click="toggleMobileNav"
          v-show="mobile"
          :class="[
            { 'icon-active': mobileNav },
            mobileNav ? 'fas fa-times' : 'far fa-bars',
          ]"
        ></i>
      </div>
      <transition name="mobile-nav">
        <ul v-show="mobileNav" class="dropdown-nav">
          <li><router-link class="link" to="/" @click="closemenu">About</router-link></li>
          <li v-show="userid != null"><router-link class="link" to="/account" @click="closemenu">My Account</router-link></li>          
          <li ><router-link class="link" to="/register" @click="closemenu" style="font-size:15.5px">Register as a Professional</router-link></li>
          <li v-show="userid != null"><router-link class="link logout" to="/" @click="logout">Log Out <i class="fas fa-sign-out-alt"></i></router-link></li>
          <li v-show="userid == null"><a class="link" @click="login" style="cursor:pointer">Login / Sign Up</a></li>
        </ul>
      </transition>
    </nav>
    <div id="id01" v-show="LoginForm" class="modal">
      <form class="modal-content" @submit.prevent="login_form" v-show="!receive_otp_input" >
        <div class="container">
          <span @click="this.LoginForm = !this.LoginForm" class="close" title="Close Modal">&times;</span>
          <p>Please Login to Continue</p>
          <hr>
          <label for="email"><b style="font-size:18px">Email-ID</b></label>
          <input autocomplete="off" type="email" id="email_input" placeholder="Enter your Email-ID" v-model="email" required> 
          <label>
            <input type="checkbox" checked="checked" style="margin-bottom:30px" v-model="haveSession"> Remember me
          </label>
          <div class="clearfix">
            <button type="submit" class="signupbtn">Continue</button>
          </div>
        </div>
      </form>
      <form class="modal-content" @submit.prevent="verifyOTP" v-show="receive_otp_input" autocomplete="off">
        <div class="container">
          <span @click="clearLogin" class="close" title="Close Modal">&times;</span>
          <p>Please Login to Continue</p>
          <hr>
          <center><label for="email"><b style="font-size:19px;">Enter verification code</b><br/><span style="font-size:13px;color:grey;margin-left:5px">We have sent you an OTP on {{email}}</span><br/><p v-if="err_msg" style="color:red">{{err_display}}</p></label></center>
          <div class="otp_field">
            <input class="otp_box" min="0" max="9" maxlength="1" type="text" id="1" :keyup="changefocus(0,'2')" v-model="OTP[0]" required>
            <input class="otp_box" maxlength="1" type="text" id="2" :keyup="changefocus(1,'3')" v-model="OTP[1]" required>
            <input class="otp_box" maxlength="1" type="text" id="3" :keyup="changefocus(2,'4')" v-model="OTP[2]" required>
            <input class="otp_box" maxlength="1" type="text" id="4" :keyup="changefocus(3,'5')" v-model="OTP[3]" required>
            <input class="otp_box" maxlength="1" type="text" id="5" :keyup="changefocus(4,'6')" v-model="OTP[4]" required>
            <input class="otp_box" maxlength="1" type="text" id="6"  v-model="OTP[5]" required> 
          </div>           
          <div class="clearfix">
            <button type="submit" class="signupbtn">Login</button>
          </div>
        </div>
      </form>
    </div>
  </header>
</template>
<script>
import axios from 'axios';

export default {
  name: "Header",
  created() {
    this.checkSession()
    window.addEventListener("resize", this.checkScreen);
    this.checkScreen();
    window.addEventListener("click", (evt) => {
      const e = document.getElementById("screen");
      const e2 = document.getElementById("id01");
      let target = evt.target;
      if (target == e) {
        this.mobileNav = false;
      }
      if (target == e2){
        this.clearLogin();
      }
    });
  },
  data() {
    return {
      err_display:"Invalid OTP",
      err_msg:false,
      OTP:[],
      otp_value:null,
      OTP_input:'',
      email:'',
      haveSession:false,
      mobile: false,
      mobileNav: false,
      LoginForm:false,
      receive_otp_input:false,
      userid:this.getCookie("userid"),
      sessionid:localStorage.getItem("sessionid"),
    };
  },
  methods: {
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
    async verifyOTP(){
      this.$emit('loading')
      var str = ""
      for (var i=0;i<6;i++){
        str+=this.OTP[i]
      }
      this.otp_value = parseInt(str)
      axios.post("http://localhost:3000/login/checkOTP",{otp:this.otp_value,session_required:this.haveSession,vemail:this.email})
      .then((responce)=>{
        if (responce.status == 200){
          if (responce.data.otp_verified){
            this.userid = responce.data.userid;
            document.cookie = "userid="+this.userid;
            if (this.haveSession){
              this.sessionid = responce.data.session_id
              localStorage.setItem("sessionid",responce.data.session_id)
            }
            this.clearLogin()
          }
          else{
            this.err_msg = true;
          }
        }
      })
      .finally(() => {
        this.$emit('loading')
      });
    },
    changefocus(to,from){
      if (this.OTP[to] != null){
        document.getElementById(from).focus();
      }
    },
    clearLogin(){
      this.LoginForm = false;
      this.haveSession = false;
      this.email = '';
      this.OTP_input='';
      this.receive_otp_input=false;
      this.OTP=[]
    },
    async login_form(){
      this.$emit('loading')
      axios.post('http://localhost:3000/login',{email:this.email})
      .then((responce)=>{
        if (responce.status == 200){
          this.receive_otp_input = responce.data.OTP_sent;
        }
      })
      .finally(() => {
        this.$emit('loading')
      });
    },
    async checkSession(){
      axios.post('http://localhost:3000/auth', {session_id: this.sessionid})
      .then((response) =>{
        if(response.status == 200){
          this.userid = response.data.SessionPresent;
          document.cookie="userid="+response.data.SessionPresent;
          if (this.userid == null){
            this.sessionid = null
            localStorage.removeItem("sessionid")
          }
        }
      })
      .finally(() => {
      });
    },
    toggleMobileNav() {
      this.mobileNav = !this.mobileNav;
    },
    checkScreen() {
      if (window.innerWidth <= 880) {
        this.mobile = true;
        return;
      }
      this.mobile = false;
      this.mobileNav = false;
      return;
    },
    closemenu() {
      this.mobileNav = false;
    },
    login(){
      if (this.mobile){
        this.closemenu()
      }
      this.LoginForm = true
    },
    logout(){
      if (this.mobile){
        this.closemenu()
        setTimeout(()=>{
          this.logout_core()
        }, 301)
      }
      else{
        this.logout_core()
      }
    },
    async logout_core(){
      this.$emit('loading')
      this.clearLogin()
      axios.post('http://localhost:3000/auth/logout', {remove_id:this.sessionid})
      .then((response) =>{
        if(response.status == 200 && response.data.removeStatus == true){
          document.cookie="userid=0; expires=Sun, 20 Aug 2000 12:00:00 UTC";
          localStorage.removeItem("sessionid")
          this.sessionid = null
          this.userid = null
        }
      })
      .finally(() => {
        this.$emit('loading')
      });
    },

  },
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Roboto&display=swap');
* :not(i){
  font-family: 'Roboto', sans-serif;
  font-weight: bold;
}


.fa-sign-out-alt{
  font-size: 18px;
}

header {
  width: 100%;
  position: relative;
  transition: 0.5s ease all;
  color: black;
  box-shadow: 0px 2px 5px lightgrey;
}

nav {
  display: flex;
  flex-direction: row;
  transition: 0.5s ease all;
  width: 95%;
  margin: 0 auto;
  height: 60px;
}
ul,
.link {
  color: black;
  list-style: none;
  text-decoration: none;
}
li {
  text-transform: uppercase;
  padding: 16px;
  margin-left: 16px;
}

.link {
  font-size: 14.5px;
  transition: 0.3s ease all;
  padding-bottom: 18px;
  border-bottom: 3.5px solid transparent;
}
.link:hover{
  color: #008ebd;
}
.navigation .router-link-exact-active {
  border-bottom:3.5px solid #008ebd;
}

img {
  height: 35px;
  position: relative;
  top: 13px;
  transition: 0.5s ease all;
}
.navigation {
  display: flex;
  align-items: center;
  flex: 1;
  justify-content: flex-end;
  margin: 0;
}
.icon {
  display: flex;
  align-items: center;
  position: absolute;
  z-index: 98;
  top: 0px;
  right: 20px;
  height: 100%;
}
i {
  padding: 5px;
  transition: 0.5s;
  font-size: 24px;
  cursor: pointer;
}
.icon-active {
  transform: rotate(180deg);
}
.dropdown-nav {
  display: flex;
  flex-direction: column;
  position: fixed;
  width: 100%;
  z-index: 98;
  max-width: 250px;
  height: 100%;
  background-color: rgb(0, 0, 0);
  top: 60px;
  left: 0;
  margin: 0;
  padding: 0;
}
.dropdown-nav li {
  position: relative;
  margin: 0;
  padding: 0;
}
.dropdown-nav li .link {
  display: inline-block;
  padding: 0 10px;
  margin: 0;
  width: 100%;
  text-align: center;
  max-width: 230px;
  min-height: 50px;
  font-size: 16px;
  line-height: 50px;
  color: white;
}
.dropdown-nav li .link:hover {
  background-color: lightslategray;
}
#start_option {
  margin-left: 0;
}
.mobile-nav-enter-active,
.mobile-nav-leave-active {
  transition: 0.3s ease all;
}
.mobile-nav-enter-from,
.mobile-nav-leave-to {
  transform: translate(-250px);
}
.mobile-nav-enter-to {
  transform: translate(0px);
}
.pc-nav-enter-active {
  transition: 0.3s ease all;
}
.pc-nav-leave-active {
  transition: none;
}
.pc-nav-enter-from,
.pc-nav-leave-to {
  transform: translateY(-200px);
}
.pc-nav-enter-to {
  transform: translateY(0px);
}

#btn_signin {
  background-color: rgb(3, 130, 214);
  color: white;
  font-weight: bold;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
}
#btn_signin:hover {
  background-color: rgb(3, 99, 163);
}
.endnav {
  color: rgb(3, 99, 163);
  font-weight: bold;
}
.endnav:hover {
  color: rgb(3, 99, 163);
}
#screen {
  position: fixed;
  width: 100%;
  height: 100vh;
  z-index: 97;
  margin-top: 60px;
  background-color: rgba(2, 2, 2, 0.712);
}
.dropdown-nav li .router-link-exact-active {
  color:#008ebd;
}
.dropdown-nav li .logout{
  background-color: rgb(50, 190, 125);
  color:white;
  position: absolute;
  margin-top: 20%;
  left: 50%;
  transform: translateX(-50%);
  width: 100px;
  text-align: center;
  border-radius: 15px;
}

label{
  margin-left: 5px;
}
#email_input {
  width: 94%;
  padding:3%;
  min-height: 20px;
  margin: 22px 0;
  display: inline-block;
  border: none;
  font-size: 18px;
  background: #d3d3d3;
  border-radius: 10px;
  text-align: center;
}

#email_input:focus{
  background-color: #ddd;
  outline: none;
}

button {
  background-color: #04AA6D;
  color: white;
  padding: 14px 20px;
  margin: 8px 0;
  border: none;
  cursor: pointer;
  width: 100%;
  opacity: 0.9;
}

button:hover {
  opacity:1;
}

.signupbtn {
  float: left;
  width: 50%;
  margin-left:50%;
  transform:translateX(-50%);
  border-radius:10px;
  transition:0.5s;
  max-width:300px;
  min-width:100px;
  font-size: 18px;
  font-family: Arial, Helvetica, sans-serif;
  transition: 0.3s;
}

.container {
  padding: 16px;
  padding-top:25px;
}

.modal {
  position: fixed;
  z-index: 99;
  left: 0;
  top: 0;
  width: 100%; 
  height: 100%;
  overflow: auto;
  background-color: rgba(2, 2, 2, 0.712);
  padding-top: 50px;
}

.modal-content {
  position: fixed;
  background-color: #fefefe;
  margin: 5% 0 15% 0; 
  border: 1px solid #888;
  width: 85%;
  max-width: 600px;
  border-radius: 20px;
  margin-left: 50%;
  transform: translateX(-50%);
  transition: 0.3s;
}
.modal-content p{
  font-size: 18px;
  margin-left: 5px;
  transition: 0.3s;
}
 
.close {
  position: absolute;
  float: right;
  right: 15px;
  top: 10px;
  font-size: 40px;
  font-weight: bold;
  color: black;
}

.close:hover,
.close:focus {
  color: #f44336;
  cursor: pointer;
}

.clearfix::after {
  content: "";
  clear: both;
  display: table;
}
.otp_box{
  margin: 10px;
  height: 35px;
  width: 8%;
  border:0;
  border-bottom: 2px solid black;
  text-align: center;
  font-size: 20px;
}
.otp_field{
  display: flex;
  justify-content: center;
  margin: 25px 0;
}
.otp_box:focus{
  outline: none;
  background-color: white;
}
hr {
  background-color: black;
  margin-top:25px;
  margin-bottom: 25px;
  width: 100%;
  text-align: center;
}
@media screen and (max-width: 880px) {
  .signupbtn {
    font-size: 16px;
  }

}
@media screen and (max-width:470px){
  .modal-content{
    width: 90%;
  }
}
@media screen and (max-width:319px){
  img{
    top:15px;
    height: 30px;
  }
  .modal-content{
    width: 97%;
  }
}
</style>