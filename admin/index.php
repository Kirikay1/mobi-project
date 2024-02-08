<?php

function start($name, $chmod = false) {
	if (!file_exists('../'.$name)) {
		$file = 'start/'.$name;
		$new_file = '../'.$name;
		copy($file, $new_file);
		if ($chmod) {
			chmod($new_file, $chmod);
			chmod('../admin', 0700);
		}
	}
}
// Если нет файла /admin.php
// Клонируем его из папки start
start('admin.php', 0400);

// Если нет файла /pagedot-config.php
// Клонируем его из папки start
start('pagedot-config.php', 0644);

// Перенаправляем на страницу /admin.php
header('Location: ../admin.php');
