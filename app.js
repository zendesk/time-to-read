(function() {

  return {

    events: {
      'app.activated':'calculateTimeToReadTicketComments'
    },

    calculateTimeToReadTicketComments: function () {
      var AGENT_WPM = this.setting('agentSpeedDefault');

      // calculate the time it takes to read the end user's comment
      var previousCommentsTime, timeToRead;
      
      // calculate the time it takes to read all previous comments
      var ticketComments = this.ticket().comments();
      var previousCommentsWordCount = _.map(ticketComments, function (comment) { return comment.value(); }).join().split(' ').length;
      timeToRead = Math.round(previousCommentsWordCount/AGENT_WPM);
          
      var unit = " minute";
      if (timeToRead < 1) {
        this.previousCommentsTime = 'less than 1 minute';
      } else {
        if (timeToRead > 1) { unit = unit + "s"; }
        this.previousCommentsTime = timeToRead + unit;
      }

      // display the data
      this.switchTo('main', {
        previousCommentsTime: this.previousCommentsTime
      });

      this.calculateTimeToReadAgentComment();

      setInterval(function () {
        this.calculateTimeToReadAgentComment();
      }.bind(this), 5000);

    },

    calculateTimeToReadAgentComment: function () {
      // This is how fast most people can read on a monitor according to 
      // [Wikipedia](http://en.wikipedia.org/wiki/Words_per_minute#Reading_and_comprehension)
      var END_USER_WPM = this.setting('endUserSpeed');

      // calculate the time it takes to read the agent's comment
      var agentCommentTime, timeToRead;

      if (this.ticket().comment().text() !== undefined) {
        var commentWordCount = this.comment().text().split(' ').length;
        timeToRead = Math.round(commentWordCount/END_USER_WPM);
      } else {
        timeToRead = 0;
      }

      var unit = " minute";
      if (timeToRead < 1) {
        agentCommentTime = 'less than 1 minute';
      } else {
        if (timeToRead > 1) { unit = unit + "s"; }
        agentCommentTime = timeToRead + unit; 
      }

      this.updateTime(agentCommentTime);

    },

    updateTime: function (agentCommentTime) {
      this.$('#time').html(agentCommentTime);
    }

  };
}());
