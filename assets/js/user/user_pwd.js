$(function () {
    var form = layui.form;
    form.verify({
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        samePwd: function (value) {
            if (value === $('[name=oldPwd]').val()) {
                return '新旧密码不能相同！';
            }
        },
        rePwd: function (value) {
            if (value !== $('[name=newPwd]').val()) {
                return '两次密码不一致！'
            }
        }
    })

    
    //发起请求修改密码
    $('.layui-form').on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            type: 'POST',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) return layui.layer.msg('更新密码失败！');
                layui.layer.msg('更新密码成功！');
                //重置表单
                $('.layui-form')[0].reset();
                // 清空本地存储中的 token
                localStorage.removeItem('token');
                // 跳转到登录页面
                window.parent.location.href = '/login.html';
            }
        })
    })
}) 