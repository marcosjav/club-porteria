<?php
$serverName = "192.168.0.1"; //serverName\instanceName
$connectionInfo = array( "UID"=>"US_TARJETA", "PWD"=>"crc.2020");
$conn = sqlsrv_connect( $serverName, $connectionInfo);

if( $conn ) {
     echo "Conexión establecida.<br />";
}else{
     echo "Conexión no se pudo establecer.<br />";
     die( print_r( sqlsrv_errors(), true));
}
?>
