/*
 * Copyright (C) 2009-2015 SAP SE or an SAP affiliate company. All rights reserved.
 */
jQuery.sap.require("sap.m.MessageBox");sap.ui.controller("splController.vehicles.MyVehiclesDetailAddVehicle",{onInit:function(){var s=null;s=new sap.ui.model.json.JSONModel({});sap.ui.getCore().setModel(s,"myVehiclesAddVehicleModel");this.getView().setModel(sap.ui.getCore().getModel("myVehiclesAddVehicleModel"));this.getEnumerations();this.byId("sapSplNewVehiclesDeviceType").attachChange(jQuery.proxy(this.handleSelectOfDeviceType,this));this.fnDefineControlLabelsFromLocalizationBundle();this.oShareInfo={};this.getView().addEventDelegate({onAfterShow:function(){oSapSplUtils.setIsDirty(false);}});},handleSelectOfSugesstedItem:function(e){var m=sap.ui.getCore().getModel("myVehiclesAddVehicleModel").getData();var M=m["data"];if(M["DeviceUUID"]!==e.getParameter("selectedItem").getBindingContext().getObject()["UUID"]){M["DeviceUUID"]=e.getParameter("selectedItem").getBindingContext().getObject()["UUID"];m["data"]=M;this.bDeviceAssignmentChanged=true;sap.ui.getCore().getModel("myVehiclesAddVehicleModel").setData(m);}},handleSelectOfDeviceType:function(e){this.fnToCaptureLiveChangeToSetFlag();this.byId("sapSplNewVehicleMobileDeviceID").setValue("");var d=null,s=null;s=e.getParameters().selectedItem;this.sSelectedDeviceType=s.getKey();d=this.byId("sapSplNewVehiclesDeviceID");if(s.getKey()!=="None"){this.sSelectedDeviceType=s.getKey();}if(this.sSelectedDeviceType==="Select"){d.setVisible(false);this.byId("SapSplVehicleDeviceID").setVisible(false);this.byId("sapSplNewVehicleMobileDeviceID").setVisible(false);}if(s.getKey()!=="None"&&s.getKey()!=="MOBILEIF"&&this.sSelectedDeviceType!=="Select"){this.byId("SapSplVehicleDeviceID").setVisible(true);this.byId("SapSplVehicleDeviceID").setText(oSapSplUtils.getBundle().getText("DEVICE_ID"));d.setVisible(true);this.byId("sapSplNewVehicleMobileDeviceID").setVisible(false);}else if(s.getKey()==="None"){d.setVisible(false);this.byId("SapSplVehicleDeviceID").setVisible(false);this.byId("sapSplNewVehicleMobileDeviceID").setVisible(false);d.setVisible(false);}else if(s.getKey()==="MOBILEIF"){this.byId("SapSplVehicleDeviceID").setVisible(true);d.setVisible(false);this.byId("sapSplNewVehicleMobileDeviceID").setVisible(true);this.byId("SapSplVehicleDeviceID").setText(oSapSplUtils.getBundle().getText("IMEI_NUMBER"));this.byId("sapSplNewVehiclesDeviceType").setSelectedKey(s.getKey());var D=sap.ui.getCore().getModel("SapSplMyVehicleDetailModel").getData()["DevicePublicName"];if(D&&D!=="Select Device"&&this.mode==="Edit"){this.byId("sapSplNewVehicleMobileDeviceID").setValue(D);}else{this.byId("sapSplNewVehicleMobileDeviceID").setValue("");}this.fnGetDevicesFromTSystems("MOBILE");}},handleSelectOfDeviceID:function(){},fnToCaptureLiveChangeToSetFlag:function(){if(!oSapSplUtils.getIsDirty()){oSapSplUtils.setIsDirty(true);}},fnhandleClickOfSelectDeviceID:function(e){var m=sap.ui.getCore().getModel("myVehiclesAddVehicleModel").getData();if(m["data"]["DevicePublicName"]!==e.getParameters().listItem.getBindingContext().getProperty("denotation")){this.bDeviceAssignmentChanged=true;}this.fnToCaptureLiveChangeToSetFlag();e.getSource().getParent().close();m["data"]["DevicePublicName"]=e.getParameters().listItem.getBindingContext().getProperty("denotation");m["data"]["DeviceUniqueID"]=e.getParameters().listItem.getBindingContext().getProperty("deviceId");m["data"]["DeviceUUID"]=e.getParameters().listItem.getBindingContext().getProperty("DeviceUUID");e.getSource().removeSelections();sap.ui.getCore().getModel("myVehiclesAddVehicleModel").setData(m);},fnGetSelectDevicesDialog:function(){var t=this;return new sap.m.Dialog({title:oSapSplUtils.getBundle().getText("SELECT_DEVICE_PLACEHOLDER"),content:[new sap.m.List({mode:"SingleSelectMaster",select:jQuery.proxy(t.fnhandleClickOfSelectDeviceID,t),noDataText:oSapSplUtils.getBundle().getText("NO_DATA_FOUND_TEXT"),items:{path:"/mobileDevices",template:new sap.m.StandardListItem({title:"{denotation}",description:"{deviceId}"})}})],leftButton:new sap.m.Button({text:"Cancel",press:function(e){e.getSource().getParent().close();}})}).attachAfterOpen(function(e){oSapSplUtils.fnSyncStyleClass(e.getSource());}).setModel(sap.ui.getCore().getModel("myVehiclesAddVehicleModel"));},fnGetDevicesFromTSystems:function(m){var t=this,u="",a={};this.sModeTSystems=m;var p={UUID:oSapSplUtils.getCompanyDetails()["BasicInfo_CompanyID"],accountID:this.sSelectedDeviceType};if(this.sSelectedDeviceType!=="Select"){u=oSapSplUtils.getServiceMetadata("deviceList",true);a={url:u,method:"POST",data:JSON.stringify(p),success:jQuery.proxy(t.successForTSysDevices,t),error:jQuery.proxy(t.errorForTSysDevices,t),complete:jQuery.proxy(t.completeForTSysDevices,t)};oSapSplAjaxFactory.fireAjaxCall(a);}},successForTSysDevices:function(d){if(!this.oSelectDevicesFromTSystemsDialog&&this.sModeTSystems.constructor!==String){this.oSelectDevicesFromTSystemsDialog=this.fnGetSelectDevicesDialog();}var m=sap.ui.getCore().getModel("myVehiclesAddVehicleModel").getData();oSapSplBusyDialog.getBusyDialogInstance().close();if(this.sModeTSystems.constructor!==String){this.oSelectDevicesFromTSystemsDialog.open();this.oSelectDevicesFromTSystemsDialog.getContent()[0].setBusy(true);}if(d.constructor===String){d=JSON.parse(d);}if(this.sModeTSystems.constructor!==String){m["mobileDevices"]=d;sap.ui.getCore().getModel("myVehiclesAddVehicleModel").setData(m);}else{m["mobileDeviceNames"]=d;sap.ui.getCore().getModel("myVehiclesAddVehicleModel").setData(m);}},errorForTSysDevices:function(e){jQuery.sap.log.error("fnGetDevicesFromTSystems","ajax failed","MyVehiclesDetailAddVehicle.controller.js");oSapSplBusyDialog.getBusyDialogInstance().close();if(e&&e["status"]===500){sap.ca.ui.message.showMessageBox({type:sap.ca.ui.message.Type.ERROR,message:e["status"]+" "+e.statusText,details:e.responseText});}else{sap.ca.ui.message.showMessageBox({type:sap.ca.ui.message.Type.ERROR,message:oSapSplUtils.getErrorMessagesfromErrorPayload(JSON.parse(e.responseText))["errorWarningString"],details:oSapSplUtils.getErrorMessagesfromErrorPayload(JSON.parse(e.responseText))["ufErrorObject"]});}},completeForTSysDevices:function(){if(this.oSelectDevicesFromTSystemsDialog){this.oSelectDevicesFromTSystemsDialog.getContent()[0].setBusy(false);}},getEnumerations:function(){var m=null,e=[],E="",t=this,a={};this.oEnumerationData={};m=sap.ui.getCore().getModel("myVehiclesAddVehicleModel").getData();e=["Enumeration('DeviceType')/Values?$format=json","Enumeration('VehicleType')/Values?$format=json","Enumeration('statusValue')/Values?$format=json"];for(var i=0;i<e.length;i++){E=oSapSplUtils.getFQServiceUrl("/sap/spl/xs/utils/services/utils.xsodata/")+e[i];a={url:E,success:jQuery.proxy(t.updateEnumData,t),method:"GET"};oSapSplAjaxFactory.fireAjaxCall(a);}m["enum"]=this.oEnumerationData;sap.ui.getCore().getModel("myVehiclesAddVehicleModel").setData(m);},updateEnumData:function(d){var r=[];if(d.d.results){r=d.d.results;}if(r.length>0){this.oEnumerationData[r[0].Name]=r;}},fnDefineControlLabelsFromLocalizationBundle:function(){this.byId("SapSPlAddVehicleSimpleForm").setTitle(oSapSplUtils.getBundle().getText("ADD_TRUCK_TITLE"));this.byId("SapSplVehicleRegistrationNumberLabel").setText(oSapSplUtils.getBundle().getText("VEHICLE_REGISTRATION_NUMBER"));this.byId("SapSplVehicleVehicleTypeLabel").setText(oSapSplUtils.getBundle().getText("VEHICLE_TYPE"));this.byId("SapSplVehiclePublicName").setText(oSapSplUtils.getBundle().getText("VEHICLE_PUBLIC_NAME"));this.byId("SapSplVehicleDeviceType").setText(oSapSplUtils.getBundle().getText("DEVICE_TYPE"));this.byId("SapSplVehicleDeviceID").setText(oSapSplUtils.getBundle().getText("DEVICE_ID"));this.byId("MyVehiclesFormTitle_Truck").setText(oSapSplUtils.getBundle().getText("TRUCK_DETAILS_TITLE"));this.byId("MyVehiclesFormTitle_Device").setText(oSapSplUtils.getBundle().getText("DEVICE_DETAILS_TITLE"));this.byId("NewContactRegistrationDetailPage").setTitle(oSapSplUtils.getBundle().getText("ADD_VEHICLE_TITLE"));this.byId("addVehicleSave").setText(oSapSplUtils.getBundle().getText("NEW_CONTACT_SAVE"));this.byId("addVehicleCancel").setText(oSapSplUtils.getBundle().getText("MY_COLLEAGUES_CANCEL_BUTTON"));this.byId("SapSplVehicleDriver").setText(oSapSplUtils.getBundle().getText("DRIVER_NAME"));},onBeforeShow:function(e){var m=null,c=null,d=null;d=this.byId("sapSplNewVehiclesDeviceID");this.byId("SapSplVehicleDeviceID").setVisible(false);this.byId("sapSplNewVehiclesDeviceID").setVisible(false);this.byId("sapSplNewVehicleMobileDeviceID").setVisible(false);m=e.data.mode;c=e.data.context;this.mode=m;if(c){if(m&&m==="Edit"){this.byId("SapSplVehicleDeviceID").setVisible(false);d.setVisible(true);var D=this.byId("sapSplNewVehiclesDeviceType");D.setEnabled(true);this.byId("NewContactRegistrationDetailPage").setTitle(oSapSplUtils.getBundle().getText("MY_VEHICLE_TITLE_IN_EDIT",[c["RegistrationNumber"]]));this.byId("SapSPlAddVehicleSimpleForm").setTitle("");if(D.getItemByKey(c["DeviceType"])){D.setSelectedKey(c["DeviceType"]);D.setSelectedItem(D.getItemByKey(c["DeviceType"]));D.fireChange({selectedItem:D.getItemByKey(c["DeviceType"])});}else{this.byId("sapSplNewVehiclesDeviceType").setSelectedKey("None");this.sSelectedDeviceType="None";d.setVisible(false);}this.byId("sapSplNewVehiclesVehicleType").setSelectedKey(c["Type"]);this.byId("SapSplNewVehiclesVehicleRegistrationNumber").setEditable(true);if(c["DriverName"]){var n=c["DriverName"].split(", ");c["VehicleDriverFirstName"]=n[0];c["VehicleDriverLastName"]=n[1];}this.updateEnumsWithNone("add");this.addRemoveNoneFromTruckTypeEnum("remove");c["mode"]=m;var o=sap.ui.getCore().getModel("myVehiclesAddVehicleModel").getData();oSapSplUtils.setIsDirty(false);o["isCancel"]=false;o["data"]=c;sap.ui.getCore().getModel("myVehiclesAddVehicleModel").setData(o);}else{this.sSelectedDeviceType="Select";d.setVisible(false);this.byId("SapSplVehicleDeviceID").setVisible(false);this.byId("sapSplNewVehicleMobileDeviceID").setVisible(false);this.updateEnumsWithNone("remove");this.addRemoveNoneFromTruckTypeEnum("add");this.byId("sapSplNewVehiclesVehicleType").setSelectedItem(null);this.byId("sapSplNewVehiclesDeviceType").setSelectedItem(null);this.byId("sapSplNewVehiclesDeviceType").fireChange({selectedItem:this.byId("sapSplNewVehiclesDeviceType").getItems()[0]});this.byId("sapSplNewVehiclesDeviceType").setEnabled(true);this.byId("SapSplNewVehiclesVehicleRegistrationNumber").setEditable(true);this.byId("NewContactRegistrationDetailPage").setTitle(oSapSplUtils.getBundle().getText("ADD_VEHICLE_TITLE"));this.byId("SapSPlAddVehicleSimpleForm").setTitle(oSapSplUtils.getBundle().getText("ADD_TRUCK_TITLE"));var a=sap.ui.getCore().getModel("myVehiclesAddVehicleModel").getData();oSapSplUtils.setIsDirty(false);a["isCancel"]=false;a["data"]=c;sap.ui.getCore().getModel("myVehiclesAddVehicleModel").setData(a);}}},addRemoveNoneFromTruckTypeEnum:function(m){var M=null,v=[];M=sap.ui.getCore().getModel("myVehiclesAddVehicleModel").getData();var p={};p["Value"]="Select";p["Value.description"]=oSapSplUtils.getBundle().getText("PLEASE_SELECT_PLACEHOLDER");if(M["enum"]["VehicleType"]){v=M["enum"]["VehicleType"];if(m==="add"){if(v.length>0&&v[0]["Value"]!=="Select"){v.splice(0,0,p);}}else{if(v.length>0&&v[0]["Value"]==="Select"){v.shift();}}M["enum"]["VehicleType"]=v;sap.ui.getCore().getModel("myVehiclesAddVehicleModel").setData(M);}},updateEnumsWithNone:function(m){var M=null,d=null,n=null,t=null,s=null;M=sap.ui.getCore().getModel("myVehiclesAddVehicleModel").getData();if(M["enum"]["DeviceType"]){d=M["enum"]["DeviceType"];if(d.constructor===Array&&d.length>0){if(m==="add"){if(d[0]["Value"]!=="None"&&d[0]["Value"]!=="Select"){n={};n["Value"]="None";n["Value.description"]=oSapSplUtils.getBundle().getText("PLEASE_SELECT_PLACEHOLDER");t=d[0];d[0]=n;d[d.length]=t;}}else{if(d[0]["Value"]==="None"){d[0]["Value"]="Select";d[0]["Value.description"]=oSapSplUtils.getBundle().getText("PLEASE_SELECT_PLACEHOLDER");}else{if(d[0]["Value"]!=="Select"&&d[0]["Value"]!=="None"){s={};s["Value"]="Select";s["Value.description"]=oSapSplUtils.getBundle().getText("PLEASE_SELECT_PLACEHOLDER");t=d[0];d[0]=s;d[d.length]=t;}}}}}M["enum"]["DeviceType"]=d;sap.ui.getCore().getModel("myVehiclesAddVehicleModel").setData(M);},fireCancelAction:function(){var t=this,s,m;m=sap.ui.getCore().getModel("myVehiclesAddVehicleModel").getData();m["isCancel"]=true;sap.ui.getCore().getModel("myVehiclesAddVehicleModel").setData(m);s=jQuery.extend(true,{},sap.ui.getCore().getModel("SapSplMyVehicleDetailModel").getData());if(oSapSplUtils.getIsDirty()){sap.m.MessageBox.show(oSapSplUtils.getBundle().getText("DATA_LOSS_WARNING_TEXT"),sap.m.MessageBox.Icon.WARNING,oSapSplUtils.getBundle().getText("WARNING"),[sap.m.MessageBox.Action.YES,sap.m.MessageBox.Action.CANCEL],function(a){if(a==="YES"){jQuery.proxy(t.callToNavInDetailVehicle(s),t);t.selectMasterListItemOnBackNavigation("SapSplMyVehicleDetailModel");oSapSplUtils.setIsDirty(false);}},null,oSapSplUtils.fnSyncStyleClass("messageBox"));}else{this.callToNavInDetailVehicle(s);this.selectMasterListItemOnBackNavigation("SapSplMyVehicleDetailModel");}},callToNavInDetailVehicle:function(m){var b=sap.ui.getCore().getEventBus();b.publish("navInDetailVehicle","to",{from:this.getView(),data:{context:m}});},selectMasterListItemOnBackNavigation:function(m){var i,c,a;c=sap.ui.getCore().getModel(m).getData();a=oSapSplUtils.getCurrentMasterPageVehicle().byId("SapSplVehiclesList");for(i=0;i<a.getItems().length;i++){if(a.getItems()[i].sId.indexOf("SapSplVehiclesListItem")!==-1){if(a.getItems()[i].getBindingContext().getProperty().UUID===c.UUID){a.setSelectedItem(a.getItems()[i]);break;}}}if(a.getItems().length===0){var e={};e["isClicked"]=false;e["noData"]=true;e["showFooterButtons"]=false;e["isEdit"]=false;e["isEditable"]=false;sap.ui.getCore().getModel("SapSplMyVehicleDetailModel").setData(e);}},fireSaveAction:function(){var p=null,t=this,u="",a={};oSapSplBusyDialog.getBusyDialogInstance({title:oSapSplUtils.getBundle().getText("BUSY_DIALOG_MESSAGE")}).open();p=this.preparePayLoad();u=oSapSplUtils.getServiceMetadata("deviceVehicleAssignment",true);a={url:u,method:"PUT",data:JSON.stringify(p),success:jQuery.proxy(t.successForSaveAction,t),error:jQuery.proxy(t.errorForSaveAction,t),complete:jQuery.proxy(t.completeForSaveAction,t)};oSapSplAjaxFactory.fireAjaxCall(a);},successForSaveAction:function(d,s,m){if(d.constructor===String){d=JSON.parse(d);}var a=sap.ui.getCore().getModel("myVehiclesAddVehicleModel").getData().data;oSapSplBusyDialog.getBusyDialogInstance().close();if(m["status"]===200&&d["Error"].length===0){var c=new sap.ui.core.CustomData({key:"bRefreshTile",value:true});oSplBaseApplication.getAppInstance().getCurrentPage().destroyCustomData();oSplBaseApplication.getAppInstance().getCurrentPage().addCustomData(c);if(a.mode==="Edit"){sap.ca.ui.message.showMessageToast(oSapSplUtils.getBundle().getText("SUCCESSFUL_EDIT",a.RegistrationNumber));}else{sap.ca.ui.message.showMessageToast(oSapSplUtils.getBundle().getText("TRUCK_ADDED_SUCCESSFUL"));}oSapSplUtils.getCurrentMasterPageVehicle().byId("SapSplVehiclesList").addCustomData(new sap.ui.core.CustomData({key:d.Vehicle.data[0].UUID}));sap.ui.getCore().getModel("myVehiclesListODataModel").refresh();oSapSplUtils.setIsDirty(false);}else{var e=oSapSplUtils.getErrorMessagesfromErrorPayload(d)["ufErrorObject"];sap.ca.ui.message.showMessageBox({type:oSapSplUtils.getErrorMessagesfromErrorPayload(d)["messageTitle"],message:oSapSplUtils.getErrorMessagesfromErrorPayload(d)["errorWarningString"],details:e},function(){});}},errorForSaveAction:function(e){jQuery.sap.log.error("fireSaveAction","ajax failed","MyVehiclesDetailAddVehicle.controller.js");oSapSplBusyDialog.getBusyDialogInstance().close();if(e&&e["status"]===500){sap.ca.ui.message.showMessageBox({type:sap.ca.ui.message.Type.ERROR,message:e["status"]+" "+e.statusText,details:e.responseText});}else{if(e&&e.responseText&&e.responseText!==null){if(e.responseText.constructor===String){e.responseText=JSON.parse(e.responseText);}else if(e.statusText==="timeout"){sap.m.MessageBox.show(oSapSplUtils.getBundle().getText("APP_ERR_MSG"),{title:oSapSplUtils.getBundle().getText("ACC_STATE_ERROR"),icon:sap.m.MessageBox.Icon.ERROR,actions:[sap.m.MessageBox.Action.CLOSE],onClose:function(){jQuery.sap.log.warning("SAP SCL Timeout","Timeout error occured while performing save","SAPSCL");}});}}var d=e.responseText;sap.ca.ui.message.showMessageBox({type:oSapSplUtils.getErrorMessagesfromErrorPayload(d)["messageTitle"],message:oSapSplUtils.getErrorMessagesfromErrorPayload(d)["errorWarningString"],details:oSapSplUtils.getErrorMessagesfromErrorPayload(d)["ufErrorObject"]});}},preparePayLoad:function(){var p={},d=null,s="",m={};m["data"]=[];d=sap.ui.getCore().getModel("myVehiclesAddVehicleModel").getData()["data"];if(d["UUID"]){p["VehicleUUID"]=d["UUID"];}else{p["VehicleUUID"]=oSapSplUtils.getUUID();}p["VehicleRegistrationNumber"]=d["RegistrationNumber"];if(d["VehicleDriverUUID"]||d["DriverID"]){p["DriverID"]=d["VehicleDriverUUID"]||d["DriverID"];}else{p["DriverID"]=null;}p["VehiclePublicName"]=d["PublicName"];p["VehicleType"]=this.byId("sapSplNewVehiclesVehicleType").getSelectedItem().getBindingContext().getProperty()["Value"];if(p["VehicleType"]==="Select"){p["VehicleType"]=null;}if(d["Status"]){p["VehicleStatus"]=d["Status"];}else{p["VehicleStatus"]="A";}p["VehicleCountryCode"]="IND";if(d["VehicleChangeMode"]){p["VehicleChangeMode"]=d["VehicleChangeMode"];}else{p["VehicleChangeMode"]=null;}p["OwnerID"]=oSapSplUtils.getCompanyDetails()["BasicInfo_CompanyID"];p["VehicleImageUrl"]=null;p["VehicleIsDeleted"]="0";s=this.byId("sapSplNewVehiclesDeviceType").getSelectedItem().getBindingContext().getProperty()["Value"];if(s==="None"||s==="Select"||d["DevicePublicName"]===oSapSplUtils.getBundle().getText("SELECT_DEVICE_PLACEHOLDER")){m["data"].push(p);return m;}else{if(d["mode"]&&d["mode"]==="Edit"&&this.bDeviceAssignmentChanged===true){m["data"].push(p);p=jQuery.extend(true,{},p);this.bDeviceAssignmentChanged=false;}if(d["DeviceUUID"]){p["DeviceUUID"]=d["DeviceUUID"];}else{p["DeviceUUID"]=oSapSplUtils.getUUID();}p["DeviceType"]=(this.byId("sapSplNewVehiclesDeviceType").getSelectedItem().getBindingContext().getProperty()["Value"]===undefined)?null:this.byId("sapSplNewVehiclesDeviceType").getSelectedItem().getBindingContext().getProperty()["Value"];p["DevicePhoneNumber"]=(d["DevicePhoneNumber"])?d["DevicePhoneNumber"]:null;p["DeviceStatus"]="A";p["DeviceisDeleted"]="0";if(this.byId("sapSplNewVehiclesDeviceType").getSelectedItem().getBindingContext().getProperty()["Value.description"]==="Mobile"){p["DeviceUniqueID"]=this.byId("sapSplNewVehicleMobileDeviceID").getValue();p["DevicePublicName"]=this.byId("sapSplNewVehicleMobileDeviceID").getValue();}else{if(!d["DeviceUniqueID"]){p["DeviceUniqueID"]=d["DevicePublicName"];}else{p["DeviceUniqueID"]=d["DeviceUniqueID"];}p["DevicePublicName"]=d["DevicePublicName"];}}m["data"].push(p);return m;},fnHandlePressSelectDriverName:function(){splReusable.libs.SapSplStyleSheetLoader.loadStyle("./resources/styles/splDriverDialog");var d=sap.ui.view({viewName:"splView.dialogs.SplDriverDetailsDialog",type:sap.ui.core.mvc.ViewType.XML}).addStyleClass("AddDriverDialogDialogContainerView");this.oSendMessageBusinessPartnerParentDialog=new sap.m.Dialog({showHeader:false,content:new sap.ui.commons.layout.VerticalLayout().addStyleClass("viewHolderLayout").addContent(d),afterOpen:function(e){e.getSource().getContent()[0].getContent()[0].setBusyIndicatorDelay(0);e.getSource().getContent()[0].getContent()[0].setBusy(true);var s=null,D=null,o=null,i=null;s=sap.ui.getCore().getModel("myDriversListODataModel");o=["$filter= BasicInfo_Type eq 'P' and Role eq 'DRIVER'"];i=true;var u="/MyUsers";if(s){s.read(u,D,o,i,jQuery.proxy(this.successOfDriversOData,this),jQuery.proxy(this.errorOfDriverOData,this));}}.bind(this)}).addStyleClass("splSendMessageBusinessPartnerDialog");d.getController().setParentDialogInstance(this.oSendMessageBusinessPartnerParentDialog);$(".sapMDialogBlockLayerInit").css("z-index","0");this.oSendMessageBusinessPartnerParentDialog.open();},successOfDriversOData:function(d){this.oSendMessageBusinessPartnerParentDialog.getContent()[0].getContent()[0].setBusy(false);var m=new sap.ui.model.json.JSONModel();m.setData(d);this.oSendMessageBusinessPartnerParentDialog.setModel(m);},errorOfDriverOData:function(){},fnHandleSwitchChange:function(e){var d=e.getSource().getBindingContext().getObject();this.fnToCaptureLiveChangeToSetFlag();if(e.getSource().getState()){d["ChangeMode"]="I";}else{d["ChangeMode"]="D";}this.oShareInfo[d.Partner_Name]={data:d};}});