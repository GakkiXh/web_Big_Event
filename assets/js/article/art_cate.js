$(function () {

    var layer = layui.layer;
    var form = layui.form;
    initArtCateList();
    function initArtCateList() {
        $.ajax({
            type: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                var htmlStr = template('tpl-table', res);
                $('tbody').html(htmlStr);
            }
        })
    }

    //为添加类别按钮绑定事件
    var indexAdd = null;
    $('#btnAddCate').on('click', function () {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog-add').html()
        });
    })

    //通过代理形式为form-add表单绑定提交事件
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault();
        $.ajax({
            type: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) return layer.msg('新增分类失败！');
                layer.msg('新增分类成功！');
                //根据索引关闭弹出层
                layer.close(indexAdd);
                initArtCateList();
            }
        })
    })

    //通过代理形式为编辑按钮添加事件
    var indexEdit = null;
    $('tbody').on('click', '#btn-edit', function () {
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#dialog-edit').html()
        })
        var id = $(this).attr('data-id');
        $.ajax({
            type: 'GET',
            url: '/my/article/cates/' + id,
            success: function (res) {
                console.log(res);
                form.val('form-edit', res.data)
            }
        })
    })

    //通过代理形式为form-edit表单绑定提交事件
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault();
        $.ajax({
            type: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) return layer.msg('更新分类信息失败！');
                layer.msg('更新分类信息成功！');
                //根据索引关闭弹出层
                layer.close(indexEdit);
                initArtCateList();
            }
        })
    })

    //通过代理形式为删除按钮添加事件
    $('tbody').on('click', '#btn-delete', function () {
        var id = $(this).attr('data-id');
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                type: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function (res) {
                    if (res.status !== 0) return layer.msg('删除分类失败！');
                    layer.msg('删除分类成功！');
                    layer.close(index);
                    initArtCateList();
                }
            })
        })
    })

})