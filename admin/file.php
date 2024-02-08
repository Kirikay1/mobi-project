<?php


$baseDirectory = $_SERVER['DOCUMENT_ROOT'];
// Составляем путь к файлу
$originPath = '';
// Ищем файл в текущей и всех поддиректориях
$REQUEST_URI = implode('/', array_slice(explode('/', str_replace('/admin','',$_SERVER['REQUEST_URI'])), 0, -1));
$originPaths = glob($baseDirectory . $REQUEST_URI, GLOB_BRACE);
if (!empty($originPaths)) {
   $originPath = $originPaths[0];
}
$originPath = str_replace('/admin', '', $originPath);
if (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') {
    // Запрос был выполнен по HTTPS
    $protocol = "https://";
} else {
    // Запрос был выполнен по HTTP
    $protocol = "http://";
}
$sitePath = $protocol.$_SERVER['HTTP_HOST'].$REQUEST_URI;


//echo $originPath; return false;

$config = include('../pagedot-config.php');
include('actions.php');
include('functions.php');

$value = $_GET;
$rows = [];
$value['type'] = $value['type'] ?? 'image';

$path = $originPath."/img";
$rows = dirlist($path);

$query = [
	'key' => $config['key'],
	'version' => $config['version'],
	'rows' => json_encode($rows),
	'value' => json_encode($value),
];

$page = requestPost('filemanager', $query, $config);

?>

<form id="pagedot-upload-image" enctype="multipart/form-data">
	<div class="row">
	<div class="col-12">


		<?php echo $page['html'] ?? ''; ?>


			</div>

			<div class="text-center mt-3 d-none">
				<button type="button" class="btn" onclick="loadMore(this);" data-offset="12" data-take="6">Загрузить еще</button>
			</div>

		</div>
	</div>

</div>
</form>

<script>	
	var pagedot_dir = '<?php echo $config['dir']; ?>';
</script>
<script src="<?php echo $config['dir']; ?>/js/uploader-files.js?<?php echo time(); ?>"></script>
