// 获取后台传送的cookie
if (document.cookie.indexOf("phone") >= 0) {
  // 如果cookie里的phone存在,则把index页面中的登录换成用户名
  // 想要获取当前手机号,可以使用cookie中的phone
  // console.log(document.cookie); // phone=17692414892; id=j%3A%225f5c9c1f203b5c3b2ca5c27c%22
  // 通过 ; 切割字符串
  // console.log(document.cookie.split(";")); // ["phone=17692414892", " id=j%3A%225f5c9c1f203b5c3b2ca5c27c%22"]
  // 取第零个 -- 手机号
  // console.log(document.cookie.split(";")[0]); // phone=17692414892
  // 利用 = 切割字符串
  // console.log(document.cookie.split(";")[0].split("=")); // ["phone", "17692414892"]
  // 然后再取第一个就可以了
  var phone = document.cookie.split(";")[0].split("=")[1];
  // console.log(phone);
  // 对登录a标签进行文本替换,herf地址也换一下，可以换成个人主页
  $(".login").text(phone);
  $(".login").attr("href", "/about");
  $(".login").attr("class", "about");
  // 把注册a标签换成退出a标签
  $(".register").text("退出");
  $(".register").attr("href", "/logout");

  // 先获取到每个li的class值,这个class值是每个用户对应的手机号,需要用事件委托

  // $(".login").text =

  // about页逻辑
  $(".aboutBox").text(phone + "~ 欢迎你");
}

// 搜索逻辑
// 按用户名 -- 搜索
$(".searchButton").on("click", (event) => {
  if (document.cookie.indexOf("phone") >= 0) {
    // 如果进入到这里说明用户已登录

    // 获取到用户在搜索框输入的用户名
    var username = {
      username: $(".searchInput").val(),
    };
    // 发送ajax请求，后端会传给前端数据，让前端进行页面处理
    $.ajax("/search", {
      type: "get",
      data: username,
      success: function (response) {
        // console.log(response.datas);
        var result = response.datas;
        // console.log(result[0].username);

        if (result[0]) {
          // 如果查询到的结果不为空
          // 先把ul列表清空
          $(".userul").empty();

          // 循环遍历result
          $.each(result, (index, data) => {
            console.log(data);
            var html = `<li class="${data.username}">
            <div class="left">
              <img src="${data.picture}" alt="" />
            </div>
            <div class="center">
              <div>${data.username} | 编号# ${data.matchId}</div>
              <div>${data.slogan}</div>
            </div>
            <div class="right">
              <div class="voteNum">${data.voteNum}</div>
              <div><button>投他一票</button></div>
            </div>
          </li>`;

            // 然后再把查询到的所有数据都添加到ul列表中
            $(".userul").append(html);
          });
        } else {
          // 如果查询到的结果为空
          alert("当前没有该用户");
        }
      },
    });
    //   var username = datas
  } else {
    // 如果进入到这里说明用户未登录
    alert("请先登录！！！");
  }
});

// 投票
// 因为li标签是动态创建的，所以需要通过事件委托来获取投票按钮
$(".userul").delegate(".vote", "click", function () {
  if (document.cookie.indexOf("phone") >= 0) {
    var $this = $(this);
    var username = $this.parents("li").attr("class");
    var data = {
      username,
    };
    $.ajax("/vote", {
      type: "get",
      data,
      success: function (response) {
        // console.log(response.datas);
        if (response.code === 200) {
          // 先获取到数据库中该用户的票数
          var voteNum = response.datas.voteNum;
          // console.log(voteNum);
          // 通过 全局$this 找到voteNum元素
          var $voteNum = $this.parents(".right").children(".voteNum");
          // 然后把voteNum重新绘制到HTML页面即可
          $voteNum.text(voteNum);
        }
      },
    });
  } else {
    alert("请先登录！！！");
  }
});

// 我要参赛
// $(".myToMacth").on("click", (event) => {
//   $.ajax("/match", {
//     type: "get",
//     success: function (response) {
//       console.log(response.message);
//       // $(".match").attr("href", "/match");
//     },
//   });
// });
