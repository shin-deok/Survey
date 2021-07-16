<template>

    <body style="height:100%">
        <div class="sv_main sv_frame sv_default_css">
            <div class="sv_container">
            <div class="sv_header">
                <h2>My Surveys</h2>
                <p>
                Below you can see the list of available surveys you can edit, run
                and see the results
                </p>
            </div>
            <div class="sv_body">
                <div id="surveys-list" class="surveys-list">
                <section>
                    <button @click="goCreator()">
                    Add
                    </button>
                </section>
                <table class="table table-striped">
                    <tbody>
                    <!-- ko foreach: availableSurveys -->
                    <tr v-for="(survey, index) in surveyList" :key="index">
                        <td data-bind="text: survey.name">{{survey.name}}</td>
                        <td>
                        <a
                            class="sv_button_link"
                            @click="goSurvey({surveyId: survey.id, surveyJson: survey.json})"
                            >Run</a
                        >
                        <a
                            class="sv_button_link"
                            @click="goEdit({surveyId: survey.id, surveyJson: survey.json})"
                            >Edit</a
                        >
                        <a
                            class="sv_button_link"
                            @click="goResult({surveyId: survey.id, surveyJson: survey.json})"
                            >Results</a
                            
                        >
                        <span
                            class="sv_button_link sv_button_delete"
                            @click="goSurveyDelete({surveyId: survey.id})"
                            >Delete</span
                        >
                        </td>
                    </tr>
                    <!-- /ko -->
                    </tbody>
                </table>
                </div>
            </div>
            </div>
        </div>
    </body>        

        
</template>

<script>
import {mapState, mapActions} from "vuex";
import axios from "axios";
//import router from "../router";
//import SurveyCreator from "../components/SurveyCreator";

export default {
    data() {
        return {
            surveyId: null,
            surveyJson: null
        }
    },
    methods: {
        /*
        goCreator(){
            this.$router.push('/Creator');
        },
        */
        ...mapActions(['goCreator']),
        ...mapActions(['goSurvey']),
        ...mapActions(['goResult']),
        ...mapActions(['goEdit']),
        ...mapActions(['goSurveyDelete']),

        goSurveyDelete(surveyObject){
            console.log("go SurveyDelete: ", surveyObject.surveyId);
            axios
            .post("http://localhost:3000/surveyDelete", surveyObject)
            .then(response => {
                console.log("Response of Delete:", response.data.data);
            })
            .catch(error => { 
                alert("Error of deleting the survey.", error);          
            })
      //router.push({ name: "Creator"});  
        },

        /*
        btn_test(runSurvey) {
            console.log("btn_test:", runSurvey);
            //console.log("btn_test2:", runSurvey.surveyJson);
        }
        */
    },
    computed: {
        ...mapState(["userInfo"]),
        ...mapState(["surveyList"])
    },
}
</script>

<style scoped>
    @import '../assets/surveyList.css';
    @import "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css";
    @import "https://unpkg.com/survey-knockout/survey.css";
</style>

