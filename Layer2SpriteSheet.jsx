// Copyright 2007.  Adobe Systems, Incorporated.  All rights reserved.
// This script will export each layer in the document to a separate file.
// Written by Naoki Hada
// ZStrings and auto layout by Tom Ruark

/*
@@@BUILDINFO@@@ Export Layers to Sprite Sheet.jsx 1.0.0.16
*/

/*

// BEGIN__HARVEST_EXCEPTION_ZSTRING

<javascriptresource>
<name>$$$/JavaScripts/ExportLayersToSpriteSheet/Menu=Export Layers to Sprite Sheet...</name>
<category>layers</category>
<enableinfo>true</enableinfo>
<eventid>f42ac2d5-da04-47d5-9ece-62283ca65029</eventid>
<terminology><![CDATA[<< /Version 1
                         /Events <<
                          /f42ac2d5-da04-47d5-9ece-62283ca65029 [($$$/JavaScripts/ExportLayersToSpriteSheet/Action=Export Layers to Sprite Sheet) /noDirectParam <<
                           /message           [($$$/Actions/Key/Message=Message) /char]
                           /destination       [($$$/Actions/Key/Destination=Destination) /char]
                           /visibleOnly       [($$$/Actions/Key/CompsObject/UseVisibility=Visibility) /boolean]
                           /format            [($$$/Actions/Key/Format=Output Format) /integer]
                           /mode              [($$$/Actions/Key/Mode=Packing Mode) /integer]
                           /reverse           [($$$/Actions/Key/Reverse=Reverse Array) /boolean]
                           /pot               [($$$/Actions/Key/POT=Power of Two) /boolean]
                           /rotate            [($$$/Actions/Key/Rotate=Allow Rotation) /boolean]
                           /max_size          [($$$/Actions/Key/MaxSize=Is Maximum Size) /boolean]
                           /pretty            [($$$/Actions/Key/Pretty=Use Indentation) /boolean]
                           /hard_tabs         [($$$/Actions/Key/HardTabs=Use Tabs) /boolean]
                           /indentation       [($$$/Actions/Key/Indentation=Number of Spaces) /integer]
                           /width             [($$$/Actions/Key/Width=Atlas Width) /char]
                           /height            [($$$/Actions/Key/Height=Atlas Height) /char]
                           /padding           [($$$/Actions/Key/Padding=Padding) /char]
                           /fileType          [($$$/Actions/Key/FileType=File Type) /integer]
                           /icc               [($$$/Actions/Key/PDFGenericFormat/KeepProfile=Keep Profile) /boolean]
                           /jpegQuality       [($$$/Actions/Key/JPEGQuality=JPEG Quality) /char]
                           /psdMaxComp        [($$$/Actions/Key/MaximizePSDCompatibility=maximize compatibility for Photoshop files) /boolean]
                           /tiffCompression   [($$$/Actions/Key/TiffCompression=TIFF encoding) /char]
                           /tiffJpegQuality   [($$$/Actions/Key/TIFFJPEGQuality=TIFF JPEG Quality) /char]
                           /pdfEncoding       [($$$/Actions/Key/PDFEncoding=PDF encoding) /char]
                           /pdfJpegQuality    [($$$/Actions/Key/PDFJPEGQuality=PDF JPEG Quality) /char]
                           /targaDepth        [($$$/Actions/Key/Depth/TargaDepth=Targa depth) /char]
                           /bmpDepth          [($$$/Actions/Key/Depth/BMPDepth=BMP depth) /char]
                           /png24Transparency [($$$/Actions/Key/Layer/PNG24PreserveTransparency=PNG 24 Preserve Transparency) /boolean]
                           /png24Interlaced   [($$$/Actions/Key/Layer/PNG24Interlaced=PNG 24 Interlaced) /boolean]
                           /trim              [($$$/Actions/Key/Trim=Trim the Layers) /boolean]
                           /png8Transparency  [($$$/Actions/Key/Layer/PNG8PreserveTransparency=PNG 8 Preserve Transparency) /boolean]
                           /png8Interlaced    [($$$/Actions/Key/Layer/PNG8Interlaced=PNG 8 Interlaced) /boolean]
                          >>]
                         >>
					  >> ]]></terminology>
</javascriptresource>

// END__HARVEST_EXCEPTION_ZSTRING

*/

// enable double clicking from the Macintosh Finder or the Windows Explorer
#target photoshop

var window = {};

#include "include/json2.js"
#include "include/texpack.js"

for (var p in window) this[p] = window[p];
delete window;

// debug level: 0-2 (0:disable, 1:break on error, 2:break at beginning)
// $.level = 0;
// debugger; // launch debugger on next line

// on localized builds we pull the $$$/Strings from a .dat file, see documentation for more details
$.localize = true;

//=================================================================
// Globals
//=================================================================

// UI strings to be localized
var strTitle = localize("$$$/JavaScripts/ExportLayersToSpriteSheet/Title=Export Layers to Sprite Sheet");
var strButtonRun = localize("$$$/JavaScripts/ExportLayersToSpriteSheet/Run=Run");
var strButtonCancel = localize("$$$/JavaScripts/ExportLayersToSpriteSheet/Cancel=Cancel");
var strHelpText = localize("$$$/JavaScripts/ExportLayersToSpriteSheet/Help=Please specify the format and location for saving each layer as a sprite sheet.");
var strLabelDestination = localize("$$$/JavaScripts/ExportLayersToSpriteSheet/Destination=Destination:");
var strLabelPadding = localize("$$$/JavaScripts/ExportLayersToSpriteSheet/Padding=Padding");
var strButtonBrowse = localize("$$$/JavaScripts/ExportLayersToSpriteSheet/Browse=&Browse...");
var strCheckboxVisibleOnly = localize("$$$/JavaScripts/ExportLayersToSpriteSheet/VisibleOnly=&Visible Layers Only");
var strLabelPacking = localize("$$$/JavaScripts/ExportLayersToSpriteSheet/Packing=Packing:");
var strLabelFormat = localize("$$$/JavaScripts/ExportLayersToSpriteSheet/Format=Output Format:");
var strLabelTexture = localize("$$$/JavaScripts/ExportLayersToSpriteSheet/Texture=Texture:");
var strLabelHash = localize("$$$/JavaScripts/ExportLayersToSpriteSheet/Hash=Hash");
var strLabelArray = localize("$$$/JavaScripts/ExportLayersToSpriteSheet/Array=Array");
var strLabelReverse = localize("$$$/JavaScripts/ExportLayersToSpriteSheet/Reverse=Reverse Order");
var strLabelPretty = localize("$$$/JavaScripts/ExportLayersToSpriteSheet/Pretty=Add Indentation");
var strLabelAlgorithm = localize("$$$/JavaScripts/ExportLayersToSpriteSheet/Algorithm=Algorithm:");
var	strddAlgorithm = localize( "$$$/locale_specific/JavaScripts/ExportLayersToSpriteSheet/DDAlgorithm=100" );
var	strCheckboxPOT = localize("$$$/JavaScripts/ExportLayersToSpriteSheet/POT=&Power of Two");
var	strCheckboxMaxSize = localize("$$$/JavaScripts/ExportLayersToSpriteSheet/MaxSize=&Is Maximum");
var	strCheckboxRotate = localize("$$$/JavaScripts/ExportLayersToSpriteSheet/Rotate=&Allow Rotation");
var strLabelSpaces = localize("$$$/JavaScripts/ExportLayersToSpriteSheet/Spaces=Spaces");
var strLabelTabs = localize("$$$/JavaScripts/ExportLayersToSpriteSheet/Tabs=Tabs");
var strLabelTextureWidth = localize("$$$/JavaScripts/ExportLayersToSpriteSheet/TextureWidth=Width");
var strLabelTextureHeight = localize("$$$/JavaScripts/ExportLayersToSpriteSheet/TextureHeight=Height");
var stretTextureSize = localize( "$$$/locale_specific/JavaScripts/ExportLayersToSpriteSheet/ETTextureSize=50" );
var stretIndentation = localize( "$$$/locale_specific/JavaScripts/ExportLayersToSpriteSheet/ETIndentation=50" );
var strLabelFileType = localize("$$$/JavaScripts/ExportLayersToSpriteSheet/FileType=File Type:");
var strCheckboxIncludeICCProfile = localize("$$$/JavaScripts/ExportLayersToSpriteSheet/IncludeICC=&Include ICC Profile");
var strJPEGOptions = localize("$$$/JavaScripts/ExportLayersToSpriteSheet/JPEGOptions=JPEG Options:");
var strLabelQuality = localize("$$$/JavaScripts/ExportLayersToSpriteSheet/Quality=Quality:");
var strPSDOptions = localize("$$$/JavaScripts/ExportLayersToSpriteSheet/PSDOptions=PSD Options:");
var strCheckboxMaximizeCompatibility = localize("$$$/JavaScripts/ExportLayersToSpriteSheet/Maximize=&Maximize Compatibility");
var strTIFFOptions = localize("$$$/JavaScripts/ExportLayersToSpriteSheet/TIFFOptions=TIFF Options:");
var strLabelImageCompression = localize("$$$/JavaScripts/ExportLayersToSpriteSheet/ImageCompression=Image Compression:");
var strNone = localize("$$$/JavaScripts/ExportLayersToSpriteSheet/None=None");
var strPDFOptions = localize("$$$/JavaScripts/ExportLayersToSpriteSheet/PDFOptions=PDF Options:");
var strLabelEncoding = localize("$$$/JavaScripts/ExportLayersToSpriteSheet/Encoding=Encoding:");
var strTargaOptions = localize("$$$/JavaScripts/ExportLayersToSpriteSheet/TargaOptions=Targa Options:");
var strLabelDepth = localize("$$$/JavaScripts/ExportLayersToSpriteSheet/Depth=Depth:");
var strRadiobutton16bit = localize("$$$/JavaScripts/ExportLayersToSpriteSheet/Bit16=16bit");
var strRadiobutton24bit = localize("$$$/JavaScripts/ExportLayersToSpriteSheet/Bit24=24bit");
var strRadiobutton32bit = localize("$$$/JavaScripts/ExportLayersToSpriteSheet/Bit32=32bit");
var strBMPOptions = localize("$$$/JavaScripts/ExportLayersToSpriteSheet/BMPOptions=BMP Options:");
var strTitleSelectDestination = localize("$$$/JavaScripts/ExportLayersToSpriteSheet/SelectDestination=Select Destination");
var strAlertSpecifyDestination = localize("$$$/JavaScripts/ExportLayersToSpriteSheet/SpecifyDestination=Please specify destination.");
var strAlertDestinationNotExist = localize("$$$/JavaScripts/ExportLayersToSpriteSheet/DestionationDoesNotExist=Destination does not exist.");
var strAlertDocumentMustBeOpened = localize("$$$/JavaScripts/ExportLayersToSpriteSheet/OneDocument=There must be a document open to export!");
var strAlertDocumentMustBeSaved = localize("$$$/JavaScripts/ExportLayersToSpriteSheet/SavedDocument=The document must be saved first!");
var strConfirmDocumentMustBeSaved = localize("$$$/JavaScripts/ExportLayersToSpriteSheet/ShouldSavedDocument=Your document has unsaved changes. The changes will be automatically saved if you continue. Do you want to proceed?");
var strAlertNeedMultipleLayers = localize("$$$/JavaScripts/ExportLayersToSpriteSheet/NoLayers=The document need to have multiple layers to export!");
var strAlertWasSuccessful = localize("$$$/JavaScripts/ExportLayersToSpriteSheet/Success= was successful.");
var strUnexpectedError = localize("$$$/JavaScripts/ExportLayersToSpriteSheet/Unexpected=Unexpected error");
var strMessage = localize("$$$/JavaScripts/ExportLayersToSpriteSheet/Message=Export Layers to Sprite Sheet action settings");
var	stretQuality = localize( "$$$/locale_specific/JavaScripts/ExportLayersToSpriteSheet/ETQualityLength=30" );
var	stretDestination = localize( "$$$/locale_specific/JavaScripts/ExportLayersToSpriteSheet/ETDestinationLength=160" );
var	strddFileType = localize( "$$$/locale_specific/JavaScripts/ExportLayersToSpriteSheet/DDFileType=100" );
var	strpnlOptions = localize( "$$$/locale_specific/JavaScripts/ExportLayersToSpriteSheet/PNLOptions=100" );
var strPNG8Options = localize("$$$/JavaScripts/ExportLayersToSpriteSheet/PNG8Options=PNG-8 Options:");
var strCheckboxPNGTransparency = localize("$$$/JavaScripts/ExportLayersToSpriteSheet/Transparency=Transparency");
var strCheckboxPNGInterlaced = localize("$$$/JavaScripts/ExportLayersToSpriteSheet/Interlaced=Interlaced");
var strCheckboxTrim = localize("$$$/JavaScripts/ExportLayersToSpriteSheet/Trim=Trim Layers");
var strPNG24Options = localize("$$$/JavaScripts/ExportLayersToSpriteSheet/PNG24Options=PNG-24 Options:");

// the drop down list indexes for file type
var bmpIndex = 0;
var jpegIndex = 1;
var pdfIndex = 2;
var psdIndex = 3;
var targaIndex = 4;
var tiffIndex = 5;
var png8Index = 6;
var png24Index = 7;

// the drop down list indexes for tiff compression
var compNoneIndex = 0;
var compLZWIndex = 1;
var compZIPIndex = 2;
var compJPEGIndex = 3;

// ok and cancel button
var runButtonID = 1;
var cancelButtonID = 2;

// namespace and prefix for storing XMP metadata
var XMPNamespace = "http://ns.texpack/json/1.0/";
var XMPPrefix = "json:";

///////////////////////////////////////////////////////////////////////////////
// Dispatch
///////////////////////////////////////////////////////////////////////////////


main();


///////////////////////////////////////////////////////////////////////////////
// Functions
///////////////////////////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////////////////////////
// Function: main
// Usage: the core routine for this script
// Input: <none>
// Return: <none>
///////////////////////////////////////////////////////////////////////////////
function main() {
	// there should one document already open
	if ( app.documents.length <= 0 ) {
		if ( DialogModes.NO != app.playbackDisplayDialogs ) {
			alert( strAlertDocumentMustBeOpened );
		}
		return 'cancel'; // quit, returning 'cancel' (dont localize) makes the actions palette not record our script
	}

	// the active document must have a path
	try {
		var documentPath = Folder(app.activeDocument.fullName.parent).fsName;
	} catch(err) {
		if ( DialogModes.NO != app.playbackDisplayDialogs ) {
			alert( strAlertDocumentMustBeSaved );
		}
		return 'cancel'; // quit, returning 'cancel' (dont localize) makes the actions palette not record our script
	}

	// ask to save unsaved changes
	if (!app.activeDocument.saved) {
		if (DialogModes.NO != app.playbackDisplayDialogs ? confirm(strConfirmDocumentMustBeSaved) : true) {
			app.activeDocument.save(app.activeDocument.fullName);
		} else {
			return 'cancel'; // quit, returning 'cancel' (dont localize) makes the actions palette not record our script
		}
	}

	// the document must have multiple layers
	if ((app.activeDocument.layers.length <= 1) && (app.activeDocument.layerSets.length <= 0)) {
		if ( DialogModes.NO != app.playbackDisplayDialogs ) {
			alert( strAlertNeedMultipleLayers );
			return 'cancel'; // quit, returning 'cancel' (dont localize) makes the actions palette not record our script
		}
	}

	var documentName = app.activeDocument.name.replace(/\.[^\.]+$/, '');

	var exportInfo = new Object();

	initExportInfo(exportInfo);

	// update the export info with the metadata in the document
	getMeta(exportInfo);

	// see if I am getting descriptor parameters
	descriptorToObject(exportInfo, app.playbackParameters, strMessage, postProcessExportInfo);

	if ( DialogModes.ALL == app.playbackDisplayDialogs ) {
		if (cancelButtonID == settingDialog(exportInfo, documentPath, documentName)) {
			return 'cancel'; // quit, returning 'cancel' (dont localize) makes the actions palette not record our script
		}
	}

	try {
		var rememberMaximize;
		var needMaximize = exportInfo.psdMaxComp ? QueryStateType.ALWAYS : QueryStateType.NEVER;
		if ( exportInfo.fileType == psdIndex && app.preferences.maximizeCompatibility != needMaximize ) {
			rememberMaximize = app.preferences.maximizeCompatibility;
			app.preferences.maximizeCompatibility = needMaximize;
		}

		var originalDocument = app.activeDocument;

		var duppedDocument = getDocumentCopy(originalDocument, true);

		var frames = [];

		// generate the frame information for each layer
		generateFrames(duppedDocument, originalDocument, exportInfo, duppedDocument, frames);

		duppedDocument.close(SaveOptions.DONOTSAVECHANGES);

		// generate the output files
		processFrames(frames, originalDocument, exportInfo);

		app.activeDocument = originalDocument;

		// update the document metadata with the new export info
		addMeta(exportInfo);

		app.activeDocument.save(app.activeDocument.fullName);

		var d = objectToDescriptor(exportInfo, strMessage, preProcessExportInfo);
		app.playbackParameters = d;

		if ( rememberMaximize != undefined ) {
			app.preferences.maximizeCompatibility = rememberMaximize;
		}

		if ( DialogModes.ALL == app.playbackDisplayDialogs ) {
			alert(strTitle + strAlertWasSuccessful);
		}

		app.playbackDisplayDialogs = DialogModes.ALL;

	} catch (e) {
		if ( DialogModes.NO != app.playbackDisplayDialogs ) {
			alert(e);
		}
		return 'cancel'; // quit, returning 'cancel' (dont localize) makes the actions palette not record our script
	}
}


///////////////////////////////////////////////////////////////////////////////
// Function: settingDialog
// Usage: pop the ui and get user settings
// Input: exportInfo object containing our parameters, the document's path,
//        the document's name
// Return: on ok, the dialog info is set to the exportInfo object
///////////////////////////////////////////////////////////////////////////////
function settingDialog(exportInfo, documentPath, documentName) {
	dlgMain = new Window("dialog", strTitle);

	// match our dialog background color to the host application
	var brush = dlgMain.graphics.newBrush (dlgMain.graphics.BrushType.THEME_COLOR, "appDialogBackground");
	dlgMain.graphics.backgroundColor = brush;
	dlgMain.graphics.disabledBackgroundColor = dlgMain.graphics.backgroundColor;

	dlgMain.orientation = 'column';
	dlgMain.alignChildren = 'left';

	// -- top of the dialog, first line
	dlgMain.add("statictext", undefined, strLabelDestination);

	// -- two groups, one for left and one for right ok, cancel
	dlgMain.grpTop = dlgMain.add("group");
	dlgMain.grpTop.orientation = 'row';
	dlgMain.grpTop.alignChildren = 'top';
	dlgMain.grpTop.alignment = 'fill';

	// -- group top left
	dlgMain.grpTopLeft = dlgMain.grpTop.add("group");
	dlgMain.grpTopLeft.orientation = 'column';
	dlgMain.grpTopLeft.alignChildren = 'left';
	dlgMain.grpTopLeft.alignment = 'fill';

	// -- the second line in the dialog
	dlgMain.grpSecondLine = dlgMain.grpTopLeft.add("group");
	dlgMain.grpSecondLine.orientation = 'row';
	dlgMain.grpSecondLine.alignChildren = 'center';

	dlgMain.etDestination = dlgMain.grpSecondLine.add("edittext", undefined, makeRelativePath(exportInfo.destination.toString(), documentPath));
	dlgMain.etDestination.preferredSize.width = StrToIntWithDefault( stretDestination, 160 );

	dlgMain.btnBrowse = dlgMain.grpSecondLine.add("button", undefined, strButtonBrowse);
	dlgMain.btnBrowse.onClick = function() {
		var defaultDestination = makeAbsolutePath(dlgMain.etDestination.text, documentPath);
		var defaultFile = new File(defaultDestination);
		if (defaultFile.exists && defaultFile.length < 0) {
			defaultDestination = documentPath + '/' + documentName;
			defaultFile = new File(defaultDestination);
		}
		var selFile = defaultFile.saveDlg(strTitleSelectDestination);
		if (selFile != null) {
			var selPath = makeRelativePath(selFile.fsName, documentPath);
			dlgMain.etDestination.text = selPath.replace(/\.[^\.]+$/, '');
		}
		dlgMain.defaultElement.active = true;
	}

	// -- the fifth line in the dialog
	dlgMain.grpFifthLine = dlgMain.grpTopLeft.add("group");
	dlgMain.grpFifthLine.orientation = 'row';
	dlgMain.grpFifthLine.alignChildren = 'fill';

	dlgMain.cbVisible = dlgMain.grpFifthLine.add("checkbox", undefined, strCheckboxVisibleOnly);
	dlgMain.cbVisible.value = exportInfo.visibleOnly;

	dlgMain.cbTrim = dlgMain.grpFifthLine.add("checkbox", undefined, strCheckboxTrim.toString());
	dlgMain.cbTrim.value = exportInfo.trim;

	// -- the sixth line is the panel
	dlgMain.pnlPacking = dlgMain.grpTopLeft.add("panel", undefined, strLabelPacking);
	dlgMain.pnlPacking.alignment = 'fill';

	dlgMain.grpAlgorithm = dlgMain.pnlPacking.add("group");
	dlgMain.grpAlgorithm.orientation = 'row';
	dlgMain.grpAlgorithm.alignChildren = 'middle';
	dlgMain.grpAlgorithm.alignment = 'fill';

	dlgMain.grpAlgorithm.add("statictext", undefined, strLabelAlgorithm);

	dlgMain.ddAlgorithm = dlgMain.grpAlgorithm.add("dropdownlist");
	dlgMain.ddAlgorithm.preferredSize.width = StrToIntWithDefault( strddAlgorithm, 100 );
	dlgMain.ddAlgorithm.alignment = 'left';

	for (var i = 0; i < MaxRects.Modes.length; i++) {
		dlgMain.ddAlgorithm.add("item", MaxRects.Modes[i]);
	}

	dlgMain.ddAlgorithm.items[exportInfo.mode].selected = true;

	dlgMain.pnlFormat = dlgMain.pnlPacking.add("panel", undefined, strLabelFormat);
	dlgMain.pnlFormat.alignment = 'fill';

	dlgMain.grpPretty = dlgMain.pnlFormat.add("group");
	dlgMain.grpPretty.orientation = 'row';
	dlgMain.grpPretty.alignChildren = 'middle';
	dlgMain.grpPretty.alignment = 'fill';

	dlgMain.cbPretty = dlgMain.grpPretty.add("checkbox", undefined, strLabelPretty);
	dlgMain.cbPretty.value = exportInfo.pretty;
	dlgMain.cbPretty.hard_tabs = exportInfo.hard_tabs;

	dlgMain.rbTabs = dlgMain.grpPretty.add("radiobutton", undefined, strLabelTabs);
	dlgMain.rbTabs.value = dlgMain.cbPretty.hard_tabs;
	dlgMain.rbSpaces = dlgMain.grpPretty.add("radiobutton", undefined, strLabelSpaces);
	dlgMain.rbSpaces.value = !dlgMain.cbPretty.hard_tabs;

	dlgMain.etIndentation = dlgMain.grpPretty.add("edittext", undefined, exportInfo.indentation.toString());
	dlgMain.etIndentation.preferredSize.width = StrToIntWithDefault( stretIndentation, 50 );

	if (exportInfo.pretty) {
		dlgMain.rbTabs.enabled = true;
		dlgMain.rbSpaces.enabled = true;
		dlgMain.etIndentation.enabled = !dlgMain.cbPretty.hard_tabs;
	} else {
		dlgMain.rbTabs.enabled = false;
		dlgMain.rbSpaces.enabled = false;
		dlgMain.etIndentation.enabled = false;
	}

	dlgMain.cbPretty.onClick = function() {
		if (this.value) {
			dlgMain.rbTabs.enabled = true;
			dlgMain.rbTabs.value = this.hard_tabs;
			dlgMain.rbSpaces.enabled = true;
			dlgMain.rbSpaces.value = !this.hard_tabs;
			dlgMain.etIndentation.enabled = !this.hard_tabs;
		} else {
			dlgMain.rbTabs.enabled = false;
			dlgMain.rbSpaces.enabled = false;
			dlgMain.etIndentation.enabled = false;
		}
	}

	dlgMain.rbTabs.onClick = function() {
		dlgMain.etIndentation.enabled = false;
		dlgMain.cbPretty.hard_tabs = true;
	}
	dlgMain.rbSpaces.onClick = function() {
		dlgMain.etIndentation.enabled = true;
		dlgMain.cbPretty.hard_tabs = false;
	}

	dlgMain.grpFormat = dlgMain.pnlFormat.add("group");
	dlgMain.grpFormat.orientation = 'row';
	dlgMain.grpFormat.alignChildren = 'middle';
	dlgMain.grpFormat.alignment = 'fill';

	dlgMain.rbHash = dlgMain.grpFormat.add("radiobutton", undefined, strLabelHash);
	dlgMain.rbArray = dlgMain.grpFormat.add("radiobutton", undefined, strLabelArray);

	dlgMain.cbReverse = dlgMain.grpFormat.add("checkbox", undefined, strLabelReverse);
	dlgMain.cbReverse.value = exportInfo.reverse;

	switch (exportInfo.format) {
		case 0:
			dlgMain.rbHash.value = true;
			dlgMain.cbReverse.enabled = false;
			break;
		case 1:
			dlgMain.rbArray.value = true;
			dlgMain.cbReverse.enabled = true;
			break;
	}

	dlgMain.rbArray.onClick = function() {
		dlgMain.cbReverse.enabled = true;
	}
	dlgMain.rbHash.onClick = function() {
		dlgMain.cbReverse.enabled = false;
	}

	dlgMain.pnlTexture = dlgMain.pnlPacking.add("panel", undefined, strLabelTexture);
	dlgMain.pnlTexture.alignment = 'fill';

	dlgMain.grpTextureSize = dlgMain.pnlTexture.add("group");
	dlgMain.grpTextureSize.orientation = 'row';
	dlgMain.grpTextureSize.alignChildren = 'middle';
	dlgMain.grpTextureSize.alignment = 'fill';

	dlgMain.grpTextureSize.add("statictext", undefined, strLabelTextureWidth);

	dlgMain.etTextureWidth = dlgMain.grpTextureSize.add("edittext", undefined, exportInfo.width.toString());
	dlgMain.etTextureWidth.preferredSize.width = StrToIntWithDefault( stretTextureSize, 50 );

	dlgMain.grpTextureSize.add("statictext", undefined, strLabelTextureHeight);

	dlgMain.etTextureHeight = dlgMain.grpTextureSize.add("edittext", undefined, exportInfo.height.toString());
	dlgMain.etTextureHeight.preferredSize.width = StrToIntWithDefault( stretTextureSize, 50 );

	dlgMain.grpTextureSize.add("statictext", undefined, strLabelPadding);

	dlgMain.etPadding = dlgMain.grpTextureSize.add("edittext", undefined, exportInfo.padding.toString());
	dlgMain.etPadding.preferredSize.width = StrToIntWithDefault( stretTextureSize, 50 );

	dlgMain.grpTextureOptions = dlgMain.pnlTexture.add("group");
	dlgMain.grpTextureOptions.orientation = 'row';
	dlgMain.grpTextureOptions.alignChildren = 'middle';
	dlgMain.grpTextureOptions.alignment = 'fill';

	dlgMain.cbPOT = dlgMain.grpTextureOptions.add("checkbox", undefined, strCheckboxPOT);
	dlgMain.cbPOT.value = exportInfo.pot;

	dlgMain.cbMaxSize = dlgMain.grpTextureOptions.add("checkbox", undefined, strCheckboxMaxSize);
	dlgMain.cbMaxSize.value = exportInfo.max_size;

	dlgMain.cbRotate = dlgMain.grpTextureOptions.add("checkbox", undefined, strCheckboxRotate);
	dlgMain.cbRotate.value = exportInfo.rotate;



	// -- the sixth line is the panel
	dlgMain.pnlFileType = dlgMain.grpTopLeft.add("panel", undefined, strLabelFileType);
	dlgMain.pnlFileType.alignment = 'fill';

	// -- now a dropdown list
	dlgMain.ddFileType = dlgMain.pnlFileType.add("dropdownlist");
	dlgMain.ddFileType.preferredSize.width = StrToIntWithDefault( strddFileType, 100 );
	dlgMain.ddFileType.alignment = 'left';

	dlgMain.ddFileType.add("item", "BMP");
	dlgMain.ddFileType.add("item", "JPEG");
	dlgMain.ddFileType.add("item", "PDF");
	dlgMain.ddFileType.add("item", "PSD");
	dlgMain.ddFileType.add("item", "Targa");
	dlgMain.ddFileType.add("item", "TIFF");
	dlgMain.ddFileType.add("item", "PNG-8");
	dlgMain.ddFileType.add("item", "PNG-24");

	dlgMain.ddFileType.onChange = function() {
		hideAllFileTypePanel();
		switch(this.selection.index) {
			case bmpIndex:
				dlgMain.pnlFileType.pnlOptions.text = strBMPOptions;
				dlgMain.pnlFileType.pnlOptions.grpBMPOptions.show();
				break;
			case jpegIndex:
				dlgMain.pnlFileType.pnlOptions.text = strJPEGOptions;
				dlgMain.pnlFileType.pnlOptions.grpJPEGOptions.show();
				break;
			case tiffIndex:
				dlgMain.pnlFileType.pnlOptions.text = strTIFFOptions;
				dlgMain.pnlFileType.pnlOptions.grpTIFFOptions.show();
				break;
			case pdfIndex:
				dlgMain.pnlFileType.pnlOptions.text = strPDFOptions;
				dlgMain.pnlFileType.pnlOptions.grpPDFOptions.show();
				break;
			case targaIndex:
				dlgMain.pnlFileType.pnlOptions.text = strTargaOptions;
				dlgMain.pnlFileType.pnlOptions.grpTargaOptions.show();
				break;
			case png8Index:
				dlgMain.pnlFileType.pnlOptions.text = strPNG8Options;
				dlgMain.pnlFileType.pnlOptions.grpPNG8Options.show();
				break;
			case png24Index:
				dlgMain.pnlFileType.pnlOptions.text = strPNG24Options;
				dlgMain.pnlFileType.pnlOptions.grpPNG24Options.show();
				break;
			case psdIndex:
			default:
				dlgMain.pnlFileType.pnlOptions.text = strPSDOptions;
				dlgMain.pnlFileType.pnlOptions.grpPSDOptions.show();
				break;
		}
	}

	dlgMain.ddFileType.items[exportInfo.fileType].selected = true;

	// -- now after all the radio buttons
	dlgMain.cbIcc = dlgMain.pnlFileType.add("checkbox", undefined, strCheckboxIncludeICCProfile);
	dlgMain.cbIcc.value = exportInfo.icc;
	dlgMain.cbIcc.alignment = 'left';

	// -- now the options panel that changes
	dlgMain.pnlFileType.pnlOptions = dlgMain.pnlFileType.add("panel", undefined, "Options");
	dlgMain.pnlFileType.pnlOptions.alignment = 'fill';
	dlgMain.pnlFileType.pnlOptions.orientation = 'stack';
	dlgMain.pnlFileType.pnlOptions.preferredSize.height = StrToIntWithDefault( strpnlOptions, 100 );

	// PSD options
	dlgMain.pnlFileType.pnlOptions.grpPSDOptions = dlgMain.pnlFileType.pnlOptions.add("group");
	dlgMain.pnlFileType.pnlOptions.grpPSDOptions.cbMax = dlgMain.pnlFileType.pnlOptions.grpPSDOptions.add("checkbox", undefined, strCheckboxMaximizeCompatibility);
	dlgMain.pnlFileType.pnlOptions.grpPSDOptions.cbMax.value = exportInfo.psdMaxComp;
	dlgMain.pnlFileType.pnlOptions.grpPSDOptions.visible = (exportInfo.fileType == psdIndex);

	 // PNG8 options
	dlgMain.pnlFileType.pnlOptions.grpPNG8Options = dlgMain.pnlFileType.pnlOptions.add("group");
	dlgMain.pnlFileType.pnlOptions.grpPNG8Options.png8Trans = dlgMain.pnlFileType.pnlOptions.grpPNG8Options.add("checkbox", undefined, strCheckboxPNGTransparency.toString());
	dlgMain.pnlFileType.pnlOptions.grpPNG8Options.png8Inter = dlgMain.pnlFileType.pnlOptions.grpPNG8Options.add("checkbox", undefined, strCheckboxPNGInterlaced.toString());
	dlgMain.pnlFileType.pnlOptions.grpPNG8Options.png8Trans.value = exportInfo.png8Transparency;
	dlgMain.pnlFileType.pnlOptions.grpPNG8Options.png8Inter.value = exportInfo.png8Interlaced;
	dlgMain.pnlFileType.pnlOptions.grpPNG8Options.visible = (exportInfo.fileType == png8Index);

	// PNG24 options
	dlgMain.pnlFileType.pnlOptions.grpPNG24Options = dlgMain.pnlFileType.pnlOptions.add("group");
	dlgMain.pnlFileType.pnlOptions.grpPNG24Options.png24Trans = dlgMain.pnlFileType.pnlOptions.grpPNG24Options.add("checkbox", undefined, strCheckboxPNGTransparency.toString());
	dlgMain.pnlFileType.pnlOptions.grpPNG24Options.png24Inter = dlgMain.pnlFileType.pnlOptions.grpPNG24Options.add("checkbox", undefined, strCheckboxPNGInterlaced.toString());
	dlgMain.pnlFileType.pnlOptions.grpPNG24Options.png24Trans.value = exportInfo.png24Transparency;
	dlgMain.pnlFileType.pnlOptions.grpPNG24Options.png24Inter.value = exportInfo.png24Interlaced;
	dlgMain.pnlFileType.pnlOptions.grpPNG24Options.visible = (exportInfo.fileType == png24Index);

	// JPEG options
	dlgMain.pnlFileType.pnlOptions.grpJPEGOptions = dlgMain.pnlFileType.pnlOptions.add("group");
	dlgMain.pnlFileType.pnlOptions.grpJPEGOptions.add("statictext", undefined, strLabelQuality);
	dlgMain.pnlFileType.pnlOptions.grpJPEGOptions.etQuality = dlgMain.pnlFileType.pnlOptions.grpJPEGOptions.add("edittext", undefined, exportInfo.jpegQuality.toString());
	dlgMain.pnlFileType.pnlOptions.grpJPEGOptions.etQuality.preferredSize.width = StrToIntWithDefault( stretQuality, 30 );
	dlgMain.pnlFileType.pnlOptions.grpJPEGOptions.visible = (exportInfo.fileType == jpegIndex);

	// TIFF options
	dlgMain.pnlFileType.pnlOptions.grpTIFFOptions = dlgMain.pnlFileType.pnlOptions.add("group");
	dlgMain.pnlFileType.pnlOptions.grpTIFFOptions.orientation = 'column';
	dlgMain.pnlFileType.pnlOptions.grpTIFFOptions.visible = (exportInfo.fileType == tiffIndex);

	dlgMain.pnlFileType.pnlOptions.grpTIFFOptions.grpCompression = dlgMain.pnlFileType.pnlOptions.grpTIFFOptions.add("group");
	dlgMain.pnlFileType.pnlOptions.grpTIFFOptions.grpCompression.alignment = 'left';
	dlgMain.pnlFileType.pnlOptions.grpTIFFOptions.grpCompression.add("statictext", undefined, strLabelImageCompression);


	dlgMain.pnlFileType.pnlOptions.grpTIFFOptions.grpCompression.ddCompression = dlgMain.pnlFileType.pnlOptions.grpTIFFOptions.grpCompression.add("dropdownlist");
	dlgMain.pnlFileType.pnlOptions.grpTIFFOptions.grpCompression.ddCompression.add("item", strNone);
	dlgMain.pnlFileType.pnlOptions.grpTIFFOptions.grpCompression.ddCompression.add("item", "LZW");
	dlgMain.pnlFileType.pnlOptions.grpTIFFOptions.grpCompression.ddCompression.add("item", "ZIP");
	dlgMain.pnlFileType.pnlOptions.grpTIFFOptions.grpCompression.ddCompression.add("item", "JPEG");

	dlgMain.pnlFileType.pnlOptions.grpTIFFOptions.grpCompression.ddCompression.onChange = function() {
		if (this.selection.index == compJPEGIndex) {
			dlgMain.pnlFileType.pnlOptions.grpTIFFOptions.grpQuality.stQuality.enabled = true;
			dlgMain.pnlFileType.pnlOptions.grpTIFFOptions.grpQuality.etQuality.enabled = true;
		} else {
			dlgMain.pnlFileType.pnlOptions.grpTIFFOptions.grpQuality.stQuality.enabled = false;
			dlgMain.pnlFileType.pnlOptions.grpTIFFOptions.grpQuality.etQuality.enabled = false;
		}
	}

	dlgMain.pnlFileType.pnlOptions.grpTIFFOptions.grpQuality = dlgMain.pnlFileType.pnlOptions.grpTIFFOptions.add("group");
	dlgMain.pnlFileType.pnlOptions.grpTIFFOptions.grpQuality.alignment = 'left';
	dlgMain.pnlFileType.pnlOptions.grpTIFFOptions.grpQuality.stQuality = dlgMain.pnlFileType.pnlOptions.grpTIFFOptions.grpQuality.add("statictext", undefined, strLabelQuality);
	dlgMain.pnlFileType.pnlOptions.grpTIFFOptions.grpQuality.etQuality = dlgMain.pnlFileType.pnlOptions.grpTIFFOptions.grpQuality.add("edittext", undefined, exportInfo.tiffJpegQuality.toString());
	dlgMain.pnlFileType.pnlOptions.grpTIFFOptions.grpQuality.etQuality.preferredSize.width = StrToIntWithDefault( stretQuality, 30 );
	dlgMain.pnlFileType.pnlOptions.grpTIFFOptions.grpQuality.etQuality.graphics.disabledBackgroundColor = brush;

	var index;
	switch (exportInfo.tiffCompression) {
		case TIFFEncoding.NONE:     index = compNoneIndex; break;
		case TIFFEncoding.TIFFLZW:  index = compLZWIndex; break;
		case TIFFEncoding.TIFFZIP:  index = compZIPIndex; break;
		case TIFFEncoding.JPEG:     index = compJPEGIndex; break;
		default: index = compNoneIndex;    break;
	}

	dlgMain.pnlFileType.pnlOptions.grpTIFFOptions.grpCompression.ddCompression.items[index].selected = true;

	if (TIFFEncoding.JPEG != exportInfo.tiffCompression) { // if not JPEG
		dlgMain.pnlFileType.pnlOptions.grpTIFFOptions.grpQuality.stQuality.enabled = false;
		dlgMain.pnlFileType.pnlOptions.grpTIFFOptions.grpQuality.etQuality.enabled = false;
	}


	// PDF options
	dlgMain.pnlFileType.pnlOptions.grpPDFOptions = dlgMain.pnlFileType.pnlOptions.add("group");
	dlgMain.pnlFileType.pnlOptions.grpPDFOptions.orientation = 'column';
	dlgMain.pnlFileType.pnlOptions.grpPDFOptions.visible = (exportInfo.fileType == pdfIndex);

	dlgMain.pnlFileType.pnlOptions.grpPDFOptions.grpCompression = dlgMain.pnlFileType.pnlOptions.grpPDFOptions.add("group");
	dlgMain.pnlFileType.pnlOptions.grpPDFOptions.grpCompression.alignment = 'left';
	dlgMain.pnlFileType.pnlOptions.grpPDFOptions.grpCompression.add("statictext", undefined, strLabelEncoding);

	dlgMain.pnlFileType.pnlOptions.grpPDFOptions.grpCompression.rbZip = dlgMain.pnlFileType.pnlOptions.grpPDFOptions.grpCompression.add("radiobutton", undefined, "ZIP");
	dlgMain.pnlFileType.pnlOptions.grpPDFOptions.grpCompression.rbZip.onClick = function() {
		dlgMain.pnlFileType.pnlOptions.grpPDFOptions.grpQuality.stQuality.enabled = false;
		dlgMain.pnlFileType.pnlOptions.grpPDFOptions.grpQuality.etQuality.enabled = false;
	}

	dlgMain.pnlFileType.pnlOptions.grpPDFOptions.grpCompression.rbJpeg = dlgMain.pnlFileType.pnlOptions.grpPDFOptions.grpCompression.add("radiobutton", undefined, "JPEG");
	dlgMain.pnlFileType.pnlOptions.grpPDFOptions.grpCompression.rbJpeg.onClick = function() {
		dlgMain.pnlFileType.pnlOptions.grpPDFOptions.grpQuality.stQuality.enabled = true;
		dlgMain.pnlFileType.pnlOptions.grpPDFOptions.grpQuality.etQuality.enabled = true;
	}

	dlgMain.pnlFileType.pnlOptions.grpPDFOptions.grpQuality = dlgMain.pnlFileType.pnlOptions.grpPDFOptions.add("group");
	dlgMain.pnlFileType.pnlOptions.grpPDFOptions.grpQuality.alignment = 'left';

	dlgMain.pnlFileType.pnlOptions.grpPDFOptions.grpQuality.stQuality = dlgMain.pnlFileType.pnlOptions.grpPDFOptions.grpQuality.add("statictext", undefined, strLabelQuality);

	dlgMain.pnlFileType.pnlOptions.grpPDFOptions.grpQuality.etQuality = dlgMain.pnlFileType.pnlOptions.grpPDFOptions.grpQuality.add("edittext", undefined, exportInfo.pdfJpegQuality.toString());
	dlgMain.pnlFileType.pnlOptions.grpPDFOptions.grpQuality.etQuality.preferredSize.width = StrToIntWithDefault( stretQuality, 30 );
	dlgMain.pnlFileType.pnlOptions.grpPDFOptions.grpQuality.etQuality.graphics.disabledBackgroundColor = brush;

	switch (exportInfo.pdfEncoding) {
		case PDFEncoding.PDFZIP:
			dlgMain.pnlFileType.pnlOptions.grpPDFOptions.grpCompression.rbZip.value  = true;    break;
		case PDFEncoding.JPEG:
		default:
			dlgMain.pnlFileType.pnlOptions.grpPDFOptions.grpCompression.rbJpeg.value = true;    break;
	}

	if (PDFEncoding.JPEG != exportInfo.pdfEncoding) {
		dlgMain.pnlFileType.pnlOptions.grpPDFOptions.grpQuality.stQuality.enabled = false;
		dlgMain.pnlFileType.pnlOptions.grpPDFOptions.grpQuality.etQuality.enabled = false;
	}

	// Targa options
	dlgMain.pnlFileType.pnlOptions.grpTargaOptions = dlgMain.pnlFileType.pnlOptions.add("group");
	dlgMain.pnlFileType.pnlOptions.grpTargaOptions.add("statictext", undefined, strLabelDepth);
	dlgMain.pnlFileType.pnlOptions.grpTargaOptions.visible = (exportInfo.fileType == targaIndex);

	dlgMain.pnlFileType.pnlOptions.grpTargaOptions.rb16bit = dlgMain.pnlFileType.pnlOptions.grpTargaOptions.add( "radiobutton", undefined, strRadiobutton16bit);
	dlgMain.pnlFileType.pnlOptions.grpTargaOptions.rb24bit = dlgMain.pnlFileType.pnlOptions.grpTargaOptions.add( "radiobutton", undefined, strRadiobutton24bit);
	dlgMain.pnlFileType.pnlOptions.grpTargaOptions.rb32bit = dlgMain.pnlFileType.pnlOptions.grpTargaOptions.add( "radiobutton", undefined, strRadiobutton32bit);

	switch (exportInfo.targaDepth) {
		case TargaBitsPerPixels.SIXTEEN:     dlgMain.pnlFileType.pnlOptions.grpTargaOptions.rb16bit.value = true;   break;
		case TargaBitsPerPixels.TWENTYFOUR:  dlgMain.pnlFileType.pnlOptions.grpTargaOptions.rb24bit.value = true;   break;
		case TargaBitsPerPixels.THIRTYTWO:   dlgMain.pnlFileType.pnlOptions.grpTargaOptions.rb32bit.value = true;   break;
		default: dlgMain.pnlFileType.pnlOptions.grpTargaOptions.rb24bit.value = true;   break;
	}


	// BMP options
	dlgMain.pnlFileType.pnlOptions.grpBMPOptions = dlgMain.pnlFileType.pnlOptions.add("group");
	dlgMain.pnlFileType.pnlOptions.grpBMPOptions.add("statictext", undefined, strLabelDepth);
	dlgMain.pnlFileType.pnlOptions.grpBMPOptions.visible = (exportInfo.fileType == bmpIndex);

	dlgMain.pnlFileType.pnlOptions.grpBMPOptions.rb16bit = dlgMain.pnlFileType.pnlOptions.grpBMPOptions.add( "radiobutton", undefined, strRadiobutton16bit);
	dlgMain.pnlFileType.pnlOptions.grpBMPOptions.rb24bit = dlgMain.pnlFileType.pnlOptions.grpBMPOptions.add( "radiobutton", undefined, strRadiobutton24bit);
	dlgMain.pnlFileType.pnlOptions.grpBMPOptions.rb32bit = dlgMain.pnlFileType.pnlOptions.grpBMPOptions.add( "radiobutton", undefined, strRadiobutton32bit);

	switch (exportInfo.bmpDepth) {
		case BMPDepthType.SIXTEEN:   dlgMain.pnlFileType.pnlOptions.grpBMPOptions.rb16bit.value = true;   break;
		case BMPDepthType.TWENTYFOUR:dlgMain.pnlFileType.pnlOptions.grpBMPOptions.rb24bit.value = true;   break;
		case BMPDepthType.THIRTYTWO: dlgMain.pnlFileType.pnlOptions.grpBMPOptions.rb32bit.value = true;   break;
		default: dlgMain.pnlFileType.pnlOptions.grpBMPOptions.rb24bit.value = true;   break;
	}

	// the right side of the dialog, the ok and cancel buttons
	dlgMain.grpTopRight = dlgMain.grpTop.add("group");
	dlgMain.grpTopRight.orientation = 'column';
	dlgMain.grpTopRight.alignChildren = 'fill';

	dlgMain.btnRun = dlgMain.grpTopRight.add("button", undefined, strButtonRun );

	dlgMain.btnRun.onClick = function() {
		// check if the setting is properly
		var destination = dlgMain.etDestination.text;
		if (destination.length == 0) {
			alert(strAlertSpecifyDestination);
			return;
		}
		destination = makeAbsolutePath(destination, documentPath);
		var folder = destination.substr(0, destination.lastIndexOf('/')) + '/';
		if (folder.length > 0) {
			var testFolder = new Folder(folder);
			if (!testFolder.exists) {
				alert(strAlertDestinationNotExist);
				return;
			}
		}

		dlgMain.close(runButtonID);
	}

	dlgMain.btnCancel = dlgMain.grpTopRight.add("button", undefined, strButtonCancel );

	dlgMain.btnCancel.onClick = function() {
		dlgMain.close(cancelButtonID);
	}

	dlgMain.defaultElement = dlgMain.btnRun;
	dlgMain.cancelElement = dlgMain.btnCancel;

	// the bottom of the dialog
	dlgMain.grpBottom = dlgMain.add("group");
	dlgMain.grpBottom.orientation = 'column';
	dlgMain.grpBottom.alignChildren = 'left';
	dlgMain.grpBottom.alignment = 'fill';

	dlgMain.pnlHelp = dlgMain.grpBottom.add("panel");
	dlgMain.pnlHelp.alignment = 'fill';

	dlgMain.etHelp = dlgMain.pnlHelp.add("statictext", undefined, strHelpText, {multiline:true});
	dlgMain.etHelp.alignment = 'fill';

	dlgMain.onShow = function() {
		dlgMain.ddFileType.onChange();
	}

	// give the hosting app the focus before showing the dialog
	app.bringToFront();

	dlgMain.center();

	var result = dlgMain.show();

	if (cancelButtonID == result) {
		return result;  // close to quit
	}

	// get setting from dialog
	exportInfo.destination = makeAbsolutePath(dlgMain.etDestination.text, documentPath);
	exportInfo.visibleOnly = dlgMain.cbVisible.value;
	if (dlgMain.rbHash.value) {
		exportInfo.format = 0;
	} else if (dlgMain.rbArray.value) {
		exportInfo.format = 1;
	}
	exportInfo.mode = dlgMain.ddAlgorithm.selection.index;
	exportInfo.reverse = dlgMain.cbReverse.value;
	exportInfo.pot = dlgMain.cbPOT.value;
	exportInfo.rotate = dlgMain.cbRotate.value;
	exportInfo.max_size = dlgMain.cbMaxSize.value;
	exportInfo.pretty = dlgMain.cbPretty.value;
	exportInfo.hard_tabs = dlgMain.cbPretty.hard_tabs;
	exportInfo.indentation = dlgMain.etIndentation.text;
	exportInfo.width = dlgMain.etTextureWidth.text;
	exportInfo.height = dlgMain.etTextureHeight.text;
	exportInfo.padding = dlgMain.etPadding.text;
	exportInfo.fileType = dlgMain.ddFileType.selection.index;
	exportInfo.icc = dlgMain.cbIcc.value;
	exportInfo.jpegQuality = dlgMain.pnlFileType.pnlOptions.grpJPEGOptions.etQuality.text;
	exportInfo.psdMaxComp = dlgMain.pnlFileType.pnlOptions.grpPSDOptions.cbMax.value;
	index = dlgMain.pnlFileType.pnlOptions.grpTIFFOptions.grpCompression.ddCompression.selection.index;
	if (index == compNoneIndex) {
		exportInfo.tiffCompression = TIFFEncoding.NONE;
	}
	if (index == compLZWIndex) {
		exportInfo.tiffCompression = TIFFEncoding.TIFFLZW;
	}
	if (index == compZIPIndex) {
		exportInfo.tiffCompression = TIFFEncoding.TIFFZIP;
	}
	if (index == compJPEGIndex) {
		exportInfo.tiffCompression = TIFFEncoding.JPEG;
	}
	exportInfo.tiffJpegQuality = dlgMain.pnlFileType.pnlOptions.grpTIFFOptions.grpQuality.etQuality.text;
	if (dlgMain.pnlFileType.pnlOptions.grpPDFOptions.grpCompression.rbZip.value) {
		exportInfo.pdfEncoding = PDFEncoding.PDFZIP;
	}
	if (dlgMain.pnlFileType.pnlOptions.grpPDFOptions.grpCompression.rbJpeg.value) {
		exportInfo.pdfEncoding = PDFEncoding.JPEG;
	}
	exportInfo.pdfJpegQuality = dlgMain.pnlFileType.pnlOptions.grpPDFOptions.grpQuality.etQuality.text;
	if (dlgMain.pnlFileType.pnlOptions.grpTargaOptions.rb16bit.value) {
		exportInfo.targaDepth = TargaBitsPerPixels.SIXTEEN;
	}
	if (dlgMain.pnlFileType.pnlOptions.grpTargaOptions.rb24bit.value) {
		exportInfo.targaDepth = TargaBitsPerPixels.TWENTYFOUR;
	}
	if (dlgMain.pnlFileType.pnlOptions.grpTargaOptions.rb32bit.value) {
		exportInfo.targaDepth = TargaBitsPerPixels.THIRTYTWO;
	}
	if (dlgMain.pnlFileType.pnlOptions.grpBMPOptions.rb16bit.value) {
		exportInfo.bmpDepth = BMPDepthType.SIXTEEN;
	}
	if (dlgMain.pnlFileType.pnlOptions.grpBMPOptions.rb24bit.value) {
		exportInfo.bmpDepth = BMPDepthType.TWENTYFOUR;
	}
	if (dlgMain.pnlFileType.pnlOptions.grpBMPOptions.rb32bit.value) {
		exportInfo.bmpDepth = BMPDepthType.THIRTYTWO;
	}
	if (typeof dlgMain.cbTrim.value !== "undefined") {
		exportInfo.trim = dlgMain.cbTrim.value;
	}

	return result;
}


///////////////////////////////////////////////////////////////////////////////
// Function: getDocumentCopy
// Usage: duplicate the document and optionally make all layers invisible
// Input: reference to the original document,
//        whether the layers visibility should be set to invisible
// Return: a referencde to the duplicated copy
///////////////////////////////////////////////////////////////////////////////
function getDocumentCopy(ducumentRef, invisible) {
	app.activeDocument = ducumentRef;
	var duppedDocument = app.activeDocument.duplicate();
	duppedDocument.activeLayer = duppedDocument.layers[duppedDocument.layers.length-1]; // for removing
	if (invisible) {
		setInvisibleAllArtLayers(duppedDocument);
	}
	return duppedDocument;
}


///////////////////////////////////////////////////////////////////////////////
// Function: processFrames
// Usage: create and save the pack files from the frames according to the
//        exporting info
// Input: JavaScript array with the frames to process,
//        reference to the original document,
//        export info object containing more information
// Return: <node>, all the packets are created and saved to the destination
//         files
///////////////////////////////////////////////////////////////////////////////
function processFrames(frames, orgObj, exportInfo) {
	var results = packFrames(frames, exportInfo);

	for (var r = 0; r < results.length; r++) {
		var duppedDocument = getDocumentCopy(orgObj, true);

		var result = results[r];
		var sprites = result.sprites;

		var framesPack;

		if (exportInfo.format == 0) {
			framesPack = {};
		} else {
			framesPack = [];
		}

		for (var i = 0; i < frames.length; i++) {
			var frame = frames[i];
			for (var j = 0; j < sprites.length; j++) {
				var sprite = sprites[j];
				if (frame.name == sprite.name) {
					for (var k in sprite) {
						frame[k] = sprite[k];
					}
					if (exportInfo.format == 0) {
						framesPack[frame.name] = frame;
						delete frame.name;
					} else {
						framesPack.push(frame);
					}
					duppedDocument.artLayers[sprite.name].visible = true;
				}
			}
		}

		removeAllInvisible(duppedDocument);

		result.sprites = framesPack;

		if (exportInfo.reverse && exportInfo.format == 1) {
			result.sprites.reverse();
		}

		var outputFileName;

		if (exportInfo.pretty) {
			outputFileName = JSON.stringify(result, null, exportInfo.hard_tabs ? '\t' : parseInt(exportInfo.indentation));
		} else {
			outputFileName = JSON.stringify(result);
		}

		if (results.length > 1) {
			saveTxt(outputFileName, exportInfo, r + 1);
		} else {
			saveTxt(outputFileName, exportInfo);
		}

		duppedDocument.resizeCanvas(result.width, result.height, AnchorPosition.TOPLEFT);

		for (var i = 0; i < duppedDocument.artLayers.length; i++) {
			var layer = duppedDocument.artLayers[i];

			var layerName = layer.name;

			var rect;

			if (exportInfo.format == 0) {
				for (var j in framesPack) {
					if (j == layerName) {
						rect = framesPack[j];
					}
				}
			} else {
				for (var j = 0; j < framesPack.length; j++) {
					if (framesPack[j].name == layerName) {
						rect = framesPack[j];
					}
				}
			}

			if (!rect) {
				continue;
			}

			if (rect.rotated) {
				if (!rect.trimmed) {
					var bounds = layer.bounds;

					var left = bounds[0];
					var top = bounds[1];
					var right = bounds[2];
					var bottom = bounds[3];

					var newLeft = rect.sourceH - (top + rect.width);
					var newTop = left;

					layer.translate(-left, -top)
					layer.rotate(90, AnchorPosition.TOPLEFT);
					layer.translate(bottom - top, 0);

					layer.translate(newLeft, newTop);

				} else {
					layer.translate(-rect.offsetX, -rect.offsetY);
					layer.rotate(90, AnchorPosition.TOPLEFT);
					layer.translate(rect.height, 0);
				}
			} else {
				if (rect.trimmed) {
					layer.translate(-rect.offsetX, -rect.offsetY);
				}
			}

			layer.translate(rect.x, rect.y);
		}

		if (results.length > 1) {
			saveFile(duppedDocument, exportInfo, r + 1);
		} else {
			saveFile(duppedDocument, exportInfo);
		}

		duppedDocument.close(SaveOptions.DONOTSAVECHANGES);
	}
}


///////////////////////////////////////////////////////////////////////////////
// Function: hideAllFileTypePanel
// Usage: hide all the panels in the common actions
// Input: <none>, dlgMain is a global for this script
// Return: <none>, all panels are now hidden
///////////////////////////////////////////////////////////////////////////////
function hideAllFileTypePanel() {
	dlgMain.pnlFileType.pnlOptions.grpPSDOptions.hide();
	dlgMain.pnlFileType.pnlOptions.grpJPEGOptions.hide();
	dlgMain.pnlFileType.pnlOptions.grpTIFFOptions.hide();
	dlgMain.pnlFileType.pnlOptions.grpPDFOptions.hide();
	dlgMain.pnlFileType.pnlOptions.grpTargaOptions.hide();
	dlgMain.pnlFileType.pnlOptions.grpBMPOptions.hide();
	dlgMain.pnlFileType.pnlOptions.grpPNG8Options.hide();
	dlgMain.pnlFileType.pnlOptions.grpPNG24Options.hide();
}


///////////////////////////////////////////////////////////////////////////////
// Function: initExportInfo
// Usage: create our default parameters
// Input: a new Object
// Return: a new object with params set to default
///////////////////////////////////////////////////////////////////////////////
function initExportInfo(exportInfo) {
	exportInfo.visibleOnly = false;
	exportInfo.format = 0;
	exportInfo.mode = 0;
	exportInfo.reverse = true;
	exportInfo.pot = false;
	exportInfo.rotate = true;
	exportInfo.max_size = true;
	exportInfo.pretty = true;
	exportInfo.hard_tabs = true;
	exportInfo.indentation = new String("4");
	exportInfo.width = new String("2048");
	exportInfo.height = new String("2048");
	exportInfo.padding = new String("0");
	exportInfo.fileType = psdIndex;
	exportInfo.icc = true;
	exportInfo.jpegQuality = 8;
	exportInfo.psdMaxComp = true;
	exportInfo.tiffCompression = TIFFEncoding.NONE;
	exportInfo.tiffJpegQuality = 8;
	exportInfo.pdfEncoding = PDFEncoding.JPEG;
	exportInfo.pdfJpegQuality = 8;
	exportInfo.targaDepth = TargaBitsPerPixels.TWENTYFOUR;
	exportInfo.bmpDepth = BMPDepthType.TWENTYFOUR;
	exportInfo.png24Transparency = true;
	exportInfo.png24Interlaced = false;
	exportInfo.trim = true;
	exportInfo.png8Transparency = true;
	exportInfo.png8Interlaced = false;

	try {
		exportInfo.destination = Folder(app.activeDocument.fullName.parent).fsName; // destination folder
	} catch(someError) {
		exportInfo.destination = new String("");
	}
}


///////////////////////////////////////////////////////////////////////////////
// Function: saveFile
// Usage: the worker routine, take our params and save the file accordingly
// Input: reference to the document,
//        export info object containing more information,
//        the number to append to the file name
// Return: <none>, a file on disk
///////////////////////////////////////////////////////////////////////////////
function saveFile( docRef, exportInfo, pack) {
	var name = exportInfo.destination;
	if (pack) {
		name = name + "-" + pack;
	}

	var outputFile;

	switch (exportInfo.fileType) {
		case jpegIndex:
			docRef.bitsPerChannel = BitsPerChannelType.EIGHT;
			outputFile = new File(name + ".jpg");
			jpgSaveOptions = new JPEGSaveOptions();
			jpgSaveOptions.embedColorProfile = exportInfo.icc;
			jpgSaveOptions.quality = exportInfo.jpegQuality;
			docRef.saveAs(outputFile, jpgSaveOptions, true, Extension.LOWERCASE);
			break;
		case psdIndex:
			outputFile = new File(name + ".psd");
			psdSaveOptions = new PhotoshopSaveOptions();
			psdSaveOptions.embedColorProfile = exportInfo.icc;
			psdSaveOptions.maximizeCompatibility = exportInfo.psdMaxComp;
			docRef.saveAs(outputFile, psdSaveOptions, true, Extension.LOWERCASE);
			break;
		case tiffIndex:
			outputFile = new File(name + ".tif");
			tiffSaveOptions = new TiffSaveOptions();
			tiffSaveOptions.embedColorProfile = exportInfo.icc;
			tiffSaveOptions.imageCompression = exportInfo.tiffCompression;
			if (TIFFEncoding.JPEG == exportInfo.tiffCompression) {
				tiffSaveOptions.jpegQuality = exportInfo.tiffJpegQuality;
			}
			docRef.saveAs(outputFile, tiffSaveOptions, true, Extension.LOWERCASE);
			break;
		case pdfIndex:
			if (docRef.bitsPerChannel == BitsPerChannelType.THIRTYTWO)
				docRef.bitsPerChannel = BitsPerChannelType.SIXTEEN;
			outputFile = new File(name + ".pdf");
			pdfSaveOptions = new PDFSaveOptions();
			pdfSaveOptions.embedColorProfile = exportInfo.icc;
			pdfSaveOptions.encoding = exportInfo.pdfEncoding;
			if (PDFEncoding.JPEG == exportInfo.pdfEncoding) {
				pdfSaveOptions.jpegQuality = exportInfo.pdfJpegQuality;
			}
			docRef.saveAs(outputFile, pdfSaveOptions, true, Extension.LOWERCASE);
			break;
		case targaIndex:
			docRef.bitsPerChannel = BitsPerChannelType.EIGHT;
			outputFile = new File(name + ".tga");
			targaSaveOptions = new TargaSaveOptions();
			targaSaveOptions.resolution = exportInfo.targaDepth;
			docRef.saveAs(outputFile, targaSaveOptions, true, Extension.LOWERCASE);
			break;
		case bmpIndex:
			docRef.bitsPerChannel = BitsPerChannelType.EIGHT;
			outputFile = new File(name + ".bmp");
			bmpSaveOptions = new BMPSaveOptions();
			bmpSaveOptions.depth = exportInfo.bmpDepth;
			docRef.saveAs(outputFile, bmpSaveOptions, true, Extension.LOWERCASE);
			break;
		case png8Index:
			outputFile = saveFile(docRef, exportInfo, dlgMain.pnlFileType.pnlOptions.grpPNG24Options.png24Inter.value, dlgMain.pnlFileType.pnlOptions.grpPNG24Options.png24Trans.value);
			function saveFile( docRef, exportInfo, interlacedValue, transparencyValue) {
				var outputFile = new File( name + ".png");
				var id5 = charIDToTypeID( "Expr" );
				var desc3 = new ActionDescriptor();
				var id6 = charIDToTypeID( "Usng" );
				var desc4 = new ActionDescriptor();
				var id7 = charIDToTypeID( "Op  " );
				var id8 = charIDToTypeID( "SWOp" );
				var id9 = charIDToTypeID( "OpSa" );
				desc4.putEnumerated( id7, id8, id9 );
				var id10 = charIDToTypeID( "Fmt " );
				var id11 = charIDToTypeID( "IRFm" );
				var id12 = charIDToTypeID( "PNG8" );
				desc4.putEnumerated( id10, id11, id12 );
				var id13 = charIDToTypeID( "Intr" ); //Interlaced
				desc4.putBoolean( id13, interlacedValue );
				var id14 = charIDToTypeID( "RedA" );
				var id15 = charIDToTypeID( "IRRd" );
				var id16 = charIDToTypeID( "Prcp" ); //Algorithm
				desc4.putEnumerated( id14, id15, id16 );
				var id17 = charIDToTypeID( "RChT" );
				desc4.putBoolean( id17, false );
				var id18 = charIDToTypeID( "RChV" );
				desc4.putBoolean( id18, false );
				var id19 = charIDToTypeID( "AuRd" );
				desc4.putBoolean( id19, false );
				var id20 = charIDToTypeID( "NCol" ); //NO. Of Colors
				desc4.putInteger( id20, 256 );
				var id21 = charIDToTypeID( "Dthr" ); //Dither
				var id22 = charIDToTypeID( "IRDt" );
				var id23 = charIDToTypeID( "Dfsn" ); //Dither type
				desc4.putEnumerated( id21, id22, id23 );
				var id24 = charIDToTypeID( "DthA" );
				desc4.putInteger( id24, 100 );
				var id25 = charIDToTypeID( "DChS" );
				desc4.putInteger( id25, 0 );
				var id26 = charIDToTypeID( "DCUI" );
				desc4.putInteger( id26, 0 );
				var id27 = charIDToTypeID( "DChT" );
				desc4.putBoolean( id27, false );
				var id28 = charIDToTypeID( "DChV" );
				desc4.putBoolean( id28, false );
				var id29 = charIDToTypeID( "WebS" );
				desc4.putInteger( id29, 0 );
				var id30 = charIDToTypeID( "TDth" ); //transparency dither
				var id31 = charIDToTypeID( "IRDt" );
				var id32 = charIDToTypeID( "None" );
				desc4.putEnumerated( id30, id31, id32 );
				var id33 = charIDToTypeID( "TDtA" );
				desc4.putInteger( id33, 100 );
				var id34 = charIDToTypeID( "Trns" ); //Transparency
				desc4.putBoolean( id34, transparencyValue );
				var id35 = charIDToTypeID( "Mtt " );
				desc4.putBoolean( id35, true );		 //matte
				var id36 = charIDToTypeID( "MttR" ); //matte color
				desc4.putInteger( id36, 255 );
				var id37 = charIDToTypeID( "MttG" );
				desc4.putInteger( id37, 255 );
				var id38 = charIDToTypeID( "MttB" );
				desc4.putInteger( id38, 255 );
				var id39 = charIDToTypeID( "SHTM" );
				desc4.putBoolean( id39, false );
				var id40 = charIDToTypeID( "SImg" );
				desc4.putBoolean( id40, true );
				var id41 = charIDToTypeID( "SSSO" );
				desc4.putBoolean( id41, false );
				var id42 = charIDToTypeID( "SSLt" );
				var list1 = new ActionList();
				desc4.putList( id42, list1 );
				var id43 = charIDToTypeID( "DIDr" );
				desc4.putBoolean( id43, false );
				var id44 = charIDToTypeID( "In  " );
				desc4.putPath( id44, outputFile );
				var id45 = stringIDToTypeID( "SaveForWeb" );
				desc3.putObject( id6, id45, desc4 );

				executeAction( id5, desc3, DialogModes.NO );

				return outputFile;
			}
			//outputFile = new File(name + ".png");
			//bmpSaveOptions = new BMPSaveOptions();
			//bmpSaveOptions.depth = exportInfo.bmpDepth;
			//docRef.saveAs(outputFile, bmpSaveOptions, true, Extension.LOWERCASE);
			break;
		case png24Index:
			outputFile = saveFile(docRef, exportInfo, dlgMain.pnlFileType.pnlOptions.grpPNG24Options.png24Inter.value, dlgMain.pnlFileType.pnlOptions.grpPNG24Options.png24Trans.value);
			function saveFile( docRef, exportInfo, interlacedValue, transparencyValue) {
				var outputFile = new File( name + ".png");
				var id6 = charIDToTypeID( "Expr" );
				var desc3 = new ActionDescriptor();
				var id7 = charIDToTypeID( "Usng" );
				var desc4 = new ActionDescriptor();
				var id8 = charIDToTypeID( "Op  " );
				var id9 = charIDToTypeID( "SWOp" );
				var id10 = charIDToTypeID( "OpSa" );
				desc4.putEnumerated( id8, id9, id10 );
				var id11 = charIDToTypeID( "Fmt " );
				var id12 = charIDToTypeID( "IRFm" );
				var id13 = charIDToTypeID( "PN24" );
				desc4.putEnumerated( id11, id12, id13 );
				var id14 = charIDToTypeID( "Intr" );
				desc4.putBoolean( id14, interlacedValue );
				var id15 = charIDToTypeID( "Trns" );
				desc4.putBoolean( id15, transparencyValue );
				var id16 = charIDToTypeID( "Mtt " );
				desc4.putBoolean( id16, true );
				var id17 = charIDToTypeID( "MttR" );
				desc4.putInteger( id17, 255 );
				var id18 = charIDToTypeID( "MttG" );
				desc4.putInteger( id18, 255 );
				var id19 = charIDToTypeID( "MttB" );
				desc4.putInteger( id19, 255 );
				var id20 = charIDToTypeID( "SHTM" );
				desc4.putBoolean( id20, false );
				var id21 = charIDToTypeID( "SImg" );
				desc4.putBoolean( id21, true );
				var id22 = charIDToTypeID( "SSSO" );
				desc4.putBoolean( id22, false );
				var id23 = charIDToTypeID( "SSLt" );
				var list1 = new ActionList();
				desc4.putList( id23, list1 );
				var id24 = charIDToTypeID( "DIDr" );
				desc4.putBoolean( id24, false );
				var id25 = charIDToTypeID( "In  " );
				desc4.putPath( id25, outputFile );
				var id26 = stringIDToTypeID( "SaveForWeb" );
				desc3.putObject( id7, id26, desc4 );

				executeAction( id6, desc3, DialogModes.NO );

				return outputFile;
			}

			//outputFile = new File(name + ".png");
			//bmpSaveOptions = new BMPSaveOptions();
			//bmpSaveOptions.depth = exportInfo.bmpDepth;
			//docRef.saveAs(outputFile, bmpSaveOptions, true, Extension.LOWERCASE);
			break;
		default:
			if ( DialogModes.NO != app.playbackDisplayDialogs ) {
				alert(strUnexpectedError);
			}
			break;
	}

	if (outputFile) {
		app.open(outputFile)
	}
}


///////////////////////////////////////////////////////////////////////////////
// Function: zeroSuppress
// Usage: return a string padded to digit(s)
// Input: num to convert, digit count needed
// Return: string padded to digit length
///////////////////////////////////////////////////////////////////////////////
function zeroSuppress (num, digit) {
	var tmp = num.toString();
	while (tmp.length < digit) {
		tmp = "0" + tmp;
	}
	return tmp;
}


///////////////////////////////////////////////////////////////////////////////
// Function: setInvisibleAllArtLayers
// Usage: unlock and make invisible all art layers, recursively
// Input: document or layerset
// Return: all art layers are unlocked and invisible
///////////////////////////////////////////////////////////////////////////////
function setInvisibleAllArtLayers(obj) {
	for (var i = 0; i < obj.artLayers.length; i++) {
		obj.artLayers[i].allLocked = false;
		obj.artLayers[i].visible = false;
	}
	for (var i = 0; i < obj.layerSets.length; i++) {
		setInvisibleAllArtLayers(obj.layerSets[i]);
	}
}


///////////////////////////////////////////////////////////////////////////////
// Function: removeAllInvisibleArtLayers
// Usage: remove all the invisible art layers, recursively
// Input: document or layer set
// Return: <none>, all layers that were invisible are now gone
///////////////////////////////////////////////////////////////////////////////
function removeAllInvisibleArtLayers(obj) {
	for (var i = obj.artLayers.length-1; 0 <= i; i--) {
		try {
			if (!obj.artLayers[i].visible) {
				obj.artLayers[i].remove();
			}
		}
		catch (e) {
		}
	}
	for (var i = obj.layerSets.length-1; 0 <= i; i--) {
		removeAllInvisibleArtLayers(obj.layerSets[i]);
	}
}


///////////////////////////////////////////////////////////////////////////////
// Function: removeAllEmptyLayerSets
// Usage: find all empty layer sets and remove them, recursively
// Input: document or layer set
// Return: empty layer sets are now gone
///////////////////////////////////////////////////////////////////////////////
function removeAllEmptyLayerSets(obj) {
	var foundEmpty = true;
	for (var i = obj.layerSets.length-1; 0 <= i; i--) {
		if (removeAllEmptyLayerSets(obj.layerSets[i])) {
			obj.layerSets[i].remove();
		} else {
			foundEmpty = false;
		}
	}
	if (obj.artLayers.length > 0) {
		foundEmpty = false;
	}
	return foundEmpty;
}


///////////////////////////////////////////////////////////////////////////////
// Function: removeAllInvisible
// Usage: remove all invisible layers
// Input: document to process
// Return: <none>, the the invisible layers are now gone
///////////////////////////////////////////////////////////////////////////////
function removeAllInvisible(docRef) {
	removeAllInvisibleArtLayers(docRef);
	removeAllEmptyLayerSets(docRef);
}


///////////////////////////////////////////////////////////////////////////////
// Function: generateFrames
// Usage: find all the children in this document to save
// Input: duplicate document, original document, export info,
//        reference to document, JavaScript array to store the exported frames
// Return: <none>, documents are saved accordingly
///////////////////////////////////////////////////////////////////////////////
function generateFrames(dupObj, orgObj, exportInfo, dupDocRef, frames) {
	function pxToInt(input) {
		var inpStr = input.toString();
		inpStr = inpStr.substring(0,inpStr.indexOf(" px"));
		var retVal= parseInt(inpStr);

		return retVal;
	}

	function getTrimmedRect(bounds, rect) {
		var left = pxToInt(bounds[0]);
		var top = pxToInt(bounds[1]);
		var right = pxToInt(bounds[2]);
		var bottom = pxToInt(bounds[3]);

		rect.width = right - left;
		rect.height = bottom - top;
		rect.offsetX = left;
		rect.offsetY = top;
	}

	for (var i = 0; i < dupObj.artLayers.length; i++) {
		if (exportInfo.visibleOnly) { // visible layer only
			if (!orgObj.artLayers[i].visible) {
				continue;
			}
		}

		var layer = dupObj.artLayers[i];

		layer.visible = true;

		var layerName = layer.name;  // store layer name before change doc

		var width = pxToInt(app.activeDocument.width);
		var height = pxToInt(app.activeDocument.height);

		var rect = {
			name: layerName,
			x: 0,
			y: 0,
			width: width,
			height: height,
			offsetX: 0,
			offsetY: 0,
			sourceW: width,
			sourceH: height,
			trimmed: false
		};

		if (dlgMain.cbTrim.value == true) { //transparancy checked?
			if (activeDocument.activeLayer.isBackgroundLayer == false) { //is it anything but a background layer?
				getTrimmedRect(layer.bounds, rect);
				rect.trimmed = true;
			}
		}

		frames.push(rect);
	}

	for (var i = 0; i < dupObj.layerSets.length; i++) {
		if (exportInfo.visibleOnly) { // visible layer only
			if (!orgObj.layerSets[i].visible) {
				continue;
			}
		}
		generateFrames(dupObj.layerSets[i], orgObj.layerSets[i], exportInfo, dupDocRef, frames);  // recursive call
	}
}


///////////////////////////////////////////////////////////////////////////////
// Function: objectToDescriptor
// Usage: create an ActionDescriptor from a JavaScript Object
// Input: JavaScript Object (o)
//        object unique string (s)
//        Pre process converter (f)
// Return: ActionDescriptor
// NOTE: Only boolean, string, number and UnitValue are supported, use a pre processor
//       to convert (f) other types to one of these forms.
// REUSE: This routine is used in other scripts. Please update those if you
//        modify. I am not using include or eval statements as I want these
//        scripts self contained.
///////////////////////////////////////////////////////////////////////////////
function objectToDescriptor (o, s, f) {
	if (undefined != f) {
		o = f(o);
	}
	var d = new ActionDescriptor;
	var l = o.reflect.properties.length;
	d.putString( app.charIDToTypeID( 'Msge' ), s );
	for (var i = 0; i < l; i++ ) {
		var k = o.reflect.properties[i].toString();
		if (k == "__proto__" || k == "__count__" || k == "__class__" || k == "reflect")
			continue;
		var v = o[ k ];
		k = app.stringIDToTypeID(k);
		switch ( typeof(v) ) {
			case "boolean":
				d.putBoolean(k, v);
				break;
			case "string":
				d.putString(k, v);
				break;
			case "number":
				d.putDouble(k, v);
				break;
			default:
			{
				if ( v instanceof UnitValue ) {
					var uc = new Object;
					uc["px"] = charIDToTypeID("#Rlt"); // unitDistance
					uc["%"] = charIDToTypeID("#Prc"); // unitPercent
					d.putUnitDouble(k, uc[v.type], v.value);
				} else {
					throw( new Error("Unsupported type in objectToDescriptor " + typeof(v) ) );
				}
			}
		}
	}
	return d;
}


///////////////////////////////////////////////////////////////////////////////
// Function: descriptorToObject
// Usage: update a JavaScript Object from an ActionDescriptor
// Input: JavaScript Object (o), current object to update (output)
//        Photoshop ActionDescriptor (d), descriptor to pull new params for object from
//        object unique string (s)
//        JavaScript Function (f), post process converter utility to convert
// Return: Nothing, update is applied to passed in JavaScript Object (o)
// NOTE: Only boolean, string, number and UnitValue are supported, use a post processor
//       to convert (f) other types to one of these forms.
// REUSE: This routine is used in other scripts. Please update those if you
//        modify. I am not using include or eval statements as I want these
//        scripts self contained.
///////////////////////////////////////////////////////////////////////////////
function descriptorToObject (o, d, s, f) {
	var l = d.count;
	if (l) {
		var keyMessage = app.charIDToTypeID( 'Msge' );
		if ( d.hasKey(keyMessage) && ( s != d.getString(keyMessage) )) return;
	}
	for (var i = 0; i < l; i++ ) {
		var k = d.getKey(i); // i + 1 ?
		var t = d.getType(k);
		strk = app.typeIDToStringID(k);
		switch (t) {
			case DescValueType.BOOLEANTYPE:
				o[strk] = d.getBoolean(k);
				break;
			case DescValueType.STRINGTYPE:
				o[strk] = d.getString(k);
				break;
			case DescValueType.DOUBLETYPE:
				o[strk] = d.getDouble(k);
				break;
			case DescValueType.UNITDOUBLE:
				{
				var uc = new Object;
				uc[charIDToTypeID("#Rlt")] = "px"; // unitDistance
				uc[charIDToTypeID("#Prc")] = "%"; // unitPercent
				uc[charIDToTypeID("#Pxl")] = "px"; // unitPixels
				var ut = d.getUnitDoubleType(k);
				var uv = d.getUnitDoubleValue(k);
				o[strk] = new UnitValue( uv, uc[ut] );
				}
				break;
			case DescValueType.INTEGERTYPE:
			case DescValueType.ALIASTYPE:
			case DescValueType.CLASSTYPE:
			case DescValueType.ENUMERATEDTYPE:
			case DescValueType.LISTTYPE:
			case DescValueType.OBJECTTYPE:
			case DescValueType.RAWTYPE:
			case DescValueType.REFERENCETYPE:
			default:
				throw( new Error("Unsupported type in descriptorToObject " + t ) );
		}
	}
	if (undefined != f) {
		o = f(o);
	}
}


///////////////////////////////////////////////////////////////////////////////
// Function: preProcessExportInfo
// Usage: convert Photoshop enums to strings for storage
// Input: JavaScript Object of my params for this script
// Return: JavaScript Object with objects converted for storage
///////////////////////////////////////////////////////////////////////////////
function preProcessExportInfo(o) {
	o.tiffCompression = o.tiffCompression.toString();
	o.pdfEncoding = o.pdfEncoding.toString();
	o.targaDepth = o.targaDepth.toString();
	o.bmpDepth = o.bmpDepth.toString();
	return o;
}

///////////////////////////////////////////////////////////////////////////////
// Function: postProcessExportInfo
// Usage: convert strings from storage to Photoshop enums
// Input: JavaScript Object of my params in string form
// Return: JavaScript Object with objects in enum form
///////////////////////////////////////////////////////////////////////////////
function postProcessExportInfo(o) {
	o.tiffCompression = eval(o.tiffCompression);
	o.pdfEncoding = eval(o.pdfEncoding);
	o.targaDepth = eval(o.targaDepth);
	o.bmpDepth = eval(o.bmpDepth);
	return o;
}

///////////////////////////////////////////////////////////////////////////
// Function: StrToIntWithDefault
// Usage: convert a string to a number, first stripping all characters
// Input: string and a default number
// Return: a number
///////////////////////////////////////////////////////////////////////////
function StrToIntWithDefault( s, n ) {
	var onlyNumbers = /[^0-9]/g;
	var t = s.replace( onlyNumbers, "" );
	t = parseInt( t );
	if ( ! isNaN( t ) ) {
		n = t;
	}
	return n;
}

///////////////////////////////////////////////////////////////////////////////
// Function: saveTxt
// Usage: take our params and save the file accordingly
// Input: string to save to the output file,
//        export info object containing more information,
//        the number to append to the file name
// Return: <none>, a file on disk
///////////////////////////////////////////////////////////////////////////////
function saveTxt(txt, exportInfo, pack) {
	var name = exportInfo.destination;
	if (pack) {
		name = name + "-" + pack;
	}
	var file = File(name + ".txt");

	if (file.exists) {
		file.remove();
	}

	file.encoding = "UTF8";
	file.open("w", "TEXT");
	file.writeln(txt);
	file.close();
}

///////////////////////////////////////////////////////////////////////////
// Function: makeRelativePath
// Usage: make a path relative to the document's folder, if the input path
//        is outside the document's folder it doesn't change
// Input: string with the path, the document's path
// Return: the resulting path
///////////////////////////////////////////////////////////////////////////
function makeRelativePath(path, documentPath) {
	if (path.substring(0, documentPath.length) === documentPath) {
		path = path.replace(documentPath + '/', '');
	}
	return path;
}

///////////////////////////////////////////////////////////////////////////
// Function: makeAbsolutePath
// Usage: make a path absolute if the path is relative, otherwise the
//        input path doesn't change
// Input: string with the path, the document's path
// Return: the resulting path
///////////////////////////////////////////////////////////////////////////
function makeAbsolutePath(path, documentPath) {
	if (!(path[0] === '/')) {
		path = documentPath + '/' + path;
	}
	return path;
}

///////////////////////////////////////////////////////////////////////////////
// Function: packFrames
// Usage: pack the frames according to the passed parameters
// Input: JavaScript array with the frames to pack,
//        export info object containing more information
// Return: the packed frames
///////////////////////////////////////////////////////////////////////////////
function packFrames(frames, exportInfo) {
	var packer = new Packer({
		mode:     exportInfo.mode,
		pot:      exportInfo.pot,
		rotate:   exportInfo.rotate,
		padding:  parseInt(exportInfo.padding),
		width:    parseInt(exportInfo.width),
		height:   parseInt(exportInfo.height),
		max_size: exportInfo.max_size
	});

	if (!packer.validate_params())
		return null;

	if (!packer.load_sprites_info(frames))
		return null;

	return packer.compute_results();
}

///////////////////////////////////////////////////////////////////////////////
// Function: addMeta
// Usage: add the export info to the document raw metadata
// Input: export info object containing more information
// Return: <none>, the custom metadata in the document has now the export info
///////////////////////////////////////////////////////////////////////////////
function addMeta(exportInfo){
    if (ExternalObject.AdobeXMPScript) {
		var xmp = new XMPMeta(app.activeDocument.xmpMetadata.rawData);

		for (var property in exportInfo) {
			xmp.setProperty(XMPNamespace, property, exportInfo[property]);
		}

		app.activeDocument.xmpMetadata.rawData = xmp.serialize();

		ExternalObject.AdobeXMPScript.unload();
		ExternalObject.AdobeXMPScript = undefined;
	}
}

///////////////////////////////////////////////////////////////////////////////
// Function: getMeta
// Usage: get the export info in the document raw metadata
// Input: export info object containing more information
// Return: <none>, the export info is modified with the custom data
///////////////////////////////////////////////////////////////////////////////
function getMeta(exportInfo){
    if (!ExternalObject.AdobeXMPScript) {
        try {
			ExternalObject.AdobeXMPScript = new ExternalObject('lib:AdobeXMPScript');
		} catch (err) {
		}
    }

    if (ExternalObject.AdobeXMPScript) {
		XMPMeta.registerNamespace(XMPNamespace, XMPPrefix);

		var xmp = new XMPMeta(app.activeDocument.xmpMetadata.rawData);

		for (var property in exportInfo) {
			var value = xmp.getProperty(XMPNamespace, property);
			if (typeof value !== "undefined") {
				value = value.toString();
				if (value === "True" || value === "False") {
					value = value === "True";
				} else if (!isNaN(value)) {
					value = Number(value);
				}
				exportInfo[property] = value;
			}
		}
	}
}

// End Export Layers to Sprite Sheet.jsx
