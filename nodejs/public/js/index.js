'use strict'

$(function () {
  var $loginBox = $('#loginBox');
  var $registerBox = $('#registerBox');
  var $userInfo = $('#userInfo');
  var $logout = $('#logout');

  // default show login box and hide the register box
  $loginBox.show();
  $registerBox.hide();
  // switch from the login box and register box
  $loginBox.find('a').on('click', function () {
    $registerBox.show();
    $loginBox.hide();
  })
  $registerBox.find('a').on('click', function () {
    $loginBox.show();
    $registerBox.hide();
  })
  // register method
  $registerBox.find('#registerBtn').on('click', function () {
    $.ajax({
      type: 'post',
      url: '/api/user/register',
      data: {
        email: $registerBox.find('#email').val(),
        username: $registerBox.find('#username').val(),
        password: $registerBox.find('#password').val(),
        repassword: $registerBox.find('#repassword').val()
      },
      dataType: 'json',
      success:
            function (data) {
              $registerBox.find('.colWarning').html(data.message)
              if (!data.code) {
                $loginBox.show();
                $registerBox.hide();
              }
            },
      error:
            function () {
              console.log('error');
            }
    });
  });

  $loginBox.find('#loginBtn').on('click', function () {
    $.ajax({
      type: 'post',
      url: '/api/user/login',
      data: {
        username: $loginBox.find('#username1').val(),
        password: $loginBox.find('#password1').val()
      },
      dataType: 'json',
      success:
            function (data) {
              $loginBox.find('.colWarning').html(data.message)
              if (!data.code) {
                window.location.reload();
              }
            }
        });  
    });
    
  // logout method
  $logout.on('click', function () {
    $.ajax({
      url: '/api/user/logout',
      success:
            function (data) {
              if (!data.code) {
                window.location.reload();
              }
            }
    });
  });

  $registerBox.find('#sendemailBtn').on('click', function () {
    $.ajax({
      type: 'post',
      url: '/api/genEmailCode',
      data: {
        email: $registerBox.find('#email').val()
      },
      dataType: 'json',
      success:
            function (data) {
              window.confirm('successful in sending register code, please check your email')
            },
      error:
            function () {
              console.log('error')
            }
    })
  })
})
