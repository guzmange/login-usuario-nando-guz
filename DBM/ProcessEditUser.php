<?php
header('Access-Control-Allow-Origin: *');

error_reporting(0);
include 'coneccion.php';

$userId ="";
$profileId="";

$userId=$_POST['User_Id'];
$profileId=$_POST['Profile_Id'];

$errors = array(); 

if (empty($userId)) { array_push($errors, "User id is required"); }
if (empty($profileId)) { array_push($errors, "Profile id is required"); }

$query = "UPDATE perfil_usuarios SET Id_Perfil = $profileId WHERE Id_Usuario = $userId";

if (count($errors) == 0) {
    if ($conexion->query($query) === TRUE) {
        $data = array(respuesta => "ok", mensaje => "La actualizacion se realizo correctamente.");
        echo json_encode($data);
        exit();   
    } else {
        array_push($errors, "La actualizacion no se pudo realizar");
        $data = array(respuesta => "error", mensaje => $errors);
        echo json_encode($data);
        exit();
    }
}else
{
    $data = array(respuesta => "error", mensaje => $errors);
    echo json_encode($data);
    exit();
}
$conexion->close();

?>