<template>
  <div>
    <div style="background-color:black">
    <div id="start-box">
      <p id="txt1" style="font-family: 'Spartan', sans-serif;padding-bottom:25px">WorkForce</p>
      <p id="txt2" style="font-family: 'Comfortaa', cursive;margin-top:30px">Quality home services, on demand</p>
      <p id="txt3" style="font-family: 'Spartan', sans-serif;margin:35px 0">
        Experienced, hand-picked Professionals to serve you at your doorstep
      </p>
        <div v-show="!pincode_available" class="input-icons" >
          <p id="pincode-txt">Where do you need a service ?</p>
          <input class="input-field" maxlength="6" style="max-width:300px;text-align:left;border-top-left-radius:0;border-top-right-radius:0" type="text" placeholder="Enter Your Pincode" v-model="pincode">
          <i class="fa fa-sign-out" id="enter-icon" @click="pincode_validation"></i>    
        </div>
      <div v-show="pincode_available" class="input-icons">
        <router-link class="link" to="/query"><i class="fa fa-search icon" @click="send_query"></i></router-link>
        <input class="input-field" type="text" placeholder="Search for services" v-model="query_string">
      </div>
    </div>
    </div>
      <div id="middle-box">
        <div class="para_one" >
          <img src="https://www.appointmentreminders.com/wp-content/uploads/2017/07/Who_We_Are.png">
          <div class="text_one">
            <h2 class="para_head" style="font-family: 'Comfortaa', cursive;margin-bottom:25px">Who are we ?</h2>
            <p style="font-family: 'Spartan', sans-serif">WorkForce is an online home services platform.The platform helps customers book reliable &#38; high quality services - beauty treatments,massages,haircuts, home cleaning, handymen, appliance repair, painting, pest control and more - delivered by trained professionals conveniently at home. WorkForce's vision is to empower millions of professionals worldwide to deliver services at home like never before.</p>
          </div>
        </div>
        <div class="para_two">
          <img src="https://palmtreetechcenter.com/wp-content/uploads/2014/04/how-it-works.png">
          <div class="text_two">
            <h2 class="para_head" style="font-family: 'Comfortaa', cursive;margin-bottom:25px">How We do it</h2>
            <p style="font-family: 'Spartan', sans-serif">WorkForce provides a platform that allows skilled and experienced professionals to connect with the users looking for specific service in their locality.Every professional's background is verified,Only the ones who meet the standard are allowed to list their services on the platform. Based on the Users request our algorithms identifies the professional's near to user, who have the required skills and are available at the requested time and date</p>
          </div>
        </div>
        <div class="para_three">
        </div>
      </div>
    <div class="para_end">
      Our Mission is to empower millions of service professionals by delivering services at-home in a way that has never been experienced before
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Home',
  data(){
    return{
      pincode_available:false,
      pincode:null,
      query_string:null,
    }
  },
  watch:{
    pincode:function(value){
      document.cookie = "pincode="+value;
    }
  },
  mounted () {
    this.pincode = this.getCookie("pincode")
  },
  methods:{
    send_query(){
      document.cookie = "query="+this.query_string;
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
    pincode_validation(){
      var filter = /^[1-9][0-9]{5}$/;
      if (!filter.test(this.pincode)){
        swal({
          title: "Invalid Pincode",
          text: "Please check the Pincode You have entered",
          icon: "warning",
          dangerMode: true,
        })
      }
      else{
        this.$emit('loading')
        axios.get("https://api.postalpincode.in/pincode/"+this.pincode)
        .then((responce)=>{
          if (responce.status == 200){
            if(responce.data[0].Status == "Success"){
              this.pincode_available=true
            }
            else{
              swal({
                title: "Pincode Not Found",
                text: "Please check the Pincode You have entered",
                icon: "warning",
                dangerMode: true,
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
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Spartan:wght@300&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Comfortaa:wght@700&display=swap');
#enter-icon{
  position:absolute;
  transform:translate(-35px,16px);
  font-size:25px
}
#pincode-txt{
  color:black;
  background-color:white;
  max-width: 300px;
  width:85%;
  margin:0 auto;
  font-family: 'Comfortaa', cursive;
  padding:16px;
  border-bottom:1px solid black;
  text-align:left;
  font-size:18px;
  transition: 0.3s;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}
.para_head p{
  background-color: aquamarine;
  font-size: 25px;
}
#start-box{
  background-color: black;
  color: white;
  width: 85%;
  margin:0px auto;
  padding: 30px 0 85px;
  text-align: center;
}
#middle-box{
  width: 95%;
  max-width: 750px;
  margin:40px auto 0;
}
.input-icons i {
  position: absolute;
}
#txt1{
  font-size:30px;
  transition: 0.3s;
} 
#txt2{
  font-size:35px;
  transition: 0.3s;
} 
#txt3{
  font-size:18px;
  transition: 0.3s;
}      
.input-icons {
  padding-top: 40px;
  margin-bottom: 10px;
}
        
.icon {
  padding: 18px 13px;
  font-size: 20px;
  min-width: 40px;
  transition: 0.3s;
  color: black;
}
          
.input-field {
  width: 85%;
  padding: 16px;
  text-align: center;
  max-width: 700px;
  font-size: 20px;
  border: 0;
  background-color: lightgray;
  border-radius: 10px;
  transition: 0.3s;
}
.input-field:focus{
  background-color: white;
  outline: none;
}
.fa{
  color: black;
}
.fa:hover{
  color: #008ebd;
  cursor: pointer;
}
hr{
  height: 2.5px;
  border-width:0;
  background-color: lightgrey;
}
img{
  padding-top: 8%;
  height: 230px;
  display: inline-block;
}
.text_one{
  line-height: 30px;
  width: 365px;
  float: right;
}
.para_one{
  margin-bottom: 100px;
}
.para_two{
  padding: 70px 0 40px;
}
.para_two img{
  padding-top: 7%;
  height: 280px;
  float: right;
}
.text_two{
  line-height: 30px;
  width: 407px;
}
.para_end{
  width: 80%;
  text-align: center;
  margin: 30px auto 60px;
  font-size: 25px;
  font-family: 'Comfortaa', cursive;
}
.text_one,.text_two{
  font-size:18px;
}

@media screen and (max-width:470px){
  #enter-icon{
      transform:translate(-35px,10px);
  }
  #pincode-txt,.input-field{
    padding: 12px;
    font-size:16px;
  }
  .icon{
    padding: 0;
    padding-top: 16px;
    font-size: 15px;
  }
  #txt1{
    font-size: 25px;
  }
  #txt2{
    font-size: 27px;
  }
  .text_one p,.text_two p{
    font-size:15px;
  }
  .para_head{
    font-size: 22px;
  }
  .para_end{
    font-size: 18px;
  }
  img{
    height: 150px;
  }
}
@media screen and (max-width:760px){
  #txt2{
    font-size: 30px;
  }
  img{
    padding: 0;
    margin-bottom: 30px;
    margin-left:50%;
    display: block;
    transform: translateX(-50%);
  }
  .para_head{
    text-align: center;
  }
  .text_one,.text_two{
    margin-left: 50%;
    transform: translateX(-50%);
    float: none;
    width: 100%;
    max-width: 410px;
  }
  .para_two img{
    padding: 0;
    float: none;
    display: block;
    margin-left: 50%;
    transform: translateX(-50%);
  }
  .para_one{
    margin-bottom: 40px;
  }
  .para_two{
    margin-top: 0;
    padding-top: 0;
    margin-bottom: 0;
    padding-bottom: 20px;
  }
}
</style>