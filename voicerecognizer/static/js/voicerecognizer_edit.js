/* Javascript for Voice Recognzer Xblock. */
function VoiceRecognzerEditXBlock(runtime, element) {

    $(element).ready(function(){
        mode = $("#h-mode",element).val();
        lang = $("#h-lang",element).val();
        if(mode==="assesment"){
            $(".mode-data",element).show();
        }
        $('#mode option',element).prop('selected', false)
                   .filter('[value="'+mode+'"]')
                   .prop('selected', true);
        $('#lang option',element).prop('selected', false)
                   .filter('[value="'+lang+'"]')
                   .prop('selected', true);
    });

    this.save = function ()  {
        var data = {
            'display_name':$('#display_name',element).val(),
            'lang':$("#lang option:selected",element).val(),
            'mode':$("#mode option:selected",element).val(),
            'data':$("#rsv-data",element).val(),
            'waight':$("#rsv-waight",element).val(),
            'max_attempts':$("#max-attempts",element).val(),
        };
        var handlerUrl = runtime.handlerUrl(element, 'studio_submit');
        $('.xblock-editor-error-message', element).html();
        $('.xblock-editor-error-message', element).css('display', 'none');
        $.post(handlerUrl, JSON.stringify(data)).done(function(response) {
            if (response.status === 'success') {
                window.location.reload(false);
            } else {
                $('.xblock-editor-error-message', element).html('Error: '+response.message);
                $('.xblock-editor-error-message', element).css('display', 'block');
            }
        });
    }
    $("#mode",element).change(function(){
        if($("#mode option:selected",element).val() === "assesment"){
            $(".mode-data",element).show();
        }else{
            $(".mode-data",element).hide();
        }
    });
}
