/* Javascript for VoiceRecognzer Xblock. */
function VoiceRecognzerXBlock(runtime, element) {
    var clear, working, speech, final_transcript = "";
    $(document).ready(function(){
    
     $("#start-vsr",element).click(function(){
            try{
                if(typeof(speech) === 'undefined'){
                    initialize();    
                }
                speech.start();
                $(this).hide();
                svr_start();
                $(".btn-vsr",element).show();
            }catch(e){
                console.log('Error');
            }
        });

      $("#start-vsr-assesment",element).click(function(){
            try{
                final_transcript = "";
                $("#labnol",element).html(format(capitalize(final_transcript)));
                if(typeof(speech) === 'undefined'){
                    initialize();    
                }
                speech.start();
                $(this).hide();
                svr_start();
                $(".btn-vsr",element).show();
            }catch(e){
                console.log('Error');
            }
        });
     $("#stop-vsr",element).click(function(){
            try{
                speech.stop();
                $(this).hide();
                svr_stop();
                $("#start-vsr",element).show();
                $("#start-vsr-assesment",element).show();
            }catch(e){
                console.log('Error');
            }
      });

      $("#submit-vsr",element).click(function(){
            try{
                speech.stop();
                $(this).hide();
                svr_stop();
                $("#start-vsr-assesment",element).show();
                post_data = {
                    data : final_transcript
                }
                if(final_transcript!=''){
                  var handlerUrl = runtime.handlerUrl(element, 'check_voice');
                  $('.xblock-editor-error-message', element).html();
                  $('.xblock-editor-error-message', element).css('display', 'none');
                  $.post(handlerUrl, JSON.stringify(post_data)).done(function(response) {
                      if (response.status === 'success') {
                          if(response.remaining_attempts != -1){
                            $("#rem-attempts",element).html(response.remaining_attempts);

                            if(response.submit == false)
                            {
                              $("#labnol",element).append('&nbsp;&nbsp;<i class="fa fa-times fa-2" style="margin-top: 6px;color:red;font-style: normal;"></i> &nbsp;You have spoken wrong words.');
                            }else{
                              $("#labnol",element).append('&nbsp;&nbsp;<i class="fa fa-check fa-2" style="margin-top: 6px;color:green;font-style: normal;"></i> &nbsp;You have spoken correct words.');
                              $("#messages",element).remove();
                            }
                            if(response.remaining_attempts==0){
                              $("#messages",element).remove();
                            }
                          }
                      } else {
                          $('.xblock-editor-error-message', element).html('Error: '+response.message);
                          $('.xblock-editor-error-message', element).css('display', 'block');
                      }
                  });
                }
            }catch(e){
                console.log('Error');
            }
      });

      $("#clare-vsr",element).click(function(){
        final_transcript = "";
        $("#labnol",element).html(format(capitalize(final_transcript)));
      });
    });

    function initialize() {
      speech = new webkitSpeechRecognition();
      speech.continuous = true;
      speech.maxAlternatives = 5;
      speech.interimResults = true;
      speech.lang = $("#lang",element).val();
      speech.onresult = function(e) {
            var interim_transcript = '';
            if (typeof(e.results) == 'undefined') {
              reset();
              return;
            }
            for (var i = e.resultIndex; i < e.results.length; ++i) {
              var val = e.results[i][0].transcript;
              if (e.results[i].isFinal) {
                final_transcript += " " + val;
              } else {
                interim_transcript += " " + val;
              }
            }
            $("#labnol",element).html(format(capitalize(final_transcript)));
            $("#notfinal",element).html(format(interim_transcript));
        }
    }
    function svr_stop() {
      console.log("stopped");
      working = false;
      $(".svr-status").hide();
    }
    function svr_start() {
      working = true;
      $(".svr-status").show();
    }

    function format(s) {
      return s.replace(/\n/g, '<br>');
    }

    function capitalize(s) {
      return s.replace(/\S/, function(m) {
        return m.toUpperCase();
      });
    }

}
