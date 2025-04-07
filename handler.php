<?php 

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'php/PHPMailer-5.2.28/src/Exception.php';
require 'php/PHPMailer-5.2.28/src/PHPMailer.php';
require 'php/PHPMailer-5.2.28/src/SMTP.php';

$mail = new PHPMailer(true);

// Your details
$mail_subject = 'New Contact Form Message';
$mail_to_email = 'sagarsahoredev@gmail.com'; // You will receive this
$mail_to_name = 'Sagar Sahore';

try {
	// Get POST data
	$mail_from_name = isset($_POST['name']) ? $_POST['name'] : '';
	$mail_from_email = isset($_POST['email']) ? $_POST['email'] : '';
	$mail_category = isset($_POST['category']) ? $_POST['category'] : '';
	$mail_budget = isset($_POST['budget']) ? $_POST['budget'] : '';
	$mail_message = isset($_POST['message']) ? $_POST['message'] : '';

	// SMTP settings
	$mail->isSMTP();                                            
	$mail->Host       = 'smtp.gmail.com';                      
	$mail->SMTPAuth   = true;                                   
	$mail->Username   = 'sagarsahoredev@gmail.com';            
	$mail->Password   = 'isivgakrdqrmlwdv';                    
	$mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;           
	$mail->Port       = 465;                                    

	$mail->setFrom('sagarsahoredev@gmail.com', 'Portfolio Contact Form'); // From
	$mail->addAddress($mail_to_email, $mail_to_name); // To (your inbox)

	// Email format
	$mail->isHTML(true);                                        
	$mail->Subject = $mail_subject;
	$mail->Body    = "
		<strong>Name:</strong> {$mail_from_name}<br>
		<strong>Email:</strong> {$mail_from_email}<br>
		<strong>Company:</strong> {$mail_category}<br>
		<strong>Reason:</strong> {$mail_budget}<br><br>
		<strong>Message:</strong><br>{$mail_message}
	";

	$mail->send();
	echo 'success'; // JS will detect this for frontend success message

} catch (Exception $e) {
	echo "Mailer Error: {$mail->ErrorInfo}";
}
?>
