$(window, document, undefined).ready(function() {
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