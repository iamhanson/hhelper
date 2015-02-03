/**
 * @author huihan huihan2
 * @email 237905173@qq.com 
 */
(function($) { 
	globelVar: {
		var loc = parseInt(0);
		var imgInfo = [];
		var hwidth = 500;
		var hheight = 300;
		var slideSpeed;
		}
	//滚动图片插件
	$.fn.hSlider = function(options) {
		//参数拓展
		var opts = $.extend({}, $.fn.hSlider.defaults, options);

		//参数初始化
		paramsInit: {
			imgInfo = opts.datasource;
			hwidth = parseInt(opts.width);
			hheight = parseInt(opts.height);
			slideSpeed = parseInt(opts.speed);
		}

		//对要渲染的div添加完整元素
		elementReady:{
			$("head").children(":eq(0)").before("<link type='text/css' rel='stylesheet' href='" + jsPath.replace("control","css") + "hslider.css' />");
			var htmlStr = "<div class='h_pic_slide'>";
			htmlStr += "<ul id='h_pictures' class='h_pictures'><li><a href='javascript:void(0)' target='_blank'><img src='' /></a></li><li><a href='javascript:void(0)'  target='_blank'><img src='' /></a></li></ul>"
			htmlStr += "</div>";
			htmlStr += "<div id='h_switcher' class='h_switcher'><ul id='h_curlocation' class='h_curlocation'></ul><div class='title'>ddddddddd</div></div>";
			$(this).html(htmlStr);
			//样式适应
			$(this).css({
				"height" : hheight + "px",
				"width" : hwidth + "px"
			});
			$(".h_pictures").css({
				"height" : hheight + "px",
				"width" : hwidth * 2 + "px"
			});
			$(".h_pictures img").css({
				"height" : hheight + "px",
				"width" : hwidth + "px"
			});
			$(".h_curlocation").width(hwidth - 200);
			$(".h_switcher").width(hwidth);
			//加载数字指示器(导航器)
			var sLi = "";
			for (var i = opts.datasource.length; i > 0; i--) {
				sLi += "<li>" + i + "</li>";
			}
			$("#h_curlocation").html(sLi);
			//因为是向左浮动，所以最后一个就是第一个，页面初始加载第一个
			$("#h_curlocation>li:last").addClass("h_switch_on_cur");
		}

		$(".title").text(imgInfo[0].title);
		var myInterval = setInterval(slide, slideSpeed);
		//鼠标hover事件
		$("#h_curlocation>li").hover(function() {
			$("#h_pictures").css("margin-left", "0px");
			clearInterval(myInterval);
			toCur($(this).text());
		}, function() {
			myInterval = setInterval(slide, slideSpeed);
		});
		setLiElement($("#h_pictures").children(":eq(0)"), getLoc(loc));
		setLiElement($("#h_pictures").children(":eq(1)"), getLoc(++loc));
	}
	$.fn.hSlider.defaults = {//默认参数设置
		height : "300",
		width : "500",
		speed : "6000",
		datasource : []
	}
	functionss:{//相关的函数/方法
		var jsPath = (function() {
			var scripts = document.getElementsByTagName("script");
			var script = scripts[scripts.length - 1];
			return script.src.substr(0, script.src.lastIndexOf("/") + 1);
		})();
		//返回合理的 位置索引（loc不断的++会造成loc超过实际大小）
		var getLoc = function(cur) {
			return loc = cur >= imgInfo.length ? cur % imgInfo.length : cur;
		}
		//图片滚动函数
		var slide = function() {
			setCur();
			$("#h_pictures").stop().animate({
				"margin-left" : -1 * parseInt(hwidth) + "px"
			}, 500, function() {
				$("#h_pictures").css("margin-left", "0px");
				var $firstHtml = $("#h_pictures").children(":eq(0)");
				$firstHtml.before($firstHtml.next());
				setLiElement($firstHtml, getLoc(++loc));
			});
		}
		//设置当前位置的序号提示
		var setCur = function() {
			var temp = imgInfo.length - 1;
			$(".title").text(imgInfo[loc].title);
			$("#h_curlocation>li").removeClass("h_switch_on_cur");
			$("#h_curlocation>li:eq(" + (temp - loc) + ")").addClass("h_switch_on_cur");
		}
		//跳到指定的图片
		var toCur = function(location) {
			loc = location - 1;
			setLiElement($("#h_pictures").children(":eq(1)"), loc);
			slide();
		}
		//设定每个元素的url等内容
		var setLiElement = function(selecctor, which) {
			selecctor.children().attr("href", imgInfo[which].url)
			selecctor.children().attr("title", imgInfo[which].title)
			selecctor.children().children().attr("src", imgInfo[which].src);
		}
	}

})(jQuery);
