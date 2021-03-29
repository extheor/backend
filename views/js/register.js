// 当提交表单时触发
$("form").on("submit", (event) => {
  // 阻止默认行为
  event.preventDefault();
  //   console.log($("form")[0]);
  /*
    serialize()  FormData  serializeArray()都是序列化表单，实现表单的异步提交
    但是serialize()和serializeArray()都是只能序列化表单中的数据，比如input  select等的数据，
    但是对于文件上传就只能用 FormData。
  */
  var data = new FormData($("form")[0]);

  /*
   * response - 后端成功发送数据，前端成功接收到响应
   */
  $.ajax("/register", {
    type: "post",
    data,
    dataType: "json",
    // (默认: "application/x-www-form-urlencoded") 发送信息至服务器时内容编码类型。默认值适合大多数情况。如果你明确地传递了一个content-type给 $.ajax() 那么他必定会发送给服务器（即使没有数据要发送）
    contentType: false,
    // processData 默认为true，当设置为true的时候,jquery ajax 提交的时候不会序列化 data，而是直接使用data
    processData: false,
    success: function (response) {
      if (response.code == "200") {
        window.location = "/index";
      }
    },
  });
});
