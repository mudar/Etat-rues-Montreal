
var urlWMS = 'http://sigp.effigis.com/geoserver/Geobase/wms';
var streetZoomLevel = 14;
var defaultStyle = { weight: 1, opacity: 0, fillOpacity: 0 };
var highlightStyle = {
	color: '#888',
	weight: 1,
	opacity: 0.4,
	fillOpacity: 0.4,
	fillColor: '#888'
};
var boroughs = {"Ahuntsic-Cartierville":"ahuntsic",
	"Anjou":"anjou",
	"Cote-des-Neiges--Notre-Dame-de-Grace":"cdn",
	"Lachine":"lachine",
	"LaSalle":"lasalle",
	"Plateau-Mont-Royal":"plateau",
	"Sud-Ouest":"sudouest",
	"L'Ile-Bizard--Sainte-Genevieve":"ilebizard",
	"Mercier-Hochelaga-Maisonneuve":"mhm",
	"Montreal-Nord":"mtlnord",
	"Outremont":"outremont",
	"Pierrefonds--Roxboro":"pierrefonds",
	"Pointe-aux-Trembles-Rivieres-des-Prairies":"rdp",
	"Rosemont--La-Petite-Patrie":"rosemont",
	"Saint-Laurent":"saintlaurent",
	"St-Leonard":"saintleonard",
	"Verdun--Ile-des-Soeurs":"verdun",
	"Ville-Marie":"villemarie",
	"Villeray-Saint-Michel-Parc-Extension":"vsp"
};


globalAjaxCursorChange = function(){
	$("html").bind("ajaxStart", function(){
		$(this).addClass('busy');
	}).bind("ajaxStop", function(){
		$(this).removeClass('busy');
	});
}

initializeMap = function( center, zoom ) {
	map = L.map('map', { attributionControl: false }).setView(center, zoom);
	map.setMaxBounds([ [45.158,-74.328] , [46.019,-72.977] ] );
	if ( zoom == 11 ) {
		// Default zoom, so fitBounds()
		map.fitBounds( [ [45.4014,-73.976] , [45.722,-73.453] ] , { paddingTopLeft: [0, 50]} );
	}
	L.tileLayer('http://tile.stamen.com/toner/{z}/{x}/{y}.png', { attribution: 'Stamen'}).addTo(map);

	new L.Control.GeoSearch({
		provider: new L.GeoSearch.Provider.OpenStreetMap()
	}).addTo(map);

/*
	L.tileLayer('http://{s}.tile.cloudmade.com/{key}/22677/256/{z}/{x}/{y}.png', {
		attribution: 'Map data &copy; 2011 OpenStreetMap contributors, Imagery &copy; 2011 CloudMade',
		key: 'BC9A493B41014CAABB98F0471D759707'
	}).addTo(map);
*/
/*
	var wms_geobase = L.tileLayer.wms( urlWMS + '?', {
		format: 'image/png',
		srs: 'EPSG:4326',
		transparent: true,
		layers: 'Geobase:geobase_mtl_4326_postgis'
	}).addTo(map);
*/

// https://maps.google.ca/?cbll=45.5102370986,-73.5680059163&cbp=0,0,0,0,0&layer=c&z=16&hl=en
      layerCarto = cartodb.createLayer(map, 'http://hoedic.cartodb.com/api/v2/viz/ef92bc74-2b8c-11e3-8fc0-3085a9a9563c/viz.json')
         .addTo(map);

	return map;
}

enableFullScreen = function() {
	// create fullscreen control
	var fullScreen = new L.Control.FullScreen();
	// add fullscreen control to the map
	map.addControl(fullScreen);

	// detect fullscreen toggling
	map.on('enterFullscreen', function(){
		if(window.console) window.console.log('enterFullscreen');
	});
	map.on('exitFullscreen', function(){
		if(window.console) window.console.log('exitFullscreen');
	});
}

/*
getGeoJSON = function() {
	if ( map.getZoom() >= streetZoomLevel ) {

// 			globalAjaxCursorChange();

		var bounds = map.getBounds();
		var NW = bounds.getNorthWest();
		var SE = bounds.getSouthEast();
		alert('TODO: download data for \nSE ' + SE + ' \nNW ' + NW  );
		jQuery.getJSON( "api/" ,
			{ address: $('#address').val() ,
				latNW: NW.lat , lonNW: NW.lng , latSE: SE.lat , lonSE: SE.lng } ,
			function(data) {
				geoJsonLayer.clearLayers();
				geoJsonLayer.addData([data]);
		});

	}
}
*/

setMapListeners = function() {
	var hasZoomedIn = false;
	var hasZoomedOut = false;

	/*
	map.on("moveend", function(e) {
		getGeoJSON();
	});
	*/
	// map.addEventListener('click', onMapClick);

	map.on("dragend", function(e) {
		if ( map.getZoom() >= streetZoomLevel ) {
			$( '.borough').hide();
		}
	});

	map.on("zoomend", function(e) {
		if ( map.getZoom() >= streetZoomLevel ) {
			hasZoomedIn = true;
			map.removeLayer(boroughsGeoJsonLayer);
// 			if ( hasZoomedOut ) {
// 				$( "#footer_zoom_in" ).hide();
// 				$("#footer_wrapper").hide();
// 			}
		}
		else if ( hasZoomedIn ) {
			hasZoomedOut = true;
			boroughsGeoJsonLayer.addTo(map);
// 			$( "#footer_content .hint" ).hide();
// 			$( "#footer_zoom_in" ).show();
// 			$("#footer_wrapper").show();
		}
	});


	layerCarto.on('done', function(layer) {

		// get sublayer 0 and set the infowindow template
		var sublayer = layer.getSubLayer(0);

		sublayer.infowindow.set('template', $('#infowindow_template').html());
	});
/*
	layerCarto.on('done', function(layer) {
		layer.setInteraction(true);
		layer.on('featureOver', function(e, pos, latlng, data) {
			cartodb.log.log(e, pos, latlng, data);
		});
		layer.on('error', function(err) {
			cartodb.log.log('error: ' + err);
		});
	}).on('error', function() {
		cartodb.log.log("some error occurred");
	});
*/
	map.on("", function() {
		});
}

displayUserMarker = function( label ) {
	if ( ( typeof label == "undefined" ) || ( label == "" ) ) { return; }

	var marker = L.marker(mapCenter , {zIndexOffset: -10} ).addTo(map)
			.bindPopup( '<span class="black"><strong>' + label + '</strong></span>').openPopup();
}

getBorougsGeoJSON = function(geoJsonLayer) {

	globalAjaxCursorChange();

	var bounds = map.getBounds();
	var NW = bounds.getNorthWest();
	var SE = bounds.getSouthEast();

	jQuery.getJSON( "json/arrondissements_mtl.json" ,
		function(data) {
			geoJsonLayer.addData([data]);
	});
}

onEachFeature = function(feature, layer) {
	if (feature.properties.ARROND) {
// 		popupContent = '<span class="black"><strong>' + feature.properties.ARROND + '</strong></span>';
		layer.setStyle(defaultStyle);

		(function(layer, properties) {
			layer.on("click", function (e) {
				map.setView(layer.getBounds().getCenter(), streetZoomLevel+1);
			});
			/*
			layer.on("dblclick", function (e) {
				map.setZoomAround(e.latlng, 1+map.getZoom());
			});
			*/
			layer.on("mouseover", function (e) {
				layer.setStyle( map.getZoom() > streetZoomLevel ? defaultStyle: highlightStyle);
				toggleBoroughInfo( boroughs[feature.properties.ARROND] , true);
			});
			layer.on("mouseout", function (e) {
				layer.setStyle(defaultStyle);
				toggleBoroughInfo( boroughs[feature.properties.ARROND] , false);
			});
		})(layer, feature.properties);
	}
}


initializeUI = function() {
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
}

toggleBoroughInfo = function( boroughId , isEnabled ) {
	if ( isEnabled ) {
		$( '.borough').hide();
		$( '#'+ boroughId).show();
	}
	else {
		$( '#'+ boroughId).hide();
	}
}

excludeNonBoroughs = function() {
	boroughsGeoJsonLayer
		.on("mouseout", function (e) {
			toggleBoroughInfo('non-mtl', true);
		})
		.on("mouseover", function (e) {
			toggleBoroughInfo('non-mtl', false);
		});
}

$( document ).ready(function() {
	var layerCarto;	// initializa global var
	var map = initializeMap(mapCenter, defaultZoom);

	// displayUserMarker(address);

	initializeUI();
	enableFullScreen();
	setMapListeners();

	boroughsGeoJsonLayer = L.geoJson(null, { onEachFeature: onEachFeature }).addTo(map);
	getBorougsGeoJSON(boroughsGeoJsonLayer);
	excludeNonBoroughs();
// 	$( '#ahuntsic').show();
});
