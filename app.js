(function() {

  return {

    events: {
      'app.activated':'calculateTimeToReadTicketComments',
      'app.willDestroy':function () { clearInterval(this.pollingInterval); },
      'click #get_support_button': 'showLabsDeflection'
    },

    calculateTimeToReadTicketComments: function () {
      // calculate the time it takes to read all previous comments
      var AGENT_WPM = this.setting('agentSpeedDefault');
      var previousCommentsTime, timeToRead;
      var ticketComments = this.ticket().comments();
      var previousCommentsWordCount = _.map(ticketComments, function (comment) { return comment.value(); }).join().split(' ').length;
      timeToRead = Math.round(previousCommentsWordCount/AGENT_WPM);

      var unit = " minute";
      if (timeToRead < 1) {
        this.previousCommentsTime = 'less than 1 minute';
      } else {
        unit = unit + "s";
        this.previousCommentsTime = timeToRead + unit;
      }

      // display the data
      this.switchTo('main', {
        previousCommentsTime: this.previousCommentsTime
      });

      // calculate the time it takes to read the end user's comment
      this.calculateTimeToReadAgentComment();

      // poll the agent's comment every 5 seconds
      this.pollingInterval = setInterval(function () {
        this.calculateTimeToReadAgentComment();
      }.bind(this), 5000);

    },

    calculateTimeToReadAgentComment: function () {
      // This is how fast most people can read on a monitor according to
      // [Wikipedia](http://en.wikipedia.org/wiki/Words_per_minute#Reading_and_comprehension)
      var END_USER_WPM = this.setting('endUserSpeed');

      // calculate the time it takes to read the agent's comment
      var agentCommentTime, timeToRead;

      // the ticket comment text attribute will be undefined when the field is empty
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
    },

    showLabsDeflection: function(event){
      event.preventDefault();
      var help_link = helpers.fmt("%@/issues", this.author.email);
      this.$('.labs_support').modal({ //   Fires a modal to display the string that will be redacted and how many times it appears on the ticket.
              backdrop: true,
              keyboard: false,
              button_data: this.$("#create_git_issue").attr("href", help_link)
      });
    }

  };
}());
