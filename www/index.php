<?php

require( 'inc/Geocoder.inc.php' );

$address = ( empty( $_POST['address'] ) ? '' : htmlspecialchars( $_POST['address'] ) );
if ( !empty( $address ) ) {
	$Geocoder = new Geocoder();
	$geo_point = $Geocoder->get_geo_point( $address );
// print_r($geo_point );exit;
}
?><!DOCTYPE html>
<!--[if lt IE 7]>      <html class="no-js lt-ie9 lt-ie8 lt-ie7"> <![endif]-->
<!--[if IE 7]>         <html class="no-js lt-ie9 lt-ie8"> <![endif]-->
<!--[if IE 8]>         <html class="no-js lt-ie9"> <![endif]-->
<!--[if gt IE 8]><!--> <html class="no-js"> <!--<![endif]-->
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <title>État du réseau routier</title>
        <meta name="description" content="Moteur de rechercher comparatif qui permet de comprendre l'état du réseau routier à Montréal de façon interactive.">
        <meta name="viewport" content="width=device-width, initial-scale=1">

		<link rel="shortcut icon" type="image/x-icon" href="favicon.ico" />
		<link rel="icon" type="image/png" href="favicon.png" />

        <link rel="stylesheet" href="css/normalize.css">

		<link rel="stylesheet" href="js/leaflet-0.6.4/leaflet.css" />
		<!--[if lte IE 8]>
			<link rel="stylesheet" href="js/leaflet-0.6.4/leaflet.ie.css" />
		<![endif]-->

        <link rel="stylesheet" href="css/main.css">
        <script src="js/vendor/modernizr-2.6.2.min.js"></script>
    </head>
    <body>
	<!--[if lt IE 7]>
		<p class="browsehappy">You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade your browser</a> to improve your experience.</p>
	<![endif]-->

			<div id="map"></div>
<div id="wrapper">
			<header id="header">
				<h1 id="site-title">État du réseau routier &ndash; Montréal</h1>
<div id="form-wrapper">
	<form id="search-form" method="post" action="<?php echo $_SERVER['REQUEST_URI'] ?>">
		<fieldset>
			<input id="address" type="text" placeholder="Adresse&hellip;" name="address" value="<?php echo $address ?>" />
			<input type="hidden" name="submitted" value="1" />
			<input type="submit" class="hidden" value="Envoyer" />
<!-- 			<a id="submit" href="#submit">Recherche</a> -->
		</fieldset>
	</form>
</div>
			</header>
			<div role="main" id="main">
				<div id="about" class="info-box scrollable" style="display: none;">
					<h2>À propos</h2>
					&copy; Lorem ipsum dolor sit amet.
					<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris ligula velit, eleifend a massa eu, ullamcorper porta erat. Cras sit amet augue id magna aliquam malesuada id a massa. Sed ornare sem sed justo euismod, a ultrices orci tempus. Duis ultricies in elit eu fermentum. Mauris malesuada eleifend ipsum at venenatis. Fusce laoreet eu arcu ut posuere. Aliquam luctus augue et erat fringilla consectetur. Donec semper lectus dolor, ut commodo velit eleifend accumsan. Proin sed facilisis erat, vitae molestie odio. Praesent rhoncus neque felis, iaculis ullamcorper neque convallis vitae. Ut nisl nisi, pharetra vitae aliquam sed, pharetra in ipsum.</p>
				</div>
				<div id="radio-canada" class="info-box scrollable" style="display: none;">
					<h2>Radio Canada</h2>
					<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris ligula velit, eleifend a massa eu, ullamcorper porta erat. Cras sit amet augue id magna aliquam malesuada id a massa. Sed ornare sem sed justo euismod, a ultrices orci tempus. Duis ultricies in elit eu fermentum. Mauris malesuada eleifend ipsum at venenatis. Fusce laoreet eu arcu ut posuere. Aliquam luctus augue et erat fringilla consectetur. Donec semper lectus dolor, ut commodo velit eleifend accumsan. Proin sed facilisis erat, vitae molestie odio. Praesent rhoncus neque felis, iaculis ullamcorper neque convallis vitae. Ut nisl nisi, pharetra vitae aliquam sed, pharetra in ipsum.</p> 
				</div>
				<div id="ville-de-montreal" class="info-box scrollable" style="display: none;">
					<h2>Ville de Montréal</h2>
					<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis ultricies in elit eu fermentum. Mauris malesuada eleifend ipsum at venenatis. Fusce laoreet eu arcu ut posuere. Aliquam luctus augue et erat fringilla consectetur. Donec semper lectus dolor, ut commodo velit eleifend accumsan. Proin sed facilisis erat, vitae molestie odio. Praesent rhoncus neque felis, iaculis ullamcorper neque convallis vitae. Ut nisl nisi, pharetra vitae aliquam sed, pharetra in ipsum.</p> 
				</div>
				<div id="geohack" class="info-box scrollable" style="display: none;">
					<h2>Défi GéoHack 2013</h2>
					<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris ligula velit, eleifend a massa eu, ullamcorper porta erat. Cras sit amet augue id magna aliquam malesuada id a massa. Sed ornare sem sed justo euismod, a ultrices orci tempus. Duis ultricies in elit eu fermentum. Mauris malesuada eleifend ipsum at venenatis. Fusce laoreet eu arcu ut posuere. Aliquam luctus augue et erat fringilla consectetur. Donec semper lectus dolor, ut commodo velit eleifend accumsan. Proin sed facilisis erat, vitae molestie odio.</p> 
				</div>
			</div>
			<footer id="footer">
				<nav role="navigation" id="navigation">
					<ul id="main-links">
						<li><a href="#about" class="link-box">À propos</a></li>
						<li><a href="#radio-canada" class="link-box">Radio Canada</a></li>
						<li><a href="#ville-de-montreal" class="link-box">Ville de Montréal</a></li>
						<li><a href="#geohack" class="link-box">GéoHack</a></li>
					</ul>
				</nav>
			</footer>
   
</div>

        <script src="//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
        <script>window.jQuery || document.write('<script src="js/vendor/jquery-1.10.2.min.js"><\/script>')</script>
		<script src="js/leaflet-0.6.4/leaflet.js"></script>
        <script src="js/plugins.js"></script>
<script  type="text/javascript">
<?php if ( !empty( $geo_point ) && empty( $geo_point['error'] ) ): ?>
			var mapCenter = [<?php echo $geo_point['lat'] ?>, <?php echo $geo_point['lon'] ?>];
			var defaultZoom = 16;
			var address = "<?php echo $address ?>";
<?php else: ?>
			var mapCenter = [45.606832, -73.701782];
			var defaultZoom = 11;
			var address = "";
<?php endif ?>
</script>
        <script src="js/main.js"></script>

        <!-- Google Analytics: change UA-XXXXX-X to be your site's ID. -->
        <script>
            (function(b,o,i,l,e,r){b.GoogleAnalyticsObject=l;b[l]||(b[l]=
            function(){(b[l].q=b[l].q||[]).push(arguments)});b[l].l=+new Date;
            e=o.createElement(i);r=o.getElementsByTagName(i)[0];
            e.src='//www.google-analytics.com/analytics.js';
            r.parentNode.insertBefore(e,r)}(window,document,'script','ga'));
            ga('create','UA-XXXXX-X');ga('send','pageview');
        </script>
    </body>
</html>
