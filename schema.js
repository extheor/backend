/* MongoDB数据库模型文件 */

// 引入mongoose插件
const mongogose = require("mongoose");

// 编号自加
/* 
  编号# 001
  编号# 002
  编号# 003
  ...
*/
var count = 0;
var matchId = {
  type: String,
  default: () =>
    ++count < 10 ? "00" + count : ++count < 100 ? "0" + count : count,
};

// 通过mongoose定义接口 Schema
var Schema = mongogose.Schema;

// 生成表结构
// 操作users表（集合） 定义一个Schema  Schema里面的对象和数据库表里面的字段需要一一对应
var mySchema = new Schema({
  // name: { type: String, default: "zhangsan" },
  id: Number,
  username: String,
  picture: {
    type: String,
    default:
      "https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=2456975006,3192848039&fm=26&gp=0.jpg",
  },
  phone: String,
  sex: Number,
  password: String,
  bio: String,
  time: Number,
  isMatch: Number,
  matchId, // 相当于 matchId: matchId
  slogan: {
    type: String,
    default: "哈哈哈哈",
  },
  voteNum: {
    type: Number,
    default: 0,
  },
});

// 把Schema导出
module.exports = mySchema;
