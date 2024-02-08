<?php 

header('Content-type: text/html; charset=utf-8');

if (version_compare(PHP_VERSION, '7.2.0') <= 0) {
	 echo 'Версия php должна быть не ниже 7.2';
    exit;
}
$baseDirectory = $_SERVER['DOCUMENT_ROOT'];
// Составляем путь к файлу
$originPath = '';
// Ищем файл в текущей и всех поддиректориях
$REQUEST_URI = implode('/', array_slice(explode('/', $_SERVER['REQUEST_URI']), 0, -1));
$originPaths = glob($baseDirectory . $REQUEST_URI, GLOB_BRACE);
if (!empty($originPaths)) {
   $originPath = $originPaths[0];
}
//echo print_r($_SERVER); return false;
//echo $originPath; return false;

if (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') {
    // Запрос был выполнен по HTTPS
    $protocol = "https://";
} else {
    // Запрос был выполнен по HTTP
    $protocol = "http://";
}

$sitePath = $protocol.$_SERVER['HTTP_HOST'].'/'.$REQUEST_URI;


define('PAGEDOT', true);
session_start();

$config = include('pagedot-config.php');

$pagedot_dir = $config['dir'];
include($pagedot_dir.'/actions.php');
include($pagedot_dir.'/functions.php');
$version = $config['version'];

if (isset($_GET) && isset($_GET['page'])) {

	if(file_exists($_GET['page']) || (isset($_GET['p']) && file_exists($_GET['p']))){
		if ((isset($_GET['p']) && (preg_match("#.php$#", $_GET['p']) || preg_match("#.html$#", $_GET['p']) || preg_match("#.htm$#", $_GET['p']))) || (isset($_GET['page']) && (preg_match("#.php$#", $_GET['page']) || preg_match("#.html$#", $_GET['page']) || preg_match("#.htm$#", $_GET['page'])))) {
			GetContent();
		} else {
			echo 'Вы можете управлять визуально только следующими форматами файлов: .html, .htm, .php';
			exit;
		}
	} else {
		echo 'Страница не существует!';
		exit;
	}

} else {
  
  if (isset($_GET['p'])) {
    $page_name = $_GET['p'];
	} else {
	    if (file_exists('index.php')) {
	        $page_name = 'index.php';
	    } elseif (file_exists('index.html')) {
	        $page_name = 'index.html';
	    } elseif (file_exists('index.htm')) {
	        $page_name = 'index.htm';
	    } else {
	        $page_name = false;
	    }
	}

  //$page_name = $_GET['p'] ?? (file_exists('index.php') ? 'index.php' : (file_exists('index.html') ? 'index.html' : (file_exists('index.htm') ? 'index.htm' : false)));

	if (empty($_SESSION['pagedot-auth']) OR !$_SESSION['pagedot-auth']) { 
	  include($pagedot_dir.'/view/auth.php');
	  exit;
	}
	if (isset($_GET['action']) && $_GET['action'] == 'parse') {

		include($pagedot_dir.'/view/download_site.php');
		exit;
	}

	if (!$page_name || !file_exists($page_name)) {

		include($pagedot_dir.'/view/not_found.php');
		exit;
	}
	
	include($pagedot_dir.'/view/index.php');

}

?>