//USO VARIBALES SESSION A MODO EJEMPLO
//var keyName = window.sessionStorage.key(0); //Get key name
//window.sessionStorage.setItem("Id_Usuario", resp.idUsuario); //Set item
//var value = window.sessionStorage.getItem("key");// Get item
//window.sessionStorage.removeItem("key"); //Remove Item 
//window.sessionStorage.clear();//Clear storage

//VARIABLES DE CONFIGURACION

//url servidor
var urlServer ="http://192.168.1.42/AdminUsu/www/dbm/";
//Largo de password mínimo utilizada en registro
var passLength = 8;

//manejo inicial de botones
$( document ).ready(function() {
    $("#btnLogOffUser").css("display", "none");//se oculta boton de logoff
});


//////////////////////////////////////////////////
///// LOGIN
//////////////////////////////////////////////////
// Get the modal login
var modal = document.getElementById('idModalLogin');

//retorna campo a color blanco luego de escribir en este campo
$("#uname").on('keyup', function(){
    $("#uname").css('background-color', 'white');
}).keyup();

$("#psw").on('keyup', function(){
    $("#psw").css('background-color', 'white');
}).keyup();

// When the user clicks anywhere outside of the modal Login, close it
window.onclick = function(event) {
    if(event.target == modal) {
        modal.style.display = "none";
        cleanFields();
    }
}

//Funcion que procesa el login de usuario al sistema.
function login_process()
{
    var usu = $("#uname").val();
    var pass = $("#psw").val();
    
    if(verifyFieldsLogin())
    {
        $.ajax({
            type: 'POST',
            dataType: 'json',
            url: urlServer+'ProcessLogin.php',
           data: { usuario: usu, clave : pass} , 
            success: function(resp) {
                 if(resp.respuesta =='ok')
                 {
                    notie.alert({ type: 'success', text: 'Login correcto!', time: 2, position: 'top' });
                    //si el login es correcto borro el modal
                    $("#idModalLogin").css("display", "none");
                    cleanFields();//limpio campos login
                    //se coloca saludo en etiqueta con el nombre de usuario
                    $("#userName").html('<tt>Bienvenido <b>' + resp.nombreCompleto + '</b> <br /> Ultimo login: ' + retornoFecha(resp.ultimoLogin)+'</tt>');
                    //se oculta bot[on de login]
                    $("#LoginButton").css("display", "none");
                    $("#SignUpButton").css("display", "none");
                    $("#btnLogOffUser").css("display", "inline");
                    window.sessionStorage.setItem("Id_Usuario", resp.idUsuario); //Set item

                 }else if(resp.respuesta =='error')
                 {//si desde el servidor se envia un error se muestra en etiqueta de error
                    notie.alert({ type: 'error', text: resp.mensaje , time: 2, position: 'top' });
                 }

            }
        });

    }


}

//funcion para desloguear el usuario
function LogoffUser()
{
    window.sessionStorage.removeItem("Id_Usuario"); //se destruye variable de session con id de usuario 
    window.sessionStorage.clear();//se limpia todo el sessionStorage
    $("#LoginButton").css("display", "inline"); //se muestra boton de login
    $("#SignUpButton").css("display", "inline");//se muestra boton de registro
    $("#btnLogOffUser").css("display", "none");//se oculta boton de logoff
    
}
//Funcion para verificar campos de usuario y clave antes de loguear usuario
function verifyFieldsLogin()
{   //bandera que indica si se validan campos o no
    var resp = true;

    //obtiene valor escrito en usuario
    var userName = $("#uname").val().trim();
    //obtiene valor escrito en passqord
    var userPsw = $("#psw").val().trim();
   
    if(userName.length==0)
    {//si el valor ingresado en campo usuario es nulo se envia mensaje de error y se cancela login
        resp=false;
        notie.alert({ type: 'error', text: 'el campo nombre no puede estar vacio' , time: 2, position: 'top' });
        $("#uname").css('background-color', 'red');
        $("#uname").focus();
    }else if(userPsw.length==0)
    {//si el valor ingresado en campo password es nulo se envia mensaje de error y se cancela login
        resp=false;
        notie.alert({ type: 'error', text: 'el campo password no puede estar vacio' , time: 2, position: 'top' });
        $("#psw").css('background-color', 'red');
        $("#psw").focus();
    }
    return resp;
}

//funcion que limpia campos de login de usuario
function cleanFields()
{
    $("#uname").val('');
    $("#psw").val('');
}

//funcion que recibe un texto de timestamp y lo convierte a string formateado dd/mm/yyyy hh:mm
function retornoFecha(dateString)
{   // 2019-04-15 23:32:28.000000
    var dateTimeParts = dateString.split(' '),
    timeParts = dateTimeParts[1].split(':'),
    dateParts = dateTimeParts[0].split('-'),
    date;

    date = new Date(dateParts[0], parseInt(dateParts[1], 10) - 1, dateParts[2], timeParts[0], timeParts[1]);
    return date.toLocaleString();
}


//////////////////////////////////////////////////
///// SIGN UP
//////////////////////////////////////////////////



//agrega el evento click al boton que cierra el modal de SignUp
$(document).ready(function(){
    $("#btnCancelSignUp").click(function(){ 
    $("#idModalSignUp").hide();
  });
});

//variable que contiene el modal de Sign Up
var modalSignUp = document.getElementById('idModalSignUp');

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modalSignUp) {
        modalSignUp.style.display = "none";
    }
}

//Verifica la disponibilidad del nombre de usuario, si ya existe notifica con un error.
function verifyUserName()
{
    var userName = $("#user").val();
    var resp =true;
    if(userName!="")
    {//si el campo usuario está completo valida en servidor el nombre de usuario
        $.ajax({
            type: 'POST',
            dataType: 'json',
            async:false,
            cache:false,
            url: urlServer + 'VerifyUserName.php',
            data: { usuario: userName} , 
            success: function(resp) {
                 if(resp.respuesta =='error')
                 {//si el usuario existe el servidor retorna un error
                    notie.alert({ type: 'error', text: resp.mensaje , time: 2, position: 'top' });
                    $("#user").focus();
                    resp = false;
                 }else{
                     //si el nombre de usuario no existe retorna true (usuario disponible)
                    resp = true;
                 }
                 
            }
        });
    }else
    {//si el campo usuario está vacío notifica el error
        notie.alert({ type: 'error', text: "El nombre de usuario es un campo requerido, favor ingreselo" , time: 2, position: 'top' });
        $("#user").focus();
        resp= false;
    }

   return resp;

}

//Verifica igualdad de password y verificacion de password, tambien llama a funcion
// que controla el largo del password.
function verifyPassword()
{
    var ret = true;
    var pswUser = document.getElementById('pswUser').value;
    var psw_repeat = document.getElementById('psw-repeat').value;

    if(pswUser!=""){
        //si el campo password tiene valor ingresado, verifica el largo del password "verifyPasswordLength"
        if(verifyPasswordLength(pswUser)){
            //se consulta si el password y la repeticion del password son distintos
            if(pswUser!=psw_repeat)
            {//si son distintos se notifica con un error
                notie.alert({ type: 'error', text: 'Las claves ingresadas no coinciden, verifiquelo' , time: 2, position: 'top' });
                $('#pswUser').focus();
                ret = false;
            }
        }else{//si no se verifica el largo del password se retorna false
            ret=false;
        }
    }else
    {
        notie.alert({ type: 'error', text: 'El password es un campo requerido, favor ingreselo.' , time: 2, position: 'top' });
        $('#pswUser').focus();
        ret = false;
    }
    return ret;
}

//Verifica el largo del password ingresado segun parametro predefinido en variable
function verifyPasswordLength()
{
    var ret = true;
    var pswUser = document.getElementById('pswUser').value;
   //verifica si el largo del password es mayor o menor al largo seteado en variable
    if(pswUser.length < passLength)
    {//si el password es menor al minimo seteado, se muestra mensaje de error
        notie.alert({ type: 'error', text: 'El password debe contener al menos '+ passLength+ ' caracteres.' , time: 2, position: 'top' });
        $('#pswUser').focus();
        ret = false;
    }
    return ret;
}

//Funcion que verifica el campo email que sea de un formato correcto
function verifyEmail() {
    var ret=true;
    var email = document.getElementById('email').value;
    var emailRegex = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
    
    if(email!=""){
    //si el email no esta vacio se analiza que cumpla las condiciones de direccion de mail
        if (!emailRegex.test(email)) {
            //si no las cumple se muestra mensaje de error
            notie.alert({ type: 'error', text: 'El email ingresado no parece correcto, favor verifiquelo' , time: 2, position: 'top' });
            $('#email').focus();
            ret = false;
        } 
    }else
    {//si el campo esta vacio se muestra mensaje de error que es un campo requerido
        notie.alert({ type: 'error', text: 'El email es requerido, favor completarlo' , time: 2, position: 'top' });
        $('#email').focus();
        ret = false;
    }
    return ret;
}

//Funcion que valida documento ingresado
function verifyDocument()
  {
    var cedi = document.getElementById('document').value;
    if(cedi.length >= 7){
        //Inicializo los coefcientes en el orden correcto
        var arrCoefs = [2,9,8,7,6,3,4,1];
        var suma = 0;
        //Para el caso en el que la CI tiene menos de 8 digitos
        //calculo cuantos coeficientes no voy a usar
        var difCoef = parseInt(arrCoefs.length - cedi.length);
        //var difCoef = parseInt(arrCoefs.length – ci.length);
        //recorro cada digito empezando por el de más a la derecha
        //o sea, el digito verificador, el que tiene indice mayor en el array
        for(var i=cedi.length - 1; i> -1;i--){
        //for (var i = ci.length – 1; i > -1; i–) {
            //ooObtengo el digito correspondiente de la ci recibida
            var dig = cedi.substring(i, i+1);
            //Lo tenía como caracter, lo transformo a int para poder operar
            var digInt = parseInt(dig);
            //Obtengo el coeficiente correspondiente al ésta posición del digito
            var coef = arrCoefs[i+difCoef];
            //Multiplico dígito por coeficiente y lo acumulo a la suma total
            suma = suma + digInt * coef;
        }
        // si la suma es múltiplo de 10 es una ci válida
        if ( (suma % 10) == 0 ) {
            return true;
        }else{
            notie.alert({ type: 'error', text: 'El documento ingresado no es valido, favor verifiquelo' , time: 2, position: 'top' });
            $('#document').focus();
            return false;
        }
    }else{
        notie.alert({ type: 'error', text: 'El documento ingresado no es valido, favor verifiquelo' , time: 2, position: 'top' });
        $('#document').focus();
        return false;
    }

}

//Funcion que verifica si se ingresa nombre y apellido por separado
function verifyNameSurname()
{
    var ret=true;
    var p1 = document.getElementById("name").value;  //tomamos en una variable lo ingresado en el login nombre
    var valido = / /;//parametro espacio que se busca en el texto ingresado


    if(valido.test(p1)){ // se chequea el regex de que el string tenga espacio
        ret=true; 
    }
    else
    {//en caso que no cumpla con el requerimiento de un espacio, se muestra mensaje de error
        notie.alert({ type: 'error', text: 'Debe ingresar nombre y apellido, verifiquelo' , time: 2, position: 'top' });
        $('#name').focus();
        ret=false;
    }
    return ret;
}

//funcion que recorre las verificaciones pertinentes para el ingreso de un usuario
function verifyFieldsSignUp()
{
    //llama a verificar nombre y apellido
    if(!verifyNameSurname())
    {
        return false;
    }else if(!verifyEmail())//llama a verificar email valido
    {
        return false;
    }else if(!verifyDocument())//llama a verificar documento
    {
        return false;
    }else if(!verifyUserName())//llama a verificar existencia de nombre de usuario
    {
        return false;
    }else if(!verifyPassword())//llama a verificacion de password y largo del mismo
    {
        return false;
    }else {
        return true;//si se cumplen todas las verificaciones se retorna true
    }

}
function SignUpProcess()
{
    
    if(verifyFieldsSignUp())
    {//si pasa todas las verificaciones de campos, se procede al registro
        var nameF = document.getElementById("name").value;
        var userNameF = $("#user").val();
        var pswUserF = document.getElementById('pswUser').value;
        var emailF = document.getElementById('email').value;
        var cediF = document.getElementById('document').value;
       
        $.ajax({
            type: 'POST',
            dataType: 'json',
            url: urlServer + 'ProcessSignUp.php',
            data: { name: nameF, userName : userNameF, pswUser : pswUserF, email : emailF, cedi : cediF} , 
            success: function(resp) {
                 if(resp.respuesta =='ok')
                 {//si el registro es satisfactorio se muestra mensaje de registro correcto
                    notie.alert({ type: 'success', text: 'El registro se realizo correctamente, verifique su email para activar la cuenta.!', time: 3, position: 'top' });
                    //si el registro es correcto borro el modal
                    $("#idModalSignUp").css("display", "none");
                    cleanFieldsSignUp();//limpio campos registro
                 }else if(resp.respuesta =='error')
                 {//Si se retornan errores se recorre el array de errores y se cargan los mensajes de error
                     var errores = resp.mensaje;
                     var msj ="";
                     for(var mensaje in errores) {
                        if(msj!=""){
                            msj = msj + "<br/>" + errores[mensaje];
                        }else{
                            msj = errores[mensaje];
                        }
                    }
                    notie.alert({ type: 'error', text: msj , time: 2, position: 'top' });
                    msj="";
                 }

            }
        });

    }
}

//funcion que limpia los campos de registro una vez realizado el mismo
function cleanFieldsSignUp()
{
    $("#name").val('');
    $("#user").val('');
    $("#pswUser").val('');
    $("#psw-repeat").val('');
    $("#email").val('');
    $("#document").val('');
}

//////////////////////////////////////////////////
///// USER LIST
//////////////////////////////////////////////////

//funcion que lista todos los usuarios registrados en el sistema
function showUserList()
{
    $.ajax({
        type: 'POST',
        dataType: 'html',
        url: urlServer + 'UserList.php',
        data: { } , 
        success: function(resp) {
            //se carga una tabla generada en el php con los usuarios registrados en el sistema
            $('#divTableUser').html(resp);
        }
    });

}


//agrega el evento click al boton que cierra el modal de SignUp
$(document).ready(function(){
    $("#btnCancelEditUser").click(function(){ 
    $("#idModalEditUser").hide();
  });
});

//funcion que obtiene los datos de un usuario especificado por su id
function getUserData(id)
{
    // se llama a cargar datos de usuario y se muestra al final modal de edituser
    $.ajax({
        type: 'POST',
        dataType: 'json',
        url: urlServer + 'GetUserData.php',
       data: { User_Id: id} , 
        success: function(resp) {
             if(resp.respuesta =='ok')
             {//se cargan datos de usuario recibidos desde el servidor a variable local
                var user = resp.data;
                $('#userIdEdit').val(user.UserId);
                $('#nameEdit').val(user.Name);
                $('#emailEdit').val(user.Email);
                $('#documentEdit').val(user.Document);
                $('#userEdit').val(user.UserName);
                $('#LastLoginEdit').val(user.LastLogin);
                $('#confirmAccount').val(user.FirstLogin);
                //se carga listado de perfiles desde base de datos
                $('#ProfileListContainer').html(user.ProfileList);
                
             }else if(resp.respuesta =='error')
             {//si desde el servidor se envia un error se muestra en etiqueta de error
                notie.alert({ type: 'error', text: resp.mensaje , time: 2, position: 'top' });
             }

        }
    });

    //luego de cargar los datos a los campos del formulario muestro el modal de EditUser
    document.getElementById('idModalEditUser').style.display='block'
}

//funcion que procesa la edicion del usuario
function ProcessEditUser()
{   //se obtiene el id de usuario que se va a editar
    var userId = document.getElementById('userIdEdit').value;
    //se obtiene el id de perfil seleccionado en el combo
    var profileId =$("#cmbProfile option:selected").val();
    $.ajax({
        type: 'POST',
        dataType: 'json',
        url: urlServer + 'ProcessEditUser.php',
       data: { User_Id: userId, Profile_Id: profileId} , 
        success: function(resp) {
             if(resp.respuesta =='ok')
             {//si la actualizacion se lleva a cabo de forma exitosa se muestra mensaje
                notie.alert({ type: 'success', text: 'El usuario se actualizo correctamente', time: 3, position: 'top' });  
             }else if(resp.respuesta =='error')
             {//Si se retornan errores se recorre el array de errores y se cargan los mensajes de error
                 var errores = resp.mensaje;
                 var msj ="";
                 for(var mensaje in errores) {
                    if(msj!=""){
                        msj = msj + "<br/>" + errores[mensaje];
                    }else{
                        msj = errores[mensaje];
                    }
                }
                notie.alert({ type: 'error', text: msj , time: 2, position: 'top' });
                msj="";
             }

        }
    });
}

//funcion que resetea el password del usuario
function resetPassword()
{
    //se obtiene id de usuario a resetear el password
    var userId =  $('#userIdEdit').val();
    //se obtiene nombre de usuario para utilizar en mensaje de confirmacion
    var name = $('#nameEdit').val();
    //se solicita confirmacion para resetear el password del usuario
    notie.confirm({
        text: 'Are you sure you want to reset password from user '+ name +'?<br><b>That\'s a bold move...</b>',
        cancelCallback: function () {
          //notie.alert({ type: 3, text: 'Aw, why not? :(', time: 2 })
        },
        submitCallback: function () {//si se confirma el reseteo se llama al servidor
            alert("Funcionalidad no implementada...");
            //notie.alert({ type: 1, text: 'El reseteo se realizo de forma correcta.', time: 2 })
        }
      })
}