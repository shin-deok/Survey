const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const ldap = require('ldapjs');
const jwt = require('jsonwebtoken');

//const db = require('./db');

const pgp = require('pg-promise')(/*options*/);

const app = express();
const port = 3000;

app.use(cors());

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

app.post('/getSurveyList', function(req, res) {

  //const userid = req.body.userid;
  //const userpassword = req.body.password;

  console.log("db in server.js");

  var db = pgp(process.env.DATABASE_URL || "postgres://postgres:123456@localhost:5432/surveyjs");

  db
  .any("select * from surveys")
  .then(function(data) {
    //console.log(JSON.stringify(data));
    res.send(JSON.stringify(data));
    //res.send(data);
  });

});

app.post('/getAvailableList', function(req, res) {

  //const userid = req.body.userid;
  //const userpassword = req.body.password;

  console.log("get AvailableList in server.js");

  var db = pgp(process.env.DATABASE_URL || "postgres://postgres:123456@localhost:5432/surveyjs");
  
  // 향후 사용자가 참여 대상인 설문만 추출
  db
  .any("select * from surveys")
  .then(function(data) {
    // 시간 및 신분 등 체크
    //data.forEach((element) => {
    //  console.log("server available data: ", element.name);
    //});
    //
    res.send(data);
  });

});

app.post('/getSurvey', function(req, res) {

  //const userid = req.body.userid;
  //const userpassword = req.body.password;

  console.log("getSurvey in server.js");

  var db = pgp(process.env.DATABASE_URL || "postgres://postgres:123456@localhost:5432/surveyjs");

  db
  .any("select * from surveys")
  .then(function(data) {
    //console.log(JSON.stringify(data));
    res.send({
      name: data.name,
    });
  });


});

app.post('/surveyDelete', function(req, res) {

  //const userid = req.body.userid;
  //const userpassword = req.body.password;
  var surveyid = req.body.surveyId;

  console.log("surveyDelete Id in server.js: ", surveyid);



  var db = pgp(process.env.DATABASE_URL || "postgres://postgres:123456@localhost:5432/surveyjs");

  db
  .any(`delete from surveys where id='${surveyid}'`)
  .then(function(result) {
    console.log("result: ", result.resultValue);
    //console.log("result: ", result.lastItem);
   //console.log("result: ", result.data);
  });


});


app.post('/getResult', function(req, res) {

  console.log("getResult in server.js");

  var postid = req.body.surveyId;

  console.log("postid: ", postid);

  var db = pgp(process.env.DATABASE_URL || "postgres://postgres:123456@localhost:5432/surveyjs");

  db
  .any(`select json from results where postid='${postid}'`)
  .then(function(data) {

    let resultArray = new Array;
    var result_string;
    data.forEach(function(element) {

      resultArray.push(JSON.parse(element.json));
    });
    
    res.send({
      surveyId: postid,
      resultValue: resultArray
    });
    
  });

});

app.post('/save', function(req, res) {

  var db = pgp(process.env.DATABASE_URL || "postgres://postgres:123456@localhost:5432/surveyjs");

  //const userid = req.body.userid;
  //const userpassword = req.body.password;

  var id = req.body.surveyid;
  var json = req.body.surveyjson;
  var name = req.body.surveyname;
  var cmd = req.body.command;

  console.log("cmd: ", cmd);

  console.log("title: ", name);
  //console.log("edit id: ", id);  

  if(cmd =='edit') {     
    db
    .one("UPDATE surveys SET name = $1, json = $2 WHERE id = $3 RETURNING *  ", [
      name,
      json,
      id
    ])
    .then(function(data){

    }); 
  }else {
    db
    .one("INSERT INTO surveys (name, json) VALUES($1, $2) RETURNING *", [
      name,
      json
    ])
    .then(function(data){
      console.log("save then");
    });
  }

});

app.post('/store', function(req, res) {


  var db = pgp(process.env.DATABASE_URL || "postgres://postgres:123456@localhost:5432/surveyjs");
  //const userid = req.body.userid;
  //const userpassword = req.body.password;

  console.log("store in server.js");
  //console.log("req id: ", req.body.postid);
  //console.log("req json: ", req.body.data);
  var postId = req.body.postid;
  var json = req.body.data;

  db
  .one("INSERT INTO results (postid, json) VALUES($1, $2) RETURNING *", [
    postId,
    json
  ])
  .then(function(data){
    console.log("store then");
  });
/*
  var db = pgp(process.env.DATABASE_URL || "postgres://postgres:123456@localhost:5432/surveyjs");

  db
  .any("select * from surveys")
  .then(function(data) {
    console.log(JSON.stringify(data));
  });
*/

});

app.post('/login', function(req, res) {

  const userid = req.body.userid;
  const userpassword = req.body.password;

  //let errors = {};

  var client = ldap.createClient({
        url: 'ldap://141.223.3.3:389'
    });

  const binddn= "cn=p_hemos,ou=LegacyManagers,dc=postech,dc=ac,dc=kr";
  const bindpassword = "(postech-legacy)";

  const opts = {
      filter: `(uid=${userid})`,
      scope: 'sub',
      attributes: ['uid', 'PDESCRIPTION']
  };

  client.bind(binddn, bindpassword, function(err) {
      if(err)
      {
          console.log("Error in new connection"+err);
      }else {
          console.log("Bind Success", userid);
          /*
          client.search('ou=EPUSER, dc=postech, dc=ac, dc=kr', opts, function(err, res) {
              if(err)
              {
                  console.log("Error in search"+ err);
              }else{
                  res.on('searchEntry', (entry) => {
                      console.log('entry: ' + JSON.stringify(entry.object));
                  });
                  res.on('searchReference', (referral) => {
                      console.log('referral: ' + referral.uris.join());
                  });
                  res.on('error', (err) => {
                      console.error('error: ' + err.message);
                  });
                  res.on('end', (result) => {
                      console.log('status: ' + result.status);
                  });
              }
          });
          */

          client.bind(`uid=${userid}, ou=EPUSER, dc=postech, dc=ac, dc=kr`, `${userpassword}`, function(err){
              if(err)
              {
                  console.log("Error in search: "+ err);
                  res.status(401).send({
                    result: 'failed',
                    data: err
                  });
                  //client.unbind();
                  return;
              }else{
                  console.log("User Bind Success");
                  // test를 위해 token 만료 시간을 1분으로 
                  var token = jwt.sign({sub: userid, exp: Math.floor(Date.now() / 1000) + 3600}, 'secret_key');
                  console.log("token: ", token);
                  res.status(200).send({
                    result: 'success',
                    token: token
                  });
              }
              client.unbind();
          });
          
      }
      //client.unbind();
  });

/*
  if (req.body.userid !== 'test' && req.body.password !== 'test') {
    errors['userid'] = '아이디 혹은 비밀번호가 맞지 않습니다.';
  }
*/
/*
  if (Object.keys(errors).length > 0) {
    res.status(401).send({
      result: 'failed',
      data: errors
    });
    return;
  }
  */

});


app.get('/getMemberInfo', function(req, res) {

  const token = req.headers.accesstoken;
  if(token) {
    jwt.verify(token, 'secret_key', function(err){
      if(err) {
        console.log("error");
        res.status(401).json({ error: '유효하지 않은 token 입니다'});
      } else {
        var decoded= jwt.decode(token, 'secret_key');
        var hemosId = decoded.sub;
        console.log("decoded: ", decoded.sub);
        /////////////////
        var db = pgp(process.env.DATABASE_URL || "postgres://postgres:123456@localhost:5432/surveyjs");

        db
        .one(`select * from users where hemos_id='${hemosId}'`)
        .then(function(data) {
          console.log("data: ", data);
          console.log("id: ", data.hemos_id );
          
          res.send({
            hemosId: data.hemos_id,
            name: data.name,
            department: data.department,
            status: data.status
          });
          
        });

        /////////////////
        
        // 여기서 DB의 사용자 정보를 쿼리해서 가져와야 함
        /*
        let userInfo = {
          id: "sdkang",
          first_name: "shid-deok",
          last_name: "kang"
        }
;
        res.status(200).send(userInfo);
        */
      }
    });
  }else {
    res.status(401).json({ error: 'token 정보가 없습니다.'});
  }
});


app.post('/board', function(req, res) {
  let validationErrors = {};

  if (req.body.title === undefined || req.body.title === '') {
    validationErrors['title'] = 'title은 필수입니다.';
  }

  if (req.body.content === undefined || req.body.content === '') {
    validationErrors['content'] = 'content는 필수입니다.';
  }

  if (Object.keys(validationErrors).length > 0) {
    res.status(422).send({
      result: 'failed',
      data: validationErrors
    });
    return;
  }

  res.status(200).send({
    result: 'success'
  });
});

/*
app.get('/', function(req, res, next) {
  res.sendFile(path.join(__dirname, '../public', 'index.html'));
});
*/
app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));
