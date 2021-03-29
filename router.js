/* 路由文件 */

// 引入第三方服务器模块
const express = require("express");

// 引入model.js文件（数据库模型文件）
const USER = require("./model");
// 引入multer模块
const multer = require("multer");
const { render } = require("ejs");
var upload = multer({ dest: "uploads/" });
// 路由对象
const router = express.Router();

// 首页
router.get("/index", (req, res) => {
  // 在数据库中查找到所有的数据进行返回
  USER.find({}, (err, datas) => {
    // docs.forEach
    // 如果查询成功
    if (err === null) {
      // console.log(datas);
      res.render("index", {
        // es6语法：对象解构赋值，
        // 相当于datas:datas
        datas,
      });
    } else {
      res.send({
        code: 500,
        message: "数据库内部错误",
      });
    }
  });
});

// 注册
router.get("/register", (req, res) => {
  res.render("register");
});
// 必须写上传文件
router.post("/register", upload.single("picture"), (req, res) => {
  // 获取前端发送过来的注册信息
  var { username, phone, password, passwordtrue, slogan, sex } = req.body;
  // console.log(username);
  var picture;
  try {
    picture = req.file.filename;
  } catch (e) {
    picture = undefined;
  }
  // console.log(picture);
  if (password !== passwordtrue) {
    res.send({
      code: "304",
      message: "两次密码不一致",
    });
    return;
  }
  USER.findOne({ username })
    .then((result) => {
      // 如果查询到username存在，则说明该用户已注册过
      if (result) {
        // console.log(result); // 查询结果
        res.send({
          code: 304,
          message: "该用户已存在",
        });
      }
      // 否则该用户不存在，则添加到表(集合)中去
      else {
        console.log("用户注册~~~");
        // 如果用户上传了图片
        // 创建一个数据集合(对象)
        var myUser = new USER({
          username,
          phone,
          password,
          picture,
          slogan,
          // sex,
        });
        // console.log(myUser);
        // 把这个数据集合插入到表(集合)中
        USER.insertMany(myUser)
          .then((result) => {
            // console.log(result);
            // 插入成功
            res.send({
              code: 200,
              message: "注册成功",
            });
          })
          .catch((err) => {
            // console.log(err);
            res.send({
              code: 304,
              message: "注册失败",
            });
          });
      }
    })
    .catch((err) => {
      res.send({
        code: 500,
        message: "数据库内部错误",
      });
    });
});

// 登录
router.get("/login", (req, res) => {
  res.render("login");
});
router.post("/login", (req, res) => {
  var { phone, password } = req.body;

  // 去数据库查找phone和password
  USER.findOne({ phone, password })
    .then((result) => {
      if (phone === result.phone && password === result.password) {
        // 如果手机号和密码都正确，则登录成功
        var id = result._id;
        // console.log(id);

        res.cookie("phone", phone);
        res.cookie("id", id);

        res.send({
          code: 200,
          message: "登录成功",
          data: {
            phone,
            id,
          },
        });
      } else {
        res.send({
          code: 304,
          message: "手机号或密码错误",
        });
      }
    })
    .catch((err) => {
      res.send({
        code: 500,
        message: "数据库内部错误",
      });
    });
});

// 个人主页
router.get("/about", (req, res) => {
  // 在数据库中查找到所有的数据进行返回
  USER.find({}, (err, datas) => {
    if (err === null) {
      res.render("about", {
        datas,
      });
    } else {
      res.send({
        code: 500,
        message: "数据库内部错误",
      });
    }
  });
});

// 退出
router.get("/logout", (req, res) => {
  // 清除cookie
  res.clearCookie("phone");
  res.clearCookie("id");

  // 重定向
  res.writeHead(302, {
    Location: "/index",
  });
  // 结束响应过程
  // 用于快速结束没有任何数据的响应
  res.end("");
});

// 搜索
router.get("/search", (req, res) => {
  // 根据id搜索信息
  var { username } = req.query;
  // 把前端传递过来的username在数据库进行查找，然后返回结果给前端
  if (username !== "") {
    // 如果用户名不为空，则查询对应的用户
    USER.find({ username }, (err, datas) => {
      if (err === null) {
        res.send({
          datas,
        });
      } else {
        res.send({
          code: 500,
          message: "数据库内部错误",
        });
      }
    });
  }
  // 如果用户名不为空，则查询所有的用户
  else {
    USER.find({}, (err, datas) => {
      if (err === null) {
        res.send({
          datas,
        });
      } else {
        res.send({
          code: 500,
          message: "数据库内部错误",
        });
      }
    });
  }
});

// 投票
router.get("/vote", (req, res) => {
  // 当前端点击投票按钮时获取到前端发送过来的投票数，然后自加
  var { username } = req.query;
  USER.findOne({ username }, (err, datas) => {
    if (err === null) {
      // 修改数据库中vaotNum的值 -- update
      // console.log(datas); // 从数据库查到的数据集合(对象)
      // 从数据库中修改用户点击的用户的投票数
      // 每修改一次投票数（voteNum）的值就会加1
      USER.updateOne(
        { username },
        { voteNum: ++datas.voteNum },
        (err, voteNum) => {
          if (err === null) {
            // console.log("点赞成功");
            res.send({
              code: 200,
              message: "点赞成功",
              datas,
            });
          } else {
            console.log("点赞失败");
          }
        }
      );
    }
  });
});

// 我要参赛
router.get("/match", (req, res) => {
  res.render("match");
});

module.exports = router;
