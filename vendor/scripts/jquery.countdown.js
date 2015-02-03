(function ($) {
    function configuration(settings) {
        return $.extend({
            seconds:60,
            tick:function (timer, formatted_time) {
            },
            format:'mm:ss',
            reset:false,
            show_in_title:false,
            origin_title:undefined,
            buzzer:function () {
            }
        }, settings);
    }

    $.fn.extend({
        pauseResumeTimer:function(settings) {
          if (localStorage['jquery.countdown.paused_at'] === undefined) {
            var ended_at = localStorage['jquery.countdown.ended_at'];
            var millis_left = parseInt(ended_at) - new Date().getTime();
            localStorage['jquery.countdown.paused_at'] = millis_left;
            localStorage.removeItem('jquery.countdown.ended_at');
          } else {
            var paused_at = localStorage['jquery.countdown.paused_at'];
            //var ended_at = new Date().getTime() + (parseInt(paused_at) * 1000);
            var ended_at = new Date().getTime() + parseInt(paused_at);
            localStorage['jquery.countdown.ended_at'] = ended_at;
            localStorage.removeItem('jquery.countdown.paused_at');
            $(this).startTimer();
          }
        },
       startTimer:function (settings) {
            var timer = $(this);
            var settings = configuration(settings);
            var origin_title = document.title;

            return this.each(function () {
                if (localStorage['jquery.countdown.ended_at'] === undefined || settings.reset) {
                    localStorage['jquery.countdown.ended_at'] = new Date().getTime() + settings.seconds * 1000;
                }
                var tick = function () {
                    var ended_at = localStorage['jquery.countdown.ended_at'];
                    var current_time = parseInt(ended_at) - new Date().getTime();

                    if (current_time < 0 || isNaN(current_time)) {
                        timer.clearTimer();

                        // when not called clearTimer externally
                        if (ended_at !== undefined) {
                            settings.buzzer();
                        }
                        if (settings.show_in_title) {
                            document.title = origin_title;
                        }

                        return false;
                    } else {
                        // var formatted_time = new Date(current_time).toString(settings.format);
                        var formatted_time = moment(current_time).format(settings.format);
                        timer.text(formatted_time);
                        if (settings.show_in_title) {
                            document.title = formatted_time;
                        }

                        return true;
                    }
                };

                if (tick()) {
                    var interval = setInterval(function () {
                        if (!tick()) {
                            clearInterval(interval);
                        }
                    }, 1000);
                }
            });
        },
        clearTimer:function () {
            localStorage.removeItem('jquery.countdown.ended_at');
        }
    });
})(jQuery);

