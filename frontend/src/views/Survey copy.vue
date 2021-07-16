<template>
  <!-- <div class="container"> -->
  <div class="sv_main sv_frame sv_default_css">
    <!-- If you want to hide survey, comment the lines below -->
    <survey :survey="survey"></survey>
  </div>
</template>

<script>
import axios from "axios";
import * as SurveyVue from "survey-vue";
//import {mapSate} from "vuex";
//import {mapGetters} from "vuex";
import "bootstrap/dist/css/bootstrap.css";

var Survey = SurveyVue.Survey;
Survey.cssType = "bootstrap";

import * as widgets from "surveyjs-widgets";

import { init as customWidget } from "../components/customwidget";

// widgets.icheck(SurveyVue);
widgets.select2(SurveyVue);
widgets.inputmask(SurveyVue);
widgets.jquerybarrating(SurveyVue);
widgets.jqueryuidatepicker(SurveyVue);
widgets.nouislider(SurveyVue);
widgets.select2tagbox(SurveyVue);
widgets.sortablejs(SurveyVue);
widgets.ckeditor(SurveyVue);
widgets.autocomplete(SurveyVue);
widgets.bootstrapslider(SurveyVue);
customWidget(SurveyVue);

SurveyVue.Serializer.addProperty("question", "tag:number");

export default {
  components: {
    Survey
  },
  computed: {
      //...mapState(["surveyList"])
      //availableSurvey() {
        //return this.$store.getters.availableSurvey;
      //}
      
  },
  data() {
    var currentSurvey = this.$store.getters.availableSurvey;
    //var json = this.$store.getters.availableSurvey;
    console.log("currentSurvey: ", currentSurvey.surveyId);
    var json = currentSurvey.surveyJson;
    
    var model = new SurveyVue.Model(json);

    model.onComplete.add(function (result) {
      // 여기서 DB로 저장
      alert(`Complete: ${JSON.stringify(result)}` );
      var sendResult = { postid: currentSurvey.surveyId, data: result.data}
      axios
      //.post("https://reqres.in/api/login", loginObj)  //loginObj = {email, password}
      .post("http://localhost:3000/store", sendResult)  //loginObj = {userid, password}
      .then(res => {
          //성공시 token:
          // 토큰을 포함시켜서 사요자 정보를 요청
          let storeResult = res.data;
          console.log("storeResult:", storeResult);
          
          
      })
      .catch(err => {
          //alert("HEMOS ID와 비밀번호를 확인하세요.")
          console.log(err);
      });
    })
    return {
      survey: model
    };
  }
};
</script>

<style scoped>

#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
