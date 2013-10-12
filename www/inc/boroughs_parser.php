<?php

$xml_string = file_get_contents('../json/carte.xml');
$simple_xml = simplexml_load_string( $xml_string );

$boroughs = array();
foreach ( $simple_xml->arrondissement as $arrondissement ) {

	$id = (string) $arrondissement->attributes()->name;
	$boroughs[ $id ] = array(
		'name' => (string) $arrondissement->nom, 
		'population' => (int) str_replace( ' ' , '', (string) $arrondissement->population ), 
		'surface' => (float) str_replace( ',' , '.', (string) $arrondissement->superficie ) );
}
echo json_encode($boroughs, JSON_UNESCAPED_UNICODE);

