var player, time_update_interval = 0;

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

    // Update the controls on load
    updateTimerDisplay();
    updateProgressBar();
	player.mute();
    // Clear any old interval.
    clearInterval(time_update_interval);

    // Start interval to update elapsed time display and
    // the elapsed part of the progress bar every second.
    time_update_interval = setInterval(function () {
        updateTimerDisplay();
        updateProgressBar();
    }, 1000);


    $('#volume-input').val(Math.round(player.getVolume()));
}

TV = {
    Control: {
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
        show_icon: function(class_string, value=null){
            clearTimeout($('.tv-icons').stop().data('timer'));
            $('.delayed').removeClass('delayed');
            $('.tv-icons').hide();
            //$('.tv-icon').hide();
            //$('.text-info').hide();
            $(class_string).addClass('delayed');
            if(value){
                $('.text-info').text(value).show();//.addClass('delayed');//show().delay(5000).fadeOut();
            }
            //$('.tv-icon').hide();
            $('.delayed').show();
            //$('.tv-icons').show();
            $('.tv-icons').fadeIn(function() {
                var elem = $(this);
                $.data(this, 'timer', setTimeout(function() { elem.fadeOut(); }, 5000));
                elem.removeClass('delayed');
            });
        },
        chanel_num: function(){
            return player.getPlaylistIndex()+1;
        }
    }
}



$(document).on('click', '#power', function(){
    var new_class = $(this).attr('class') == 'off' ? 'on' : 'off' ;
    $(this).attr('class', new_class);
    if ( new_class == 'off'){
        $('#cover').show();
         player.mute();
    }
    else{
        $('.tv-icons').hide();
        $('#cover').hide();
        player.unMute();
        player.playVideo();
        TV.Control.show_icon('.tv-icons .fa-sort', TV.Control.chanel_num());
    }
});

$(document).on('click','#mute-toggle', function() {
    if(TV.Control.tv_status()){
        TV.Control.mute();
        $('.text-info').text(0);
    } 
});

$(document).on('click', '#volume-up', function(){
    if(TV.Control.tv_status()){
        player.unMute();
        var volume_level = player.getVolume()+5;
        player.setVolume(volume_level);
        volume_level = (player.getVolume()+5)/5 == 21 ? 20: (player.getVolume()+5)/5;
        TV.Control.show_icon('.tv-icons .fa-volume-up', volume_level);
    }
    
});

$(document).on('click', '#volume-down', function(){
    if(TV.Control.tv_status()){
        player.unMute();
        var volume_level = player.getVolume()-5;
        player.setVolume(volume_level);
        volume_level = (player.getVolume()-5)/5 == 0 ? 1: (player.getVolume()-5)/5;
        TV.Control.show_icon('.tv-icons .fa-volume-down', volume_level);
    }
});


$(document).on('click', '#prev-chanel', function(){
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
});

$(document).on('click', '#next-chanel', function(){
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
});














// This function is called by initialize()
function updateTimerDisplay(){
    // Update current time text display.
    $('#current-time').text(formatTime( player.getCurrentTime() ));
    $('#duration').text(formatTime( player.getDuration() ));
}


// This function is called by initialize()
function updateProgressBar(){
    // Update the value of our progress bar accordingly.
    $('#progress-bar').val((player.getCurrentTime() / player.getDuration()) * 100);
}


// Progress bar

$('#progress-bar').on('mouseup touchend', function (e) {

    // Calculate the new time for the video.
    // new time in seconds = total duration in seconds * ( value of range input / 100 )
    var newTime = player.getDuration() * (e.target.value / 100);

    // Skip video to new time.
    player.seekTo(newTime);

});


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

