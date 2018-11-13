'use strict'
// submit comments
$('#messageBtn').on('click', function () {
  $.ajax({
    type: 'POST',
    url: '/api/comment/post',
    data: {
      contentid: $('contentId').val(),
      content: $('messageContent').val()
    },
    success: function () {
      $('#messageContent').val('')
    }
  })
})
