(function() {
    var scrollDown, conf, lol;

    conf = {
    cursorcolor: "#696c75",
    cursorwidth: "4px",
    cursorborder: "none"
    };

    lol = {
    cursorcolor: "#cdd2d6",
    cursorwidth: "4px",
    cursorborder: "none"
    };

    scrollDown = function() {
    $("#texxt").val("");
    $(".messages").getNiceScroll(0).resize();
    return $(".messages").getNiceScroll(0).doScrollTop(999999, 999);
    };

    var socket = io.connect();

    $(document).ready(function() {

          socket.on('connect',function(){
              socket.emit('sayHello', "Hello server, I'm new here!");
              socket.emit('newUsername', getParameterByName('username'));
          });

          socket.on('notifyNewUser',function (data) {
              if(data != getParameterByName('username')){
                  var welcomeMessage = "User " + data + " has joined room."
                  toastr.success(welcomeMessage,'Hi there');
              }
          });

          socket.on('userCount', function (data) {
              $('.userCount').text(" " + data + " ");
          });

          socket.on('usernameList',function (usernames) {
              $('.list-friends').html('');
              var prepareString = "<li><img src='/images/avatar-empty.png'/ width=45px height=45px class='dropbtn' onclick='document.getElementById(\"profileDropdown\").classList.toggle(\"show\");'><div class='info'><div class='user'>" + getParameterByName('username')+ " (Me) </div><div class='status on'>online</div></div></li>";
              $('.list-friends').append(prepareString);
              for (i = 0; i < usernames.length; ++i){
                  if(usernames[i] != getParameterByName('username')) {
                      var prepareString = "<li><img src='/images/avatar-empty.png'/ width=45px height=45px><div class='info'><div class='user'>" + usernames[i] + "</div><div class='status on'>online</div></div></li>";
                      $('.list-friends').append(prepareString);
                  }
              }
          });

          socket.on('getRecentMessages',function (messages) {
              for (i = messages.length-1; i >= 0; --i) {
                  if(messages[i].sender != getParameterByName('username')) {
                      $(".messages").append("<li class='msg-foreign'><div class=\"head\"><span class=\"name\">"
                          + messages[i].sender + "</span><span class=\"time\"> wrote "
                          + moment(messages[i].time).fromNow() + "</div><div class=\"message\">" + messages[i].body + "</div></li>");
                  }else {
                      $(".messages").append("<li class=\"i\"><div class=\"head\"><span class=\"time\">"
                          + moment(messages[i].time).fromNow() + "" +
                          "</div><div class=\"message\">" + messages[i].body +
                          "</div></li>");
                  }
              }
              scrollDown();
          });

          socket.on('responseMessage',function (data) {
                if(data.message != previousMessage) {
                    if(data.username != getParameterByName('username')) {
                        $(".messages").append("<li class='msg-foreign'><div class=\"head\"><span class=\"name\">" + data.username + "</span><span class=\"time\"> wrote " + moment(new Date()).fromNow() + "</div><div class=\"message\">" + data.message + "</div></li>");
                        scrollDown();
                        new Audio('./notify/newMessage.mp3').play()
                    }else {
                        $(".messages").append("<li class=\"i\"><div class=\"head\"><span class=\"time\">" + moment(new Date()).fromNow() + "</div><div class=\"message\">" + data.message + "</div></li>");
                        scrollDown();
                    }
                }
          });

          socket.on('userLeft',function (data) {
              if(getParameterByName('username') != data) {
                  var byeMessage = "User " + data + " has left the room.";
                  toastr.error(byeMessage, 'Goodbye');
              }
          });

        var previousMessage;
        var innerText = $.trim($("#texxt").val());
        $(".list-friends").niceScroll(conf);
        $(".messages").niceScroll(lol);
        $("#texxt").keypress(function(e) {
          if (e.keyCode === 13) {
              var innerText = $.trim($("#texxt").val());
              if (innerText !== "") {
                  previousMessage = innerText;
                  socket.emit('send_message', {username:getParameterByName('username'),message:innerText});
                  $(".messages").append("<li class=\"i\"><div class=\"head\"><span class=\"time\">" + moment(new Date()).fromNow() + "</div><div class=\"message\">" + innerText + "</div></li>");
                  scrollDown();
              }
            return false;
          }
        });

          // Close the dropdown menu if the user clicks outside of it
          window.onclick = function(event) {
              if (!event.target.matches('.dropbtn')) {

                  var dropdowns = document.getElementsByClassName("dropdown-content");
                  var i;
                  for (i = 0; i < dropdowns.length; i++) {
                      var openDropdown = dropdowns[i];
                      if (openDropdown.classList.contains('show')) {
                          openDropdown.classList.remove('show');
                      }
                  }
              }
          };

        return $(".send").click(function() {
            var innerText = $.trim($("#texxt").val());
            if (innerText !== "") {
                previousMessage = innerText;
                socket.emit('send_message', innerText);
                $(".messages").append("<li class=\"i\"><div class=\"head\"><span class=\"time\">" + moment(new Date()).fromNow() + "</span><span class=\"name\">" +getParameterByName('username')+"</span></div><div class=\"message\">" + innerText + "</div></li>");
                scrollDown();
            }
        });

    });

    $( window ).unload(function() {
        socket.emit('leaving',getParameterByName('username'));
    });



}).call(this);

function getParameterByName(name) {
    var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}
