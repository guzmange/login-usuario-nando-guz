<?php

header('Access-Control-Allow-Origin: *');

error_reporting(0);
include 'coneccion.php';

$idUsuario =$_POST['User_Id'];


$query = "SELECT * FROM usuarios WHERE Id_Usuario=".$idUsuario; 

$resultado = mysqli_query($conexion,$query) or die("Sin resultados.");

if(mysqli_num_rows($resultado)>0){
    
    $user = mysqli_fetch_assoc($resultado);
 
    if ($user) { // if user exists
        
        $queryProfile = "SELECT p.perfil, p.Id_Perfil
                            FROM
                                perfiles AS p,
                                perfil_usuarios AS pu
                            WHERE
                                p.Id_Perfil=pu.Id_Perfil and
                                pu.Id_Usuario = $idUsuario limit 1"; 

        $resultadoProfile = mysqli_query($conexion,$queryProfile) or die("Sin resultados.");

        if(mysqli_num_rows($resultadoProfile)>0){
    
            $profile = mysqli_fetch_assoc($resultadoProfile);
 
            if ($profile) { // if user exists
        
                $myObj->Name = utf8_encode($user['Nombre_Completo']);
                $myObj->UserId = $user['Id_Usuario'];
                $myObj->Email = utf8_encode($user['Email']);
                $myObj->Document = $user['Cedula'];
                $myObj->UserName = utf8_encode($user['Nombre_Usuario']);
                $myObj->LastLogin = $user['Ultimo_Login'];
                if($user['PrimerLogin']!=0){ //0 es false no se ha realizado la confirmacion de la cuenta
                    $myObj->FirstLogin = 'true';
                }else{
                    $myObj->FirstLogin = 'false';
                }
                
                $myObj->ProfileId = $profile['Id_Perfil'];
                $myObj->Profile = $profile['perfil'];

                $queryProfileList = "SELECT * FROM perfiles"; 

                $resProfileList = mysqli_query($conexion,$queryProfileList) or die("Sin resultados.");

                if(mysqli_num_rows($resProfileList)>0){

                    $profileList = '<select id="cmbProfile">';

                    while($fila = mysqli_fetch_assoc($resProfileList)){
                        //TODO: no esta funcionando el if de select correctamente... en usuario 2 perfil 1 y muestra el select en perfil 3
                        if($fila["Id_Perfil"]===$profile['Id_Perfil']){
                            $profileList =  $profileList . '<option value="'. $fila["Id_Perfil"].'" selected="true">'.$fila["Perfil"].'</option>';
                        }else{
                            $profileList =  $profileList . '<option value="'. $fila["Id_Perfil"].'">'.$fila["Perfil"].'</option>';
                        }

                    }  
                                   
                    $profileList =  $profileList .'</select>';

                    $myObj->ProfileList = $profileList;


                    $data = array(respuesta => "ok", data => $myObj);
                    echo json_encode($data);
                    exit();

                }else{
                    $data = array(respuesta => "error", mensaje => "No se encontraron perfiles de usuario ingresados");
                    echo json_encode($data);
                    exit();
                }
            }else
            {
                $data = array(respuesta => "error", mensaje => "Perfil de usuario no encontrado");
                echo json_encode($data);
                exit();
            }

        }

    
    }else
    { 
        $data = array(respuesta => "error", mensaje => "Usuario no encontrado");
        echo json_encode($data);
        exit();
    }





}




?>