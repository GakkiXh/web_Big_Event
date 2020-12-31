$(function() {
    // 注册帐号链接
    $('#link_reg').on('click', function() {
        $('.login-box').hide();
        $('.reg-box').show();
    })
    // 登录帐号链接
    $('#link_login').on('click', function() {
        $('.reg-box').hide();
        $('.login-box').show();
    })

    // 从layui中获取form对象
    var form = layui.form;
    var layer = layui.layer;
    // 通过 form.verify() 函数自定义校验规则
    form.verify({
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        // 校验两次密码是否一致的规则
        repwd: function(value) {
            // 形参为确认密码框中输入的内容
            // 密码框中的内容
            var pwd = $('.reg-box [name=password]').val();
            // 判断 两次密码不一样返回提示消息
            if(pwd !== value) return '两次密码不一致！';
        }
    })

    // 监听注册表单的提交事件
    $('#form_reg').on('submit', function(e) {
        // 阻止表单默认行为
        e.preventDefault();
        var data = {
            username: $('#form_reg [name=username]').val(),
            password: $('#form_reg [name=password]').val()
        }
        // 发起Ajax的POST请求
        $.post('/api/reguser', data, function(res) {
            if(res.status !== 0) return layer.msg(res.message);
            layer.msg('注册成功，请登录！', function() {
                // 模拟人的点击行为
                $('#link_login').click();
            })
        })
    })

    // 监听登录表单的提交事件
    $('#form_login').on('submit', function(e) {
        console.log(123);
        // 阻止表单默认行为
        e.preventDefault();
        $.ajax({
            type: 'POST',
            url: '/api/login',
            // 快速获取表单中的数据
            data: $(this).serialize(),
            success: function(res) {
                console.log(res);
                if (res.status !== 0) return layer.msg('登录失败！');
                layer.msg('登录成功！', function() {
                    // 将登录成功得到的 token 字符串，保存到 localStorage 中
                    localStorage.setItem('token', res.token);
                    // 跳转到后台主页
                    location.href = '/index.html';
                })
            }
        })
    })
})