<!doctype html>
<html lang="es">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>Seguimiento de denuncia</title>
</head>

<body style="margin:0;padding:0;font-family:Inter,system-ui,Segoe UI,Roboto,'Helvetica Neue',Arial,sans-serif;background:#f4f6f8;">
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
        <tr>
            <td align="center" style="padding:24px 12px;">
                <table width="600" cellpadding="0" cellspacing="0" role="presentation" style="background:#ffffff;border-radius:8px;overflow:hidden;">
                    
                    <!-- Header -->
                    <tr>
                        <td style="padding:20px 24px;background:linear-gradient(90deg,#2E8ACB,#6CA0D8);color:#fff;">
                            <table width="100%" role="presentation">
                                <tr>
                                    <td style="vertical-align:middle">
                                        <?php if (!empty($logoUrl)): ?>
                                            <img src="<?= esc($logoUrl) ?>" alt="Logo" style="height:40px;display:block;">
                                        <?php else: ?>
                                            <strong>Municipalidad JLO</strong>
                                        <?php endif ?>
                                    </td>
                                    <td style="text-align:right;color:#fff;font-size:14px;">
                                        Notificación automática
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Body -->
                    <tr>
                        <td style="padding:28px 32px;color:#344054;">
                            <?php
                            $coloresEstados = [
                                'Recibida'    => '#433DF2',
                                'En Proceso'  => '#FBBF24', 
                                'Aceptada'    => '#04BF55', 
                                'Rechazada'   => '#F01B56',
                                'Finalizada'  => '#6B7382'  
                            ];

                            $colorEstado = $coloresEstados[$estado] ?? '#344054'; 
                            ?>
                            <h2 style="margin:0 0 8px;font-size:20px;">Estado de su denuncia: <span style="color:<?= $colorEstado ?>;"><?= esc($estado) ?></span></h2>
                            <p style="margin:0 0 16px;color:#556074;">Su denuncia ha sido actualizada. Revise los detalles a continuación:</p>

                            <p style="margin:0 0 16px;"><strong>Comentario del administrador:</strong><br><?= esc($comentario) ?></p>

                            <!-- Tracking code box -->
                            <div style="margin:18px 0;text-align:center;">
                                <div style="display:inline-block;padding:14px 20px;border-radius:8px;background:#eef7ff;border:1px solid #d6eefa;">
                                    <span style="font-family:monospace,monospace;font-size:20px;letter-spacing:2px;color:#0b6db3;">
                                        <?= esc($trackingCode) ?>
                                    </span>
                                </div>
                            </div>

                            <!-- CTA -->
                            <?php if (!empty($trackingUrl)): ?>
                                <div style="text-align:center;margin:18px 0;">
                                    <a href="<?= esc($trackingUrl) ?>" style="display:inline-block;padding:12px 20px;background:#2E8ACB;color:#fff;border-radius:6px;text-decoration:none;font-weight:600;">
                                        Ver seguimiento
                                    </a>
                                </div>
                            <?php endif ?>

                            <p style="margin:16px 0 0;color:#6b7280;font-size:14px;">
                                Si el botón no funciona, copie el siguiente enlace:
                            </p>
                            <p style="word-break:break-all;font-size:13px;color:#0b6db3;margin:8px 0 0;"><?= esc($trackingUrl) ?></p>

                            <hr style="border:none;border-top:1px solid #eef2f7;margin:24px 0;">

                            <p style="margin:0;color:#6b7280;font-size:13px;">
                                Atención al ciudadano: <strong>Municipalidad Distrital de José Leonardo Ortiz</strong><br>
                                Si necesita asistencia adicional, responda este correo o visite nuestra web.
                            </p>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="background:#f8fafc;padding:18px 24px;font-size:12px;color:#8b94a6;">
                            <table width="100%" role="presentation">
                                <tr>
                                    <td style="vertical-align:middle;">
                                        <small>© <?= date('Y') ?> Municipalidad Distrital de José Leonardo Ortiz. Todos los derechos reservados.</small>
                                    </td>
                                    <td style="text-align:right;">
                                        <?php if (!empty($logoUrl)): ?>
                                            <img src="<?= esc($logoUrl) ?>" alt="logo" style="height:28px;opacity:0.9;">
                                        <?php endif ?>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>
</body>

</html>
