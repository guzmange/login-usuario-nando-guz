<?php
$dbhost="localhost";  // host del MySQL (generalmente localhost)
$dbusuario="root"; // aqui debes ingresar el nombre de usuario
$dbpassword=""; // password de acceso para el usuario de la
$db="admin_usuarios";        // Seleccionamos la base con la cual 
$conexion = mysqli_connect($dbhost, $dbusuario, $dbpassword,$db);

if (!$conexion) {
        echo "Error: No se pudo conectar a MySQL." . PHP_EOL;
        echo "error de depuración: " . mysqli_connect_errno() . PHP_EOL;
        echo "error de depuración: " . mysqli_connect_error() . PHP_EOL;
        exit;
}
?>
