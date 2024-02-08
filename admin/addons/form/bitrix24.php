<?php

/** 
  title: В Битрикс24
  name: bitrix24
**/

Class Bitrix24FormAddon {

public static function send($form, $data) {

  define('CRM_PATH', '/crm/configs/import/lead.php'); // Путь к компоненту lead.rest


  $message = str_replace('
','<br>',$data['message']);

  foreach ($_POST as $key => $value) {
    $message = str_replace('{{'.$key.'}}', $value, $message);
    $data['subject'] = str_replace('{{'.$key.'}}', $value, $data['subject']);
    $data['first_name'] = str_replace('{{'.$key.'}}', $value, $data['first_name']);
    $data['last_name'] = str_replace('{{'.$key.'}}', $value, $data['last_name']);
    $data['telephone'] = str_replace('{{'.$key.'}}', $value, $data['telephone']);
    $data['email'] = str_replace('{{'.$key.'}}', $value, $data['email']);
  }

  // Формируем параметры для создания лида в переменной $postData = array
  $postData = array(
    'TITLE' => $data['subject'] ?? '',
    'COMMENTS' => $message,
    'LOGIN' => $data['login'] ?? '',
    'PASSWORD' => $data['password'] ?? '',

    'NAME' => $data['first_name'] ?? '',
    'LAST_NAME' => $data['last_name'] ?? '',
    'PHONE_WORK' => $data['telephone'] ?? '',
    'EMAIL_WORK' => $data['email'] ?? '',
  );

  $fp = fsockopen("ssl://".($data['host'] ?? ''), 443, $errno, $errstr, 30);
  if ($fp) {
    $strPostData = '';
    foreach ($postData as $key => $value)
    $strPostData .= ($strPostData == '' ? '' : '&').$key.'='.urlencode($value);

    $str = "POST ".CRM_PATH." HTTP/1.0\r\n";
    $str .= "Host: ".$data['host']."\r\n";
    $str .= "Content-Type: application/x-www-form-urlencoded\r\n";
    $str .= "Content-Length: ".strlen($strPostData)."\r\n";
    $str .= "Connection: close\r\n\r\n";

    $str .= $strPostData;

    fwrite($fp, $str);

    $result = '';
    while (!feof($fp))
    {
      $result .= fgets($fp, 128);
    }
    fclose($fp);

    $result = true;
  } else {
    $result = false;
  }

  if ($result) {
    return [
      'result' => 'ok',
    ];
  } else {
    return [
      'result' => 'error', 
      'html' => 'Ошибка! Заявка в битрикс не улетела!'
    ];
  }

}

}
