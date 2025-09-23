<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;

class ConsultaApi extends ResourceController
{
    private $apiUrlDNI = "http://161.132.51.161/mdjlo/api/open/dni";
    private $apiUrlRUC = "http://161.132.51.161/mdjlo/api/open/ruc";
    private $token = "dUr\"*Z!3ZqS4Xri";
    public function buscarDNI($dni)
    {
        $response = $this->consultarApi($this->apiUrlDNI, $dni);

        if (!$response) {
            return $this->fail('Error al conectar con el servicio externo', 500);
        }

        log_message('error', 'Respuesta RENIEC: ' . json_encode($response));

        if (isset($response['data'])) {
            $result = [
                'success' => true,
                'data' => $response['data']
            ];
            return $this->respond($result, 200);
        }
        return $this->failNotFound("DNI no encontrado");
    }
    public function buscarRUC($ruc)
    {
        $response = $this->consultarApi($this->apiUrlRUC, $ruc);
        if (isset($response['data'])) {
            $result = [
                'success' => true,
                'data' => $response['data']
            ];
            return $this->respond($result, 200);
        }
        return $this->failNotFound("RUC no encontrado");
    }
    private function consultarApi($url, $documento)
    {
        $data = json_encode(["documento" => $documento]);
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            "Content-Type: application/json",
            "Authorization: Bearer {$this->token}"
        ]);
        $response = curl_exec($ch);
        curl_close($ch);
        return json_decode($response, true);
    }
}
