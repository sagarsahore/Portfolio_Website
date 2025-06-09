<?php
header('Content-Type: application/json');

// Include PHPMailer
require_once __DIR__ . '/PHPMailer-5.2.28/PHPMailerAutoload.php';

$mail = new PHPMailer(true);

try {
    $name = isset($_POST['name']) ? trim($_POST['name']) : '';
    $email = isset($_POST['email']) ? trim($_POST['email']) : '';
    $category = isset($_POST['category']) ? trim($_POST['category']) : '';
    $budget = isset($_POST['budget']) ? trim($_POST['budget']) : '';
    $message = isset($_POST['message']) ? trim($_POST['message']) : '';

    $mail->setFrom($email, $name);
    $mail->addAddress('sagarsahoredev@gmail.com');
    $mail->Subject = 'Contact Form Submission';

    $body = "Name: $name\nEmail: $email\nCategory: $category\nBudget: $budget\nMessage:\n$message";
    $mail->Body = $body;

    if ($mail->send()) {
        echo json_encode(['status' => 'success']);
    } else {
        echo json_encode(['status' => 'error', 'message' => $mail->ErrorInfo]);
    }
} catch (Exception $e) {
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
