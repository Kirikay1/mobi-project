<?php

function get_data($post) {
		global $config;

		$html = get_html($post['html']);

		$key = $config['key'];
		$version = $config['version'] ?? "1.0";
		$query = [
			'key' => $key,
			'html' => $html,
			'version' => $version,
		];

				switch ($query['version']) {
					case '1.0':
					default:
					
						$html = $query['html'];
						$html = str_replace('<!-- PAGEDOTPHP', '<?php', $html);
						$html = str_replace('<!-- PAGEDOT', '<?', $html);
						$html = str_replace('/PAGEDOT -->', '?>', $html);
						
						$html = str_replace('<pdtag__textarea', '<textarea', $html);
						$html = str_replace('pdtag__textarea>', 'textarea>', $html);
						$html = str_replace('{{PDHTML}}', '<html>', $html);
						$html = str_replace('{{PDHEAD}}', '<head>', $html);
						$html = str_replace('{{PDBODY}}', '<body>', $html);
						$html = preg_replace('#{{PDDOCTYPE : (.+)}}#U', '<!DOCTYPE $1>', $html);
						$html = preg_replace('#{{PDHTML : (.+)}}#U', '<html $1>', $html);
						$html = preg_replace('#{{PDHEAD : (.+)}}#U', '<head $1>', $html);
						$html = preg_replace('#{{PDBODY : (.+)}}#U', '<body $1>', $html);
						$html = str_replace('{{/PDHEAD}}', '</head>', $html);
						$html = str_replace('{{/PDBODY}}', '</body>', $html);
						$html = str_replace('{{/PDHTML}}', '</html>', $html);

						$html = str_replace(' contenteditable="true"', '', $html);
						$html = preg_replace('#pagedot-element-active#', '', $html);
						$html = preg_replace('# data-pagedot-element-id="([0-9.,]+)"#', '', $html);
						$html = preg_replace('#<div class="pagedot-edit-variants">(.*)</div>#', '', $html);

						return [
							"result" => "ok",
							"html" => $html,
						];

						break;
				}
				

			/*
		if ( $curl = curl_init() ) {
			$headers = array("authorization: ".$key,
                 "x-domain: ".$_SERVER['HTTP_HOST']);
		    curl_setopt($curl, CURLOPT_URL, $config['api_url'].'/save');
		    curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);
		    curl_setopt($curl, CURLOPT_RETURNTRANSFER,true);
		    curl_setopt($curl, CURLOPT_POST, true);
		    curl_setopt($curl, CURLOPT_POSTFIELDS, $query);
		    $out = curl_exec($curl);
		    return json_decode($out, true);
		    curl_close($curl);
		}*/
		
}

function requestPost($path, $query, $config) {
	$page = false;

	if ( $curl = curl_init() ) {
		$headers = array("authorization: ".$config['key'],
            "x-domain: ".$_SERVER['HTTP_HOST']);
		curl_setopt($curl, CURLOPT_URL, $config['api_url'].'/'.$path);
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
		$page = [
			'result' => 'error',
			'message' => 'Произошла ошибка, Не получены данные',
		];
	}
	return $page;
}


function get_templates($post = []) {
		global $config;

		if (empty($config['key']) || $config['key'] == '') {
			$result = [
				'result' => 'error_key',
				'message' => 'Вставьте свой ключ, который получили после оплаты. Настройки->Система->Ключ',
			];
			return $result;
		}

		$key = $config['key'];
		$version = $config['version'] ?? "1.0";
		$query = [
			'key' => $key,
			'version' => $version,
		];
		if ( $curl = curl_init() ) {
			$headers = array("authorization: ".$key,
                 "x-domain: ".$_SERVER['HTTP_HOST']);
		    curl_setopt($curl, CURLOPT_URL, $config['api_url'].'/templates');
		    curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);
		    curl_setopt($curl, CURLOPT_RETURNTRANSFER,true);
		    curl_setopt($curl, CURLOPT_POST, true);
		    curl_setopt($curl, CURLOPT_POSTFIELDS, $query);
		    $out = curl_exec($curl);
		    return json_decode($out, true);
		    curl_close($curl);
		}
		
}


function my_file_get_contents($path) {
  $url = $path;
  $ch = curl_init();
  $timeout = 5; // set to zero for no timeout

  $headers = array(
	'Cookie: beget=begetok',
	'cache-control: max-age=0',
	'upgrade-insecure-requests: 1',
	'user-agent: Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.97 Safari/537.36',
	'sec-fetch-user: ?1',
	'accept: text/html,image/svg+xml,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3',
	'x-compress: null',
	'sec-fetch-site: none',
	'sec-fetch-mode: navigate',
	//'accept-encoding: deflate, br',
	'accept-language: ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7',
  );

  curl_setopt ($ch, CURLOPT_URL, $url);
  curl_setopt ($ch, CURLOPT_HTTPHEADER, $headers);
  curl_setopt ($ch, CURLOPT_RETURNTRANSFER, 1);
  curl_setopt ($ch, CURLOPT_FOLLOWLOCATION, true);
  curl_setopt ($ch, CURLOPT_CONNECTTIMEOUT, $timeout);
  $file_contents = curl_exec($ch);
  return $file_contents;
  curl_close($ch);
}


