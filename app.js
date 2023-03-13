const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use("/public", express.static(__dirname + "/public"));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const router = require("./routes/index");

app.use(router);

// 실제 계정 비밀번호 누출을 막기 위해 AWS 람다 이용
axios
  .get(
    "https://t6i4y6pbv1.execute-api.ap-northeast-2.amazonaws.com/default/_key"
  )
  .then((res) => {
    // mongoose 최신 버전에서는 모든 메소드의 파라미터로 콜백함수를 지원하지 않아 promise 처리로 수정
    mongoose
      .connect(
        `mongodb+srv://geun10121:${res.data}@cluster0.ahbtkiv.mongodb.net/?retryWrites=true&w=majority`,
        {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        }
      )
      .then(() => {
        console.log("mongoDB Connceted!!");
        app.listen(3000, () => {
          console.log("Server listening on port 3000!");
        });
      })
      .catch((err) => {
        console.error(err);
      });
  });
