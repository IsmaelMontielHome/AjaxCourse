<?php

$connection = mysqli_connect(
  'localhost', 'isma', '123', 'task-app'
);

// for testing connection
#if($connection) {
#  echo 'database is connected';
#}

?>
