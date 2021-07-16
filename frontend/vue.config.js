var path = require("path");
module.exports = {
  outputDir : path.resolve("../backend/public"),
  devServer:{
    proxy:{
      '/': {
        target: "http://survey.postech.ac.kr:3000/",
        changeOrigin: true,
        pathRewrite:{

        }
      }
    }
  },
  transpileDependencies: ["vuetify"],
};
