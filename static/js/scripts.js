var today = new Date();

function gfg_Run(today) {
  var today = new Date();
  var date = today.toJSON().slice(0, 10);
  var nDate = date.slice(8, 10) + '-' +
    date.slice(5, 7) + '-' +
    date.slice(0, 4);
  return nDate;
}

$('#tasker').bind('submit', function(e) {
  e.preventDefault();
  $.ajax({
    url: '/add_task',
    data: $('form').serialize(),
    type: 'POST',
    success: function(response) {
      console.log(response);
      get_tasks();
    },
    error: function(error) {
      console.log(error);
    }
  });

});


function get_tasks(today) {
  $.ajax({
    url: '/get_tasks',
    type: 'GET',
    success: function(response) {
      $('#tasks').html('');
      $.each(JSON.parse(response), function(i, item) {
        var today = new Date();
        now = moment(today).format('YYYY-MM-DD');
        snow = moment(i).format('YYYY-MM-DD');
        dd = moment(i).format('Do MMM Y - hh:mm');
        if (now == snow) {
          t = 'is-today';
        } else {
          t = '';
        }
        $('#tasks').append(`
          <article class='media ${t}'>
            <div class='media-content'>
              <div class='content'>
                <a class='done' data-time='${i}'>
                  <i class="is-pulled-right far fa-lg fa-times-circle"></i>
                  <!--i class="is-pulled-right far fa-check-circle"></i-->
                </a>
                <p>
                  <strong>${dd}</strong>
                  <br>
                  ${item}
                </p>
              </div>
            </div>
          </article>
        `);
      });
      $('.done').click(function(e) {
        do_task($(this).data('time'));
      });
    },
    error: function(error) {
      console.log(error);
    }
  });
}

function do_task(time) {
  $.ajax({
    url: '/do_task',
    data: {
      time: time
    },
    type: 'POST',
    success: function(response) {
      console.log(response);
      get_tasks();
    },
    error: function(error) {
      console.log(error);
    }
  });
}

var task = document.querySelector('#task-calendar');
var task_calendar = bulmaCalendar.attach(task, options = {
  showClearButton: false,
  color: 'black',
  startDate: today,
  showClearButton: true,
  showHeader: false,
  minDate: today,
  disabledDates: []
});


if (task) {
  task.bulmaCalendar.on('select', function(datepicker) {
    var dater = datepicker.data.value();
    console.log(dater);
  });
}

get_tasks();
