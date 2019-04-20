<?php
header('Access-Control-Allow-Origin: *');
error_reporting(0);
include 'coneccion.php';

$usuario =utf8_decode(strtolower($_POST['usuario']));
$clave= utf8_decode($_POST['clave']);

$query = "SELECT * FROM usuarios WHERE Nombre_Usuario='".$usuario."'"; 

$resultado = mysqli_query($conexion,$query) or die("Sin resultados.");

if(mysqli_num_rows($resultado)>0){

    while ($row = mysqli_fetch_array($resultado)){
        if($clave==$row['Clave']) {       
            //si la clave de usuario es igual a la ingresada se cargan datos del usuario
            if($row['PrimerLogin']!=0){
                $idUsuario = $row['Id_Usuario']; 
                $NombreCompleto=$row['Nombre_Completo'];
                $Email=$row['Email'];       
                $UltimoLogin=$row['Ultimo_Login'];
                $data = array(respuesta => "ok", mensaje => "", idUsuario => "$idUsuario", nombreCompleto => "$NombreCompleto", email => "$Email", ultimoLogin => "$UltimoLogin");
            

                $queryLastLogin = "UPDATE `usuarios` SET Ultimo_Login=now() where Id_Usuario = $idUsuario";
                $ultLogin = mysqli_query($conexion,$queryLastLogin) or die("Error al actualizar ultimo login.");
            }else
            {
                $data = array(respuesta => "error", mensaje => "La cuenta no fue activada, verifique su email.");
            }
        }else{ //si la clave registrada no coincide con la ingresada se retorna error en clave de usuario
            $data = array(respuesta => "error", mensaje => "La clave ingresada no es correcta.");
        }

        echo json_encode($data);
        exit();
    }
}else
{ //si no se encuentra un usuario registrado con el nombre que se ingresa, se retorna error
    $data = array(respuesta => "error", mensaje => "No existe usuario con dicho nombre");
    echo json_encode($data);
    exit();
}

?>