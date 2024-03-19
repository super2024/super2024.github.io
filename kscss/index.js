$(function () {
    $('.nav-user').hover(function () {
        $(this).children('.nav-list').toggle()
    })
    $('.nav-item').each(function (index, item) {
        var that = this;
        $(item).children('.nav-title').click(function () {
            $(that).children('dl').toggle();
            $(that).find('.nav-right-icon').toggleClass('icon-up');
        })
    });
    // 关闭右侧
    $('.close-right').click(function () {
        $(this).parents('.base-info').stop().animate({
            'right': '-344px'
        });
    })
    // 二维码
    $tinyUrlQRCode = $('#tinyUrlQRCode'); // 二维码容器
    function showTinyUrlAndQRCode(tinyUrl) {
        var canvas = $tinyUrlQRCode.qrcode(tinyUrl).find('canvas').hide()[0];
        var src = canvas.toDataURL('image/jpg');
        var index = tinyUrl.lastIndexOf('/') + 1;

        $("#download").attr("href", src).attr('download', 'QRCode-' + tinyUrl.substring(index) + '.png');
        $tinyUrlQRCode.html('<img src="' + src + '">');
    };
    window.showTinyUrlAndQRCode = showTinyUrlAndQRCode;

    // 全选
    $('#checkAll').click(function () {
        var inputs = $('.url-list input');
        if (this.checked) {
            for (let i = 0; i < inputs.length; i++) {
                inputs[i].checked = true;
            }
            ;
        } else {
            for (let i = 0; i < inputs.length; i++) {
                inputs[i].checked = false;
            }
            ;
        }
        ;
        checkAll();
    });
    $('.url-list input').click(function () {
        checkAll();
    });
    /* 提示框配置 */
    var timeOut = 2000;
    toastr.options = {
        positionClass: "toast-top-center"
    };
    window.tips = {
        success: function (text, time) {
            var t = time == undefined ? t = timeOut : t = time;
            toastr.options.timeOut = t;
            toastr.remove();
            toastr.success(text);
        },
        warning: function (text, time) {
            var t = time == undefined ? t = timeOut : t = time;
            toastr.options.timeOut = t;
            toastr.remove();
            toastr.warning(text);
        },
        error: function (text, time) {
            var t = time == undefined ? t = timeOut : t = time;
            toastr.options.timeOut = t;
            toastr.remove();
            toastr.error(text);
        }
    };
    // 复制
    var clipboard = new ClipboardJS('.list-name .copy,.copy-btn,.copy_qrurl', {
        target: function (trigger) {
            $('.base-info').stop().animate({
                'right': '-344px'
            })
            return $(trigger).prev()[0]
        }
    })
    clipboard.on('success', function (e) {
        tips.success('已复制到剪贴板');
    });
    clipboard.on('error', function (e) {
        tips.error('自动复制失败，请重新复制或手动复制');
    });


    // 复制
    var clipboard = new ClipboardJS('.copy-btn-token', {
        target: function (trigger) {
            $('.base-info').stop().animate({
                'right': '-344px'
            })
            return $(trigger).prev()[0]
        }
    })
    clipboard.on('success', function (e) {
        tips.success('key已复制到剪贴板');
    });
    clipboard.on('error', function (e) {
        tips.error('自动复制失败，请重新复制或手动复制');
    });


    // 右侧信息复制
    var clipboard = new ClipboardJS('.info-url .copy', {
        target: function (trigger) {
            return $(trigger).prev()[0]
        }
    });
    clipboard.on('success', function (e) {
        tips.success('已复制到剪贴板');
    });
    clipboard.on('error', function (e) {
        tips.error('自动复制失败，请重新复制或手动复制');
    });

    // 淘宝客 ，常见问题显示
    $('.qs-info').click(function () {
        $(this).children('.icon-down').toggleClass('icon-up');
        $(this).siblings('.qs-answer').slideToggle(300);
        $(this).sibling().show();
    })
    /*// 显示示例图
    $('.show-demo').click(function () {
        $(this).parent().siblings().show();
    })*/


    clear('.cps-input');


    /* 批量缩短清除按钮控制 */
    $('.batchShortInput').keyup(function () {
        if ($(this).val() == '') {
            $('.batch-clear-btn').hide();
        } else {
            $('.batch-clear-btn').show();
        }
        ;
    });
    $('.batch-clear-btn').click(function () {
        $('.batchShortInput').val("").focus();
        $('.batch-clear-btn').hide();
    });
    // 改变颜色
    var blue = localStorage.getItem('blue')
    if (blue) {
        var changeCss = '<link rel="stylesheet" href="https://static.3w.cn/static/home-3wcn/css/blueStyle.css?v=0.1" class="blue-css">';
        $('head').append(changeCss);
        $('.change-color').addClass('active')
    }
    $('.change-color').click(function () {
        changeColor()
    })

    // buy 用户购买页面套餐选择
    $('.select-box').change(function (e) {
        var txt = $(this).find("option:selected").text()
        if ($(this).find("option:selected").index() == 0) {
            // 显示页面传递过来的版本
            $('.buy-name').text('用户之前选择的套餐');
            return false;
        }
        $('.buy-name').text(txt);
    })

    //引导开通VIP弹窗关闭
    $('.icon-close').click(function () {
        $(this).parents('.flex-mask').hide();
    })
})

/* 淘宝客清空input */
function clear(el) {
    $(el).each(function (index, v) {
        $(v).keyup(function () {
            if ($(this).val() == '') {
                $(this).next().hide();
                $('.cps-btn').removeClass('active')
            } else {
                $(this).next().show();
            }
            ;
        });
        $(v).next().click(function () {
            $(v).val("").focus();
            $(v).next().hide();
            $('.cps-btn').removeClass('active')
        });
    })
}

function checkAll() {
    var inputs = $('.url-list input').length;
    var inputsChecked = $('.url-list input:checked').length;

    if (inputs == inputsChecked) {
        $('#checkAll')[0].checked = true;
    } else {
        $('#checkAll')[0].checked = false;
    }
    ;
}

function changeColor() {
    var blue = localStorage.getItem('blue')
    if (blue) {
        $('.blue-css').remove()
        localStorage.removeItem('blue')
        $('.change-color').removeClass('active')
    } else {
        var changeCss = '<link rel="stylesheet" href="https://static.3w.cn/static/home-3wcn/css/blueStyle.css?v=0.1" class="blue-css">';
        $('head').append(changeCss);
        localStorage.setItem('blue', true)
        $('.change-color').addClass('active')
    }
}


/* 回到顶部控制 */
var $returnTopBtn = $('.right-tool .return-top-btn');
var topTag = [0, 0];

function returnTopControl() {
    $(window).scrollTop() > 700 ? topTag[0] = 1 : topTag[0] = 0;
    if (topTag[0] == 1 && topTag[1] == 0) {
        $returnTopBtn.css({
            visibility: 'visible',
            opacity: '1'
        });
        topTag[1] = 1;
    }
    ;
    if (topTag[0] == 0 && topTag[1] == 1) {
        $returnTopBtn.css({
            visibility: 'hidden',
            opacity: '0'
        });
        topTag[1] = 0;
    }
    ;
};
returnTopControl();
$(window).scroll(function (event) {
    returnTopControl()
});
$returnTopBtn.click(function () {
    $('body,html').animate({
        scrollTop: 0
    }, 800);
    return false;
});


/* 右侧客服显示控制 */
$('.kefu-tool li').hover(
    function () {
        $(this).find('.kf-item').show();
    },
    function () {
        $(this).find('.kf-item').hide();
    }
);
