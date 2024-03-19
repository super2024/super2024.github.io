$(function () {
    Request = {
        QueryString: function (item) {
            var svalue = location.search.match(new RegExp("[\?\&]" + item + "=([^\&]*)(\&?)", "i"));

            return svalue ? svalue[1] : svalue;
        }
    };

    var tinyUrl = Request.QueryString("tinyUrl");
    var token = Request.QueryString("token");


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

    $.ajax({
        type: 'POST',
        url: "//u.3wt.cn/mkhome/app/file/content",
        data: {
            "tinyUrl": tinyUrl,
            "token":token
        },
        async: false,
        dataType: "json",
        cache: true,
        success: function (resdata) {
                if (resdata.code !== 200) {
                    tips.error("文件内容获取失败，请您检查网络后重试!");
                    return;
                }
                var data = resdata.result;
                if ($.trim(data.dwzFile.fileName) != "" && data.dwzFile.fileName != null) {
                    $("#fileName").html(data.dwzFile.fileName);
                }

                if ($.trim(data.dwzFile.fileSize) != "" && data.dwzFile.fileSize != null) {
                    $("#fileSize").html(data.dwzFile.fileSize);
                }

                if ($.trim(data.dwzFile.longUrl) != "" && data.dwzFile.longUrl != null) {
                    $("#download_file").attr("href", data.dwzFile.longUrl);
                    $("#download_file").attr("download", data.dwzFile.fileName);

                    // $("#download_file").attr("logurl", data.dwzFile.longUrl);
                    // $("#download_file").attr("download-name", data.dwzFile.fileName);
                }

                if ($.trim(data.dwzFile.fileCover) != "" && data.dwzFile.fileCover != null) {
                    $("#filecover").attr("src",data.dwzFile.fileCover);
                }else {
                    $("#filecover").attr("src","//static.3wt.cn/static/3wt.cn/images/icon-file.png");
                }

                if (($.trim(data.dwzFile.fileDetails) == "" || data.dwzFile.fileDetails == null)
                    &&($.trim(data.dwzFile.fileUrlJump) == "" || data.dwzFile.fileUrlJump == null)
                    &&($.trim(data.dwzFile.fileUrlName) == "" || data.dwzFile.fileUrlName == null)){
                    $(".introduce-content").css({
                        'width':'0px',
                        'height':'0px',
                        'overflow':'hidden'
                    })
                    $(".make-call").css({
                        'width':'0px',
                        'height':'0px',
                        'overflow':'hidden'
                    })
                }
                if ($.trim(data.dwzFile.fileDetails) != "" && data.dwzFile.fileDetails != null) {
                    $("#filedetails").html(data.dwzFile.fileDetails);
                    $("#filedetails").show();
                }

                if ($.trim(data.dwzFile.fileUrlJump) != "" && data.dwzFile.fileUrlJump != null && $.trim(data.dwzFile.fileUrlName) != "" && data.dwzFile.fileUrlName != null) {
                    $("#filejumpurl").attr("href",data.dwzFile.fileUrlJump);
                    $("#fileurlName").html(data.dwzFile.fileUrlName);
                    $("#filejumpurl").show();
                }else if ($.trim(data.dwzFile.fileUrlJump) != "" && data.dwzFile.fileUrlJump != null && ($.trim(data.dwzFile.fileUrlName) == "" || data.dwzFile.fileUrlName == null)){
                    $("#filejumpurl").attr("href",data.dwzFile.fileUrlJump);
                    $("#fileurlName").html("点击了解更多");
                    $("#filejumpurl").show();
                }

                if ($.trim(data.dwzFile.account) != "" && data.dwzFile.account != null) {
                    $("#account").attr("href","tel:" + data.dwzFile.account);
                    $("#account").html("拨打电话");
                    $("#account").show();
                }

                if ($.trim(tinyUrl) != "") {
                    $(".download-dwz").html("http://"+data.dwzFile.domain+"/"+tinyUrl);
                }

                if ($.trim(data.dwzName) != "" && data.dwzName != null) {
                    $('title').html(data.dwzName);
                } else {
                    document.title = '\u200E'
                }

                //底部logo
                if (data.logoShow == '0'){
                    $("#logoTips").show();
                }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            tips.error("文件内容获取失败，请您检查网络后重试!");
        }
    });

    //判断是不是微信环境打开
    var wx= (function(){
            return navigator.userAgent.toLowerCase().indexOf('micromessenger') !== -1
        }
    )();
    if(wx) {
        $("#download_file").removeAttr("href");
        $("#download_file").removeAttr("download");
        //打开浮窗
        $('#download_file').click(function () {
            $('.download-tips').show()
        })
        $('.download-tips .close').click(function () {
            $('.download-tips').hide()
        })
        // 复制
        var clipboard = new ClipboardJS('.download-content button', {
            target: function (trigger) {
                $('.base-info').stop().animate({
                    'right': '-344px'
                })
                return $(trigger).prev()[0]
            }
        })
        clipboard.on('success', function (e) {
            tips.success('链接已复制到剪切板');
        });
        clipboard.on('error', function (e) {
            tips.error('自动复制失败，请重新复制或手动复制');
        });

    }
    // $('#download_file').click(function() {
    //     var url = $(this).attr("logurl");
    //     var downloadName = $(this).attr("download-name");
    //     if (downloadName == null || downloadName == ""){
    //         downloadName = url.substring(url.lastIndexOf("/") + 1)
    //     }else {
    //         downloadName += url.substring(url.lastIndexOf("."))
    //     }
    //     saveAs(url, downloadName);
    //     // var xhr = new XMLHttpRequest();
    //     // xhr.open('get', url, true);
    //     // xhr.responseType = "blob";
    //     // xhr.onload = function () {
    //     //     if (this.status === 200) {
    //     //         var blob = this.response;
    //     //         var href = window.URL.createObjectURL(blob);  // 创建下载链接
    //     //         // 判断是否是IE浏览器，是则返回true
    //     //         if (window.navigator.msSaveBlob) {
    //     //             try {
    //     //                 window.navigator.msSaveBlob(blob, downloadName)
    //     //             } catch (e) {
    //     //                 console.log(e);
    //     //             }
    //     //         } else {
    //     //             // 非IE浏览器，创建a标签，添加download属性下载
    //     //             var a = document.createElement('a');  // 创建下载链接
    //     //             a.href = href;
    //     //             a.target = '_blank';  // 新开页下载
    //     //             a.download = downloadName; // 下载文件名
    //     //             document.body.appendChild(a);  // 添加dom元素
    //     //             a.click();  //  点击下载
    //     //             document.body.removeChild(a); // 下载后移除元素
    //     //             window.URL.revokeObjectURL(href); // 下载后释放blob对象
    //     //         }
    //     //     }
    //     // }
    //     // xhr.send()
    // })
})

