<?php
header('Content-Type: application/json');

// Include PHPMailer classes
require_once __DIR__ . '/PHPMailer-5.2.28/src/PHPMailer.php';
require_once __DIR__ . '/PHPMailer-5.2.28/src/SMTP.php';
require_once __DIR__ . '/PHPMailer-5.2.28/src/Exception.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

$mail = new PHPMailer(true);

try {
    $name = isset($_POST['name']) ? trim($_POST['name']) : '';
    $email = isset($_POST['email']) ? trim($_POST['email']) : '';
    $category = isset($_POST['category']) ? trim($_POST['category']) : '';
    $budget = isset($_POST['budget']) ? trim($_POST['budget']) : '';
    $message = isset($_POST['message']) ? trim($_POST['message']) : '';

    // Configure basic mail headers
    $mail->setFrom('sagarsahoredev@gmail.com', 'Portfolio Website');
    if (!empty($email)) {
        $mail->addReplyTo($email, $name);
    }
    $mail->addAddress('sagarsahoredev@gmail.com');
    $mail->Subject = 'Contact Form Submission';
    $mail->isHTML(false);

    $body = "Name: $name\nEmail: $email\nCategory: $category\nBudget: $budget\nMessage:\n$message";
    $mail->Body = $body;

    if ($mail->send()) {
        echo json_encode(['status' => 'success']);
    } else {
        echo json_encode(['status' => 'error', 'message' => $mail->ErrorInfo]);
    }
    exit;
} catch (Exception $e) {
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
    exit;
}
