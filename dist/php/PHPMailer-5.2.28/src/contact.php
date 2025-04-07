<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Load PHPMailer classes
require 'PHPMailer/PHPMailer.php';
require 'PHPMailer/SMTP.php';
require 'PHPMailer/Exception.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $mail = new PHPMailer(true);

    try {
        // SMTP Configuration
        $mail->isSMTP();
        $mail->Host       = 'smtp.gmail.com';
        $mail->SMTPAuth   = true;
        $mail->Username   = 'sagarsahoredev@gmail.com';  // ✅ Your Gmail
        $mail->Password   = 'isivgakrdqrmlwdv';           // ✅ Your 16-character Gmail App Password
        $mail->SMTPSecure = 'tls';
        $mail->Port       = 587;

        // Get form fields
        $name = strip_tags(trim($_POST["name"]));
        $email = filter_var(trim($_POST["email"]), FILTER_SANITIZE_EMAIL);
        $category = strip_tags(trim($_POST["category"]));
        $reason = strip_tags(trim($_POST["budget"]));
        $message = strip_tags(trim($_POST["message"]));

        if (!empty($name) && !empty($email) && !empty($message)) {
            // From and To
            $mail->setFrom($email, $name);
            $mail->addAddress('sagarsahoredev@gmail.com', 'Sagar'); // ✅ Your receiving email

            // Email content
            $mail->isHTML(true);
            $mail->Subject = 'New Contact Form Message';
            $mail->Body    = "
                <h2>New Contact Form Submission</h2>
                <p><strong>Name:</strong> $name</p>
                <p><strong>Email:</strong> $email</p>
                <p><strong>Company:</strong> $category</p>
                <p><strong>Reason:</strong> $reason</p>
                <p><strong>Message:</strong><br>$message</p>
            ";

            $mail->send();
            echo 'success';
        } else {
            echo 'fail';
        }
    } catch (Exception $e) {
        echo 'fail';
        // Optionally: error_log($mail->ErrorInfo);
    }
}
?>
