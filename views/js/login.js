$("form").on("submit", (event) => {
  // 阻止默认行为
  event.preventDefault();

  // 表单序列化
  var data = $("form").serializeArray();
  // 然后发送Ajax请求，来向后端发送数据
  /*
   * response - 后端成功发送数据，前端成功接收到响应
   */
  $.ajax("/login", {
    type: "post",
    data,
    success: function (response) {
      if (response.code === 200) {
        window.location = "/index";
      }
      console.log(response.message);
    },
  });
});
