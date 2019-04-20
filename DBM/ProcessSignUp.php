<?php
header('Access-Control-Allow-Origin: *');

error_reporting(0);
include 'coneccion.php';

$name ="";
$userName="";
$pswUser="";
$email="";
$cedi="";

$errors = array(); 

// connect to the database
//$db = mysqli_connect('localhost', 'root', '', 'registration');

// REGISTER USER
//if (isset($_POST['reg_user'])) {
  // receive all input values from the form
  $name = utf8_decode(mysqli_real_escape_string($conexion, $_POST['name']));
  $userName =  utf8_decode(strtolower(mysqli_real_escape_string($conexion, $_POST['userName'])));
  $pswUser = utf8_decode(mysqli_real_escape_string($conexion, $_POST['pswUser']));
  $email = utf8_decode(strtolower(mysqli_real_escape_string($conexion, $_POST['email'])));
  $cedi = mysqli_real_escape_string($conexion, $_POST['cedi']);

  // form validation: ensure that the form is correctly filled ...
  // by adding (array_push()) corresponding error unto $errors array
  if (empty($name)) { array_push($errors, "Name is required"); }
  if (empty($userName)) { array_push($errors, "Username is required"); }
  if (empty($pswUser)) { array_push($errors, "Password is required"); }
  if (empty($email)) { array_push($errors, "Email is required"); }
  if (empty($cedi)) { array_push($errors, "Document is required"); }

  // first check the database to make sure 
  // a user does not already exist with the same username and/or email
  $user_check_query = "SELECT * FROM usuarios WHERE Nombre_Usuario='$userName' OR Email='$email' LIMIT 1";
  
  
  $result = mysqli_query($conexion, $user_check_query);
  $user = mysqli_fetch_assoc($result);
 
  if ($user) { // if user exists
    if (strtolower($user['Nombre_Usuario']) === $userName) {
      array_push($errors, "El usuario ya esta registrado en el sistema");
    }
    if (strtolower($user['Email']) === $email) {
      array_push($errors, "El Email ya esta registrado en el sistema");
    }
  }
  
  
  // Finally, register user if there are no errors in the form
  if (count($errors) == 0) {
  //$password = md5($password_1);//encrypt the password before saving in the database

  $conexion->begin_transaction(MYSQLI_TRANS_START_READ_ONLY);

      $query = "INSERT INTO usuarios (Nombre_Completo, Email, Cedula, Nombre_Usuario,Clave,PrimerLogin) 
  			  VALUES('$name', '$email', '$cedi','$userName','$pswUser',0)";
      //mysqli_query($conexion, $query);
      $conexion->query($query);

      // $queryId ="SELECT MAX(Id_Usuario) AS id FROM usuarios";
      // $rs = mysqli_query($conexion,$queryId);
      // if ($row = mysql_fetch_row($rs)) {
      //   $idUsu = trim($row[0]);
      // }
      $idUsu =  mysqli_insert_id($conexion); 

      $queryProfile = "INSERT INTO perfil_usuarios (Id_Perfil,Id_Usuario) 
      VALUES(3, $idUsu)";
      $conexion->query($queryProfile);
      //mysqli_query($conexion, $queryProfile);
      
  $conexion->commit();
  $conexion->close();


    $data = array(respuesta => "ok", mensaje => "El registro se realizo correctamente.");
    echo json_encode($data);
    exit();

  }else{

    $data = array(respuesta => "error", mensaje => $errors);
    echo json_encode($data);
    exit();

  }
//}

?>