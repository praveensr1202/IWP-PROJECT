<template>
    <div>
        <img src="https://www.costcoauto.com/save/images/ajax-loading.gif" >
    </div>
</template>
<script>
export default{
    name:"LoadPage"
}
</script>
<style scoped>
div{
    position: fixed;
    top: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(255, 255, 255, 0.753);
    z-index: 99;
}
img{
    height: 80px;
    margin-top: 40vh;
    margin-left: 50%;
    transform: translateX(-50%);
}
</style>
