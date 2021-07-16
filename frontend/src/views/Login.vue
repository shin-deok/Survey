<template>
    <v-container fill-height style="max-width: 450px">
        <v-layout align-center row wrap>
            <v-flex xs12>
                <v-alert
                    :value="isLoginError"
                    type = "error"
                    >
                    아이디와 비밀번호를 확인하세요.
                </v-alert>
                <v-alert
                    :value="isLogin"
                    type = "success"
                    >
                    로그인이 완료되었습니다.
                </v-alert>
                <v-card>
                    <v-toolbar flat color="primary">
                        <v-toolbar-title class="white--text">로그인</v-toolbar-title>
                    </v-toolbar>
                    <div class="pa-3">
                        <v-text-field
                            v-model="userid"
                            label="HEMOS ID를 입력하세요"
                        >
                        </v-text-field>
                        <v-text-field
                            v-model="password"
                            type="password"
                            label="패스워드를 입력하세요"
                            @keyup.up.enter="userLogin({ userid: userid, password: password })"
                        >
                        </v-text-field>
                        <v-btn
                            color="primary"
                            depressed
                            block
                            large
                            @click="userLogin({ userid: userid, password: password })"
                        >
                        Login
                        </v-btn>

                    </div>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
import { mapState, mapActions } from "vuex";

//import { mapActions } from "vuex";
export default {
    data(){
        return{
            userid: null,
            password: null,
            //isError: false,
            //loginSuccess: false
        }
    },
    computed: {
        ...mapState(["isLogin", "isLoginError"])
    },
    methods: {
        ...mapActions(['userLogin']),
        //userLogin() {
            // 전체 User에서 해당 이메일로 유저를 찾는다
            // let selectedUser = null;
            // this.allusers.forEach(user =>{
            //     if(user.email === this.email) selectedUser = user;
            // })
            // selectedUser === null 
            // ? (this.isError = true)
            // : selectedUser.password !== this.password 
            //     ? (this.isError = true)
            //     : (this.loginSuccess = true);
            // 그 유저의 비밀번호와 입력된 비밀번호를 비교한다.
        //}

        // test() {
        //     axios
        //         .get('https://reqres.in/api/user?page=2')
        //         .then(response => {
        //             // handle success
        //             console.log(response);
        //         })
        //         .catch(error => {
        //             // handle error
        //             console.log(error);
        //         })
        //         .then(() => {
        //             // always executed
        //             console.log("test");
        //         })
        // },
        // post_test() {
        //     axios
        //         .post('https://reqres.in/api/login', {
        //             "email": "eve.holt@reqres.in",
        //             "password": "pistolsdf21"
        //         })
        //         .then(function (response) {
        //             console.log(response);
        //         })
        //         .catch(function (error) {
        //             console.log(error);
        //         });
        // }
    }
}
</script>