/**
 * hgallery插件
 * @author Huihan/Huihan2

 */
(function($) {
	//设置全局变量
	globeVar: {
		var picData;
		var imgHeight;
		var imgWidth;
		var pHeight;
		var showNum;
		var slideSpeed;
		var switchNum = 0;
		var ableAmount;
	}
	//插件声明
	$.fn.hGallery = function(options) {
		return this.each(function() {
			//参数拓展
			var opts = $.extend({}, $.fn.hGallery.defaults, options);
			paramsInit: {//参数初始化
				picData = opts.datasource;
				imgHeight = parseInt(opts.imgHeight);
				imgWidth = parseInt(opts.imgWidth);
				showNum = parseInt(opts.showNum);
				slideSpeed = parseInt(opts.speed);
				pHeight=parseInt(opts.pHeight);
				ableAmount = parseInt((picData.length + showNum - 1) / showNum);
			}
			elementReady: {//对要渲染的div添加完整元素
				$("head").children(":eq(0)").before("<link type='text/css' rel='stylesheet' href='" + jsPath.replace("control", "css") + "hgallery.css' />");
				var galleryHtml = "";
				galleryHtml+="<div class='h_gallery_wrap'><div class='hgallery_photo'><img src='' /></div>";
				galleryHtml += "<div class='hgallery'><span class='hg_switch hg_prev'> </span><div class='hg_items'><ul class='h_gallery_item'>";
				$.each(opts.datasource, function(idx, item) {
					galleryHtml += "<li><img src='" + item.src + "'  /></li>";
				});
				galleryHtml += "</ul></div><span class='hg_switch hg_next'> </span></div></div>";
				$(this).html(galleryHtml);
				
				//设置元素属性
				$(".h_gallery_item li:eq(0)").css("margin-left", "0px");
				$(".hgallery,.hgallery_photo,.hgallery_photo img").width(showNum * (imgWidth + 10) + 40);
				$(".hgallery_photo,.hgallery_photo img").height(pHeight);
				$(".h_gallery_item li,.h_gallery_item li img").width(imgWidth).height(imgHeight);
				$(".h_gallery_item").width(picData.length * (imgWidth + 10) - 10).height(imgHeight);
				$(".hg_items").height(imgHeight).width(showNum * (imgWidth + 10) - 10);
				$(".hg_switch").height(imgHeight);
			}
			settings: {//事件设置
				ifUseable();
				$(".hg_prev").click(function() {
					switchList("prev");
					opts.selectChanged($(".h_gallery_item li.hg_li_select"));
				});
				$(".hg_next").click(function() {
					switchList("next");
					opts.selectChanged($(".h_gallery_item li.hg_li_select"));
				});
				$(".h_gallery_item li").hover(function() {
					$(this).addClass("hg_li_hover");
					$(".hgallery_photo img").attr("src",picData[$(this).index()].src);
					changeStyle();
				}, function() {
					$(this).parent().children().removeClass("hg_li_hover");
					changeStyle();
				});
				$(".h_gallery_item li").click(function() {
					$(this).parent().children().removeClass("hg_li_select");
					$(this).addClass("hg_li_select");
					$(".hgallery_photo img").attr("src",picData[$(this).index()].src);
					changeStyle();
					//拓展的click事件
					opts.onItemSelect($(this));
				});
				$(".h_gallery_item li:eq(0)").trigger("click");
			}
		});
	}
	$.fn.hGallery.defaults = {//插件暴露的参数以及拓展事件
		imgHeight : "75",
		imgWidth : "100",
		pHeight:300,
		showNum : "6",
		speed : "1000",
		datasource : [],
		onItemSelect : function() {/*滚动项选择事件*/
		},
		selectChanged : function() {/*选择发生改变*/
		}
	}
	functions: {//相关的函数/方法
		/*
		 * 获取脚本当前路径
		 */
		var jsPath = (function() {//
			var scripts = document.getElementsByTagName("script");
			var script = scripts[scripts.length - 1];
			return script.src.substr(0, script.src.lastIndexOf("/") + 1);
		})();
		
		/*
		 * 左右点击滚动列表
		 * 有prev和next两个方向
		 */
		var switchList = function(toDire) {
			if (toDire == "prev") {
				switchNum--;
				setCurLocation();
			} else {
				switchNum++;
				setCurLocation();
			}
		}
		
		/*
		 * 改变样式。
		 * 在切换时，检测是否能再往该方向操作
		 */
		var changeStyle = function() {
			$(".h_gallery_item li").css({
				"height" : imgHeight + "px",
				"width" : imgWidth + "px",
				"border" : "none"
			}).children().css({
				"height" : imgHeight + "px",
				"width" : imgWidth + "px"
			});
			$("li.hg_li_select,li.hg_li_hover").css({
				"height" : (imgHeight - 4) + "px",
				"width" : (imgWidth - 4) + "px",
				"border" : "orange solid 2px"
			}).children().css({
				"height" : (imgHeight - 4) + "px",
				"width" : (imgWidth - 4) + "px"
			});
		}
		
		/*
		 * 判断和设置按钮状态
		 */
		var ifUseable = function() {
			var temp = switchNum;
			if ((++temp) >= ableAmount) {
				$(".hg_next").css("background", "url(images/next_btn_unable.gif) 50% 50% no-repeat");
				switchNum = ableAmount - 1;
			} else {
				$(".hg_next").css("background", "url('images/next_btn.gif') 50% 50% no-repeat");
			}
			if (--temp <= 0) {
				$(".hg_prev").css("background", "url(images/prev_btn_unable.gif) 50% 50% no-repeat");
				switchNum = 0;
			} else {
				$(".hg_prev").css("background", "url(images/prev_btn.gif) 50% 50% no-repeat");
			}
		}
		/*
		 * 设置当前的偏移量
		 */
		var setCurLocation = function(toDirection) {
			ifUseable();
			if ((switchNum < ableAmount) && (switchNum >= 0)) {
				var moveAmount = -1 * (switchNum * ($(".hg_items").width() + 10));
				$(".h_gallery_item").stop().animate({
					"left" : moveAmount + "px"
				}, slideSpeed);
			}
		}
	}
})(jQuery);
