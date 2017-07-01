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
      /*$.ajax({
          method: "POST",
          url: "/login",
          data: { username: $('#username').val() , password: $('#password').val()},
          statusCode: {
              401: function(data) {
                  console.log(data);
              },
              200: function () {
                  socket.emit('tryLogin', {
                      "username": $('[type=text]').val()
                  },function (result) {
                      if(result) {
                          console.log('RESULT' + result);
                          window.location.href = 'localhost:3000';
                      }
                  });
              }
          }
      });*/
      this.submit();
  });

});
