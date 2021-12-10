<template>
    <div id="main">
        <h2 style="text-align:center">Available Results</h2>
        <div style="text-align:center">
            <div v-show="results.length > 0">
                <div class="booking-main">
                    <div class="booking-box" v-show="results.length > 0" v-for="result in results" :key="result.id" style="width:94%;max-width:1270px">
                        <div class="booking-top-div">
                            <div style="text-align:center;width:100px;padding:10px;font-size:18px;margin:0 0 10px;border-radius:10px;cursor:pointer;float:right" class='green-color' @click="book_service(result.id,result.prof_id,result.service_name)" >Book</div>
                            <p style="margin:5px 0 10px;" >{{result.service_name}}</p>
                        </div>
                        <div class="booking-mid-div">
                            <div>
                                <p class="desc_line" v-show="result.price_type == 'constant' ">Fixed Price : <i class="fa fa-inr"></i> {{result.price}}</p>
                                <p class="desc_line" v-show="result.price_type == 'duration' ">Price : <i class="fa fa-inr"></i> {{result.price}} / hour</p>
                            </div>
                            <div>
                                <p class="desc_line" v-show="result.additional_charges != 0">Additional Charges May be Applicable</p>
                                <p class="desc_line" v-show="result.additional_charges == 0">No Additional Charges</p>                                
                            </div>
                            <div>
                                <p class="desc_line" v-show="result.time != null">Approximate Time Taken : {{result.time}} Hrs</p>
                                <p class="desc_line" v-show="result.time == null">Approximate Time Taken : Not Applicable</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div v-show="results.length == 0" class="empty-box1">
                No Services are Available
            </div>
        </div>
    </div>
    
</template>
<script>
import axios from 'axios';

export default{
    name:'QueryPage',
    data(){
        return{
            user_id:this.getCookie('userid'),
            query:this.getCookie('query'),
            pincode:this.getCookie('pincode'),
            results:[],
            address:null,
            ph_no:null
        }
    },
    created(){
        this.get_details();
    },
    methods:{
        get_details(){
            this.$emit('loading')
            axios.post("http://localhost:3000/account/query",{pincode:this.pincode,query:this.query})
            .then((responce)=>{
                if (responce.status == 200){
                    this.results = responce.data.arr;
                }
            })
            .finally(() => {
                this.$emit('loading')
            });
        },
        book_service(book_id,profs_id,servicename){
            swal("Enter Your Phone Number:", {
                content: "input",
            })
            .then((value) => {
                this.ph_no = value
                swal("Enter Your address:", {
                    content: "input",
                })
                .then((value) => {
                    this.address = value
                    if (this.address == null || this.ph_no == null){
                        swal({
                            title:"Invalid details",
                            icon:"warning",
                            dangerMode:true
                        })
                    }
                    else{
                        this.$emit('loading')
                        axios.post("http://localhost:3000/account/book",{id:book_id,userid:this.user_id,prof_id:profs_id,service_name:servicename,address:this.address,customer_ph_no:this.ph_no})
                        .then((responce)=>{
                            if (responce.status == 200){
                                this.get_details();
                            }
                        })
                        .finally(()=>{
                            this.$emit('loading')
                        })
                    }
                });
            });
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
    }
}
</script>
<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Comfortaa:wght@700&display=swap');
*{
    font-family: 'Comfortaa', cursive;
}
#main{
    width: 100%;
    max-width: 1270px;
    margin: 0 auto;
    min-height: 100vh;
    margin-top: 25px;
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
.booking-top-div p{
    font-size: 20px;
}
.booking-mid-div{
    min-height: 200px;
    border-top:1px solid rgb(129, 129, 129);
}
.empty-box1{
    font-size: 18px;
    padding-top: 60px;
    text-align: center;
}
.red-color{
    background-color: red;
    color: white;
}
.green-color{
    background-color: green;
    color: white;
}
.desc_line{
    margin:30px 20px;
}
@media screen and (max-width:400px){
    .booking-top-div p{
        font-size: 18px;
    }
}
</style>