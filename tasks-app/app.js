$(document).ready(function() {
  // Global Settings
  let edit = false;

  // Testing Jquery
  console.log('jquery is working!');
  fetchTasks();
  $('#task-result').hide();

  // search key type event
  $('#search').keyup(function() {
    if($('#search').val()) {
      let search = $('#search').val();
      $.ajax({
        url: 'task-search.php',
        data: {search},
        type: 'POST',
        success: function (response) {
          if(!response.error) {
            let tasks = JSON.parse(response);
            let template = '';
            tasks.forEach(task => {
              template += `
                <li><a href="#" class="task-item" taskId="${task.id}">${task.name}</a></li>
              `;
            });
            $('#task-result').show();
            $('#container').html(template);
          }
        } 
      });
    } else {
      $('#task-result').hide();
    }
  });

  // Get a Single Task by Id 
  $(document).on('click', '.task-item', function(e) {
    const id = $(this).attr('taskId');
    $.post('task-single.php', {id}, (response) => {
      const task = JSON.parse(response);
      $('#name').val(task.name);
      $('#description').val(task.description);
      $('#taskId').val(task.id);
      edit = true;
    });
    e.preventDefault();
  });

  // Delete a Single Task
  $(document).on('click', '.task-delete', function(e) {
    if(confirm('Are you sure you want to delete it?')) {
      const id = $(this).closest('tr').attr('taskId');
      $.post('task-delete.php', {id}, (response) => {
        fetchTasks();
      });
    }
  });

  // Submit Task Form
  $('#task-form').submit(function(e) {
    e.preventDefault();
    const postData = {
      name: $('#name').val(),
      description: $('#description').val(),
      id: $('#taskId').val()
    };
    const url = edit === false ? 'task-add.php' : 'task-edit.php';
    console.log(postData, url);
    $.post(url, postData, (response) => {
      console.log(response);
      $('#task-form').trigger('reset');
      fetchTasks();
      
      // Después de la edición, restablecer el estado de edición y borrar el ID
      edit = false;
      $('#taskId').val('');
    });
  });

  // Fetching Tasks
  function fetchTasks() {
    $.ajax({
      url: 'tasks-list.php',
      type: 'GET',
      success: function(response) {
        const tasks = JSON.parse(response);
        let template = '';
        tasks.forEach(task => {
          template += `
            <tr taskId="${task.id}">
              <td>${task.id}</td>
              <td><a href="#" class="task-item" taskId="${task.id}">${task.name}</a></td>
              <td>${task.description}</td>
              <td><button class="task-delete btn btn-danger">Delete</button></td>
            </tr>
          `;
        });
        $('#tasks').html(template);
      }
    });
  }
});
