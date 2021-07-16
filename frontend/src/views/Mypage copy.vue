<template>
    <v-container fill-height style="max-width: 600px">
        <v-layout align-center row wrap>
            <v-flex xs12>
                <v-card>
                    <v-toolbar flat color="primary">
                        <v-toolbar-title class="white--text"> 이용 가능한 설문 </v-toolbar-title>
                    </v-toolbar>
                    <v-row align="center" justify="center"  v-for="(survey, index) in surveyList" :key="index">
                        <v-col> {{survey.name}}</v-col>
                        <v-col> {{survey.id}}</v-col>
                        <!--<v-col> <v-btn @click="btn_test({surveyId: survey.id, surveyJson: survey.json})"> Run </v-btn></v-col> -->
                        <v-col> <v-btn @click="goSurvey({surveyId: survey.id, surveyJson: survey.json})"> Run </v-btn></v-col>
                    </v-row>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
    <!--
    <div>
        <h1> {{ userInfo.first_name}} {{userInfo.last_name}}님, 환영합니다. </h1> 
        <h2> [이용 가능한 설문]</h2>
        <v-card elevation="2">
            dsfsdsafsf
        </v-card>
        <table>
            <tr>
                <h3> {{ surveyList.name}}</h3>
            </tr>
        </table>
    </div>
    -->
</template>
<script>
import {mapState, mapActions} from "vuex";

export default {
    data() {
        return {
            surveyId: null,
            surveyJson: null
        }
    },
     methods: {
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
        ...mapState(["surveyList"])
    },
}
</script>