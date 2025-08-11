<?php
/**
 * Contact Form Handler
 * Handles form submissions with validation, spam protection, and email sending
 */

// Set JSON response header
header('Content-Type: application/json');
header('X-Content-Type-Options: nosniff');

// Enable CORS for same-origin requests only
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$allowed_origins = [
    'http://localhost:8080',
    'http://127.0.0.1:8080',
    // Add your domain here when deployed
];

if (in_array($origin, $allowed_origins)) {
    header("Access-Control-Allow-Origin: $origin");
}

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

// Load environment variables
function loadEnv($file) {
    if (!file_exists($file)) return;
    
    $lines = file($file, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos($line, '#') === 0) continue;
        list($key, $value) = explode('=', $line, 2);
        $_ENV[trim($key)] = trim($value, '"\'');
    }
}

loadEnv(__DIR__ . '/.env');

// Configuration from environment variables
$config = [
    'smtp_host' => $_ENV['SMTP_HOST'] ?? 'localhost',
    'smtp_port' => $_ENV['SMTP_PORT'] ?? 587,
    'smtp_secure' => $_ENV['SMTP_SECURE'] ?? 'tls',
    'smtp_user' => $_ENV['SMTP_USER'] ?? '',
    'smtp_pass' => $_ENV['SMTP_PASS'] ?? '',
    'mail_to' => $_ENV['MAIL_TO'] ?? 'contact@example.com',
    'mail_from' => $_ENV['MAIL_FROM'] ?? 'noreply@example.com',
    'site_key' => $_ENV['SITE_KEY'] ?? 'default_key_change_in_production'
];

// Time-based spam protection (form should take at least 3 seconds to fill)
session_start();
$form_start_time = $_SESSION['form_start_time'] ?? time();
$_SESSION['form_start_time'] = time();

if (time() - $form_start_time < 3) {
    http_response_code(429);
    echo json_encode(['success' => false, 'message' => 'Form submitted too quickly. Please try again.']);
    exit;
}

// Get and validate form data
$name = trim($_POST['name'] ?? '');
$email = trim($_POST['email'] ?? '');
$category = trim($_POST['category'] ?? '');
$budget = trim($_POST['budget'] ?? '');
$message = trim($_POST['message'] ?? '');
$honeypot = trim($_POST['website'] ?? ''); // Hidden honeypot field

// Honeypot spam protection
if (!empty($honeypot)) {
    http_response_code(200); // Return success to not alert bots
    echo json_encode(['success' => true, 'message' => 'Thank you for your message.']);
    exit;
}

// Validation
$errors = [];

if (empty($name) || strlen($name) < 2 || strlen($name) > 100) {
    $errors[] = 'Name must be between 2 and 100 characters';
}

if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($email) > 255) {
    $errors[] = 'Please enter a valid email address';
}

if (strlen($category) > 100) {
    $errors[] = 'Category must be less than 100 characters';
}

if (!in_array($budget, ['500-1000', '1000-10000', '10000+']) && !empty($budget)) {
    $errors[] = 'Please select a valid budget option';
}

if (empty($message) || strlen($message) < 10 || strlen($message) > 2000) {
    $errors[] = 'Message must be between 10 and 2000 characters';
}

// Check for common spam patterns
$spam_patterns = [
    '/\b(viagra|cialis|casino|poker|loan|credit)\b/i',
    '/\b(buy\s+now|click\s+here|free\s+money)\b/i',
    '/https?:\/\/[^\s]+/i' // URLs in message
];

foreach ($spam_patterns as $pattern) {
    if (preg_match($pattern, $message . ' ' . $name)) {
        http_response_code(200);
        echo json_encode(['success' => true, 'message' => 'Thank you for your message.']);
        exit;
    }
}

if (!empty($errors)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => implode('. ', $errors)]);
    exit;
}

// Sanitize data for email
$name = htmlspecialchars($name, ENT_QUOTES, 'UTF-8');
$email = filter_var($email, FILTER_SANITIZE_EMAIL);
$category = htmlspecialchars($category, ENT_QUOTES, 'UTF-8');
$budget = htmlspecialchars($budget, ENT_QUOTES, 'UTF-8');
$message = htmlspecialchars($message, ENT_QUOTES, 'UTF-8');

// Prepare email content
$subject = 'Contact Form Submission - ' . $name;
$email_body = "
New contact form submission:

Name: $name
Email: $email
Category: " . ($category ?: 'Not specified') . "
Budget: " . ($budget ?: 'Not specified') . "

Message:
$message

---
Submitted at: " . date('Y-m-d H:i:s') . "
IP Address: " . ($_SERVER['HTTP_X_FORWARDED_FOR'] ?? $_SERVER['REMOTE_ADDR']) . "
User Agent: " . ($_SERVER['HTTP_USER_AGENT'] ?? 'Unknown') . "
";

// Try to use PHPMailer if available, otherwise use mail()
$use_phpmailer = class_exists('PHPMailer\PHPMailer\PHPMailer');

if ($use_phpmailer && !empty($config['smtp_user'])) {
    // Use PHPMailer for better reliability
    require_once 'php/PHPMailer-5.2.28/PHPMailerAutoload.php';
    
    $mail = new PHPMailer();
    $mail->isSMTP();
    $mail->Host = $config['smtp_host'];
    $mail->SMTPAuth = true;
    $mail->Username = $config['smtp_user'];
    $mail->Password = $config['smtp_pass'];
    $mail->SMTPSecure = $config['smtp_secure'];
    $mail->Port = $config['smtp_port'];
    
    $mail->setFrom($config['mail_from'], 'Portfolio Contact Form');
    $mail->addAddress($config['mail_to']);
    $mail->addReplyTo($email, $name);
    
    $mail->Subject = $subject;
    $mail->Body = $email_body;
    
    if ($mail->send()) {
        echo json_encode(['success' => true, 'message' => 'Thank you for your message. I will get back to you soon!']);
    } else {
        error_log('PHPMailer Error: ' . $mail->ErrorInfo);
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Sorry, there was an error sending your message. Please try again later.']);
    }
} else {
    // Fallback to mail() function
    $headers = [
        'From: ' . $config['mail_from'],
        'Reply-To: ' . $email,
        'X-Mailer: PHP/' . phpversion(),
        'Content-Type: text/plain; charset=UTF-8'
    ];
    
    if (mail($config['mail_to'], $subject, $email_body, implode("\r\n", $headers))) {
        echo json_encode(['success' => true, 'message' => 'Thank you for your message. I will get back to you soon!']);
    } else {
        error_log('Mail function failed for contact form');
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Sorry, there was an error sending your message. Please try again later.']);
    }
}
?>