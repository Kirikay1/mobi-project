<?php 
if (empty($_POST)) {header('Location: /');}
$form_id = $_POST['form_id'];


if (!file_exists('form/'.$form_id.'.php')) {
	$html = '<div class="pagedot-form-after-result" style="background-color:#fff;color:#000;font-weight:bold;font-size:15px;border:1px solid #eee;border-radius:8px;padding:10px 20px;margin-top:15px;margin-bottom:15px;">Уппс! Что-то пошло не так!!!</div>';
	echo json_encode(['result' => 'error', 'html' => $html]);
	return false;
}
$form = include('form/'.$form_id.'.php');

/*foreach ($_POST as $key => $value) {
	$form['message'] = str_replace('{{'.$key.'}}', $value, $form['message']);
}*/
$result = [
	'result' => 'error',     
    'html' => 'Уппс! Что-то пошло не так!!!'
];
if (isset($form['data']) && is_array($form['data'])) {
	foreach ($form['data'] as $data) {
		include(__DIR__.'/../admin/addons/form/'.$data['type'].'.php');
		$class = ucfirst($data['type']).'FormAddon';
		$send = $class::send($form, $data);
	}
}

if ($send['result'] == 'ok') {
	$result['result'] = 'ok';
	$result['html'] = 'Спасибо! Сообщение успешно отправлено!';
	$result['redirect'] = $form['redirect'] ?? '';
	$result['data'] = $data;
}
if (isset($send['html'])) $result['html'] = $send['html'];

$result['html'] = '<div class="pagedot-form-after-result" style="background-color:#fff;color:#000;font-weight:bold;font-size:15px;border:1px solid #eee;border-radius:8px;padding:10px 20px;margin-top:15px;margin-bottom:15px;">'.$result['html'].'</div>';
echo json_encode($result);
return false;

?>
