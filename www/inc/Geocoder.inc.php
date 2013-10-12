<?php  
class Geocoder
{

	private $auth_key;
	private $url_query;
	private $default_geo_lat;
	private $default_geo_lon;

	function __construct()
	{
		$this->auth_key = '__AUTH_KEY_HERE__';
		$this->url_query = 'http://geocoder.ca/?auth=%s&city=%s&prov=%s&locate=%s&geoit=xml&showpostal=1';
		$this->default_geo_lat = 45.606832;
		$this->default_geo_lon = -73.701782;
	}

	function get_geo_point( $address , $city = 'montreal' , $province = 'QC' )
	{
		$result = array( 'lat' => NULL , 'lon' => NULL );

		$address = trim( $address );

		if ( empty( $address ) ) {
			$result['lat'] = $this->default_geo_lat;
			$result['lon'] = $this->default_geo_lon;
			$result['is_empty_address'] = TRUE;
		}
		else {
			if ( ( strlen( $address ) <= 7 ) ) {
				$postal_code = str_replace( array( ' ' , '-' ) , '' , $address );
				if ( $this->_is_postal_code( $postal_code ) ) {
					$address = strtoupper( $postal_code );
				}
			}

			$url = sprintf( $this->url_query , $this->auth_key , $city , $province , urlencode( $address ) );

			$xml_string = file_get_contents($url );
			$simple_xml = simplexml_load_string( $xml_string );

			if ( !empty( $simple_xml->error ) ) {
				$result['error'] = array( 'code' => (string) $simple_xml->error->code , 'desc' => (string) $simple_xml->error->description );
				$result['is_empty_address'] = TRUE;
			}
			else {
				$postal_code = $simple_xml->postal;
				$result['lat'] = (float) $simple_xml->latt;
				$result['lon'] = (float) $simple_xml->longt;
			}
		}

		return $result;
	}


	function _is_postal_code( $postal_code )
	{
		//function by Roshan Bhattara(http://roshanbh.com.np)
		if( preg_match( "/^([a-ceghj-npr-tv-z]){1}[0-9]{1}[a-ceghj-npr-tv-z]{1}[0-9]{1}[a-ceghj-npr-tv-z]{1}[0-9]{1}$/i" , $postal_code ) )
			return TRUE;
		else
			return FALSE;
	}
}