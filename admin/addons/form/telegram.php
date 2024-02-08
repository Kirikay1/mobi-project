<?php

/** 
  title: В телеграм
  name: telegram
**/

Class TelegramFormAddon {

  public static function send($form, $data) {

    foreach ($_POST as $key => $value) {
      $data['message'] = str_replace('{{'.$key.'}}', $value, $data['message']);
      $data['subject'] = str_replace('{{'.$key.'}}', $value, $data['subject']);
    }

    $data['message'] = preg_replace("#\r\n#", '<br>', $data['message'] ?? '');

      $query = [
        'message' => $data['message'],
        'chat_id' => $data['chat_id'],
      ];
      if ( $curl = curl_init() ) {
          curl_setopt($curl, CURLOPT_URL, 'https://pagedot.ru/telegram_send');
          curl_setopt($curl, CURLOPT_RETURNTRANSFER,true);
          curl_setopt($curl, CURLOPT_POST, true);
          curl_setopt($curl, CURLOPT_POSTFIELDS, json_encode($query));
          $out = curl_exec($curl);
          $result = json_decode($out, true);
          curl_close($curl);
      }

    if ($result) {
      return [
        'result' => 'ok', 
        'html' => 'Спасибо! Сообщение успешно отправлено!'
      ];
    } else {
      return [
        'result' => 'error', 
        'html' => 'Ошибка! Сообщение в телеграм не отправлено!'.json_encode($out)
      ];
    }

  }

}
