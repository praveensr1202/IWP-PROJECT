<template>
    <div id="main">
        <form @submit.prevent="GetData" id="auth_form">
            <h2 style="padding: 20px 0">Enter Your credentials to access data</h2>
            <input type="text" placeholder="User Name" v-model="name">
            <input type="text" placeholder="Password" v-model="password">
            <input type="submit" value="Get Data" style="padding:10px 20px;cursor:pointer">
        </form>
        <div v-show="data.length > 0">
            <table>
                <tr>
                    <th>Name</th>
                    <th>Email ID</th>
                    <th>Phone Number</th>
                    <th>Skill</th>
                    <th>Access</th>
                </tr>
                <tr v-for="item in data" :key="item.id">
                    <td>{{item.name}}</td>
                    <td>{{item.email}}</td>
                    <td>{{item.ph_no}}</td>
                    <td>{{item.work_description}}</td>
                    <td>
                        <form @submit.prevent="btn_click('accept',item.id)" style="display:inline-block">
                            <input type="submit" class="btn" style="background-color: green;margin-right: 10px;" value="Accept">
                        </form>
                        <form @submit.prevent="btn_click('deny',item.id)" style="display:inline-block">
                            <input type="submit" class="btn" style="background-color: red;" value="Deny">
                        </form>
                    </td>
                </tr>
            </table>
        </div>
        <div v-show="data.length == 0" style="width:99%;max-width:1000px;margin:20px auto;text-align:center;font-size:25px;">
            <p>You Don't have any new Requests</p>
        </div>
    </div>    
</template>

<script>
import axios from 'axios';

export default{
    name:"Admin",
    data(){
        return{
            name:"",
            password:"",
            table_present:false,
            data:[]
        }
    },
    methods:{
        btn_click(s,userid){
            this.$emit('loading')
            axios.post("http://localhost:3000/auth/operation",{id:userid,operation:s,name:this.name,password:this.password})
            .then((responce)=>{
                if (responce.status == 200){
                    if (responce.data.valid){
                        swal({
                            title: "Operation Successful",
                            icon: "success",
                        })
                        this.data = responce.data.arr;
                    }
                    else{
                        swal({
                            title:"Invalid Credentials",
                            icon:"warning",
                            dangerMode:true
                        })
                    }
                }
            })
            .finally(() => {
                this.$emit('loading')
            });         
        },
        GetData(){
            this.$emit('loading')
            axios.post("http://localhost:3000/auth/admin",{name:this.name,password:this.password})
            .then((responce)=>{
                if (responce.status == 200){
                    if (responce.data.valid){
                        this.data = responce.data.arr;
                    }
                    else{
                        swal({
                            title:"Invalid Credentials",
                            icon:"warning",
                            dangerMode:true
                        })
                    }
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
#auth_form{
    width: 99%;
    margin: 0 auto;
    max-width: 1000px;
    text-align: center;
    background-color: aqua;
}
input{
    padding: 10px;
    margin: 10px;
    font-size:15px;
    font-family: 'Comfortaa', cursive;
    background-color: white;
    border: 0;
    border-radius: 10px;
}
.btn{
    color: white;
    padding:10px 20px;
    border: 0;
    border-radius: 10px;
    cursor: pointer;
}
#main{
    position: absolute;
    z-index: 99;
    top: 0;
    width: 100%;
    min-height: 100vh;
    background-color: greenyellow;
}
table {
  font-family: arial, sans-serif;
  border-collapse: collapse;
  width: 99%;
  max-width: 1000px;
  margin: 0 auto;
}

td, th {
    border: 1px solid black;
    text-align: left;
    padding: 8px;
    font-family: 'Comfortaa', cursive;
}
tr th{
    background-color: black;
    color: white;
    border-color: white;
    border-bottom-color: black;
    border-top-color: black;
}
tr:nth-child(even) {
  background-color: #dddddd;
}
tr:nth-child(odd){
    background-color: white;
}
</style>