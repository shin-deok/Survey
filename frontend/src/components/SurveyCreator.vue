<template>
  <div id="surveyCreatorContainer"></div>
</template>

<script>
import axios from "axios";
import * as SurveyCreator from "survey-creator";
import "survey-creator/survey-creator.css";

import * as SurveyKo from "survey-knockout";
import * as widgets from "surveyjs-widgets";
import { init as customWidget } from "../components/customwidget";

//import {mapState} from "vuex";

// widgets.icheck(SurveyKo);
widgets.select2(SurveyKo);
widgets.inputmask(SurveyKo);
widgets.jquerybarrating(SurveyKo);
widgets.jqueryuidatepicker(SurveyKo);
widgets.nouislider(SurveyKo);
widgets.select2tagbox(SurveyKo);
widgets.sortablejs(SurveyKo);
widgets.ckeditor(SurveyKo);
widgets.autocomplete(SurveyKo);
widgets.bootstrapslider(SurveyKo);

customWidget(SurveyKo);

SurveyKo.Serializer.addProperty("question", "tag:number");

SurveyKo.Serializer.addProperty('survey', { name: 'All:boolean', category: '신분별 설문 대상', visibleIndex:0});
SurveyKo.Serializer.addProperty('survey', { name: '전임교원:boolean', displayname:"전임", category: '신분별 설문 대상'});
SurveyKo.Serializer.addProperty('survey', { name: '비전임교원:boolean', category: '신분별 설문 대상'});
SurveyKo.Serializer.addProperty('survey', { name: '정직원:boolean', category: '신분별 설문 대상'});
SurveyKo.Serializer.addProperty('survey', { name: '연봉계약직:boolean', category: '신분별 설문 대상'});
SurveyKo.Serializer.addProperty('survey', { name: '연구원:boolean', category: '신분별 설문 대상'});
SurveyKo.Serializer.addProperty('survey', { name: '학부생:boolean', category: '신분별 설문 대상'});
SurveyKo.Serializer.addProperty('survey', { name: '대학원생:boolean', category: '신분별 설문 대상'});

SurveyKo.Serializer.addProperty('survey', { name: 'All:boolean', category: '부서별 설문 대상'});
SurveyKo.Serializer.addProperty('survey', { name: '정보기술팀:boolean', category: '부서별 설문 대상'});
SurveyKo.Serializer.addProperty('survey', { name: '정보전략팀:boolean', category: '부서별 설문 대상'});
SurveyKo.Serializer.addProperty('survey', { name: '학술정보팀:boolean', category: '부서별 설문 대상'});


SurveyKo.Serializer.addProperty("survey", {
  name: "EndDate:date",
  category: "general", type: "date", isRequired: true, visibleIndex:1
});

SurveyKo.Serializer.addProperty("survey", {
  name: "StartDate:date",
  category: "general", isRequired: true, displayname:"StartDate(yyyy-mm-dd)", visibleIndex:1
});


var propertyDateWidget = {
    //name: "startdate",
    render : function(editor, el) {
        var isSetValue = false;
        var input = document.createElement("input");
        input.className = "form-control svd_editor_control";
        input.type = "date";
        console.log( "isSetValue: ", isSetValue);
        
        input.onchange = function() {
          //isSetValue = true;
          editor.koValue(input.value);
          //isSetValue = false;
        };
        
        el.appendChild(input);
    }
}

SurveyCreator.Extentions.registerCustomPropertyEditor("date", propertyDateWidget);


//SurveyKo.Serializer.findProperty("survey", "description").visible = false;

//Make title required field
SurveyKo.JsonObject.metaData.findProperty('survey', 'title').isRequired = true;
//SurveyCreator.validateSelectedElement();

var CkEditor_ModalEditor = {
  afterRender: function(modalEditor, htmlElement) {
    var editor = window["CKEDITOR"].replace(htmlElement);
    editor.on("change", function() {
      modalEditor.editingValue = editor.getData();
    });
    editor.setData(modalEditor.editingValue);
  },
  destroy: function(modalEditor, htmlElement) {
    var instance = window["CKEDITOR"].instances[htmlElement.id];
    if (instance) {
      instance.removeAllListeners();
      window["CKEDITOR"].remove(instance);
    }
  }
};
SurveyCreator.SurveyPropertyModalEditor.registerCustomWidget(
  "html",
  CkEditor_ModalEditor
);

export default {
  name: "survey-creator",
  data() {

    
    return { 

    };
  },
  mounted() {
    let options = { 
      showEmbededSurveyTab: true,
      // Added 1 row by sdkang in order to remove the non-commercial usage text
      haveCommercialLicense: true
      };
    this.surveyCreator = new SurveyCreator.SurveyCreator(
      "surveyCreatorContainer",
      options
    );
        
    // for Edit about the listed survey
    var command = this.$store.state.currentCommand;
    var surveyId = null;
    console.log("command: ", command);
    if(command =="edit") {
      this.surveyCreator.text =  this.$store.state.currentSurvey.surveyJson;
      surveyId = this.$store.state.currentSurvey.surveyId;
    }
    //this.surveyCreator.text =  this.$store.state.currentSurvey.surveyJson;
    //////
    this.surveyCreator.saveSurveyFunc = function() {
      console.log("click the save button in SuveyCreator.vue");
      //owner ID와 설문데이터 JSON 형태를 DB로 넘겨서 저장?? by sdkang
      
      //var test = JSON.stringify(this.text);
      var surveyText = JSON.parse(this.text);

      //var surveyJson =  (JSON.stringify(this.text));
      //var surveyJson =  this.text;
      var surveyJson = this.text;
      var surveyName = surveyText.title;
      //var sendSurvey = {surveyjson: surveyJson, surveyname: surveyName};
      var sendSurvey = {surveyid: surveyId, surveyjson: surveyJson, surveyname: surveyName, command: command};

      console.log("save command: ", command);
      if(surveyName == null) {
        alert("Survey Title을 입력하십시오.");
      }else{
        axios
          .post("http://localhost:3000/save", sendSurvey)  //loginObj = {userid, password}
          .then(res => {
              //성공시 token:
              // 토큰을 포함시켜서 사요자 정보를 요청
              let saveResult = res.data;
              console.log("saveResult:", saveResult);
              
              
          })
          .catch(err => {
              //alert("HEMOS ID와 비밀번호를 확인하세요.")
              console.log(err);
          });
      } 
    };
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
