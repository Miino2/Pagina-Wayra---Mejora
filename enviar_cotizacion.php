<?php
ob_start();
header("Content-Type: application/json; charset=utf-8");

require __DIR__ . '/vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use Dompdf\Dompdf;

// Capturar datos del formulario
$nombre      = $_POST['nombre'];
$apellido    = $_POST['apellido'];
$dni         = $_POST['dni'];
$direccion   = $_POST['direccion'];
$contacto    = $_POST['contacto'];
$correo      = $_POST['correo'];
$tipoEntidad = $_POST['tipo_entidad'];
$nombreEntidad = $_POST['empresa'];
$ruc         = $_POST['ruc'];
$tipoServicio = $_POST['tipo_servicio'];
$detalles    = $_POST['detalle'];

// Archivo que guarda el último número generado
$archivoContador = 'contador_cotizaciones.txt';

// Verifica si el archivo existe
if (!file_exists($archivoContador)) {
    file_put_contents($archivoContador, "0");
}

// Leer el valor actual
// Reemplazado por versión con bloqueo para evitar race conditions
$fp = fopen($archivoContador, 'c+');
if ($fp !== false && flock($fp, LOCK_EX)) {
    clearstatcache(true, $archivoContador);
    $contents = stream_get_contents($fp);
    $ultimoNumero = is_numeric(trim($contents)) ? (int) trim($contents) : 0;

    // Incrementar
    $nuevoNumero = $ultimoNumero + 1;

    // Guardar el nuevo número en el archivo (con bloqueo)
    ftruncate($fp, 0);
    rewind($fp);
    fwrite($fp, (string)$nuevoNumero);
    fflush($fp);

    // Liberar bloqueo y cerrar
    flock($fp, LOCK_UN);
    fclose($fp);

    // Formatear (ej. 0001, 0025, 0145…)
    $numeroFormato = str_pad($nuevoNumero, 4, '0', STR_PAD_LEFT);
} else {
    // Fallback: si no se pudo bloquear, usar método simple (aun así escribe con LOCK_EX)
    if ($fp !== false) fclose($fp);
    $ultimoNumero = (int)file_get_contents($archivoContador);
    $nuevoNumero = $ultimoNumero + 1;
    file_put_contents($archivoContador, $nuevoNumero, LOCK_EX);
    $numeroFormato = str_pad($nuevoNumero, 4, '0', STR_PAD_LEFT);
}

// Año automático según el sistema
$anioActual = date("Y");

// Número final de solicitud (año cambia solo)
$numeroSolicitud = "COT-$anioActual-$numeroFormato";

// Fecha de emisión
$fechaEmision = date("d/m/Y");

// Plantilla mejorada del PDF
$html = '
<style>
    body {
        font-family: DejaVu Sans, sans-serif;
        font-size: 13px;
        color: #333;
    }
    h1 {
        text-align: center;
        color: #0b3d91;
        margin-bottom: 5px;
    }
    .subtitulo {
        text-align: center;
        font-size: 14px;
        margin-bottom: 20px;
    }
    table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 15px;
    }
    th {
        background-color: #0057b7;
        color: white;
        padding: 8px;
        text-align: left;
        font-size: 13px;
    }
    td {
        padding: 8px;
        border: 1px solid #ccc;
        font-size: 13px;
    }
    .footer {
        text-align: center;
        margin-top: 40px;
        font-size: 12px;
        color: #777;
    }
</style>

<h1>SOLICITUD DE COTIZACIÓN</h1>
<div class="subtitulo">Fecha de emisión: '.$fechaEmision.'</div>
<div class="subtitulo">N° de solicitud: '.$numeroSolicitud.'</div>

<table>
    <tr>
        <th>Campo</th>
        <th>Detalle</th>
    </tr>
    <tr>
        <td><strong>Nombre</strong></td>
        <td>'.$nombre.'</td>
    </tr>
    <tr>
        <td><strong>Apellidos</strong></td>
        <td>'.$apellido.'</td>
    </tr>
    <tr>
        <td><strong>DNI</strong></td>
        <td>'.$dni.'</td>
    </tr>
    <tr>
        <td><strong>Dirección</strong></td>
        <td>'.$direccion.'</td>
    </tr>
    <tr>
        <td><strong>N° de contacto</strong></td>
        <td>'.$contacto.'</td>
    </tr>
    <tr>
        <td><strong>Correo</strong></td>
        <td>'.$correo.'</td>
    </tr>
    <tr>
        <td><strong>Tipo de entidad</strong></td>
        <td>'.$tipoEntidad.'</td>
    </tr>
    <tr>
        <td><strong>Nombre de empresa</strong></td>
        <td>'.$nombreEntidad.'</td>
    </tr>
    <tr>
        <td><strong>RUC</strong></td>
        <td>'.$ruc.'</td>
    </tr>
    <tr>
        <td><strong>Tipo de servicio</strong></td>
        <td>'.$tipoServicio.'</td>
    </tr>
    <tr>
        <td><strong>Detalle</strong></td>
        <td>'.$detalles.'</td>
    </tr>
</table>

<div class="footer">
    Este documento ha sido generado automáticamente por el sistema de cotización.
</div>
';

// Generar PDF con DOMPDF
$dompdf = new Dompdf();
$dompdf->set_option('isHtml5ParserEnabled', true);
$dompdf->set_option('defaultFont', 'DejaVu Sans');

$dompdf->loadHtml($html);
$dompdf->setPaper('A4', 'portrait');
$dompdf->render();
$pdfOutput = $dompdf->output();

// Guardar el PDF temporalmente
$pdfPath = __DIR__ . "/cotizacion_" . time() . ".pdf";
file_put_contents($pdfPath, $pdfOutput);

// Preparar correo con PHPMailer
$mail = new PHPMailer(true);

// AÑADIR AQUÍ UTF-8
$mail->CharSet = 'UTF-8';
$mail->Encoding = 'base64';

// CONFIGURACIÓN SMTP
$mail->SMTPDebug = 0; // Cambiar a 2 SOLO PARA PRUEBAS
$mail->isSMTP();
$mail->Host       = 'smtp-relay.brevo.com';
$mail->SMTPAuth   = true;
$mail->Username   = '9b55ec001@smtp-brevo.com';
$mail->Password   = 'bskQfd6zpg4T7wq';
$mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
$mail->Port       = 587;

// Remitente
$mail->setFrom('contactos@wayraapurimac-eirl.com', 'Wayra Apurimac E.I.R.L.');

// Destinatario
$mail->addAddress('wayraapurimac@gmail.com');

// Asunto y contenido
$mail->Subject = 'Nueva solicitud de cotización'.$numeroSolicitud;
$mail->isHTML(true);

$mail->Body = '
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px; padding: 20px;">
    
    <h2 style="text-align: center; color: #0b3d91; margin-bottom: 5px;">
        Nueva solicitud de cotización recibida
    </h2>

    <p style="text-align: center; font-size: 14px; color: #555; margin-top: 0;">
        <strong>N° de solicitud:</strong> '.$numeroSolicitud.'
    </p>

    <hr style="border: 0; height: 1px; background: #ccc; margin: 20px 0;">

    <table style="width: 100%; border-collapse: collapse;">
        <tr>
            <td style="padding: 8px; font-weight: bold; width: 35%;">Nombre y Apellido:</td>
            <td style="padding: 8px;">'.$nombre.' '.$apellido.'</td>
        </tr>
        <tr>
            <td style="padding: 8px; font-weight: bold;">DNI:</td>
            <td style="padding: 8px;">'.$dni.'</td>
        </tr>
        <tr>
            <td style="padding: 8px; font-weight: bold;">Dirección:</td>
            <td style="padding: 8px;">'.$direccion.'</td>
        </tr>
        <tr>
            <td style="padding: 8px; font-weight: bold;">Contacto:</td>
            <td style="padding: 8px;">'.$contacto.'</td>
        </tr>
        <tr>
            <td style="padding: 8px; font-weight: bold;">Correo:</td>
            <td style="padding: 8px;">'.$correo.'</td>
        </tr>
        <tr>
            <td style="padding: 8px; font-weight: bold;">Tipo de entidad:</td>
            <td style="padding: 8px;">'.$tipoEntidad.'</td>
        </tr>
        <tr>
            <td style="padding: 8px; font-weight: bold;">Entidad:</td>
            <td style="padding: 8px;">'.$nombreEntidad.'</td>
        </tr>
        <tr>
            <td style="padding: 8px; font-weight: bold;">RUC:</td>
            <td style="padding: 8px;">'.$ruc.'</td>
        </tr>
        <tr>
            <td style="padding: 8px; font-weight: bold;">Servicio solicitado:</td>
            <td style="padding: 8px;">'.$tipoServicio.'</td>
        </tr>
        <tr>
            <td style="padding: 8px; font-weight: bold;">Detalles:</td>
            <td style="padding: 8px;">'.$detalles.'</td>
        </tr>
    </table>

    <hr style="border: 0; height: 1px; background: #eee; margin: 30px 0;">

    <p style="text-align: center; font-size: 12px; color: #777;">
        Este correo fue generado automáticamente por el sistema de cotización de 
        <strong>Wayra Apurimac E.I.R.L.</strong>
    </p>
</div>';

// Adjuntar PDF
$mail->addAttachment($pdfPath);

// <<< AGREGA AQUÍ LA LÓGICA PARA ADJUNTAR LOS ARCHIVOS DEL USUARIO >>>

// Si hay archivos adjuntos subidos por el usuario
if (isset($_FILES['adjunto'])) {
    // Si es múltiple, cada archivo estará en $_FILES['adjunto']['name'][i]
    $fileCount = is_array($_FILES['adjunto']['name']) ? count($_FILES['adjunto']['name']) : 0;
    for ($i = 0; $i < $fileCount; $i++) {
        if (
            isset($_FILES['adjunto']['error'][$i]) &&
            $_FILES['adjunto']['error'][$i] == UPLOAD_ERR_OK &&
            is_uploaded_file($_FILES['adjunto']['tmp_name'][$i])
        ) {
            $fileName = $_FILES['adjunto']['name'][$i];
            $fileTmp  = $_FILES['adjunto']['tmp_name'][$i];
            $mail->addAttachment($fileTmp, $fileName);
        }
    }
    // En caso de que NO sea múltiple (solo 1 archivo), también lo cubre el siguiente:
    if ($fileCount == 0 && $_FILES['adjunto']['error'] == UPLOAD_ERR_OK) {
        $mail->addAttachment($_FILES['adjunto']['tmp_name'], $_FILES['adjunto']['name']);
    }
}
// ----------------------------------------


// Enviar
$mail->send();

// Eliminar archivo temporal
unlink($pdfPath);

// LIMPIA CUALQUIER SALIDA INDESEADA
ob_end_clean();

// Respuesta para AJAX
echo json_encode(['status' => 'success']);
exit;

?>