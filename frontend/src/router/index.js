import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Account from '../views/Account.vue'
import NotFound from '../views/NotFound.vue'
import Register from '../views/Register.vue'
import Admin from '../views/Admin.vue'
import QueryPage from '../views/QueryPage.vue'
function getCookie(cname) {
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
}

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path:'/account',
    name: 'Account',
    component:Account,
    beforeEnter:(to,from,next)=>{
      if (getCookie("userid") == null){
        router.replace("/")
      }
      else{
        next();
      }
    }
  },
  {
    path:'/register',
    name:'Register',
    component:Register
  },
  {
    path:'/query',
    name:'QueryPage',
    component:QueryPage,
  },
  {
    path:'/admin',
    name:'Admin',
    component:Admin,
  },
  {
    path:'/:catchAll(.*)',
    name:'NotFound',
    component: NotFound,
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
