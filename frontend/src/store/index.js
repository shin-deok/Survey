import Vue from "vue";
import Vuex from "vuex";
import router from "../router";
import axios from "axios";
import moment from 'moment';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    userInfo: null,
    allusers:[
      {id: 1, name:"hoza", email: "hoza@gmail.com", password: "123456"},
      {id: 2, name:"lego", email: "lego@gmail.com", password: "123456"}
    ],
    userid: null,
    isLogin: false,
    isLoginError: false,
    surveyList : null,
    availableList : null,
    currentSurvey : null,
    currentResult : null,
    currentCommand : null,
    accessToken: null
  },
  
  getters: {
    availableSurvey: state => {
      return state.currentSurvey;
    },
    currentResult: state => {
      return state.currentResult;
    }
  },
  
  //state 값을 변경
  mutations: {
    //로그인이 성공했을 때
    loginSuccess(state, payload) {
      state.isLogin = true;
      state.isLoginError = false;
      state.userInfo = payload;
    },
    //로그인이 실패했을 때
    loginError(state) {
      state.isLogin = false;
      state.isLoginError = true;
    },
    
    //로그아웃
    logout(state){
      state.isLogin = false;
      state.isLoginError = false;
      state.surveyList = null;
      state.currentSurvey = null;
      state.currentCommand = null;
      state.userInfo = null;  
      state.accessToken = null;
    },

    surveyCheck(state, payload) {
      state.surveyList = payload;
    },

    availableCheck(state, payload) {
      state.availableList = payload;
    },

    setCurrentSurvey(state, payload) {
      state.currentSurvey = payload;
    },

    setCurrentResult(state, payload) {
      state.currentResult = payload;
    },

    setCurrentCommand(state, payload) {
      //console.log("setCommand: ", payload);
      state.currentCommand = payload;
    },
    storeToken(state, payload) {
      state.accessToken = payload;
    },
    setTokenExpired(state) {
      state.isLogin = false;
      state.accessToken = null;
    }

  },
  actions: {
    //로그인 시도 -> 토큰 반환
    userLogin({dispatch}, loginObj ) {
      console.log("loginObj: ", loginObj);
      axios
      //.post("https://reqres.in/api/login", loginObj)  //loginObj = {email, password}
      .post("http://localhost:3000/login", loginObj)  //loginObj = {userid, password}
      .then(res => {
          //성공시 token:
          // 토큰을 포함시켜서 사요자 정보를 요청
          let token = res.data.token;
          //commit("storeToken", token);
          //토큰을 로컬스토리지에 저장
          localStorage.setItem("access_token", token);
          dispatch("getMemberInfo");
      })
      .catch(err => {
          alert("HEMOS ID와 비밀번호를 확인하세요.")
          console.log(err);
      });
      
    //전체 User에서 해당 이메일로 유저를 찾는다
      // let selectedUser = null;

      // state.allusers.forEach(user =>{
      //     if(user.email === loginObj.email) selectedUser = user;
      // })
      //       //그 유저의 비밀번호와 입력된 비밀번호를 비교한다.
      // if(selectedUser === null || selectedUser.password !== loginObj.password) {
      //   console.log(loginObj.email);
      //   commit('loginError');
      // } else {
      //   commit('loginSuccess', selectedUser);
      //   console.log("Login");
      //   router.push({ name: "Mypage"});
      // } 
    }, 
    userLogout( {commit} ) {
      // added by sdkang
      localStorage.removeItem("access_token");
      commit('logout');
      router.push({ name: "Home"});
      console.log("call the userLogout");
    },
    getMySurveyList({commit}) {
      // DB의 설문 리스트 가져오기
      console.log("getMySurveyList()");
      axios
        .post("http://localhost:3000/getSurveyList")
        .then(response => {
          //console.log("dbTest response:", response.data.name);
          let surveyInfo = new Array;
          //var count = 0;
          response.data.forEach((element) => {
            /*
            surveyInfo = {
              name: element.name,
              id: element.id,
              json: element.json
            }
            */
            surveyInfo.push(element);
            //console.log("===== name ========:", surveyInfo[count].name);
            //count++;
            //console.log("element:", element);
          });
          /*
          let surveyInfo= {
            name: response.data.name,
            id: response.data.id,
            json: response.data.json
          }
          */
          commit("surveyCheck", surveyInfo);
          router.push({ name: "Mypage"});
        })
        .catch(error => { 
          alert("Error of getting the survey list.", error);          

        })

    },
    getAvailableList({commit}) {
      // DB의 설문 리스트 가져오기
      console.log("getAvailableSurveyList()");
      axios
        .post("http://localhost:3000/getAvailableList")
        .then(response => {
          //console.log("dbTest response:", response.data.name);
          let availableInfo = new Array;
          //var count = 0;
          response.data.forEach((element) => {
            element.json = JSON.parse(element.json);

            var now = moment().format('YYYY-MM-DD');
            var status = this.state.userInfo.status;
            // 1. 시간으로 이용가능한 설문 여부 체크
            if(moment(now).isSameOrAfter(element.json.StartDate) && moment(now).isSameOrBefore(element.json.EndDate)) {
              if(element.json[status]) {
                availableInfo.push(element);  
                console.log("Available Survey: ", element.name);
              }
              //availableInfo.push(element);
              
              //console.log("Available Survey: ", element.json[status]);
            }

            // 2. 신분으로 이용가능한 설문 여부 체크
            
            // 3. ID 리스트 기준으로 이용가능한 설문 여부 체크
          });
          
          commit("availableCheck", availableInfo);
          router.push({ name: "AvailableSurvey"});
        })
        .catch(error => { 
          alert("Error of getting the Available list.", error);          

        })

    },
    goCreator({commit}){
      var Cmd = "create";
      commit("setCurrentCommand", Cmd);
      router.push({ name: "Creator"});    
    },
    goSurvey({commit}, surveyObject){
      console.log("surveyObject2: ", surveyObject.surveyId);
      commit("setCurrentSurvey", surveyObject);    
      router.push({ name: "Survey"});  
    },

    goResult({commit}, resultObject){
      console.log("resultObject: ", resultObject);
      axios
        .post("http://localhost:3000/getResult", resultObject)
        .then(response => {
          console.log("getResult response:", response.data.surveyId);
          console.log("getResult response:", response.data.resultValue);
          
          //let resultInfo = new Array;
          let resultInfo = new Object;

          resultInfo.data = response.data.resultValue
          resultInfo.json = resultObject.surveyJson;
          
          commit("setCurrentResult", resultInfo); 
          router.push({ name: "Analytics"});
        })
        .catch(error => { 
          alert("goResult axios error.", error);          

        })
      
      //commit("setCurrentResult", resultObject);    

      //router.push({ name: "Survey"});  
    },

    goEdit( {commit}, surveyObject) {
      var Cmd = "edit";
      console.log("goEidt: ", surveyObject.surveyId);
      
      commit("setCurrentSurvey", surveyObject); 
      commit("setCurrentCommand", Cmd);
      router.push({ name: "Creator"});  
    },

    /*
    goSurveyDelete(surveyObject) {
      //var Cmd = "edit";
      console.log("goSurveyDelete: ", surveyObject.surveyId);
      axios
        .post("http://localhost:3000/surveyDelete")
        .then(response => {
          console.log("Response of Delete:", response.data.data);
        })
        .catch(error => { 
          alert("Error of deleting the survey.", error);          

        })
      
      //router.push({ name: "Creator"});  
    },
    */
    getMemberInfo({commit}) {
      let token = localStorage.getItem("access_token");
      console.log("token :: ", token);
      if(token) {
        let config = {
          headers: {
            'accessToken': token
          }
        }
  
        // 토큰 -> 멤버 정보를 반환
        // 새로 고침 -> 토큰만 가지고 멤버 정보를 요청
        axios
        .get("http://localhost:3000/getMemberInfo", config)
        .then(response => {
          console.log("response:", response);
          let userInfo= {
            id: response.data.hemosId,
            name: response.data.name,
            department: response.data.department,
            status: response.data.status
          }
          commit("loginSuccess", userInfo);
          commit("storeToken", token);
          this.dispatch("getAvailableList");
          router.push({ name: "AvailableSurvey"});
          //router.push({ name: "Mypage"});
        })
        .catch(error => { 
          alert("HEMOS ID와 비밀번호를 확인하세요!!.");
          commit("setTokenExpired");          
          console.log("Get:", error);
        })

      }else{
        commit("setTokenExpired");
        console.log("access_token:", token)
      }
      
    }
  },
  modules: {

  },

});
