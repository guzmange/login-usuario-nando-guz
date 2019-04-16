// Get the modal
var modal = document.getElementById('id01');

//retorna campo a color blanco luego de escribir en este campo
$("#uname").on('keyup', function(){
    $("#uname").css('background-color', 'white');
}).keyup();

$("#psw").on('keyup', function(){
    $("#psw").css('background-color', 'white');
}).keyup();


// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if(event.target == modal) {
        modal.style.display = "none";
        cleanFields();
    }
}

function login_process()
{
    var usu = $("#uname").val();
    var pass = $("#psw").val();
    
    if(verifyFields())
    {
        $.ajax({
            type: 'POST',
            dataType: 'json',
            url: 'http://192.168.1.42/AdminUsu/www/dbm/ProcessLogin.php',
           // url: 'http://192.168.1.42/DBM/ProcessLogin.php', //la direccion inemdiata de toda la carpeta dentro de htdocs
           data: { usuario: usu, clave : pass} , 
            success: function(resp) {
                 
                 if(resp.respuesta =='ok')
                 {
                    notie.alert({ type: 'success', text: 'Login correcto!', time: 2, position: 'top' });
                    //si el login es correcto borro el modal
                    $("#id01").css("display", "none");
                    cleanFields();//limpio campos login
                    //se coloca saludo en etiqueta con el nombre de usuario
                    
                    $("#userName").text('Bienvenido ' + resp.nombreCompleto + ' - Ultimo login: ' + retornoFecha(resp.ultimoLogin));
                    //se oculta bot[on de login]
                    $("#LoginButton").css("display", "none");
                 }else if(resp.respuesta =='error')
                 {
                    notie.alert({ type: 'error', text: resp.mensaje , time: 2, position: 'top' });
                 }

            }
        });

    }


}

//Funcion para verificar campos de usuario y clave antes de loguear usuario
function verifyFields()
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