<?php
header('Access-Control-Allow-Origin: *');
error_reporting(0);
include 'coneccion.php';

$usuario =utf8_decode(strtolower($_POST['usuario']));


$query = "SELECT * FROM usuarios WHERE Nombre_Usuario='".$usuario."'"; 

$resultado = mysqli_query($conexion,$query) or die("Sin resultados.");

if(mysqli_num_rows($resultado)>0){
    
    $data = array(respuesta => "error", mensaje => "El nombre de usuario ya esta registrado.");
    echo json_encode($data);
    exit();
}else
{ 
    $data = array(respuesta => "ok", mensaje => "Usuario disponible");
    echo json_encode($data);
    exit();
}

?>