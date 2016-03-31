var player,
    time_update_interval = 0;

function onYouTubeIframeAPIReady() {
    player = new YT.Player('video-placeholder', {
        width: 600,
        height: 400,
        videoId: 'Xa0Q0J5tOP0',
        playerVars: {
            color: 'white',
            playlist: 'taJ60kskkns,FG0fTKAqZ5g',
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

$(document).on('click', '#power', function(){
    var new_class = $(this).attr('class') == 'off' ? 'on' : 'off' ;
    $(this).attr('class', new_class);
    if ( new_class == 'off'){
        $('#cover').show();
         player.mute();
    }
    else{
        $('.tv-icon').hide();
        $('#cover').hide();
        player.unMute();
        player.playVideo();
    }
});

$(document).on('click','#mute-toggle', function() {
    if(tv_status()){
        mute();
        $('.text-info').text(0);
    } 
});

function mute(){
 var mute_toggle = $(this);
    if(player.isMuted() && tv_status()){
        player.unMute();
        mute_toggle.text('volume_up');
        $('.wrapper').find('.fa-volume-off').hide(); 
    }
    else{
        player.mute();
        mute_toggle.text('volume_off');
        $('.wrapper').find('.fa-volume-off').show(); 
    }
}



$(document).on('click', '#volume-up', function(){
    if(tv_status()){
        player.unMute();
        var volume_level = player.getVolume()+5;
        player.setVolume(volume_level);
        volume_level = (player.getVolume()+5)/5 == 21 ? 20: (player.getVolume()+5)/5;
        show_icon('.tv-icons .fa-volume-up', volume_level);
        //$('.fa-volume-up').show();
        //$('.text-info').text(player.getVolume()/5).show();
    }
    
});

$(document).on('click', '#volume-down', function(){
    if(tv_status()){
        player.unMute();
        var volume_level = player.getVolume()-5;
        player.setVolume(volume_level);
        volume_level = (player.getVolume()-5)/5 == 0 ? 1: (player.getVolume()-5)/5;
        show_icon('.tv-icons .fa-volume-down', volume_level);
        //$('.fa-volume-down').show();
        //$('.text-info').text(player.getVolume()/5).show();
    }
});

function tv_status(){
    if($('#power').attr('class') == 'on'){
        $('.tv-icon').hide();
        $('.text-info').hide();
        return true;
    }
    return false;
}

function show_icon(class_string, value=null){
    clearTimeout($('.tv-icons').stop().data('timer'));
    $('.tv-icons').hide();
    $('.tv-icon').hide();
    $('.text-info').hide();
    //$('.delayed').removeClass('delayed');
    $(class_string).addClass('delayed');
    if(value){
        $('.text-info').text(value).show();//.addClass('delayed');//show().delay(5000).fadeOut();
    }
    $('.delayed').show();
    $('.tv-icons').show();
    $('.tv-icons').fadeIn(function() {
        var elem = $(this);
        $.data(this, 'timer', setTimeout(function() { elem.fadeOut(); }, 5000));
        //elem.removeClass('delayed');
    });
}

//http://stackoverflow.com/questions/2578628/how-to-stop-override-a-jquery-timeout-function










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

