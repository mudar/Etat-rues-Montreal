
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

	//layerCarto = cartodb.createLayer(map, 'http://hoedic.cartodb.com/api/v2/viz/ef92bc74-2b8c-11e3-8fc0-3085a9a9563c/viz.json')
	   //.addTo(map);


      var layerUrl = 'http://hoedic.cartodb.com/api/v2/viz/ef92bc74-2b8c-11e3-8fc0-3085a9a9563c/viz.json';
      var layerIntervention = 'http://hoedic.cartodb.com/api/v2/viz/104ebd34-2b95-11e3-9a0e-3085a9a9563c/viz.json';

      var sublayers = [];

      var LayerActions = {
        all: function(){
          sublayers[0].setSQL("SELECT * FROM geobase_mtl_4326_arr_stats_final").setCartoCSS('#geobase_mtl_4326_arr_stats_final{line-color: #cccccc;line-opacity: 0.8;line-width: 1;polygon-opacity: 0;[zoom <= 12] {line-width: 1;}[zoom >= 13] {line-width: 2;} [zoom >= 15] {line-width: 3.4;} [zoom >= 17] {line-width: 5;} }#geobase_mtl_4326_arr_stats_final[ ipc <= 100] {line-color:  #1a9641;}#geobase_mtl_4326_arr_stats_final[ ipc <= 79] {line-color: #a6d96a;}#geobase_mtl_4326_arr_stats_final[ ipc <= 59] {line-color: #ffffbf;}#geobase_mtl_4326_arr_stats_final[ ipc <= 39] {line-color: #fdae61;}#geobase_mtl_4326_arr_stats_final[ ipc <= 19] {line-color:#d7191c;}}');
          return true;
        },
        rep: function(){
          sublayers[0].setSQL("SELECT * FROM geobase_mtl_4326_arr_stats_final WHERE interventi = 'OUI'")
          .setCartoCSS("#geobase_mtl_4326_arr_stats_final{line-color: #c33;  line-opacity: 0.8; line-width: 3;[zoom <= 12] {line-width: 3;}[zoom >= 13] {line-width: 4;} [zoom >= 15] {line-width: 5;} [zoom >= 17] {line-width: 6;}}");
          return true;
        }
      }

      cartodb.createLayer(map, layerUrl)
        .addTo(map)
        .on('done', function(layer) {
          // change the query for the first layer
          var subLayerOptions = {
            sql: "SELECT * FROM geobase_mtl_4326_arr_stats_final WHERE interventi = 'OUI'",
            cartocss: "#geobase_mtl_4326_arr_stats_final{line-color: #c33;  line-opacity: 0.8; line-width: 3;[zoom <= 12] {line-width: 3;}[zoom >= 13] {line-width: 4;} [zoom >= 15] {line-width: 5;} [zoom >= 17] {line-width: 6;}}"
          }

          var sublayer = layer.getSubLayer(0);

          sublayer.set(subLayerOptions);

          sublayers.push(sublayer);
        })
        .on('done', function(layer) {

          // get sublayer 0 and set the infowindow template
          var sublayer = layer.getSubLayer(0);

          sublayer.infowindow.set('template', $('#infowindow_template').html());
        }).on('error', function() {
          console.log("some error occurred");
        });

        $('.button').click(function() {
        $('.button').removeClass('selected');
        $(this).addClass('selected');
        LayerActions[$(this).attr('id')]();
      });

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

setMapListeners = function() {
	var hasZoomedIn = false;
	var hasZoomedOut = false;

	map.on("dragend", function(e) {
		if ( map.getZoom() >= streetZoomLevel ) {
			$( '.borough').hide();
		}
	});

	map.on("zoomend", function(e) {
		if ( map.getZoom() >= streetZoomLevel ) {
			hasZoomedIn = true;
			map.removeLayer(boroughsGeoJsonLayer);
		}
		else if ( hasZoomedIn ) {
			hasZoomedOut = true;
			boroughsGeoJsonLayer.addTo(map);
		}
	});

/*
	layerCarto.on('done', function(layer) {
		// get sublayer 0 and set the infowindow template
		var sublayer = layer.getSubLayer(0);

		sublayer.infowindow.set('template', $('#infowindow_template').html());
	});
*/
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
		layer.setStyle(defaultStyle);

		(function(layer, properties) {
			layer.on("click", function (e) {
				map.setView(layer.getBounds().getCenter(), streetZoomLevel+1);
			});
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

	initializeUI();
	enableFullScreen();
	setMapListeners();

	boroughsGeoJsonLayer = L.geoJson(null, { onEachFeature: onEachFeature }).addTo(map);
	getBorougsGeoJSON(boroughsGeoJsonLayer);
	excludeNonBoroughs();
});
