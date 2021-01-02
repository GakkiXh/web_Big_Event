$(function() {
    var form = layui.form;
    form.verify({
        nickname: function(value) {
            if(value.length >= 6) return '昵称长度必须在 1 ~ 6 个字符之间！';
        }
    }) 
    initUserInfo();
    //初始化用户基本信息
    function initUserInfo() {
        $.ajax({
            type: "GET",
            url: '/my/userinfo',
            success: function (res) {
                if (res.status !== 0) return layui.layer.msg('获取用户信息失败！');
                //调用form.val() 快速赋值
                form.val('formUserInfo', res.data);
            }
        })
    }
    //重置表单数据
    $('#btnReset').on('click', function(e) {
        e.preventDefault();
        initUserInfo();
    })
    //更新用户信息
    $('.layui-form').on('submit', function(e) {
        e.preventDefault();
        $.ajax({
            type: "POST",
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) return layui.layer.msg('更新用户信息失败！');
                layui.layer.msg('更新用户信息成功！');
                // 调用父页面中的方法，重新渲染用户的头像和用户的信息
                window.parent.getUserInfo();
            }
        })
    })
})