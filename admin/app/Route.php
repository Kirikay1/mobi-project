<?php

session_start();

$baseDirectory = $_SERVER['DOCUMENT_ROOT'];
// Составляем путь к файлу
$originPath = '';
// Ищем файл в текущей и всех поддиректориях
$REQUEST_URI = implode('/', array_slice(explode('/', $_SERVER['REQUEST_URI']), 0, -1));
$originPaths = glob($baseDirectory . $REQUEST_URI, GLOB_BRACE);
if (!empty($originPaths)) {
   $originPath = $originPaths[0];
}
$originPath = str_replace('/admin/app', '', $originPath);


$config = include($originPath.'/pagedot-config.php');
include('Controller.php');
include('../actions.php');
include('../functions.php');

if (isset($_SESSION['pagedot-auth']) && !$_SESSION['pagedot-auth'] && $_POST['route'] != 'login-auth') {
	return false;
}

if (empty($_POST) && empty($_GET)) {
	return false;
}

if (empty($_POST['route']) && empty($_GET['route'])) {
	return false;
}

$post     = $_POST;
$get      = $_GET;
$session  = $_SESSION;
$files    = $_FILES;

$route = $post['route'] ?? false;
if (!$route) {
	$route = $get['route'];
}
switch ($route) {
	case 'login-auth':
		LoginAuth();
		break;

	case 'config-save':
		ConfigSave();
		break;
	
	case 'file-upgrade':
		FileUpgrade();
		break;
	
	case 'start-upgrade':
		StartUpgrade();
		break;
	
	case 'stop-upgrade':
		StopUpgrade();
		break;
	
	case 'get-history':
		GetHistory();
		break;

	case 'get-upgrade':
		GetUpgrade();
		break;

	case 'page-history-choose':
		PageHistoryChoose();
		break;

	case 'page-save':
		PageSave();
		break;

	case 'delete-file':
		DeleteFile();
		break;

	case 'html-duplicate':
		HtmlDuplicate();
		break;

	case 'site-parse-css':
		SiteParseCSS();
		break;

	case 'site-parse-image-font':
		SiteParseImageOrFont();
		break;

	case 'site-parse-tilda':
		SiteParseTilda();
		break;

	case 'site-parse-js':
		SiteParseJS();
		break;

	case 'site-parse-image':
		SiteParseImage();
		break;

	case 'site-parse':
		SiteParse();
		break;

	case 'style-save':
		StyleSave();
		break;

	case 'style-replace':
		StyleReplace();
		break;

	case 'style-duplicate':
		StyleDuplicate();
		break;

	case 'upload-file':
		UploadFile();
		break;

	case 'chunk-save':
		ChunkSave();
		break;

	case 'get-form':
		GetForm();
		break;

	case 'get-files':
		LoadFiles();
		break;

	case 'create-or-update-form':
		CreateOrUpdateForm();
		break;

	case 'create-form-item':
		CreateFormItem();
		break;
	
	case 'pdeid-create':
		PdeidCreateForContent();
		break;
	
	default:
		return false;
		break;
}
