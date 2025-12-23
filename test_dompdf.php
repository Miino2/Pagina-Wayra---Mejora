<?php
require __DIR__ . '/vendor/autoload.php';

use Dompdf\Dompdf;

$dompdf = new Dompdf();
$dompdf->loadHtml("<h1> DOMPDF está funcionando correctamente</h1>");
$dompdf->setPaper("A4", "portrait");
$dompdf->render();
$dompdf->stream("test.pdf", ["Attachment" => false]);