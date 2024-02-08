<?php

function ConfigSave() {
	global $post, $config;

	if (isset($config['demo']) && $config['demo'] == true) {
		echo json_encode([
			'result' => 'ok',
			'message' => 'Успешно сохранено! (DEMO-РЕЖИМ)',
		]);
		return false;
	}

	$result = '<?php
return [
    ';
	foreach ($config as $k => $val) {
		if (isset($post[$k])) {
			if (is_array($post[$k])) {
				$arr = '';
				foreach ($post[$k] as $kl => $vl) {
					$arr .= '"'.$kl.'" => "'.$vl.'",
		';
				}
				$result .= '"'.$k.'" => [
			'.$arr.'],
	';
			} else {
				$result .= '"'.$k.'" => "'.$post[$k].'",
	';
			}

		} else {
			$result .= '"'.$k.'" => "'.$val.'",
    ';
		}
	}
	$result .= '
];';

	$cfile = '../../pagedot-config.php';
	file_put_contents($cfile, $result);

	//sleep(1);
	echo json_encode([
		'result' => 'ok',
		'message' => 'Успешно сохранено!',
	]);

}
function PdeidCreateForContent() {
	global $post, $config;

	$html = PdeidCreate($post['html']);

	echo $html;

}
function CreateFormItem() {
	global $post, $config;

	$query = [
		"type" => $post['type'],
		"name" => $post['name'],
	];

	$response = requestPost('createform', $query, $config);

	if (!$response) {
		echo 'Произошла ошибка! ('; exit;
	}

	echo $response['html'] ?? 'Произошла ошибка!'; exit;

}
function CreateOrUpdateForm() {
	global $post, $config;

	if (isset($config['demo']) && $config['demo'] == true) {
		echo json_encode([
			'result' => 'ok',
			'message' => 'Успешно сохранено! (DEMO-РЕЖИМ)',
		]);
		return false;
	}

	//echo json_encode($post);return;
	$form_id = $post['form-id'] ?? '0000';
	$dir = '../../app';
	$dir_form = '../../app/form';
	$file_form = "";
	$file_form .= "<?php return [
	'id' => '".$form_id."',
	'redirect' => '".($post['redirect'] ?? '')."',
	";
	$file_form .= "'data' => [
	";
	foreach ($post['field'] as $p) {
	$file_form .= "[
";
foreach ($p as $item_key => $item) {
	if ($item_key == 'form-status') $item = (int)$item; else $item = "'".$item."'";
	$file_form .= "'".str_replace('form-','',$item_key)."' => ".$item.",
";
}
	
$file_form .= "],";
}
$file_form .= "]]; ?>";

	if(!is_dir($dir)) {
	    mkdir($dir, 0777, true);
	}
	if(!is_dir($dir_form)) {
	    mkdir($dir_form, 0777, true);
	}

	file_put_contents($dir_form . '/' . $form_id . '.php', $file_form);

	if (!file_exists($dir . '/script.js')) {
		// Клонируем файл из папки start
		start('script.js', 'app/');
	}
	if (!file_exists($dir . '/form_send.php')) {
		// Клонируем файл из папки start
		start('form_send.php', 'app/');
	}
	echo json_encode(['result' => 'ok', 'message' => 'Успешно сохранено!']);
	return;
}

function start($name, $dir) {
	global $originPath;
	if (!file_exists($originPath.'/'.$dir.$name)) {
		$file = $originPath.'/start/'.$name;
		$new_file = $originPath.'/'.$dir.$name;
		copy($file, $new_file);
	}
}
function GetForm() {
	global $get, $config, $originPath;
	$form_id = $get['form_id'];

	if (!$form_id) {
		echo json_encode(['html' => 'Идентификатор формы не определен!']); exit;
	}

	$form = [[]];

	if (file_exists($originPath.'/app/form/'.$form_id.'.php')) {
		$form = include($originPath.'/app/form/'.$form_id.'.php');
	}
	
	if (!is_array($form)) $form = [[]];
	if (empty($form['data'])) $form['data'] = [$form];
	$form['id'] = $form_id;

	$query = [
		'form'   => json_encode($form, JSON_UNESCAPED_UNICODE),
		'config' => json_encode($config, JSON_UNESCAPED_UNICODE),
	];

	$response = requestPost('getform', $query, $config);

	if (!$response) {
		echo json_encode(['html' => 'Произошла ошибка! (']); exit;
	}

	echo json_encode($response); exit;

	//include('../view/form.php');
	
}

function LoadFiles() {
	global $get;
	if ($get['dir']) {
		$dir = '../../'.$get['dir'].'/';
	} else {
		$dir = '../../';
	}
	$dir = '../../'.$get['dir'];
	$root_info = scandir($dir);
	$dirBack = explode('/', $get['dir']);
	$dirBack2 = array_pop($dirBack);
	$dirb = implode('/', $dirBack);
	echo '<div class="pagedot-ul-files-nav"><button type="button" onclick=\'loadFiles("'.$dirb.'")\'><i class="ti ti-arrow-left"></i></button></div>';
	echo '<ul class="pagedot-ul-files">';
	if ($root_info) {
		$resDirs = [];
		$resFiles = [];
	    foreach($root_info as $value) {
	    	$realDir = str_replace('../../', '', $dir.'/'.$value);
	        if($value != '.git' && $value != '.' && $value != '..' && !is_file($dir.'/'.$value) && $dir.$value != '../../admin' && $dir.$value != '../../app') {
	        	$resDirs[] = '<li class="d-flex align-items-center pagedot-ul-file-folder" onclick=\'loadFiles("'.$realDir.'")\'><i class="ti ti-folder"></i> '.$value.'</li>';
	        }
	    }
	    
	    foreach($root_info as $value) {
	    	$realDir = str_replace('../../', '', $dir.$value);
	    	$realDirLink = ltrim(str_replace('../../', '', $dir.'/'.$value), '/');

	        if($value != '.' && $value != '..' && is_file($dir.'/'.$value) && $dir.$value != $dir.'admin.php' && $dir.$value != $dir.'pagedot-config.php') {
	        	if (preg_match("#.php$#", $value) || preg_match("#.html$#", $value) || preg_match("#.htm$#", $value)) {
	        		$resFiles[] = '<li class="d-flex align-items-center pagedot-ul-file-file" onclick=\'runAction("redirect", "admin.php?p='.$realDirLink.'")\'><i class="ti ti-files"></i> '.$value.'</li>';
	        	} else {
	        		//echo '<li class="d-flex align-items-center pagedot-ul-file-file" onclick=\'runAction("message", "Нет возможности визуально управлять этим файлом!")\'><i class="ti ti-files"></i> '.$value.'</li>';
	        	}
	        	
	        }
	        
	    }

	    $resDirsEcho = implode('', $resDirs);
	    $resFilesEcho = implode('', $resFiles);
	    if (!$resDirsEcho && !$resFilesEcho) {
	    	echo '<div class="text-center pt-5 pb-5">В это директории нет файлов для редактирования</div>';
	    }
	    echo $resDirsEcho;
	    echo $resFilesEcho;

    }
    echo '</ul>';

	

}

function FileUpgrade() {
	global $post, $config;

	$key = $config['key'];
	$upfile = explode('---', $post['url']);
	$version = $upfile[0];
	$url = str_replace('--', '/', $upfile[1]);
	$url = explode('.', $url);
	array_pop($url);
	$url = implode('.', $url);

	$query = [
		'key' => $key,
		'version' => $version,
		'path' => $url,
	];
	if ( $curl = curl_init() ) {
		$headers = array("authorization: ".$key,
                 "x-domain: ".$_SERVER['HTTP_HOST']);
	    curl_setopt($curl, CURLOPT_URL, $config['api_url'].'/upgrade/file');
	    curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);
	    curl_setopt($curl, CURLOPT_RETURNTRANSFER,true);
	    curl_setopt($curl, CURLOPT_POST, true);
	    curl_setopt($curl, CURLOPT_POSTFIELDS, $query);
	    $out = curl_exec($curl);
	    $upgrade_file = json_decode($out, true);
	    curl_close($curl);
	}

	if ($upgrade_file['result'] == 'error') {
		// Какая-то ошибка. Дальше не продолжаем
		exit;
	}

	$urlik = explode('/', $url);
	$file_name = end($urlik);
	array_pop($urlik);
	$dir = '../'.implode('/', $urlik);
	if(!is_dir($dir)) {
	    mkdir($dir, 0777, true);
	}

	file_put_contents('../' . $url, $upgrade_file['file']);

	echo json_encode([
		'result' => 'ok',
		'version' => $version,
	]);

}

function UploadFile() {
	global $post, $config, $files, $originPath, $sitePath;


//PageDotFileChoose(this, "/demo/img/1625466355-home-bg.png")
//PageDotFileChoose(this, "/demo/img/1625464867-home-bg.png", "backgroundImage")

/*PageDotFileChoose(this, "img/1625464867-home-bg.png")
PageDotFileChoose(this, "/demo/img/1625418876-home-bg.png", "backgroundImage")
PageDotFileRemove("1625464867", "../../img/1625464867-home-bg.png")
PageDotFileRemove("3", "D:/OpenServer/domains/pagedot.loc/demo/img/1625418876-home-bg.png")
*/
	
	$path_file = str_replace('/admin', '', getFolder())."/img/";
	$dir = 'img/';
	$path = '../../'.$dir;
	if(!is_dir($path)) {
		mkdir($path, 0777, true);
	}
	$tmp_path = 'tmp/';
	// Массив допустимых значений типа файла
	$types = array('image/gif', 'image/png', 'image/jpeg', 'image/svg', 'image/svg+xml');
	// Максимальный размер файла
	$size = 102400000000;
	 
	// Обработка запроса
	if ($_SERVER['REQUEST_METHOD'] == 'POST')
	{

		if ($files['pagedot-images']['name']) {

			foreach ($files['pagedot-images']['name'] as $key => $name) {
				$time = time();
				$filename = $time . '-' . $files['pagedot-images']['name'][$key];

				if (!in_array($files['pagedot-images']['type'][$key], $types)) {
					$result[] = '<div class="col-4 col-md-3 col-lg-2 dot-files-body__item">Запрещённый тип файла</div>';
				}
				if ($files['pagedot-images']['size'][$key] > $size) {
					$result[] = '<div class="col-4 col-md-3 col-lg-2 dot-files-body__item">Слишком большой размер файла</div>';
				}
				if (isset($config['demo']) && $config['demo'] == true) {
					$result[] = '<div class="col-4 col-md-3 col-lg-2 dot-files-body__item">Будем считать, что изображение загружено ;) Вы в ДЕМО-РЕЖИМе</div>';
				} else {
				if (!@copy($files['pagedot-images']['tmp_name'][$key], $path . $filename)) {
					$result[] = '<div class="col-4 col-md-3 col-lg-2 dot-files-body__item">Ошибка</div>';
				} else {
					$result[] = '<div class="col-4 col-md-3 col-lg-2 dot-files-body__item" id="pagedot-file-item-'.$time.'">
	<div class="dot-files-body__file d-flex align-items-center justify-content-center">
		<img src="'.$dir . $filename.'" alt="">
		<div class="dot-files-body__file-btns d-flex align-items-center justify-content-center">

<div class="dot-files-body__file-btn-setting d-flex align-items-center justify-content-center" onclick=\'PageDotFileRemove("'.$time.'", "'.$dir . $filename.'")\'>


	<i class="ti ti-trash"></i>
</div>
<div class="dot-files-body__file-btn-setting d-none align-items-center justify-content-center">
	<i class="ti ti-pencil"></i>
</div>
<div class="dot-files-body__file-btn-plus d-flex align-items-center justify-content-center" onclick=\'PageDotFileChoose(this, "'.$dir . $filename.'")\'>
	<i class="ti ti-check"></i>
</div>
		</div>
	</div>
	
	<div class="dot-files-body__file-title text-center mt-1">'.$filename.'</div>
</div>';
					
				}
				}

			}

			echo implode('', $result);
		}

	}

}

function HtmlDuplicate() {
	global $post, $config;

	$html = $post['html'];

	$array_tags = ArrayTags();

	preg_match_all("|data-pdeid=|U", $html, $contentFind, PREG_PATTERN_ORDER);

	$pdeid_start = '8000000';
	$pdeid_unique = time();

	$html = preg_replace('|data-pdeid="([a-zA-Z0-9]+)"|', 'data-pdeid="'.$pdeid_start.'"', $html);

	for($i = 0; $i < count($contentFind[0]); $i++) {
		foreach ($array_tags as $array_tag) {
			$html = str_replace_once('data-pdeid="'.$pdeid_start.'"', 'data-pdeid="'.$array_tag.''.($pdeid_unique + $i).'"', $html);
		}
	}

	echo $html;
}

function StyleReplace() {
	global $post, $config;

	$html = $post['html'];
	$key = $post['key'];
	$type = $post['type'];
	$size = $post['size'];
	$append = $post['append'];

	$html = preg_replace('#\/\*'.$key.' '.$type.'\*\/@media'.$size.'{(.*)}\/\*\/'.$key.' '.$type.'\*\/#', '', $html);
	echo $html.$append;
}

function SiteParseTilda() {
	global $post, $config;
	$url = rtrim(trim($post['url']), '/');
	$path = $post['path'];
	$file_name = end(explode('/', $path));

	$dirss = explode('/', str_replace('https://static.tildacdn.com/', '', $path));
	unset($dirss[count($dirss)-1]);

	$dirs = '../../' . implode('/', array_diff($dirss, array('')));

	if (!is_dir($dirs)) {
		if (!mkdir($dirs, 0777, true)) {
		    echo '<div><span style="font-weight:bold;color:red;">Не удалось создать директорию...</span></div>';
		} else {
			echo '<div>Директория ' . implode('/', array_diff($dirss, array(''))) . ' создана</div>';
		}
	}

	//if (!file_exists('../../' . $path)) {
	$path_save = str_replace('https://static.tildacdn.com/', '', $path);
		if ($content = my_file_get_contents($path)) {
			if (file_put_contents('../../' . $path_save, $content)) {
				echo '<div>Файл "'.$file_name.'" загружен</div>';
			} else {
				echo '<div><span style="font-weight:bold;color:red;">Ошибка загрузки файла</span></div>';
			}

		}

	//}

}


function SiteParseImageOrFont() {
	global $post, $config;
	$url = rtrim(trim($post['url']), '/');
	$path = $post['path'];
	$file_name = end(explode('/', $path));

	$dirss = explode('/', $path);
	unset($dirss[count($dirss)-1]);

	$dirs = '../../' . implode('/', array_diff($dirss, array('')));

	if (!is_dir($dirs)) {
		if (!mkdir($dirs, 0777, true)) {
		    echo '<div><span style="font-weight:bold;color:red;">Не удалось создать директорию...</span></div>';
		} else {
			echo '<div>Директория ' . implode('/', array_diff($dirss, array(''))) . ' создана</div>';
		}
	}

	//if (!file_exists('../../' . $path)) {
		if ($content = my_file_get_contents($url . '/' . $path)) {
			if (file_put_contents('../../' . $path, $content)) {
				echo '<div>Файл "'.$file_name.'" загружен</div>';
			} else {
				echo '<div><span style="font-weight:bold;color:red;">Ошибка загрузки файла</span></div>';
			}

		}

	//}

}

function SiteParseImage() {
	global $post, $config;

	$path = explode('?', ltrim(trim($post['path']), '/'))[0];
	$url = rtrim(trim($post['url']), '/');
	$path = str_replace([$url, str_replace('https://', 'http://', $url), str_replace('http://', 'https://', $url)], '', $path);
	$pathStart = $path;

	if (!preg_match('#https://#i', $path) && !preg_match('#http://#i', $path)) {
		$path = $url.'/'.$path;
	} else {

		// Тут получаем ссылку на стороннее изображение
		// не будем качать такие изображения
		return false;
	}

	$dirss = explode('/', $path);
	$file_name = $dirss[count($dirss)-1];
	unset($dirss[count($dirss)-1]);
	unset($dirss[0]);
	unset($dirss[1]);
	unset($dirss[2]);

	$dirs = '../../' . implode('/', array_diff($dirss, array('')));

	if (!is_dir($dirs)) {
		if (!mkdir($dirs, 0777, true)) {
		    echo '<div><span style="font-weight:bold;color:red;">Не удалось создать директорию...</span></div>';
		} else {
			echo '<div>Директория ' . implode('/', array_diff($dirss, array(''))) . ' создана</div>';
		}
	} else {
		echo '';
	}

	//if (!file_exists('../../' . $pathStart)) {
		if ($content = my_file_get_contents($path)) {
			if (file_put_contents('../../' . $pathStart, $content)) {
				echo '<div>Изображение "'.$file_name.'" загружено</div>';
			} else {
				echo '<div><span style="font-weight:bold;color:red;">Ошибка загрузки изображения</span></div>';
			}

		}

	//}

}

function getPathFile($path_dir, $path_file) {
	preg_match_all("|../|U", $path_file, $matches);
	$counts = count($matches);
	$path_dirs = explode('/', $path_dir);
	for ($i=1; $i <= $counts; $i++) {
		unset($path_dirs[count($path_dirs)-1]);
	}

	$return = implode('/', $path_dirs) . '/' . str_replace('../', '', explode('?', $path_file)[0]);

	$return = str_replace('////', '/', $return);
	$return = str_replace('///', '/', $return);
	$return = str_replace('//', '/', $return);

	return $return;
}

function SiteParseCSS() {
	global $post, $config;

	$path = explode('?', ltrim(trim($post['path']), '/'))[0];
	$url = rtrim(trim($post['url']), '/');
	$path = str_replace([$url, str_replace('https://', 'http://', $url), str_replace('http://', 'https://', $url)], '', $path);
	$pathStart = $path;

	if (!preg_match('#https://#i', $path) && !preg_match('#http://#i', $path)) {
		$path = $url.'/'.$path;
	} else {

		// Тут получаем ссылку на стороннее изображение
		// не будем качать такие изображения
		return false;
	}

	$dirss = explode('/', $path);
	$file_name = $dirss[count($dirss)-1];
	unset($dirss[count($dirss)-1]);
	unset($dirss[0]);
	unset($dirss[1]);
	unset($dirss[2]);

	$dir_path = implode('/', array_diff($dirss, array('')));
	$dirs = '../../' . $dir_path;
	$result = '';

	if (!is_dir($dirs)) {
		if (!mkdir($dirs, 0777, true)) {
		    $result .= '<div><span style="font-weight:bold;color:red;">Не удалось создать директорию...</span></div>';
		} else {
			$result .= '<div>Директория ' . implode('/', array_diff($dirss, array(''))) . ' создана</div>';
		}
	} else {
		$result .= '';
	}

		if ($content = my_file_get_contents($path)) {

			// находим все пути в файле url()
			preg_match_all('/url\([^)]+\)/i', $content, $imagesAndFonts); 
			$urls = array();
			$img_paths = array();
			if (count($imagesAndFonts[0]) > 0) {
				foreach( $imagesAndFonts[0] as $imagesAndFont )
				{
					if (strpos($imagesAndFont, 'data:image') === false && 
						strpos($imagesAndFont, 'http://') === false && 
						strpos($imagesAndFont, 'https://') === false) {
						$urls[] = getPathFile($dir_path, str_replace(['url(', ')', "'", '"'], '', $imagesAndFont));
					}
				}

			}

			if (file_put_contents('../../' . $pathStart, $content)) {
				$result .= '<div>CSS файл "'.$file_name.'" загружен</div>';
			} else {
				$result .= '<div><span style="font-weight:bold;color:red;">Ошибка загрузки CSS файла</span></div>';
			}

		}


	echo json_encode([
		'result' => $result,
		'imagesAndFonts' => $urls,
	]);

}

function SiteParseJS() {
	global $post, $config;

	$path = explode('?', ltrim(trim($post['path']), '/'))[0];
	$url = rtrim(trim($post['url']), '/');
	$path = str_replace([$url, str_replace('https://', 'http://', $url), str_replace('http://', 'https://', $url)], '', $path);
	$pathStart = $path;

	if (!preg_match('#https://#i', $path) && !preg_match('#http://#i', $path)) {
		$path = $url.'/'.$path;
	} else {

		// Тут получаем ссылку на стороннее изображение
		// не будем качать такие изображения
		return false;
	}

	$dirss = explode('/', $path);
	$file_name = $dirss[count($dirss)-1];
	unset($dirss[count($dirss)-1]);
	unset($dirss[0]);
	unset($dirss[1]);
	unset($dirss[2]);

	$result = '';

	$dirs = '../../' . implode('/', array_diff($dirss, array('')));

	if (!is_dir($dirs)) {
		if (!mkdir($dirs, 0777, true)) {
		    $result .= '<div><span style="font-weight:bold;color:red;">Не удалось создать директорию...</span></div>';
		} else {
			$result .= '<div>Директория ' . implode('/', array_diff($dirss, array(''))) . ' создана</div>';
		}
	} else {
		$result .= '';
	}

	//if (!file_exists('../../' . $pathStart)) {
		if ($content = my_file_get_contents($path)) {			

			if (file_put_contents('../../' . $pathStart, $content)) {
				$result .= '<div>JS файл "'.$file_name.'" загружен</div>';
			} else {
				$result .= '<div><span style="font-weight:bold;color:red;">Ошибка загрузки JS файла</span></div>';
			}

		}

	//}

	echo json_encode([
		'result' => $result,
	]);

}

function isUrlAvailable($url) {
    // Получаем заголовки
    $headers = @get_headers($url);

    // Если нет заголовков или ошибка соединения, считаем, что сайт недоступен
    if ($headers === false) {
        return false;
    }

    // Получаем первую строку заголовков, где находится статус
    $statusLine = array_shift($headers);

    // Парсим статусный код
    preg_match('/\s(\d{3})\s/', $statusLine, $matches);
    $statusCode = isset($matches[1]) ? (int)$matches[1] : 0;

    // Проверяем, является ли статус 200 OK
    return $statusCode === 200;
}

function SiteParse() {
	global $post, $config;

	if (isset($config['demo']) && $config['demo'] == true) {
		echo json_encode([
			'result' => 'error',
			'message' => 'Не получится скопировать сайт. Вы в DEMO-РЕЖИМе',
		]);
		return false;
	}

	$url = $post['url'];
	$parsedUrl = parse_url($url);
	if (!isset($parsedUrl['scheme'])) {
	    $url = 'https://' . $url;
	}

	if (isUrlAvailable($url)) {} else {
	    echo json_encode([
			'result' => 'error',
			'message' => 'Сайт защищен от парсинга! Найдите другой сайт для копирования.',
		]); exit;
	}

	$url_active = rtrim(trim($post['url_active']), '/');

	$query = [
		'key' => $config['key'],
		'version' => $config['version'],
		'url' => $url,
	];

	$page = false;

	if ( $curl = curl_init() ) {
		$headers = array("authorization: ".$config['key'],
            "x-domain: ".$_SERVER['HTTP_HOST']);
		curl_setopt($curl, CURLOPT_URL, $config['api_url'].'/page_parse');
		curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);
		curl_setopt($curl, CURLOPT_RETURNTRANSFER,true);
		curl_setopt($curl, CURLOPT_POST, true);
		curl_setopt($curl, CURLOPT_POSTFIELDS, $query);
		$page = curl_exec($curl);
		curl_close($curl);
	}

	if ($page) {
		$page = json_decode($page, true);
	} else {
		echo json_encode([
			'result' => 'error',
			'message' => 'Произошла ошибка, Не получены данные',
		]); exit;
	}

	if ($page['result'] == 'ok') {
		// Сохраняем файл
		if ($page['html'] != '' && file_put_contents('../../' . $url_active, $page['html'])) {
			// HTML код сохранен
		} else {
			echo json_encode([
				'result' => 'error',
				'message' => 'Произошла ошибка, код страницы не сохранен! Проверьте работу CURL',
			]); exit;
		}

	}
	
	if (isset($page['html'])) unset($page['html']);

	echo json_encode($page);

}

function StyleDuplicate() {
	global $post, $config;

	$html = $post['html'];
	$key_first = $post['key_first'];
	$key_last  = $post['key_last'];

	$types = [
		[
			'type' => 'desktop',
			'size' => '(.*)min-width:768px(.*)',
		],
		[
			'type' => 'tablet',
			'size' => '(.*)min-width:576px(.*) AND (.*)max-width:768px(.*)',
		],
		[
			'type' => 'mobile',
			'size' => '(.*)max-width:575px(.*)',
		],
	];

	foreach ($types as $type) {
		preg_match_all('#\/\*'.$key_first.' '.$type['type'].'\*\/@media'.$type['size'].'{(.*)}\/\*\/'.$key_first.' '.$type['type'].'\*\/#', $html, $out, PREG_PATTERN_ORDER);

		if (isset($out[0]) && isset($out[0][0])) {
			$html .= str_replace($key_first, $key_last, $out[0][0]);
		}
	} 

	echo $html;
}

function StyleSave() {
	global $post, $config;

	if (isset($config['demo']) && $config['demo'] == true) {
		echo json_encode([
			'result' => 'ok',
			'message' => 'Успешно сохранено! (DEMO-РЕЖИМ)',
		]);
		return false;
	}

	$page  = $post['page'];
	$style = $post['style'];
	
	if ($page && $style) {

		$new_page_name = $page.'.css';
		$dir = '../../css/';
		if(!is_dir($dir)) {
		    mkdir($dir, 0777, true);
		}
		$page_dirs = explode('/', $page);
		if ($page_dirs) {
			foreach ($page_dirs as $page_dir) {
				if(!is_dir($dir.$page_dir)) {
				    mkdir($dir.$page_dir, 0777, true);
				}
			}
		}
		$style = str_replace('*//*', '*/
/*', $style);
		$style = str_replace('http://'.$_SERVER['HTTP_HOST'], '', $style);
		$style = str_replace('https://'.$_SERVER['HTTP_HOST'], '', $style);
		file_put_contents($dir . $new_page_name, $style);
		echo json_encode([
			'result' => 'ok',
			'message' => 'Успешно сохранено!',
		]);
	}
}

function ChunkSave() {
	global $post;

	if ($post['name'] && $post['chunk']) {
		file_put_contents('../../chunks/' . $post['name'].'.txt', $post['chunk']);
			echo 'ok';
	}
}

function DeleteFile() {
	global $post, $config;

	$id = $post['id'];
	$path = $post['path'];
	
	unlink($path);

	echo json_encode([
		'result' => 'ok',
	]);
}

function PageSave() {
	global $post, $config, $originPath;

//echo $originPath; return false;

	if (isset($config['demo']) && $config['demo'] == true) {
		echo json_encode([
			'result' => 'ok',
			'message' => 'Успешно сохранено! (DEMO-РЕЖИМ)',
		]);
		return false;
	}

	$page = $originPath.'/' . $post['page'];
	// Проверяем лицензию и сохраняем файл
	$data = get_data($post);


	if ($data['result'] == 'error' OR $data['result'] == 'error_key') {
		echo json_encode([
			'result' => $data['result'],
			'message' => $data['message'],
		]);
		return false;
	}

	$html = $data['html'];

	if ($page && $html) {

		saveHistory([
			'file_name' => date('Ymdhis').'.txt',
			'page' => $page,
			'html' => $html,
			'dir' => $post['page'],
		]);
		
		echo json_encode([
			'result' => 'ok',
			'html' => $html,
			'message' => 'Успешно сохранено!',
		]);
	}
}

function PageHistoryChoose() {
	global $post, $config, $originPath;

	$page = $originPath.'/' . $post['page'];

	$data = get_data($post);

	$html = $data['html'];
	
	if ($page && $html) {

		saveHistory([
			'file_name' => date('Ymdhis').'.txt',
			'page' => $page,
			'html' => $html,
			'dir' => $post['page'],
		]);
		
		$html_new = file_get_contents($post['file']);
		file_put_contents($page, $html_new);

		echo json_encode([
			'result' => 'ok',
			'message' => 'Успешно загружено!',
		]);
	}
}

function LoginAuth() {
	global $post, $config, $session;

	$login = $post['login'];
	$password = $post['password'];
	if ($login == $config['login'] && $password == $config['password']) {
		// авторизован
		$_SESSION['pagedot-auth'] = true;
		$_SESSION['pagedot-login'] = $login;
		// Очищаем чанки
		
	    if (file_exists('../chunks/')) {
	        foreach (glob('../chunks/*') as $file) {
	            unlink($file);
	        }
	    }

		echo 'ok';
	} else {
		// НЕ авторизован
		echo 'Логин или пароль неверные. Попробуйте снова';
	}
}

function GetUpgrade() {
	global $post, $config;

	if ($config['upgrade'] == 'on' && $config['key']) {
		// Если разрешено проверять обновления, то проверяем
		$key = $config['key'];
		$version = $config['version'] ?? "1.0";

		$query = [
			'key' => $key,
			'version' => $version,
		];
		if ( $curl = curl_init() ) {
			$headers = array("authorization: ".$key,
                 "x-domain: ".$_SERVER['HTTP_HOST']);
		    curl_setopt($curl, CURLOPT_URL, $config['api_url'].'/upgrade');
		    curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);
		    curl_setopt($curl, CURLOPT_RETURNTRANSFER,true);
		    curl_setopt($curl, CURLOPT_POST, true);
		    curl_setopt($curl, CURLOPT_POSTFIELDS, $query);
		    $out = curl_exec($curl);
		    $upgrade = json_decode($out, true);
		    curl_close($curl);
		}
		
		if ($upgrade['result'] == 'error_access_for_upgrade') {
			// Если запрещено обновление, то смысла нет постоянно отправлять запросы, отключаем настройку
			ConfigUpdate('upgrade', 'off');
			return false;
		}
		if (isset($upgrade['result']) && $upgrade['result'] == 'error') {
			return false;
		}

		if (is_array($upgrade)) {
			foreach ($upgrade as $v => $up) {
				if ($v > $version) {
					file_put_contents('../upgrade/info/' . $v . '.txt', $up['info'], LOCK_EX);
					foreach ($up['files'] as $i => $path) {
						$path = str_replace('/', '--', $path);

						file_put_contents('../upgrade/files/' . $v . '---' . $path . '.txt', $path, LOCK_EX);
					}
				}
			}
		}
	}
}
	
function GetHistory() {
	global $get;

	$page = $get['page'];

	$dir = '../history/'.$page.'/';
	$histories = myscandir($dir);
	if (!count($histories) > 0 || !is_dir($dir)) {
		echo '<div class="pagedot-history-item">В истории нет записей</div>';
		exit;
	}

	$ke = 1;
	foreach ($histories as $history) {
		$last_update = filemtime($dir.$history);
		echo '
        <div class="pagedot-history-item" onclick=\'PagedotHistoryChoose(this, "'.$dir.$history.'")\'>'.$ke.'. '.date('Y-m-d H:i', $last_update).'</div>
		';
		$ke++;
	}
	
}

function StartUpgrade() {
	global $post, $config;

	if ($config['upgrade'] == 'on' && $config['key']) {
	// Если разрешено проверять обновления, то проверяем

	$content_info = '';
	$result = 'error';
	$content_url = [];

	$dir = '../upgrade/info';
	$root_info = scandir($dir);
	if ($root_info) {
	    foreach($root_info as $value) {
	        if($value != '.' && $value != '..' && is_file("$dir/$value")) {
	        	$result = 'ok';
	        	$content_info .= my_file_get_contents("$dir/$value");
	        }
	    }
    }

    $dir = '../upgrade/files';
	$root_files = scandir($dir);
	if ($root_files) {
	    foreach($root_files as $value) {
	        if($value != '.' && $value != '..' && is_file("$dir/$value")) {
	        	$result = 'ok';
	        	$content_url[] = $value;
	        }
	    }
    }
    if (!count($content_url) > 0) {
	    echo json_encode([
			'result' =>'error',
		]);
		return false;
	}

	echo json_encode([
		'result' => $result,
		'length' => count($content_url),
		'info' => $content_info,
		'url' => $content_url
	]);

	}

}

function StopUpgrade() {
	global $post, $config;

	$content_info = '';
	$content_url = [];

	$dir = '../upgrade/info';
	$root_info = scandir($dir);
	if ($root_info) {
	    foreach($root_info as $value) {
	        if($value != '.' && $value != '..' && is_file("$dir/$value")) {
	        	unlink("$dir/$value");
	        }
	    }
    }

    $dir = '../upgrade/files';
	$root_files = scandir($dir);
	if ($root_files) {
	    foreach($root_files as $value) {
	        if($value != '.' && $value != '..' && is_file("$dir/$value")) {
	        	unlink("$dir/$value");
	        }
	    }
    }

	// Изменяем версию в настроках
	ConfigUpdate('version', $post['version']);

}
