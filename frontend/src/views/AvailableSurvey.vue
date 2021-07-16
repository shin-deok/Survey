<template>

    <body style="height:100%">
        <div class="sv_main sv_frame sv_default_css">
            <div class="sv_container">
            <div class="sv_header">
                <h2>Available Surveys</h2>
                <p>
                Below you can see the list of available surveys you can run 
                </p>
            </div>
            <div class="sv_body">
                <div id="surveys-list" class="surveys-list">
                <section>
                    <button @click="goCreator()">
                    Make Survey
                    </button>
                </section>
                <table class="table table-striped">
                    <tbody>
                    <!-- ko foreach: availableSurveys -->
                    <tr v-for="(survey, index) in availableList" :key="index">
                        <td width="60%">{{survey.name}}</td>
                        <td align="center">{{survey.json.StartDate}} ~ {{survey.json.EndDate}}</td>
                        <td>
                            <a
                                class="sv_button_link"
                                @click="goSurvey({surveyId: survey.id, surveyJson: survey.json})"
                                >Run</a
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

        /*
        btn_test(runSurvey) {
            console.log("btn_test:", runSurvey);
            //console.log("btn_test2:", runSurvey.surveyJson);
        }
        */
    },
    computed: {
        ...mapState(["userInfo"]),
        ...mapState(["surveyList"]),
        ...mapState(["availableList"]),
    },
}
</script>

<style scoped>
    @import '../assets/surveyList.css';
    @import "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css";
    @import "https://unpkg.com/survey-knockout/survey.css";
</style>

