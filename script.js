var player;

function onYouTubeIframeAPIReady() {
    player = new YT.Player('video-placeholder', {
        width: 600,
        height: 400,
        videoId: 'Xa0Q0J5tOP0',
        playerVars: {
            color: 'white',
            playlist: 'taJ60kskkns,FG0fTKAqZ5g,vKH-rcO6PA8,wIyoTuZ9r3c,NFn_So_WWEs,y53AyAjQy9s,4Chi66oF_Tk,7o_w_Sy6bU0,ebHXNvO77yE,1fc_-tzvls0',
			controls: 0,
			showinfo: 0,
			autoplay: 0,
			modestbranding: 1
        },
        events: {
            onReady: initialize
        }
    });
}
function initialize(){
	player.mute();
    TV.Config.accept_filters();
    console.log(123);
    $('#volume-input').val(Math.round(player.getVolume()));
}

TV = {
    Control: {
        on_off: function(selector){
            var new_class = selector.attr('class') == 'off' ? 'on' : 'off' ;
            selector.attr('class', new_class);
            if ( new_class == 'off'){
                TV.Control.drop_prev_icons();
                TV.Control.clear_all();
                $('.covers').hide();
                $('#cover').show();
                //$('#video-wrapper').children().hide();
        		
                player.mute();
                TV.Sleep.clear();
            }
            else{
                $('.tv-icons').hide();
                TV.Control.clear_all();

                $('#video-placeholder').show();
                //$('#cover').hide();
                player.unMute();
                player.playVideo();
                TV.Control.show_icon('.tv-icons .fa-sort', TV.Control.chanel_num());
            }
        },
        mute: function() {
            var mute_toggle = $(this);
            if(player.isMuted() && TV.Control.tv_status()){
                player.unMute();
                mute_toggle.text('volume_up');
                $('.wrapper').find('.fa-volume-off').hide(); 
            }
            else{
                player.mute();
                mute_toggle.text('volume_off');
                $('.wrapper').find('.fa-volume-off').show(); 
            }
        },
        tv_status: function(){
            if($('#power').attr('class') == 'on'){
                $('.tv-icon').hide();
                $('.text-info').hide();
                return true;
            }
            return false;
        },
        drop_prev_icons: function(){
            clearTimeout($('.tv-icons').stop().data('timer'));
            $('.delayed').removeClass('delayed').hide();
            $('.tv-icons').hide();
        },
        show_icon: function(class_string, value=null){
            TV.Control.drop_prev_icons();
            $(class_string).addClass('delayed');
            if(value){
                $('.text-info').text(value).show();
            }
            $('.delayed').show();
            $('.tv-icons').fadeIn(function() {
                var elem = $(this);
                $.data(this, 'timer', setTimeout(function() { elem.fadeOut(); }, 5000));
                elem.removeClass('delayed');
            });
        },
        chanel_num: function(){
            return player.getPlaylistIndex()+1;
        },
        set_chanel: function(selector){
            val = $('#chanel-switcher-holder').val();
            chanel = selector.text();
            total = val+chanel;
            if(val.length==1){
                player.playVideoAt(parseInt(total)-1);
                TV.Control.show_icon('.tv-icons .fa-sort', total);
                $('#chanel-switcher-holder').val('');
            }else{
                $('#chanel-switcher-holder').val(total);
                TV.Control.show_icon('.tv-icons .fa-sort', chanel+'_');
            }
        },
        mute_toggle: function(){
            if(TV.Control.tv_status()){
                TV.Control.mute();
            } 
        },
        volume_up: function(){
             if(TV.Control.tv_status()){
                player.unMute();
                var volume_level = player.getVolume()+5;
                player.setVolume(volume_level);
                volume_level = (player.getVolume()+5)/5 == 21 ? 20: (player.getVolume()+5)/5;
                TV.Control.show_icon('.tv-icons .fa-volume-up', volume_level);
            }
        },
        volume_down: function(){
             if(TV.Control.tv_status()){
                player.unMute();
                var volume_level = player.getVolume()-5;
                player.setVolume(volume_level);
                volume_level = (player.getVolume()-5)/5 == 0 ? 1: (player.getVolume()-5)/5;
                TV.Control.show_icon('.tv-icons .fa-volume-down', volume_level);
            }
        },
        prev_chanel: function(){
            if(TV.Control.tv_status()){
                if (TV.Control.chanel_num() == 1){
                    chanel = 11
                    player.playVideoAt(10);
                }else{
                    chanel = TV.Control.chanel_num()-1;
                    player.previousVideo();
                }
                TV.Control.show_icon('.tv-icons .fa-sort', chanel);
            }
        },
        next_chanel: function(){
            if(TV.Control.tv_status()){
                if (TV.Control.chanel_num() == 11){
                    chanel = 1
                    player.playVideoAt(0);
                }else{
                    chanel = TV.Control.chanel_num()+1;
                    player.nextVideo();
                }
                TV.Control.show_icon('.tv-icons .fa-sort', chanel);
            }
        },
        sleep: function(){
            if(TV.Control.tv_status()){
                seconds = TV.Sleep.get_remaining_time() + TV.Sleep.timerStep;
                TV.Sleep.clear();
                TV.Sleep.start_timer(seconds);
                TV.Control.show_icon('.tv-icons .fa-clock-o', Math.ceil(seconds/60000));
            }
        },
        clear_all: function(){
        	$('#video-wrapper').children().hide();
        	$('.covers').hide();
        	//player.mute();
        },
      //   up: function(){
      //   	$('#frogs-area').focus();  
      //   	var e = jQuery.Event("keypress");
    		// e.keyCode = 38;                     
    		// //$('#frogs-area').trigger(e);         
      //   },
      //   down: function(){
      //   	$('#frogs-area').focus();  
      //   	var e = jQuery.Event("keypress");
    		// e.keyCode = 40;                     
    		// //$('#frogs-area').trigger(e);           
      //   },
      //   left: function(){
      //   	$('#frogs-area').focus();  
      //   	var e = jQuery.Event("keypress");
    		// e.keyCode = 37;                     
    		// //$('#frogs-area').trigger(e);               
      //   },
      //   right: function(){
      //   	$('#frogs-area').focus();       
      //   	var e = jQuery.Event("keypress");
    		// e.keyCode = 39;
    		// //$('#frogs-area').trigger(e);          
      //   },
    },
    Sleep:{
        timerStep : 300000,   // Time beetwen calls
        timerId: null,
        // This function starts the timer
        start_timer: function (seconds){
           $('#sleep-info').val(seconds).attr('data-created-at', (new Date()).getTime());
           timerId = setTimeout(TV.Sleep.event_raised, seconds);
        },

        event_raised: function (){
            console.log('was');
            if(TV.Control.tv_status()){
                TV.Control.on_off($('#power')); 
            }
            TV.Sleep.clear();
        },
        clear: function(){
           $('#sleep-info').val(0).attr('data-created-at', 0);
           clearTimeout(this.timerId); // clear timer
        },
        // Gets the number of ms remaining to execute the eventRaised Function
        get_remaining_time: function (){
            var seconds = parseInt($('#sleep-info').val());
            var created_at = parseInt($('#sleep-info').attr('data-created-at'));
            var in_time =  parseInt(seconds + created_at);
            left = in_time == 0 ? 0 : in_time - (new Date()).getTime();
            return  left;
        },
        
    },
    Settings:{
    	screen_toggle: function(){
    		if(TV.Control.tv_status()){
				$('.covers').hide();
    			$('#settings-cover').toggle();
    		}
    	},
    	browser_show: function(){
    		TV.Settings.change_mode(); 
    		//$('#settings-cover').hide();
    		TV.Control.clear_all();
    		$('#internet-placeholder').show();
    	},
    	change_mode: function(){
        	 if(TV.Control.tv_status()){
        	 	player.mute();
        	 	$('#video-placeholder').hide();
        	 }
        },
        tv_mode: function(){
 			if(TV.Control.tv_status()){
        	 	player.unMute();
        	 	$('#video-placeholder').show();
        	 }
        },
        show_file_manager: function(){
            TV.Control.clear_all();
            $('#file-manager-area').show();
        }
    },
    Apps: {
    	cover_show: function(){
    		$('.covers').hide();
    		$('#apps-cover').show();
    	},
    	play_frogs: function(){
    		TV.Control.clear_all();
            $('#frogs-area').show();
    	},
    	play_warship: function(){
    		TV.Control.clear_all();
    		$('#warship-area').show();
    	},
    },
    Config: {
        cover_show: function(){
            $('.covers').hide();
            $('#config-cover').show();
            TV.Config.show_brightness_value();
            TV.Config.show_contrast_value();
        },
        show_brightness_value: function(){
            brightness_value = TV.Config.get_filter_value(0, 'brightness_value');
            $('span.brightness-value').text(parseFloat(brightness_value));
        },
        show_contrast_value: function(){
            contrast_value = TV.Config.get_filter_value(0, "contrast_value");
            $('span.contrast-value').text(parseFloat(contrast_value));
        },
        get_filter_value: function(step, attrib){
            var filter_value = localStorage.getItem(attrib);
            if (filter_value == undefined){
                filter_value = 1; 
            }else{
                filter_value = (parseFloat(filter_value) + parseFloat(step)).toFixed(2); 
            }
            if (filter_value < 0){
                filter_value = 0;
            }else if(filter_value > 1){
                filter_value = 1;
            }
            localStorage.setItem(attrib, filter_value);
            return filter_value;
        },
        brightness_plus: function(){
           brightness_value = TV.Config.get_filter_value(0.1, 'brightness_value');
           $('#video-placeholder').css('-webkit-filter', 'brightness('+brightness_value+')');
           TV.Config.show_brightness_value();
        },
        brightness_minus: function(){
            brightness_value = TV.Config.get_filter_value(-0.1, 'brightness_value');
            $('#video-placeholder').css('-webkit-filter', 'brightness('+brightness_value+')');
            TV.Config.show_brightness_value();
        },
        contrast_plus: function(){
            contrast_value = TV.Config.get_filter_value(0.1, "contrast_value");
            $('#video-placeholder').css('-webkit-filter', 'contrast('+contrast_value+')');
            TV.Config.show_contrast_value();
        },
        contrast_minus: function(){
            contrast_value = TV.Config.get_filter_value(-0.1, "contrast_value");
            $('#video-placeholder').css('-webkit-filter', 'contrast('+contrast_value+')');
            TV.Config.show_contrast_value();
        },
        accept_filters: function(){
            brightness_value = TV.Config.get_filter_value(0, 'brightness_value');
            $('#video-placeholder').css('-webkit-filter', 'brightness('+brightness_value+')');
            contrast_value = TV.Config.get_filter_value(0, "contrast_value");
            $('#video-placeholder').css('-webkit-filter', 'contrast('+contrast_value+')');
        }
        
    }

}


$(document).on('click', '#power', function(){
    TV.Control.on_off($(this));
});

$(document).on('click','#mute-toggle', function() {
    TV.Control.mute_toggle();
});

$(document).on('click', '#volume-up', function(){
    TV.Control.volume_up();
});

$(document).on('click', '#volume-down', function(){
    TV.Control.volume_down();
});

$(document).on('click', '#prev-chanel', function(){
   TV.Control.prev_chanel();
});

$(document).on('click', '#next-chanel', function(){
    TV.Control.next_chanel();
});

$(document).on('click', '.chanel-switcher', function(){
   TV.Control.set_chanel($(this));
});

$(document).on('click', '#sleep', function(){
   TV.Control.sleep();
});

$(document).on('click', '#settings', function(){
   TV.Settings.screen_toggle();
});

$(document).on('click', '.fa-internet-explorer', function(){
   TV.Settings.browser_show();
});

$(document).on('click', '.fa-television', function(){
	$('#settings-cover').hide();
	$('#video-wrapper').children().hide();
	TV.Settings.tv_mode();
});

$(document).on('click', '.fa-gamepad', function(){
   TV.Apps.cover_show();
});

$(document).on('click', '.fa-gitlab', function(){
   TV.Apps.play_frogs();
});

$(document).on('click', '.fa-ship', function(){
   TV.Apps.play_warship();
});

$(document).on('click', '.fa-files-o', function(){
   TV.Settings.show_file_manager();
});

$(document).on('click', '.fa-sliders', function(){
   TV.Config.cover_show();
});

$(document).on('click', '.fa-plus-circle.contrast', function(){
   TV.Config.contrast_plus();
});

$(document).on('click', '.fa-minus-circle.contrast', function(){
   TV.Config.contrast_minus();
});

$(document).on('click', '.fa-plus-circle.brightness', function(){
   TV.Config.brightness_plus();
});

$(document).on('click', '.fa-minus-circle.brightness', function(){
    TV.Config.brightness_minus();
});



// $(document).on('click', '#up, #down, #left, #right', function(){
// 	var func = $(this).attr('id');
// 	TV.Control[func]();
// });












// Playback

$('#play').on('click', function () {
    player.playVideo();
});


$('#pause').on('click', function () {
    player.pauseVideo();
});


// Sound volume






// Other options


$('#speed').on('change', function () {
    player.setPlaybackRate($(this).val());
});

$('#quality').on('change', function () {
    player.setPlaybackQuality($(this).val());
});


// Playlist

$('#next').on('click', function () {
    player.nextVideo()
});

$('#prev').on('click', function () {
    player.previousVideo()
});


// Load video

$('.thumbnail').on('click', function () {

    var url = $(this).attr('data-video-id');

    player.cueVideoById(url);

});


// Helper Functions

function formatTime(time){
    time = Math.round(time);

    var minutes = Math.floor(time / 60),
        seconds = time - minutes * 60;

    seconds = seconds < 10 ? '0' + seconds : seconds;

    return minutes + ":" + seconds;
}


$('pre code').each(function(i, block) {
    hljs.highlightBlock(block);
});


//Disable right click
var message="";
function clickIE() {
    if (document.all) {
        (message);return false;
    }
}
function clickNS(e) {
    if (document.layers||(document.getElementById&&!document.all)) {
        if (e.which==2) {
            (message);
            return false;
        }
    }
}
if (document.layers) {
    document.captureEvents(Event.MOUSEDOWN);
    document.onmousedown=clickNS;
}else{
    document.onmouseup=clickNS;
    document.oncontextmenu=clickIE;
}
document.oncontextmenu=new Function("return false")