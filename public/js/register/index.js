$(window, document, undefined).ready(function() {

    $('input').blur(function() {
        var $this = $(this);
        if ($this.val())
            $this.addClass('used');
        else
            $this.removeClass('used');
    });

    var $ripples = $('.ripples');

    $ripples.on('click.Ripples', function(e) {

        var $this = $(this);
        var $offset = $this.parent().offset();
        var $circle = $this.find('.ripplesCircle');

        var x = e.pageX - $offset.left;
        var y = e.pageY - $offset.top;

        $circle.css({
            top: y + 'px',
            left: x + 'px'
        });

        $this.addClass('is-active');

    });

    $ripples.on('animationend webkitAnimationEnd mozAnimationEnd oanimationend MSAnimationEnd', function(e) {
        $(this).removeClass('is-active');
    });

    $('#registerForm').on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            method: "POST",
            url: "/register",
            data: {username: $('#username').val(), password: $('#password').val(), password2: $('#password2').val()}
        }).success(function(){
            window.location.href = document.location.origin;
        }).error(function(response){
            toastr.error(JSON.parse(response.responseText).message, 'Registration failed');
        });
    });
});