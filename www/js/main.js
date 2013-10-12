initializeMap = function(center, zoom ) {
	map = L.map('map', { attributionControl: false }).setView(center, zoom);
	map.setMaxBounds([ [45.158,-74.328] , [46.019,-72.977] ] );
	if ( zoom == 11 ) {
		// Default zoom, so fitBounds()
		map.fitBounds( [ [45.4014,-73.976] , [45.722,-73.453] ] , { paddingTopLeft: [0, 50]} );
	}

	L.tileLayer('http://{s}.tile.cloudmade.com/{key}/22677/256/{z}/{x}/{y}.png', {
		attribution: 'Map data &copy; 2011 OpenStreetMap contributors, Imagery &copy; 2011 CloudMade',
		key: 'BC9A493B41014CAABB98F0471D759707'
	}).addTo(map);

	var wms_geobase = L.tileLayer.wms("http://sigp.effigis.com/geoserver/Geobase/wms?", {
		format: 'image/png',
		srs: 'EPSG:4326',
		transparent: true,
		layers: 'Geobase:geobase_mtl_4326_postgis'
	}).addTo(map);
	
	return map;
}

displayUserMarker = function( label ) {
	if ( ( typeof label == "undefined" ) || ( label == "" ) ) { return; }
	
	var marker = L.marker(mapCenter , {zIndexOffset: -10} ).addTo(map)
			.bindPopup( '<span class="black"><strong>' + label + '</strong></span>').openPopup();
}

$( document ).ready(function() {
	var map = initializeMap(mapCenter, defaultZoom);
	displayUserMarker(address);
	  
	$(".scrollable").niceScroll({cursorcolor:"#7f8c8d", cursorborder: "none" });
	
	$( '#submit' ).click(function(e) {
		e.preventDefault();
		e.stopPropagation();
		$( '#search-form').submit();
	});
	
	$('.link-box').click(function(e) {
		e.preventDefault();
		e.stopPropagation();
		target = $( $(this).attr('href') );
		if ( target.hasClass( 'box-on' ) ) {
			$( target ).removeClass('box-on').fadeToggle('fast');
		}
		else {
			$('.box-on').removeClass('box-on').hide();
			$( target ).addClass('box-on').fadeToggle('fast');
		}
		
	} );
	
});
