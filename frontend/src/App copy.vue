<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <div class="d-flex align-center">
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-logo-dark.png"
          transition="scale-transition"
          width="40"
        />

        <h2>POSTECH Survey</h2>
      </div>

      <v-spacer></v-spacer>

      <v-btn text v-if="isLogin" router :to="{name: 'Mypage'}">
        <span class="mr-1">My page</span>
      </v-btn>

      <v-btn text v-if="isLogin" >
        <span class="mr-1">LogOut</span>
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn>
      <v-btn text  v-else router :to="{name: 'Login'}">
        <span class="mr-1">LogIn</span>
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn>

    </v-app-bar>

    <v-main>
      <router-view/>
    </v-main>

  <v-footer
    height="auto"
    color="primary"
  >
    <v-layout
      justify-center
      high
      wrap
    >
        Information Technology & Services, 279-2520
    </v-layout>
  </v-footer>
  </v-app>
</template>

<script>
//import Router from "./router";
import { mapState } from "vuex";

export default {
  name: "App",

  components: {

  },

  data: () => ({
    //
  }),

  computed: {
    ...mapState(['isLogin'])
  }
};
</script>
