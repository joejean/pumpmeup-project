$(document).ready(function(){

  $('.likeButton').on('click', function(event){
      //event.preventDefault();
      var self = this;

      $(self).find('button').attr('disabled', 'disabled');

      var quoteID = $(self).attr('id');
      var url = "/api/quotes/like/"+quoteID;
      var likeURL = "/api/quotes/"+quoteID;

      $.ajax({
        url: url,
        type: "PUT",
        }).done(function(msg){
                //Get the quote with its updated number of likes
                $.getJSON(likeURL, function(data){
                    //update the number of likes on the HTML
                    $(self).find('span').text(data.likes);
                });
        });




  });

});
