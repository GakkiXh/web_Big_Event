$(function () {

    var layer = layui.layer;
    var form = layui.form;

    // 初始化富文本编辑器
    initEditor();

    initCate();
    //获取文章分类
    function initCate() {
        $.ajax({
            type: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) return layer.msg('获取文章分类失败！');
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr);
                // 调用 form.render() 方法
                form.render();
            }
        })
    }

    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    //为选择图标按钮绑定事件
    $('#btnChooseImage').on('click', function () {
        $('#coverFile').click();
    })

    // 监听 coverFile 的 change 事件，获取用户选择的文件列表
    $('#coverFile').on('change', function (e) {
        // 获取到文件的列表数组
        var files = e.target.files;
        // 判断用户是否选择了文件
        if (files.length === 0) return;
        // 根据文件，创建对应的 URL 地址
        var newImgURL = URL.createObjectURL(files[0]);
        // 为裁剪区域重新设置图片
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })

    var art_state = '已发布';
    // 为存为草稿按钮，绑定点击事件
    $('#btnSave2').on('click', function () {
        art_state = '草稿';
    })
    //为表单绑定submit事件
    $('#form-pub').on('submit', function (e) {
        e.preventDefault();
        // 基于form表单 创建FormData对象
        var fd = new FormData($(this)[0]);
        // 将文章发布状态存到formData中
        fd.append('state', art_state);
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
                // 将文件对象，存储到 fd 中
                fd.append('cover_img', blob);
                // 发起ajax请求
                publishArticle(fd);
            })
    })

    // 定义发布文章ajax请求函数
    function publishArticle(fd) {
        $.ajax({
            type: 'POST',
            url: '/my/article/add',
            data: fd,
            //向服务器提交的是 FormData 格式的数据，
            // 必须添加以下两个配置项
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.status !== 0) return layer.msg('发表文章失败！');
                layer.msg('发表文章成功！');
                // 发布文章成功后，跳转到文章列表页面
                location.href = '/article/art_list.html'
            }
        })
    }

})