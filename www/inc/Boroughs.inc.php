<?php

class Boroughs
{
	private $xml_path;

	function __construct()
	{
		$this->xml_path = 'xml/carte.xml';
		$this->json_path = 'json/arrondissement_stats.json';
	}

	function getBoroughs( $format = 'xml' ) {
		if ( $format == 'json' ) {
			$clean_names = $this->getBoroughsXml();
			$data = $this->getBoroughsJson();

			foreach ( $data as $k => $v ) {
				$data[$k]['name'] = $clean_names[$k]['name'];
			}
			return $data;
		}
		else {
			return $this->getBoroughsXml();
		}
	}

	private function getBoroughsXml() {
		$xml_string = file_get_contents( $this->xml_path );
		$simple_xml = simplexml_load_string( $xml_string );

		$boroughs = array();
		foreach ( $simple_xml->arrondissement as $arrondissement ) {
$rand_quality = rand(0,100);
			$id = (string) $arrondissement->attributes()->name;
			$boroughs[ $id ] = array(
				'name' => (string) $arrondissement->nom,
				'population' => (string) $arrondissement->population,
				'surface' => (string) $arrondissement->superficie ,
				'quality' => $this->_getQualityLabel( $rand_quality ),
			);
		}

// 		echo json_encode($boroughs, JSON_UNESCAPED_UNICODE);die();

		return $boroughs;
	}

	private function getBoroughsJson() {
		$json_string = file_get_contents( $this->json_path );
		$data = json_decode( $json_string );
		$boroughs = array();
		foreach ( $data->features as $arrondissement ) {

			$name = (string) $arrondissement->properties->ARROND;
			$id = $this->getBoroughId( $name );
			if( isset( $boroughs[ $id ] ) ) {
				$boroughs[ $id ]['count'] += (int) $arrondissement->properties->Count_;
				$boroughs[ $id ]['sum_long'] += (float) $arrondissement->properties->Sum_LONG;
			}
			else {
				$boroughs[ $id ] = array(
					'name' => $name,
					'count' => (int) $arrondissement->properties->Count_,
					'avg_ipc' => (int) $arrondissement->properties->Avg_IPC,
					'sum_long' => (float) $arrondissement->properties->Sum_LONG,
				);
			}
		}
		return $boroughs;
	}

	private function _getQualityLabel( $quality = null )
	{
		if ( empty( $quality ) || !is_numeric( $quality ) ) {
			return '&ndash;';
		}
		elseif ( $quality >= 80 ) {
			return 'Très bonne';
		}
		elseif ( $quality >= 65 ) {
			return 'Bonne';
		}
		elseif ( $quality >= 35 ) {
			return 'Passable';
		}
		else {
			return 'Mauvaise';
		}
	}

	private function getBoroughId( $name )
	{
		switch($name) {
			case "Ahuntsic-Cartierville": return "ahuntsic";
			case "Anjou": return "anjou";
			case "Cote-des-Neiges--Notre-Dame-de-Grace": return "cdn";
			case "Lachine": return "lachine";
			case "LaSalle": return "lasalle";
			case "Plateau-Mont-Royal": return "plateau";
			case "Sud-Ouest": return "sudouest";
			case "L'Ile-Bizard--Sainte-Genevieve": return "ilebizard";
			case "Mercier-Hochelaga-Maisonneuve": return "mhm";
			case "Montreal-Nord": return "mtlnord";
			case "Outremont": return "outremont";
			case "Pierrefonds--Roxboro": return "pierrefonds";
			case "Pointe-aux-Trembles-Rivieres-des-Prairies": return "rdp";
			case "Rosemont--La-Petite-Patrie": return "rosemont";
			case "Saint-Laurent": return "saintlaurent";
			case "St-Leonard": return "saintleonard";
			case "Verdun--Ile-des-Soeurs": return "verdun";
			case "Ville-Marie": return "villemarie";
			case "Villeray-Saint-Michel-Parc-Extension": return "vsp";
			default: die($name);
		}
	}
}
