(function() {

  return {

    // This is how fast most people can read on a monitor according to 
    // [Wikipedia](http://en.wikipedia.org/wiki/Words_per_minute#Reading_and_comprehension)
    END_USER_WPM: this.setting('endUserSpeed'),
    AGENT_WPM: this.setting('agentSpeedDefault'),

    requests: {
      fetchUser: function () {
        return {
          url: '/api/v2/users/' + this.currentUser().id() + '.json',
          type: 'GET',
        };
      }
    },

    events: {
      'app.activated':'calculateTimeToRead'
    },

    calculateTimeToRead: function() {
      // calculate the time it takes to read the agent's comment
      var agentCommentTime, previousCommentsTime, timeToRead;

      if (this.ticket().comment().text() !== undefined) {
        var commentWordCount = this.comment.text().split(' ').length;
        timeToRead = Math.round(commentWordCount/this.END_USER_WPM);
      } else {
        timeToRead = 0;
      }

      if (timeToRead < 1) {
        agentCommentTime = 'less than 1';
      } else {
        agentCommentTime = timeToRead; 
      }
      
      // calculate the time it takes to read all previous comments
      var ticketComments = this.ticket().comments();
      var previousCommentsWordCount = _.map(ticketComments, function (comment) { return comment.value(); }).join().split(' ').length;
      timeToRead = Math.round(previousCommentsWordCount/this.AGENT_WPM);
          
      if (timeToRead < 1) {
        previousCommentsTime = 'less than 1';
      } else {
        previousCommentsTime = timeToRead;
      }

      // display the data
      this.switchTo('main', {
        agentCommentTime: agentCommentTime,
        previousCommentsTime: previousCommentsTime,
      });
    }
  };
}());
