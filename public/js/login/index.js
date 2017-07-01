$(window, document, undefined).ready(function() {

    var socket = io.connect();

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

  $('#loginForm').on('submit',function (e) {
      e.preventDefault();
      $.ajax({
          method: "POST",
          url: "/login",
          data: { username: $('#username').val() , password: $('#password').val()},
          statusCode: {
              401: function() {
                  toastr.error('Please double check your username and password.', 'Login failed');
              },
              200: function () {
                socket.emit('tryLogin', {
                 "username": $('#username').val()
                 },function (result) {
                    window.location.href = document.location.origin;
                 });
              }
          }
      });
  });

});
