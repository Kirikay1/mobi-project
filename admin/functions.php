<?php
header('Content-type: text/html; charset=utf-8');

function str_replace_once($search, $replace, $text) 
{ 
   $pos = strpos($text, $search); 
   return $pos!==false ? substr_replace($text, $replace, $pos, strlen($search)) : $text; 
} 

function ArrayTags()
{
	return ['div', 'img', 'section', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'a', 'input', 'select', 'textarea', 'label', 'header', 'footer', 'ul', 'li', 'table', 'tr', 'td', 'form'];
}

function GetContent()
{

	global $originPath;

	$content = file_get_contents($originPath.'/'.$_GET['page']);

	$content = preg_replace('#<meta(.*?)charset="(.*?)"(.*?)>#is', '', $content);
	$content = str_replace('<head>', '<head><meta charset="UTF-8">', $content);

	// Добавляем PREID к элементам
	$content = PdeidCreate($content, 100);

	if (strpos($content, 'id="pagedot-pdscript"') !== false) {} else {
		$content = str_replace('</body>', '<script src="app/script.js" id="pagedot-pdscript"></script></body>', $content);
	}

	if (isset($_GET['preload']) && $_GET['preload'] == 'true') {
		if (file_exists($originPath.'/css/'.$_GET['page'].'.css')) {
			$content = str_replace('</body>', '<style id="pagedot-style-custom">'.file_get_contents($originPath.'/css/'.$_GET['page'].'.css').'</style></body>', $content);
			
		}
	} else {

		$pdstyle = '';
		if (strpos($content, 'id="pagedot-pdstyle"') !== false) {} else {
		$pdstyle = '<link rel="stylesheet" href="css/'.$_GET['page'].'.css?'.time().'" id="pagedot-pdstyle">
';
		}
		$content = str_replace('</body>', $pdstyle.'</body>', $content);
		$content = preg_replace('#<\?php#is', '<!-- PAGEDOTPHP', $content);
		$content = preg_replace('#<\?#is', '<!-- PAGEDOT', $content);
		$content = preg_replace('#\?>#is', '/PAGEDOT -->', $content);

		$content = preg_replace('#<!DOCTYPE (.*?)>#is', '{{PDDOCTYPE : $1}}', $content);
		$content = preg_replace('#<html (.*?)>#is', '{{PDHTML : $1}}', $content);
		$content = preg_replace('#<head (.*?)>#is', '{{PDHEAD : $1}}', $content);
		$content = preg_replace('#<body (.*?)>#is', '{{PDBODY : $1}}', $content);
		$content = preg_replace('#<textarea#is', '<pdtag__textarea', $content);
		$content = preg_replace('#textarea>#is', 'pdtag__textarea>', $content);
		$content = preg_replace('#<html>#is', '{{PDHTML}}', $content);
		$content = preg_replace('#<head>#is', '{{PDHEAD}}', $content);
		$content = preg_replace('#<body>#is', '{{PDBODY}}', $content);
		$content = preg_replace('#</head>#is', '{{/PDHEAD}}', $content);
		$content = preg_replace('#</body>#is', '{{/PDBODY}}', $content);
		$content = preg_replace('#</html>#is', '{{/PDHTML}}', $content);
	}

	$content = str_replace(array("\r\n\r\n", "\r\r", "\n\n"), '
',  $content);

	echo $content;

	return false;
}

function PdeidCreate($content, $start = false) {

	if (!$start) { $start = time(); }
	$pdeid_unique = $start+1;

	$array_tags = ArrayTags();
	$pdeid_start = 0;
	foreach ($array_tags as $array_tag) {
		$content = preg_replace("#<".$array_tag."\b([^>]*)#uis", "<".$array_tag." $1 data-pdeid=\"".$array_tag.$pdeid_start."\"", $content);
	}

	preg_match_all("|data-pdeid=|U", $content, $contentFind, PREG_PATTERN_ORDER);

	for($i = 1; $i <= count($contentFind[0]); $i++) {
		foreach ($array_tags as $array_tag) {
			//echo $array_tag.''.($pdeid_unique + $i) . '<br>';
			$content = str_replace_once('data-pdeid="'.$array_tag.''.$pdeid_start.'"', 'data-pdeid="'.$array_tag.''.($pdeid_unique + $i).'"', $content);
		}
	}

	return $content;

}

function Config($key, $value = false)
{

	global $originPath;

	$filePath = $originPath . '/pagedot-config.php';

	if (file_exists($filePath)) {
	   $config = include($filePath);
		if (!$value) {
			return $config[$key];
		}
	}	

}

function myscandir($dir, $sort=0)
{
	$list = scandir($dir, $sort);
	
	// если директории не существует
	if (!$list) return false;
	
	// удаляем . и .. (я думаю редко кто использует)
	if ($sort == 0) unset($list[0],$list[1]);
	else unset($list[count($list)-1], $list[count($list)-1]);
	return $list;
}

function get_html($html) {

	$html = preg_replace('# : data-pdeid="(.*)"}}#U', '}}', $html);
	$html = preg_replace('# data-pdeid="(.*)"#U', '', $html);
		
	return $html;
}
function getFolderPath() {

	$path  = __DIR__;
	$path  = explode('/', $path);
	$pathr = array_pop($path);
	$path  = implode('/', $path);
	return $path;
}
function getFolder() {

	$path  = $_SERVER['REQUEST_URI'];
	$path  = explode('/', $path);
	$patha = array_pop($path);
	$pathb = array_pop($path);
	$path  = array_diff($path, array(''));
	$path  = implode('/', $path);
	$path  = '/'.$path;
	if ($path == '/') $path = ''; 
	return $path;
}

function dirlist($directory){
	global $sitePath;

		$directory = $directory;
   	if(!is_dir($directory)) {
		mkdir($directory, 0777, true);
   	}

   	$truedir = $directory;
   	$dir = scandir($truedir);
   	if (count($dir)> 0) {
	    foreach($dir as $k => $v){
	   	  
	      if($v != '.' && $v != '..' ){
	          $file[$k]['path']   = $sitePath.'/img/'.$v;
	          $file[$k]['path_file']   = $truedir.'/'.$v;
	          $file[$k]['title']  = $v;
	          $file[$k]['alt']    = $v;
	          $file[$k]['id']    = $k;
		   	  if(is_dir($truedir.'/'.$v)) {
			   	$file[$k]['type'] = 'dir';
			  }
		   	  if(is_file($truedir.'/'.$v)) {
			   	$file[$k]['type'] = 'image';
			  }
	      }
	    }
	    if (isset($file)) {
		   $file = array_values($file);
		   return $file;
	    } else {
	    	return [];
	    }
	}
}

function saveHistory($data) {
	error_reporting(E_ERROR | E_PARSE);
	global $config, $originPath;
	$dir = $originPath.'/'.$config['dir'].'/history/'.$data['dir'].'/';

		if(!is_dir($dir)) {
		    mkdir($dir, 0777, true);
		}
		file_put_contents($dir . $data['file_name'], $data['html']);
		file_put_contents($data['page'], $data['html']);

}

function ConfigUpdate($key, $value){

	global $originPath;
	$config = include($originPath.'/pagedot-config.php');

	$result = '<?
return [
    ';
	foreach ($config as $k => $val) {
		if ($k == $key) {
			$result .= '"'.$k.'" => "'.$value.'",
    ';
		} else {
			$result .= '"'.$k.'" => "'.$val.'",
    ';
		}
	}
	$result .= '
];';

file_put_contents($originPath.'/pagedot-config.php', $result);


}
