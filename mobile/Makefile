# Variables

APP_DIR=app
RELEASE_DIR=www

# Ubicación de los archivos binarios de npm
NODE_BIN=node_modules/.bin

#######################################
# REGLAS PARA LA CREACIÓN DE UN RELEASE
#######################################

copy-assets:
	rm -rf $(RELEASE_DIR)
	mkdir $(RELEASE_DIR)
	cp -R $(APP_DIR)/* $(RELEASE_DIR)
	rm -rf $(RELEASE_DIR)/css/*
	rm -rf $(RELEASE_DIR)/js/*
	rm -rf $(RELEASE_DIR)/bower_components

compile-less:
	$(NODE_BIN)/lessc --compress $(APP_DIR)/css/style.less $(RELEASE_DIR)/css/style.min.css
	
# Encuentra todos los archivos javascript del index.html de APP_DIR
# Concatena todos los archivos dejando el resultado en $(RELEASE_DIR)/js/script.min.js
concat-js:
	awk 'FNR==1{print ""}1' `cat $(APP_DIR)/index.html | grep script | grep -v src=\"cordova.js\" | grep -v less.min.js | grep -v script.min.js | sed -n 's/.*src="\([^"]*\)".*/\1/p' | sed -e 's/^/$(APP_DIR)\//'` > $(RELEASE_DIR)/js/script.min.js

# Utilizado para borrar contenido, por ejemplo todo esto:
#     <!-- [start-remove] -->
#        <link rel="stylesheet/less" href="css/style.less" />
#     <!-- [end-remove] -->
remove-tags:
	cat $(RELEASE_DIR)/index.html | sed '/start-remove/,/end-remove/d' > $(RELEASE_DIR)/index.temp.html
	rm $(RELEASE_DIR)/index.html
	mv $(RELEASE_DIR)/index.temp.html $(RELEASE_DIR)/index.html

# Quita las lineas que tengan la palabra "uncomment"
# Convirtiendo algo como esto:
#
# 	<!--[start-uncomment]>
#    	<link rel="stylesheet" href="css/style.min.css" />
# 	<![end-uncomment]-->
#
# En esto
#    	<link rel="stylesheet" href="css/style.min.css" />
uncomment:
	cat $(RELEASE_DIR)/index.html | grep -v uncomment > $(RELEASE_DIR)/index.temp.html
	rm $(RELEASE_DIR)/index.html
	mv $(RELEASE_DIR)/index.temp.html $(RELEASE_DIR)/index.html

release: copy-assets compile-less concat-js remove-tags uncomment

raw-release:
	rm -rf $(RELEASE_DIR)
	mkdir $(RELEASE_DIR)
	cp -R $(APP_DIR)/* $(RELEASE_DIR)


###############################################
# REGLAS PARA LA GENERACIÓN DE PROGRAMA CORDOVA
###############################################


.PHONY: plugins

# Instalación de las dependencias de NPM y Bower
install-dependencies:
	npm install
	$(NODE_BIN)/bower --allow-root install

prepare-dirs:
	mkdir -p platforms www

add-platforms:
	cordova platform add android
	cordova platform add ios

rm-platforms:
	rm -rf platforms

plugins:
	cordova plugin add org.apache.cordova.statusbar
	cordova plugin add org.apache.cordova.geolocation
	cordova plugin add org.apache.cordova.network-information
	cordova plugin add org.apache.cordova.camera
	cordova plugin add org.apache.cordova.file
	cordova plugin add org.apache.cordova.file-transfer
	# cordova plugin add https://github.com/wildabeast/BarcodeScanner.git
	# cordova plugin add de.appplant.cordova.plugin.local-notification
	# cordova plugin add org.apache.cordova.device
	# cordova plugin add org.apache.cordova.vibration
	# cordova plugin add org.apache.cordova.file
	# cordova plugin add org.apache.cordova.file-transfer

# Generación de iconos
cordova-icons:
	$(NODE_BIN)/cordova-icon

setup: prepare-dirs install-dependencies plugins rm-platforms add-platforms cordova-icons

# Crea un release de la aplicación y luego compila e instala en iOS
ios: release
	cordova build ios
	cordova run ios

# Crea un release de la aplicación y luego compila e instala en Android
android: release
	cordova build android
	cordova run android

# Crea un release sin optimización de la aplicación y luego compila e instala en iOS
raw-ios: raw-release
	cordova build ios
	cordova run ios

# Crea un release sin optimización de la aplicación y luego compila e instala en Android
raw-android: raw-release
	cordova build android
	cordova run android