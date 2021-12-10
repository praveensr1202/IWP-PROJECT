<template>
    <div id="main">
        <div style="text-align:center">
        <div :class="{'options':true,'active':(user_option == 'MyBookings')}" @click="bookings_func">My Bookings</div>
        <div :class="{'options':true,'active':(user_option == 'Professional')}" v-show="status != 0" @click="prof_func">Professional</div>
        </div>
        <div v-show="user_option == 'MyBookings'">
            <div class="booking-main">
                <div v-for="booking in bookings" :key="booking.id" class="booking-box" style="width:94%;max-width:1270px">
                    <div class="booking-top-div">
                        <div style="float:right;padding:10px;margin-top:10px;border-radius:10px" :class="{'green-color':(booking.status == 'BOOKED'),'red-color':(booking.status == 'CANCELLED'),'gray-color':(booking.status == 'COMPLETED')}">{{booking.status}}</div>
                        <h2>{{booking.service_name}}</h2>
                        <p style="margin-top:15px">{{booking.date}}</p>
                    </div>
                    <div class="booking-mid-div">
                        <p class="desc_line">Location : {{booking.address}}</p>
                        <p class="desc_line">Name of the Professional : {{booking.prof_name}}</p>
                        <p class="desc_line">Professional Mobile Number : {{booking.prof_ph_no}}</p>
                        <p class="desc_line" v-show="booking.price != null">Price : {{booking.price}}</p>
                        <p class="desc_line" v-show="booking.price == null">Price : Service Not Completed</p>
                    </div>
                </div>
            </div>
        </div>
        <div v-show="user_option == 'MyBookings' && bookings.length == 0" class="empty-box">
            You don't have any bookings right now
            <router-link class="link" to="/">Book A Service</router-link>
        </div>
        <div v-show="user_option != 'MyBookings' ">
            <div style="margin:10px auto;text-align:center">
                <div :class="{'sub':true,'active_sub':(prof_option == 'MyProfile')}" @click="profile_func" >Profile</div>
                <div :class="{'sub':true,'active_sub':(prof_option != 'MyProfile')}" @click="orders_func" >Orders</div>
            </div>
            <div v-show="prof_option == 'MyProfile'" style="width:90%;max-width:1270px;margin:30px auto 0">
                <h3 id="services_tag">My Services</h3>
                <div id="add_btn" @click="add_service">+ Add a Service</div>
            </div>
            <div id="id02" v-show="LoginForm" class="modal">
                <form class="modal-content" @submit.prevent="Addservice_form">
                    <div class="container">
                        <span @click="this.LoginForm = !this.LoginForm" class="close" title="Close Modal">&times;</span>
                        <p>Enter Details about Service</p>
                        <hr>
                        <label><b style="font-size:18px">Service Name</b></label>
                        <input autocomplete="off" type="text" id="email_input" placeholder="Enter your Service Name" length v-model="service_name" required>
                        <label style="line-height:40px"><b>Choose Your Pricing Type</b></label> 
                        <select style="float:right;font-size:15px;padding:10px" v-model="pricing_type">
                            <option value="constant">Constant Pricing</option>
                            <option value="duration">Duration Pricing</option>
                        </select>
                        <br><br>
                        <div v-show="pricing_type != null">
                            <div v-show="pricing_type == 'constant' ">
                                <label style="line-height:40px">Enter Your Price</label>
                                <input type="number" min="1" placeholder="Price" v-model="price">
                            </div>
                            <div v-show="pricing_type == 'duration' ">
                                <label style="line-height:40px">Enter Your Price Per Hour</label>
                                <input type="number" min="1" v-model="price">
                                <br>
                                <label style="line-height:40px">Approx Time</label>
                                <input type="number" min="1" v-model="time">
                            </div>
                        </div>
                        <br>
                        <label>
                        <input type="checkbox" style="margin-bottom:30px;" v-model="AddCharges"> Additional Charges (Optional)
                        </label>
                        <div class="clearfix">
                            <button type="submit" class="signupbtn">Add Service</button>
                        </div>
                    </div>
                </form>
            </div>
            <div v-show="user_option == 'Professional'">
                <div v-show="prof_option == 'MyProfile' ">
                    <div class="booking-main">
                        <div class="booking-box" v-show="services.length > 0" v-for="service in services" :key="service.id">
                            <div class="booking-top-div">
                                <div style="float:right;padding:10px;margin:0 0 10px;border-radius:10px;cursor:pointer" class='red-color' @click="remove_service(service.id)">REMOVE</div>
                                <h2 style="margin:5px 0 10px;">{{service.service_name}}</h2>
                            </div>
                            <div class="booking-mid-div">
                                <div>
                                    <p class="desc_line">Pricing Model : {{service.price_type}}</p>
                                    <p class="desc_line" v-show="service.price_type == 'constant'">Price : {{service.price}}</p>
                                    <p class="desc_line" v-show="service.price_type == 'duration'">Price Per Hour : {{service.price}}</p>
                                    <p class="desc_line" v-show="service.price_type == 'duration' ">Approximate Time Taken : {{service.time}}</p>
                                    <p class="desc_line" v-show="service.price_type == 'constant' ">Approximate Time Taken : Not Applicable </p>
                                    <p class="desc_line" v-show="service.additional_charges == 0 " style="color:green">Additional Charges can't be Applied</p>
                                    <p class="desc_line" v-show="service.additional_charges == 1" style="color:red">Additonal Charges can be Applied</p>
                                </div>
                            </div>
                        </div>
                    </div>
                   <div v-show="services.length == 0" class="empty-box">
                        You didn't add any Services till now
                    </div>
                </div>
                <div v-show="prof_option == 'MyOrders'" style="text-align:center">
                    <div>
                        <div :class="{'green-color':(OnlineMsg == 'Receive Orders'),'red-color':(OnlineMsg == 'Stop Orders'),'active_btn':true}">
                            <p v-show="OnlineMsg == 'Receive Orders' " @click="user_online" >Receive Orders</p>
                            <p v-show="OnlineMsg == 'Stop Orders' " @click="user_offline">Stop Orders</p>
                        </div>
                    </div>
                    <div v-show="orders.length > 0">
                        <div class="booking-main">
                            <div class="booking-box" v-show="orders.length > 0" v-for="order in orders" :key="order.id" style="width:94%;max-width:1270px">
                                <div class="booking-top-div">
                                    <div style="float:right;padding:10px;border-radius:10px" :class="{'green-color':(order.status == 'BOOKED'),'red-color':(order.status == 'CANCELLED'),'gray-color':(order.status == 'COMPLETED')}">{{order.status}}</div>
                                    <h2 style="margin:5px 0 10px;">{{order.service_name}}</h2>
                                </div>
                                <div class="booking-mid-div">
                                    <div>
                                        <p class="desc_line" >Phone Number : {{order.customer_ph_no}}</p>
                                        <p class="desc_line" >Address : <span>{{order.address}}</span> </p>
                                        <div v-show="order.status == 'BOOKED' " style="max-width:600px;margin:40px auto;padding:0 15px">
                                            <div style="text-align:center;width:100px;float:right;padding:10px;margin:0 0 10px;border-radius:10px;cursor:pointer" class='red-color' @click="cancel_func(order.id,order.service_id)">Cancel</div>
                                            <div style="text-align:center;width:100px;padding:10px;margin:0 0 10px;border-radius:10px;cursor:pointer" class='green-color' @click="completed_func(order.id,order.service_id)">Completed</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div v-show="orders.length == 0" class="empty-box">
                        You didn't have any Orders right now
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import axios from 'axios';

export default{
    name:"Account",
    data(){
        return{
            OnlineMsg:'Receive Orders',
            AddCharges:false,
            userid:this.getCookie("userid"),
            status:null,
            pricing_type:null,
            prof_option:"MyProfile",
            user_option:"MyBookings",
            services:[],
            price:1,
            time:null,
            service_name:null,
            LoginForm:false,
            bookings: [],
            orders:[],
            dum1:null,
            pincode:null
        }
    },
    created(){
        this.GetUserStatus();
        this.getServices();
        this.getBookings();
        this.getOrders();
        window.addEventListener("click", (evt) => {
            const e = document.getElementById("id02");
            let target = evt.target;
            if (target == e){
                this.clearLogin();
            }
        });
    },
    methods:{
        async completed_func(booking_id,service_id){
            this.$emit('loading')
            axios.post("http://localhost:3000/account/complete",{id:booking_id,sid:service_id})
            .then((responce)=>{
                if (responce.status == 200){
                    this.getOrders();
                    this.getServices();
                }
            })
            .finally(() => {
                this.$emit('loading')
                swal({
                    title: "Service Completed",
                    icon: "success",
                })
            });
        },
        async cancel_func(booking_id,service_id){
            this.$emit('loading')
            axios.post("http://localhost:3000/account/cancel",{id:booking_id,sid:service_id})
            .then((responce)=>{
                if (responce.status == 200){
                    this.getOrders();
                    this.getServices();
                }
            })
            .finally(() => {
                this.$emit('loading')
                swal({
                    title: "Service Cancelled",
                    icon: "success",
                })
            });
        },
        async getOrders(){
            axios.post("http://localhost:3000/account/get_orders",{id:this.userid})
            .then((responce)=>{
                if (responce.status == 200 ){
                    this.orders = responce.data.arr;
                }
            })
        },
        async getBookings(){
            axios.post("http://localhost:3000/account/get_bookings",{id:this.userid})
            .then((responce)=>{
                if (responce.status == 200){
                    this.bookings = responce.data.arr;
                }
            })
        },
        async user_online_core(){
            this.dum1 = setInterval(()=>{
                axios.post("http://localhost:3000/prof/online",{userid:this.userid,pincode:this.pincode})
                .then((responce)=>{
                    if (responce.status == 200){
                        this.OnlineMsg = "Stop Orders"
                    }
                    else{
                        this.OnlineMsg = "Receive Orders"
                    }
                })
            },2000)
        },
        async user_online(){
            swal("Enter Your Pincode:", {
                content: "input",
            })
            .then((value) => {
                this.pincode = value
                this.user_online_core();
                this.OnlineMsg = 'Stop Orders'
            });
            
        },
        async user_offline(){
            this.$emit('loading')
            this.OnlineMsg = 'Receive Orders'
            clearInterval(this.dum1)
            this.$emit('loading')
        },
        async remove_service(service_id){
            this.$emit('loading')
            axios.post("http://localhost:3000/prof/remove_service",{id:service_id,userid:this.userid})
            .then((responce)=>{
                if (responce.status == 200 ){
                    this.services = responce.data.arr;
                }
            })
            .finally(() => {
                this.$emit('loading')
                this.clearLogin()
                swal({
                    title: "Service Removed",
                    icon: "success",
                })
            });
        },
        clearLogin(){
            this.LoginForm = false
            this.price = 1;
            this.pricing_type = null,
            this.AddCharges = false,
            this.service_name = null,
            this.time = null
        },
        async Addservice_form(){
            this.$emit('loading')
            axios.post("http://localhost:3000/prof/add_service",{name:this.service_name,price_type:this.pricing_type,price:this.price,time:this.time,additional_charges:this.AddCharges,userid:this.userid})
            .then((responce)=>{
                if (responce.status == 200){
                    this.services = responce.data.arr;
                }
            })
            .finally(() => {
                this.$emit('loading')
                this.clearLogin()
                swal({
                    title: "Service Added",
                    icon: "success",
                })
            });
        },
        async getServices(){
            this.$emit('loading')
            axios.post("http://localhost:3000/prof/get_services",{userid:this.userid})
            .then((responce)=>{
                if (responce.status == 200){
                    this.services = responce.data.arr;
                }
            })
            .finally(() => {
                this.$emit('loading')
                this.LoginForm = false
            });
        },
        add_service(){
            this.LoginForm = true
        },
        profile_func(){
            this.prof_option = "MyProfile"
        },
        orders_func(){
            this.prof_option = "MyOrders"
        },
        bookings_func(){
            this.user_option = "MyBookings"
        },
        prof_func(){
            this.user_option = "Professional"
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
        async GetUserStatus(){
            this.$emit('loading')
            axios.post("http://localhost:3000/account",{userid:this.userid})
            .then((responce)=>{
                if (responce.status == 200){
                    this.status = responce.data.status;
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
*{
    font-family: 'Comfortaa', cursive;
}
.active_btn{
    width: 90%;
    min-width: 130px;
    max-width: 230px;
    margin: 30px auto 15px;
    padding: 10px 0;
    border-radius: 10px;
    font-size: 18px;
    cursor:pointer
}
.desc_line{
    margin:20px ;
}
#services_tag{
    display:inline-block;
    padding-bottom:10px;
    border-bottom:1px solid black;
    transition:0.3s;
}
#add_btn{
    float:right;
    padding:10px 15px;
    background-color:black;
    color:white;
    border-radius:10px;
    cursor:pointer;
    transition: 0.3s;
}

.sub{
    font-size: 20px;
    padding: 10px 0px;
    margin: 0 8px 0 16px;
    display: inline-block;
    transition: 0.3s;
    cursor: pointer;
    margin-bottom: 10px;
    border: 2px solid white;
}
.active_sub{
    border-bottom: 2px solid black;
}
.booking-main{
    max-width: 1270px;
    width: 98%;
    margin: 30px auto 0;
    text-align: center;
}
.booking-box{
    margin:10px;
    text-align: left;
    border: 2px solid rgb(129, 129, 129);
    width: 390px;
    display: inline-block;
    border-radius: 10px;
}
.booking-top-div{
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    padding:10px;
    font-size: 12px;
    background-color: rgb(239, 248, 255);
}
.booking-mid-div{
    min-height: 230px;
    border-top:1px solid rgb(129, 129, 129);
}
.red-color{
    background-color: red;
    color: white;
}
.green-color{
    background-color: green;
    color: white;
}
.gray-color{
    background-color:gainsboro;
    color: black;
}

.link{
    display: block;
    text-decoration: none;
    color: white;
    width: 170px;
    padding:12px 8px;
    margin:40px auto 0;
    background-color: black;
    border-radius: 5px;
}
.empty-box{
    font-size: 18px;
    padding-top: 60px;
    text-align: center;
}
.active{
    background-color: black;
    color: white;
}
#main{
    width: 100%;
    max-width: 1270px;
    margin: 0 auto;
    min-height: 100vh;
    margin-top: 25px;
}
.options{
    font-size: 20px;
    padding: 10px;
    display: inline-block;
    transition: 0.3s;
    cursor: pointer;
    margin-bottom: 10px;
    border: 1px solid black;
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
  padding-top: 0px;
}

.modal-content {
  position: fixed;
  background-color: #fefefe;
  margin: 2.5% 0 15% 0; 
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
hr {
  background-color: black;
  margin-top:25px;
  margin-bottom: 25px;
  width: 100%;
  text-align: center;
}
input[type=number]{
    float: right;
    width: 80px;
    padding: 7px 0;
}
@media screen and (max-width:880px){
    .booking-box{
        padding: 0;
        margin: 15px 2%;
        width: 96%;
    }
    #add_btn{
        padding: 8px;
        font-size: 15px;
    }
    #services_tag{
        font-size: 18px;
    }
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
  .modal-content{
    width: 97%;
  }
}
</style>
