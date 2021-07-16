import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Login from "../views/Login.vue";
import Mypage from "../views/Mypage.vue";
import Creator from "../views/Creator.vue";
import Survey from "../views/Survey.vue";
import Analytics from "../views/Analytics.vue";
import AvailableSurvey from "../views/AvailableSurvey.vue";
import store from "../store";

const jwt = require('jsonwebtoken');

Vue.use(VueRouter);

const rejectAuthUser = (to, from, next) => {

  if (store.state.isLogin === true){
    // 이미 로그인된 유저니까 막아야
    //alert("이미 로그인을 하였습니다.");
    next("/");
  }else {
    next();
  }
}
/*
const routerGuard = (to, from, next) => {
  let token = localStorage.getItem("access_token");
  if (token != null) {
    console.log("routerGuard: token", token)
  }else {
    next("/login");
  }
}
*/
//로그인한 사람만 접근 가능하도록
const onlyAuthUser = (to, from, next) => {
  
  console.log("onlyAuthUser");
  let storedToken = localStorage.getItem("access_token");
  jwt.verify(storedToken, 'secret_key', function(err) {
    if(err) {
      console.log(" onlyAuthUser error: ", err);
      store.state.isLogin = false;
      store.state.isLoginError = false;
      store.state.userInfo = null;
      store.state.accessToken = null;

      localStorage.removeItem("access_token");
      next("/login");
    } else {
      console.log("onlyAuthUser else");
      next();
    }
  });
/*
  if (store.state.isLogin === false){
    // 로그인 아된 유저니까 접근을 막아야
    //alert("로그인을 해야 합니다.");
    next("/login");
  }else {
    next();
  }
*/
}

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/survey",
    name: "Survey",
    component: Survey,
  },
  {
    path: "/login",
    name: "Login",
    beforeEnter: rejectAuthUser,
    component: Login,
  },
  {
    path: "/mypage",
    name: "Mypage",
    beforeEnter: onlyAuthUser,
    component: Mypage,
  },
  {
    path: "/availablesurvay",
    name: "AvailableSurvey",
    beforeEnter: onlyAuthUser,
    component: AvailableSurvey,
  },
  {
    path: "/creator",
    name: "Creator",
    beforeEnter: onlyAuthUser,
    component: Creator,
  },
  {
    path: "/analytics",
    name: "Analytics",
    component: Analytics,
  }

];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
