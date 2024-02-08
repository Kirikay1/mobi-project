<?php

/** 
  title: На почту (SMTP)
  name: emailSMTP
**/

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require __DIR__.'/../../../admin/libs/PHPMailer/src/Exception.php';
require __DIR__.'/../../../admin/libs/PHPMailer/src/PHPMailer.php';
require __DIR__.'/../../../admin/libs/PHPMailer/src/SMTP.php';

Class EmailSMTPFormAddon {

public static function send($form, $data) {

$subject = $data['subject'] ?? '';

if (isset($_POST)) {
  foreach ($_POST as $key => $value) {
      $data['message'] = str_replace('{{'.$key.'}}', $value, $data['message'] ?? '');
      $data['subject'] = str_replace('{{'.$key.'}}', $value, $data['subject']);
  }
}

$data['message'] = preg_replace("#\r\n#", '<br>', $data['message'] ?? '');

$body    = $data['message'] ?? '';

try {
      $mail = new PHPMailer;
      $mail->CharSet = 'UTF-8';
       
      // Настройки SMTP
      $mail->isSMTP();
      $mail->SMTPAuth = true;
      $mail->SMTPDebug = 1;
       
      /*$mail->Host = 'ssl://smtp.gmail.com';
      $mail->Port = 465; // 587
      $mail->Username = 'Логин';
      $mail->Password = 'Пароль';*/

      $mail->Host     = $data['smtp_host'] ?? '';
      $mail->Port     = $data['smtp_port'] ?? 587;
      $mail->Username = $data['smtp_email'] ?? '';
      $mail->Password = $data['smtp_password'] ?? '';
       
      // От кого
      $mail->setFrom($data['from_email'] ?? '', $data['from_name'] ?? '');   
       
      // Кому
      $mail->addAddress($data['to_email'] ?? '', '');
       
      // Тема письма
      $mail->Subject = $subject;
       
      // Тело письма
      $mail->msgHTML($body);
       
      // Приложение
      //$mail->addAttachment(__DIR__ . '/image.jpg');
      
      /*$mail->SMTPOptions = array(
        'ssl' => array(
          'verify_peer' => false,
          'verify_peer_name' => false,
          'allow_self_signed' => true
        )
      );*/

      ob_start();
      $mail->send();
      $res = ob_get_clean();

      return [
        'result' => 'ok', 
        'html' => 'Спасибо! Сообщение успешно отправлено!'
      ];

    } catch (Exception $e) {
      return [
        'result' => 'error', 
        'html' => 'Что-то пошло не так!'
      ];
    }

  }

}
