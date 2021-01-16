$(function () {

    $('#link_reg').click(function () {
        $('.reg-box').show();
        $('.login-box').hide();
    })
    $('#link_login').click(function () {
        $('.login-box').show();
        $('.reg-box').hide();
    })


    var form = layui.form;
    var layer = layui.layer;
    form.verify({
        // 定义密码校验规则
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        // 定义两次密码一致规则
        repwd: function (value) {
            var pwd = $('.reg-box [name=password]').val()
            if (pwd !== value) {
                return '两次密码不一致！'
            }
        }
    })

    //监听注册表表单提交事件 发送请求
    $('#form_reg').on('submit', function (e) {
        e.preventDefault();
        var data = {
            username: $('#form_reg [name=username]').val(),
            password: $('#form_reg [name=password]').val()
        }
        $.ajax({
            type: 'POST',
            url: '/api/reguser',
            data: data,
            success: function (res) {
                if (res.status != 0) return layer.msg(res.message);
                layer.msg('注册成功，请登录！')
                // 模拟人的点击行为
                $('#link_login').click()
            }
        })
    })

    // 监听登录表单提交事件 发送请求
    $('#form_login').on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            type: 'POST',
            url: '/api/login',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status != 0) return layer.msg('登录失败！');
                layer.msg('登录成功！');
                // 将登录成功得到的 token 字符串，保存到 localStorage 中
                localStorage.setItem('token', res.token);
                // 跳转页面
                location.href = '/index.html';
            }
        })
    })

})