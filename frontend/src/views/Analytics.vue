<template>
  <div class="container">
    <h2>SurveyJS Analytics Library</h2>
    <div id="summaryContainer"></div>
  </div>
</template>

// build error로 인해 일단 script 전체 주석 처리
<!--
<script>
import * as SurveyVue from "survey-vue";
import * as SurveyAnalytics from "survey-analytics";

//import { data } from "../data/analytics_data";

import {mapState} from "vuex";

import "survey-analytics/survey.analytics.css";

export default {
  components: {
    //SurveyVue
  },

  data() {
    
    var data = this.$store.state.currentResult.data;

    console.log("Analytics Result data: ", data);
    //console.log("result json: ", this.$store.state.currentResult.json);
    var json = this.$store.state.currentResult.json;
    
    //var data2 =  JSON.parse(data);

    const survey = new SurveyVue.Model(json);
    return { survey, data };
    //return { survey, data };
  },

  mounted() {
    var surveyAnalyticsDataTables = new SurveyAnalytics.VisualizationPanel(
      this.survey.getAllQuestions(),
      this.data
    );
    surveyAnalyticsDataTables.render(
      document.getElementById("summaryContainer")
    );
  },
  
  computed: {
    ...mapState(["currentResult"]),
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
-->