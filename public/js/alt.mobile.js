/* swipe up / swipe down */
(function() {
    var supportTouch = $.support.touch,
            scrollEvent = "touchmove scroll",
            touchStartEvent = supportTouch ? "touchstart" : "mousedown",
            touchStopEvent = supportTouch ? "touchend" : "mouseup",
            touchMoveEvent = supportTouch ? "touchmove" : "mousemove";
    $.event.special.swipeupdown = {
        setup: function() {
            var thisObject = this;
            var $this = $(thisObject);
            $this.bind(touchStartEvent, function(event) {
                var data = event.originalEvent.touches ?
                        event.originalEvent.touches[ 0 ] :
                        event,
                        start = {
                            time: (new Date).getTime(),
                            coords: [ data.pageX, data.pageY ],
                            origin: $(event.target)
                        },
                        stop;

                function moveHandler(event) {
                    if (!start) {
                        return;
                    }
                    var data = event.originalEvent.touches ?
                            event.originalEvent.touches[ 0 ] :
                            event;
                    stop = {
                        time: (new Date).getTime(),
                        coords: [ data.pageX, data.pageY ]
                    };

                    // prevent scrolling
                    if (Math.abs(start.coords[1] - stop.coords[1]) > 10) {
                        event.preventDefault();
                    }
                }
                $this
                        .bind(touchMoveEvent, moveHandler)
                        .one(touchStopEvent, function(event) {
                    $this.unbind(touchMoveEvent, moveHandler);
                    if (start && stop) {
                        if (stop.time - start.time < 1000 &&
                                Math.abs(start.coords[1] - stop.coords[1]) > 30 &&
                                Math.abs(start.coords[0] - stop.coords[0]) < 75) {
                            start.origin
                                    .trigger("swipeupdown")
                                    .trigger(start.coords[1] > stop.coords[1] ? "swipeup" : "swipedown");
                        }
                    }
                    start = stop = undefined;
                });
            });
        }
    };
    $.each({
        swipedown: "swipeupdown",
        swipeup: "swipeupdown"
    }, function(event, sourceEvent){
        $.event.special[event] = {
            setup: function(){
                $(this).bind(sourceEvent, $.noop);
            }
        };
    });

})();


/* author: Andrew */


var $view = $(window);

function fitOnScreen(element) {
	if($view.height()>=300) {
		element.css('height',$view.height());
		element.css('padding-bottom',$('.navbar').outerHeight());
	}
}


function stickNavbar() {
	
	if($view.scrollTop() >= $view.height() - $nav.outerHeight()){
		$nav.addClass('stick');
	}else {
		$nav.removeClass('stick');
	}
}


function servicesInit() {
	var $servicesWrap  = $('.services-wrap'),
		$strategy = $('#strategy'),
		$creative = $('#creative'),
		$technology = $('#technology'),
		$marketing = $('#marketing');


	$strategy.addClass('active');
	$creative.addClass('next');
	$technology.addClass('after-next');
	$marketing.addClass('prev');

	console.log("SERVICES!");

	$servicesWrap.swipeleft(function (){
		console.log("LEEFTY");
		servicesNext();
	});
	$servicesWrap.swiperight(function (){
		console.log('alllrighty');
		servicesPrev();
	});
}

function servicesPrev() {
	var $active = $('.services .active'),
		$next = $('.services .next'),
		$prev = $('.services .prev'),
		$afterNext = $('.services .after-next');

	$active.removeClass().addClass('next');
	$next.removeClass().addClass('after-next');
	$prev.removeClass().addClass('active');
	$afterNext.removeClass().addClass('prev');
}

function servicesNext() {
	var $active = $('.services .active'),
		$next = $('.services .next'),
		$prev = $('.services .prev'),
		$afterNext = $('.services .after-next');

	$active.removeClass().addClass('prev');
	$next.removeClass().addClass('active');
	$prev.removeClass().addClass('after-next');
	$afterNext.removeClass().addClass('next');
}

function fiveStepProcessInit() {
	var $analysis = $('#analysis'),
		$insight = $('#insight'),
		$ideate = $('#ideate'),
		$develop = $('#develop'),
		$refine = $('#refine'),
		$next = $('.stepper.next'),
		$prev = $('.stepper.prev');;

	window.fiveSteps = [$analysis,$insight,$ideate,$develop,$refine];

	$analysis.addClass('active');
	$insight.addClass('next');
	$ideate.addClass('after-next');
	$develop.addClass('before-prev');
	$refine.addClass('prev');

	$next.on('tap',function () {
		fiveStepNext();
	});
	$prev.on('tap',function () {
		fiveStepPrevious();
	});

	$('.steps-wrap').swipeleft(function () {
		fiveStepNext();
	});
	$('.steps-wrap').swiperight(function () { 
		fiveStepPrevious();
	});

}

function fiveStepNext() {
	var $active = $('.steps .active'),
		$next = $('.steps .next'),
		$prev = $('.steps .prev'),
		$afterNext = $('.steps .after-next'),
		$beforePrev = $('.steps .before-prev');

	$active.removeClass().addClass('prev');
	$next.removeClass().addClass('active');
	$prev.removeClass().addClass('before-prev');
	$afterNext.removeClass().addClass('next');
	$beforePrev.removeClass().addClass('after-next');
}

function fiveStepPrevious() {
	var $active = $('.steps .active'),
		$next = $('.steps .next'),
		$prev = $('.steps .prev'),
		$afterNext = $('.steps .after-next'),
		$beforePrev = $('.steps .before-prev');

	$active.removeClass().addClass('next');
	$next.removeClass().addClass('after-next');
	$prev.removeClass().addClass('active');
	$afterNext.removeClass().addClass('before-prev');
	$beforePrev.removeClass().addClass('prev');
}


function cycleInit() {
	var cycleOptions = {
		easing:  'easeInOutBack',
		pause: true,
		pauseOnPagerHover: true,
		pager: $('#testimonials-pager'),
		containerResize: 1,
		before: function(currSlideElement, nextSlideElement, options, forwardFlag) {
			$('.testimonials').css('height',$(nextSlideElement).outerHeight()+parseInt($('.testimonials').css('padding-bottom')));
			$('.testimonials-wrap').css('height',$(nextSlideElement).outerHeight()+parseInt($('.testimonials').css('padding-bottom')));
		},
		after: function(currSlideElement, nextSlideElement, options, forwardFlag) {
			if($view.skrollrInstance){
				$view.skrollrInstance.refresh('.testimonials-wrap');
			}
		},
		pagerAnchorBuilder: function (idx, slide) {
			return '<a href="#"></a>';
		},
		timeout: 0
	};

	$('.testimonials').cycle(cycleOptions);
}


function skrollrInit() {


	var skrollrOptions = {
		beforerender: function(data) {

			scroll();

			// handle sticky header
	        if(data.curTop >= $view.height() - $nav.outerHeight()) {
	        	$('#stick-nav').addClass('moveIn'); 
	        	//temporary hack to hide landing when scroll to bottom  
	        	$('.landing').addClass('cover');
	        }else {
	        	$('#stick-nav').removeClass('moveIn');   
	        	//temporary hack to hide landing when scroll to bottom  
	        	$('.landing').removeClass('cover');
	        }
	        
	    
	    }
	}

	var s = skrollr.init(skrollrOptions);
	$view.skrollrInstance = s;
	var skrollrMenuOptions =  {
	    //skrollr will smoothly animate to the new position using `animateTo`.
	    animate: true,

	    //The easing function to use.
	    easing: 'sqrt',

	    //Multiply your data-[offset] values so they match those set in skrollr.init
	    scale: 2,

	    //How long the animation should take in ms.
	    duration: function(currentTop, targetTop) {
	        return 500;
	    },

	}

	skrollr.menu.init(s);


	// hack to fix body shifting when focus on input/textarea or select field
	bodyShiftFix();
}

function bodyShiftFix() {
	if(_isMobile) {
		$('input,textarea,select').blur(function() {
			$('html,body').scrollTop(0);
		});
	}
}

function toggleOffCanvas() {
	if($('.main-wrap').hasClass('off-canvas')){
		$('.main-wrap').removeClass('off-canvas');
	} else {
		$('.main-wrap').addClass('off-canvas');
	}
}

function offCanvasInit() {




	$('a.offcanvas-toggle').on('tap', function () {
		toggleOffCanvas();
	});

	$('#off-canvas-nav a').on('tap', function () {
		toggleOffCanvas();
	})
}

function scroll() {

	stickNavbar();
	fitOnScreen($('.landing, .landing-placeholder'));
}

function resize() {
	fitOnScreen($('.landing, .landing-placeholder'));
}

function init() {
	$nav = $('.navbar');

	_isMobile = (/Android|iPhone|iPad|iPod|BlackBerry/i).test(navigator.userAgent || navigator.vendor || window.opera);

	fiveStepProcessInit();
	servicesInit();
	resize();
	offCanvasInit();
	cycleInit();
	skrollrInit();


	// hack to fix body shifting when focus on input/textarea or select field

	bodyShiftFix();
}	





$(document).ready(function() {
	init();
	$view.scroll(scroll);
	$view.resize(resize);
});