<template>
    <div id="footer-back">
        <div class="footer head">
            <h1>WorkForce</h1>
        </div>
        <div class="footer body">
            Made with <i class="fas fa-heart"></i> and <i class="fab fa-vuejs"></i>ue JS    
        </div>
        <div class="footer icons">
            <a href=""><i class="fab fa-facebook"></i></a>
            <a href=""><i class="fab fa-twitter"></i></a>
            <a href=""><i class="fab fa-instagram"></i></a>
            <a href=""><i class="fab fa-youtube"></i></a>
            <a href=""><i class="fab fa-linkedin"></i></a>
        </div>        
    </div>
</template>
<script>
    export default{
        name:"Footer"
    }
</script>
<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Comfortaa:wght@700&display=swap');
#footer-back{
    width: 80%;
    padding: 25px 10%;
    background-color: black;
    color: white;
    font-family: 'Comfortaa', cursive;
    text-align: center;
    position: relative;
    bottom: 0;
}
.head{
    float: left;
}
.body{
    display: inline-block;
    margin: 0 auto;
    padding-top: 7px;
}
.icons{
    float: right;
}
.icons a{
    color: white;
    font-size: 25px;
    padding: 0 15px 0 0;
}
@media screen and (max-width:785px){
    .body{
        float: none;
        margin-top: 15px;
        display: block;
    }
    .icons{
        margin-top: 20px;
        float: none;
    }
    .head{
        float: none;
    }
}
</style>