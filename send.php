<?php
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode([
        'success' => false,
        'message' => 'Método no permitido.'
    ]);
    exit;
}

// Honeypot anti-spam
if (!empty($_POST['website'])) {
    echo json_encode([
        'success' => true,
        'message' => 'OK'
    ]);
    exit;
}

function clean($value)
{
    return trim(strip_tags($value ?? ''));
}

$nombre = clean($_POST['nombre'] ?? '');
$empresa = clean($_POST['empresa'] ?? '');
$email = clean($_POST['email'] ?? '');
$telefono = clean($_POST['telefono'] ?? '');
$mensaje = clean($_POST['mensaje'] ?? '');

if ($nombre === '' || $empresa === '' || $email === '' || $telefono === '' || $mensaje === '') {
    echo json_encode([
        'success' => false,
        'message' => 'Por favor completá todos los campos.'
    ]);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode([
        'success' => false,
        'message' => 'El email ingresado no es válido.'
    ]);
    exit;
}

$to = 'info@libercle.com';
$subject = 'Nueva consulta desde LiberClé';

$body = "Nueva consulta desde el formulario web:\n\n";
$body .= "Nombre: $nombre\n";
$body .= "Empresa: $empresa\n";
$body .= "Email: $email\n";
$body .= "Teléfono: $telefono\n";
$body .= "Mensaje:\n$mensaje\n";

$headers = [];
$headers[] = "From: LiberClé Web <no-reply@libercle.com>";
$headers[] = "Reply-To: $email";
$headers[] = "Content-Type: text/plain; charset=UTF-8";

$sent = mail($to, $subject, $body, implode("\r\n", $headers));

if ($sent) {
    echo json_encode([
        'success' => true,
        'message' => 'Mensaje enviado correctamente.'
    ]);
} else {
    echo json_encode([
        'success' => false,
        'message' => 'No se pudo enviar el mensaje.'
    ]);
}