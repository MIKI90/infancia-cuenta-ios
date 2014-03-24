
//Google Visualization API   seleccion de parquetes a utilizar
google.load('visualization', '1', {packages: ['barchart','table']});

$(document).on("ready",function(){
  //variables
    var data;
    var table;
    var year;
    var column;
    var queryString;
    var query;
    init();

    //inicializa
    function init(){
     queryString = "SELECT *";
     query = new google.visualization.Query('http://spreadsheets.google.com/tq?key=0Aj48-XxAOWJIdHZuN0JYZkZFd21BR2JyOWpXaTNrTkE&gid='+$('#query-0').val()+'&pub=1');
     $('#Botones').append("<input type='button' id='Mostrar' value='Mostrar Consulta'>");
     $( "#followingBallsG_1" ).removeClass( "noAnimation" ).addClass( "followingBallsG" );
     $( "#followingBallsG_2" ).removeClass( "noAnimation" ).addClass( "followingBallsG" );
     $( "#followingBallsG_3" ).removeClass( "noAnimation" ).addClass( "followingBallsG" );
     $( "#followingBallsG_4" ).removeClass( "noAnimation" ).addClass( "followingBallsG" );
     sendAndDrawInfo(); 
    }

    //origen spreadsheet url http://spreadsheets.google.com/tq?key=0Aj48-XxAOWJIdHZuN0JYZkZFd21BR2JyOWpXaTNrTkE&gid=0&pub=1
    //ejecuta la consulta personalizada al presionar boton "mostrar consulta" 
   $('#Mostrar').on('click',function (e) {
      //La query se inicia con un nuevo origen de datos 
      $('#querytable div').remove();
      $('#chart div').remove();
      $('#message p').remove();
      query = new google.visualization.Query('http://spreadsheets.google.com/tq?key=0Aj48-XxAOWJIdHZuN0JYZkZFd21BR2JyOWpXaTNrTkE&gid='+$('#query-0').val()+'&pub=1');
      year= document.getElementById('query-2').value;
      column = document.getElementById('query-1').value;
      //consulta tabla
      if(year!="" && column!=""){
        $( "#followingBallsG_1" ).removeClass( "noAnimation" ).addClass( "followingBallsG" );
        $( "#followingBallsG_2" ).removeClass( "noAnimation" ).addClass( "followingBallsG" );
        $( "#followingBallsG_3" ).removeClass( "noAnimation" ).addClass( "followingBallsG" );
        $( "#followingBallsG_4" ).removeClass( "noAnimation" ).addClass( "followingBallsG" );
        queryString = "SELECT A,B,"+column+" WHERE B="+String(year);
        query.setQuery(queryString);
        sendAndDraw();
        grafica();
      }
    });

  // funcion que invoca manejador de evento para obtener un datatable de la consulta
  function sendAndDraw() {
      query.send(handleQueryResponse);
    }

  // manejador que imprime la tabla con la respuesta del objeto datatable de la consulta
  function handleQueryResponse(response) {
     if (response.isError()) {
         //alert('Error in query: ' + response.getMessage() + ' ' + response.getDetailedMessage());
         $('#message').append("<p> Error in query: "+ response.getMessage() +" " + response.getDetailedMessage()+" verifique la conexion</p>");
        return;
      }
      data = response.getDataTable();
      table = new google.visualization.Table(document.getElementById('querytable'));
      $( "#followingBallsG_1" ).removeClass( "followingBallsG" ).addClass( "noAnimation" );
      $( "#followingBallsG_2" ).removeClass( "followingBallsG" ).addClass( "noAnimation" );
      $( "#followingBallsG_3" ).removeClass( "followingBallsG" ).addClass( "noAnimation" );
      $( "#followingBallsG_4" ).removeClass( "followingBallsG" ).addClass( "noAnimation" ); 
      table.draw(data, {'showRowNumber': false ,'allowHtml':false});
      google.visualization.events.addListener(table, 'select', selectHandler); // se agrega un manejador de eventos a la tabla
     // selecciona una fila de la tabla para optener un mensaje con su informacion.
     }  

  // Manejador para seleccion de fila
  function selectHandler() {
       $('#message p').remove();
       var selection = table.getSelection();
       var message = '';
       var str = '';
       var str1= '';
      for (var i = 0; i < selection.length; i++) {
         var item = selection[i];
         if (item.row != null && item.column != null) {
            str = data.getFormattedValue(item.row, item.column);
           message += '{row:' + item.row + ',column:' + item.column + '} = ' + str + '\n';
        } else if (item.row != null) {
             str = data.getFormattedValue(item.row, 0);
             str1= data.getFormattedValue(item.row, 1);
             if(str1==$('#query-2').val()){
                str1= data.getFormattedValue(item.row, 2);
             }
            //mensaje
            message += 'Para la categoria '+$('#query-0 :selected').text()+' en el rango "'+$('#query-1 :selected').text()+'" en ' + str + ' en el año '+ $('#query-2').val()+' la cifra es de '+str1+'\n';
        } else if (item.column != null) {
            str = data.getFormattedValue(0, item.column);
           message += '{row:none, column:' + item.column + '}; value (row 0) = ' + str + '\n';
        } 
      }
      if (message == '') {
       message = 'nothing';
      }
      //$('#message').append("<p>"+message+"</p>");
     // alert(message); // test del mensaje
     window.plugins.socialsharing.share(message+' http://www.derechosinfancia.org.mx');
   }

  // funcion para para graficar la consulta
  function grafica(){
      //query se inicia con un nuevo origen de datos 
      query = new google.visualization.Query('http://spreadsheets.google.com/tq?key=0Aj48-XxAOWJIdHZuN0JYZkZFd21BR2JyOWpXaTNrTkE&gid='+$('#query-0').val()+'&pub=1');
      year= document.getElementById('query-2').value;
      column = document.getElementById('query-1').value;
      //consulta grafica
      if(year!="" && column!=""){
        queryString = "SELECT A,"+column+" WHERE B="+String(year);
        query.setQuery(queryString);
        sendAndDrawChart();
      }
   }    

  // funcion que invoca manejador de evento para dibujar la grafica
  function sendAndDrawChart() {
      query.send(handleResponseChart);
    }

  // manejador de evento para graficar la consulta
  function handleResponseChart(response) {
     if (response.isError()) {
        //alert('Error in query: ' + response.getMessage() + ' ' + response.getDetailedMessage());
        $('#message').append("<p> Error in query: "+ response.getMessage() +" " + response.getDetailedMessage()+" verifique la conexion</p>");
        return;
      }
      data = response.getDataTable();
      var visualization = new google.visualization.BarChart(document.getElementById('chart'));
      visualization.draw(data, {legend: 'bottom'});
     }


  //maestro esclavo de categoria, las opciones de tipo de dato cambian de acuerdo a la categoria 
  $('#query-0').on('change',function (e){
     //query se inicia con un nuevo origen de datos 
    query = new google.visualization.Query('http://spreadsheets.google.com/tq?key=0Aj48-XxAOWJIdHZuN0JYZkZFd21BR2JyOWpXaTNrTkE&gid='+$('#query-0').val()+'&pub=1');
     //consulta
    queryString = "SELECT *";
    $('#querytable div').remove();
    $('#chart div').remove();
    $('#message p').remove();
    $('#query-1 option').remove();
    $( "#followingBallsG_1" ).removeClass( "noAnimation" ).addClass( "followingBallsG" );
    $( "#followingBallsG_2" ).removeClass( "noAnimation" ).addClass( "followingBallsG" );
    $( "#followingBallsG_3" ).removeClass( "noAnimation" ).addClass( "followingBallsG" );
    $( "#followingBallsG_4" ).removeClass( "noAnimation" ).addClass( "followingBallsG" );
    query.setQuery(queryString);
    sendAndDrawInfo();
  });

// invoca manejador de evento para tipo de dato
  function sendAndDrawInfo() {
      query.send(handleQueryResponseInfo);
    }

// manejador para optener las opciones de tipo de dato
  function handleQueryResponseInfo(response) {
     if (response.isError()) {
        //alert('Error in query: ' + response.getMessage() + ' ' + response.getDetailedMessage());
        $('#message').append("<p> Error in query: "+ response.getMessage() +" " + response.getDetailedMessage()+" verifique la conexion</p>");
        return;
      }
      data = response.getDataTable();
      $( "#followingBallsG_1" ).removeClass( "followingBallsG" ).addClass( "noAnimation" );
      $( "#followingBallsG_2" ).removeClass( "followingBallsG" ).addClass( "noAnimation" );
      $( "#followingBallsG_3" ).removeClass( "followingBallsG" ).addClass( "noAnimation" );
      $( "#followingBallsG_4" ).removeClass( "followingBallsG" ).addClass( "noAnimation" ); 
      for(var i =2; i<35;i++){
          $('#query-1').append("<option value='"+data.getColumnId(i)+"' label='"+data.getColumnLabel(i)+"'>"+data.getColumnLabel(i)+"</option>");
       }

     }
});  