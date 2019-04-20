<?php

    header('Access-Control-Allow-Origin: *');
    error_reporting(0);
    include 'coneccion.php';

    $query = "SELECT * FROM usuarios";
    $result = mysqli_query($conexion, $query)or die("Sin resultados.");;

    if (mysqli_num_rows($result) > 0) {
       
        echo"<table>
                <tr>
                    <th>Id</th>
                    <th>Nombre</th>
                    <th>Email</th>
                    <th>Documento</th>
                    <th>Nombre Usuario</th>
                    <th>Ultimo Login</th>
                    <th>Cuenta Verificada</th>
                    <th></th>
                </tr>";
       
        while($fila = mysqli_fetch_assoc($result)){
            echo"<tr>";
            
                echo '<td>'.$fila["Id_Usuario"].'</td>';
                echo '<td>'.utf8_encode($fila["Nombre_Completo"]).'</td>';
                echo '<td>'.utf8_encode($fila["Email"]).'</td>';
                echo '<td>'.$fila["Cedula"].'</td>';
                echo '<td>'.utf8_encode($fila["Nombre_Usuario"]).'</td>';

                if($fila["PrimerLogin"]!=0){
                    $timeStamp = $fila["Ultimo_Login"];
                    $timeStamp = date( "d/m/Y", strtotime($timeStamp));
                    echo '<td>'.$timeStamp.'</td>';
                    echo '<td> Verificada </td>';
                }else
                {
                    echo '<td></td>';
                    echo '<td > Pendiente </td>';
                }
                 
                echo '<td text-align="center"><img src="img/user_edit.png" onclick="getUserData('.$fila["Id_Usuario"].');"></td>';

                
            echo"</tr>";
        }   
        echo"</table>";

    } else {
        die("Error: No hay datos en la tabla seleccionada");
    }

?>