/*
 * Copyright (C) 2009-2015 SAP SE or an SAP affiliate company. All rights reserved.
 */
/**

 * A self executing anonymous function just for to separate Unified Shell handling from main
 * application logic. Modular
 */
(function ( window, oSplBaseApplication ) {

	/**
	 * @private
	 * @since 1.0
	 * @description Event handler for session logout trigger
	 */
	function __handleLogoutPress__ ( oEvent ) {

		$.sap.log.info ( "SAP SCL Unified Shell", "Session Management Button handler " + oEvent.toString ( ), "SAPSCL" );

		sap.m.MessageBox.show ( oSapSplUtils.getBundle ( ).getText ( "SPL_LOGOUT_PROMPT_MESSAGE" ), {
			icon : sap.m.MessageBox.Icon.INFORMATION,
			title : oSapSplUtils.getBundle ( ).getText ( "SPL_LOGOUT_PROMPT_DIALOG_HEADER" ),
			actions : [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
			onClose : function ( oAction ) {
				if ( oAction === sap.m.MessageBox.Action.YES ) {
					/*
					 * Set to 'app' to avoid browser prompt
					 */
					/*
					 * HANDLE Logout of HANA XS instance and then redirect to
					 * logout page as maintained in descriptor
					 */
					oSapSplUtils.sLO4S = "app";
					splReusable.libs.SapSplLogoutHandler.doLogout ( null, null, function ( xhr, textStatus ) {
						window.location.replace ( SapSplEnums.LOGOUTPAGE );
					} );
				} else {
					return;
				}
			}
		} );

	}

	function __handleCompanyProfileLaunch__ ( oEvent ) {
		$.sap.log.info ( "SAP SCL Unified Shell", "Profile Button handler " + oEvent.toString ( ), "SAPSCL" );

		if ( oSplBaseApplication.getAppInstance ( ).getPage ( "splView.profile.Profile" ) === null ) {

			var oProfileView = sap.ui.view ( {
				viewName : "splView.profile.Profile",
				id : "splView.profile.Profile",
				type : sap.ui.core.mvc.ViewType.XML
			} );

			oProfileView.addEventDelegate ( {
				onBeforeShow : function ( oEvent ) {
					if ( !oEvent.data || !oEvent.data.hasOwnProperty ( "cDetails" ) ) {

						oEvent.data.cDetails = oSapSplUtils.getCompanyDetails ( );

					}
					oProfileView.getController ( ).updateBindings ( oEvent );

				}
			}, oProfileView.getController ( ) );

			oSplBaseApplication.getAppInstance ( ).addPage ( oProfileView );
		}
		oSplBaseApplication.getAppInstance ( ).to ( "splView.profile.Profile", {
			cDetails : oSapSplUtils.getCompanyDetails ( )
		} );
	}

	function __handleUserProfileLaunch__ ( oEvent ) {
		$.sap.log.info ( "SAP SCL Unified Shell", "Profile Button handler " + oEvent.toString ( ), "SAPSCL" );

		if ( oSplBaseApplication.getAppInstance ( ).getPage ( "splView.profile.UserProfile" ) === null ) {

			var oProfileView = sap.ui.view ( {
				viewName : "splView.profile.UserProfile",
				id : "splView.profile.UserProfile",
				type : sap.ui.core.mvc.ViewType.XML
			} );

			oProfileView.addEventDelegate ( {
				onBeforeShow : function ( oEvent ) {

					if ( !oEvent.data || !oEvent.data.hasOwnProperty ( "cDetails" ) ) {
						oEvent.data.cDetails = sap.ui.getCore ( ).getModel ( "loggedOnUserModel" ).getData ( )["profile"];
					}

					if ( oEvent.data.FromApp && oEvent.data.FromApp === "tours" ) {

						if ( this.byId ( "sapSclProfileAndSettingIconTabBar" ).getSelectedKey ( ) !== "sapSclIconTabFilterFollowTrucks" ) {
							this.byId ( "sapSclProfileAndSettingIconTabBar" ).setSelectedKey ( "sapSclIconTabFilterFollowTrucks" );
							this.byId ( "sapSclProfileAndSettingIconTabBar" ).fireSelect ( {
								selectedKey : "sapSclIconTabFilterFollowTrucks"
							} );
						}

						if ( oEvent.data.RegistrationNumber ) {
							this.fnHandleNavigationSearch ( oEvent.data.RegistrationNumber );
						}

					}

					oProfileView.getController ( ).updateBindings ( oEvent );
					if ( this.byId ( "sapSclProfileAndSettingIconTabBar" ) && this.byId ( "sapSclProfileAndSettingIconTabBar" ).getSelectedKey ( ) === "sapSclIconTabFilterFollowTrucks" ) {
						if ( sap.ui.getCore ( ).getModel ( "SapSclFollowTrucksOataModel" ) ) {
							sap.ui.getCore ( ).getModel ( "SapSclFollowTrucksOataModel" ).refresh ( true );
						}
					}
				}

			}, oProfileView.getController ( ) );

			oSplBaseApplication.getAppInstance ( ).addPage ( oProfileView );
		}
		oSplBaseApplication.getAppInstance ( ).to ( "splView.profile.UserProfile", {
			cDetails : sap.ui.getCore ( ).getModel ( "loggedOnUserModel" ).getData ( )["profile"]
		} );
	}

	function __createAndReturnActionSheet__ ( ) {

		var oDoLogoutButton = null,

		oProfileLaunchButton = null,

		oUserProfileLaunchButton = null,

		oHeaderResponsivePopover = null;

		oDoLogoutButton = new sap.m.Button ( {

			text : oSapSplUtils.getBundle ( ).getText ( "HEADER_LOGOUT" ),

			tooltip : oSapSplUtils.getBundle ( ).getText ( "HEADER_LOGOUT" ),

			icon : "sap-icon://log",

			visible : !oSapSplUtils.getStartupError ( ),
			width : "100%",

			press : function ( oEvent ) {

				if ( oSapSplUtils.getStartupError ( ) ) {

					$.sap.log.warning ( "SAP SCL Unified Shell", "Logging out of the system", "SAPSCL" );

				}

				__handleLogoutPress__ ( oEvent );

			}

		} );

		/**
		 * @since 1.0
		 * @private
		 * @description Event handler for launching company profile
		 */
		function __handleProfileLaunch__ ( oEvent ) {

			if ( oEvent.getSource ( ).getText ( ) === oSapSplUtils.getBundle ( ).getText ( "HEADER_COMPANY_PROFILE" ) ) {
				__handleCompanyProfileLaunch__ ( oEvent );
			} else if ( oEvent.getSource ( ).getText ( ) === oSapSplUtils.getBundle ( ).getText ( "HEADER_USER_PROFILE" ) ) {
				__handleUserProfileLaunch__ ( oEvent );
			}
		}

		oProfileLaunchButton = new sap.m.Button ( {

			text : oSapSplUtils.getBundle ( ).getText ( "HEADER_COMPANY_PROFILE" ),

			tooltip : oSapSplUtils.getBundle ( ).getText ( "HEADER_COMPANY_PROFILE" ),

			icon : "sap-icon://org-chart",

			visible : !oSapSplUtils.getStartupError ( ),

			press : function ( oEvent ) {

				if ( !oSapSplUtils.getStartupError ( ) ) {

					oEvent.preventDefault ( );

				}

				oHeaderResponsivePopover.close ( );

				__handleProfileLaunch__ ( oEvent );

			}
		} );

		oUserProfileLaunchButton = new sap.m.Button ( {

			text : oSapSplUtils.getBundle ( ).getText ( "HEADER_USER_PROFILE" ),

			tooltip : oSapSplUtils.getBundle ( ).getText ( "HEADER_USER_PROFILE" ),

			icon : "sap-icon://person-placeholder",

			visible : !oSapSplUtils.getStartupError ( ),

			press : function ( oEvent ) {

				if ( !oSapSplUtils.getStartupError ( ) ) {

					oEvent.preventDefault ( );

				}

				oHeaderResponsivePopover.close ( );

				__handleProfileLaunch__ ( oEvent );

			}
		} );

		/* Fix for CSN: 281798 2014 */
		oHeaderResponsivePopover = new sap.m.ActionSheet (
				{

					placement : sap.m.PlacementType.Bottom,

					showCancelButton : false,

					title : oSapSplUtils.getBundle ( ).getText ( "HEADER_WELCOME_LABEL",
							[splReusable.libs.SapSplModelFormatters.displayNameFormatterBP ( oSapSplUtils.getLoggedOnUserDetails ( ).firstName, oSapSplUtils.getLoggedOnUserDetails ( ).lastName )] ), // oSapSplUtils.getBundle().getText("HEADER_WELCOME_LABEL",["Carrier"])

							buttons : [oUserProfileLaunchButton, oProfileLaunchButton, oDoLogoutButton]

				} ).attachAfterClose ( function ( oEvent ) {
					oEvent.getSource ( ).destroy ( );
				} );

		return oHeaderResponsivePopover;

	}

	function __handleNotificationListPolling__ ( that ) {
		that.oNotificationsPopover.getContent ( )[0].setNoDataText ( oSapSplUtils.getBundle ( ).getText ( "NO_NEW_NOTIFICATIONS" ) );
		oSapSplAjaxFactory.fireAjaxCall ( {
			url : oSapSplUtils.getFQServiceUrl ( "sap/spl/xs/app/services/appl.xsodata/" ) + "ReplicationEntities?&$format=json&$filter=ReplicationStatus ne 2",
			method : "GET",
			success : function ( data ) {
				that.oNotificationsPopoverModel.setData ( data.d.results );
			},
			error : function ( data ) {
				$.sap.log.error ( "SAP SCL Shell", "Notifications fetch Error", "SAPSCL" );
			},
			complete : function ( ) {
				that.oNotificationsPopover.setBusy ( false );
			}
		} );
	}

	function __handleNotificationLaunch__ ( oEvent ) {
		if ( !this.oNotificationsPopoverModel ) {
			this.oNotificationsPopoverModel = new sap.ui.model.json.JSONModel ( );
		}
		if ( !this.oNotificationsPopover ) {
			this.oNotificationsPopover = sap.ui.xmlfragment ( "notificationsPopoverFragment", "splReusable.fragments.NotificationsPopover", this );
			sap.ui.core.Fragment.byId ( "notificationsPopoverFragment", "sapSplShellHeaderNotificationsPopoverListItem" ).addEventDelegate ( {
				onAfterRendering : function ( oEvent ) {
					oEvent.srcControl.$ ( ).find ( ".sapMIBar" ).css ( "height", oEvent.srcControl.$ ( ).find ( ".sapMText" ).height ( ) + 15 + "px" );
				}
			} );
			this.oNotificationsPopover.setModel ( this.oNotificationsPopoverModel );
		}
		if ( this.oInterval ) {
			clearInterval ( this.oInterval );
		}

		this.oNotificationsPopover.openBy ( oEvent.getSource ( ) );
		__handleNotificationListPolling__ ( this );

		this.oInterval = window.setInterval ( function ( ) {
			__handleNotificationListPolling__ ( this );
		}, 60000 );
	}

	var oShellHeaderUserItem = sap.ui.unified.ShellHeadUserItem ( {

		username : "{parts:[{path:'loggedOnUserModel>/profile/PersonName_GivenName'},{path:'loggedOnUserModel>/profile/PersonName_Surname'}],formatter:'splReusable.libs.SapSplModelFormatters.displayNameFormatter'}",
		tooltip : "{parts:[{path:'loggedOnUserModel>/profile/CommunicationInfo_EmailAddress'}]}",
		image : "sap-icon://account",
		press : [

		         function ( oEvent ) {

		        	 __createAndReturnActionSheet__ ( ).openBy ( oEvent.oSource );

		         }, this]

	} );

	/**
	 * @private
	 * @description Handle help launch from header. Specific to applications
	 * Invoked from ShellHeadItem press from Unified Shell header
	 * @since 1.0
	 *
	 */
	function __handleHelpLaunch__ ( oEvent ) {
		oSapSplHelpHandler.launchHelp ( oEvent, null, null, null, null, function ( oEvent ) {
			$.sap.log.info ( "SAP SCL Unified Shell", "Help Button handler " + oEvent.toString ( ), "SAPSCL" );
		} );
	}

	function __handleLoggerLaunch__ ( ) {

		var oDialog = new sap.m.Dialog ( {

			contentHeight : "100%",

			contentWidth : "100%",

			showHeader : true,

			title : oSapSplUtils.getBundle ( ).getText ( "LOGGER" ),

			rightButton : new sap.m.Button ( {

				icon : "sap-icon://sys-cancel",

				tooltip : oSapSplUtils.getBundle ( ).getText ( "CLOSE" ),
				/* CSNFIX 1296960 2014 */

				press : function ( oEvent ) {

					$.sap.log.info ( "SAP SCL Unified Shell", "Logger Close handler " + oEvent.toString ( ), "SAPSCL" );

					oDialog.destroy ( );

				}

			} ),

			initialFocus : "sapSplLogExportToCSV",

			content : sap.ui.view ( {

				viewName : "splView.logger.Logger",

				id : "splView.logger.Logger",

				type : sap.ui.core.mvc.ViewType.XML

			} ),

			beforeClose : function ( oEvent ) {

				oEvent.getSource ( ).getContent ( ).destroy ( );

			}

		} );

		oDialog.open ( );

	}

	/*
	 * HOTFIX For the search placeholder. Currently This is not part of the
	 * standard control. Hence listening to control after rendering event and
	 * then applying the attr object
	 */
//	oHeaderSearchField.addEventDelegate({
//	onAfterRendering: function () {
//	oSapSplQuerySelectors.getInstance().setGlobalHeaderSearchPlaceholder();
//	}
//	}, oHeaderSearchField);
	window["splBaseUnifiedShell"] = new sap.ui.unified.Shell ( "sapSplBaseUnifiedShell", {

		icon : encodeURIComponent ( "resources/icons/sap_logo.png" ),

		searchVisible : true,

		headEndItems : [new sap.ui.unified.ShellHeadItem ( {
			icon : "sap-icon://marketing-campaign",
			tooltip : oSapSplUtils.getBundle ( ).getText ( "NOTIFICATIONS" ),
			press : [function ( oEvent ) {
				__handleNotificationLaunch__ ( oEvent );
			}, this]
		} ), new sap.ui.unified.ShellHeadItem ( {
			tooltip : oSapSplUtils.getBundle ( ).getText ( "SAP_CONNECTED_LOGISTICS_HELP" ),
			icon : "sap-icon://sys-help",
			visible : "{helpModel>/helpVisible}",
			press : [function ( oEvent ) {
				__handleHelpLaunch__ ( oEvent );
			}, this]
		} )],

		user : oShellHeaderUserItem,

		content : oSplBaseApplication.getData ( )

	} ).addStyleClass ( "sapSplShellItemsSize" );

	if ( oSapSplUtils.getFromQueryParameterMap ( "spl-show-log" ) === "1" ) {

		window["splBaseUnifiedShell"].addHeadEndItem ( new sap.ui.unified.ShellHeadItem ( {

			tooltip : oSapSplUtils.getBundle ( ).getText ( "SPLUNIFIEDSHELL_HEADER_OPTIONS_LOGS" ),

			icon : "sap-icon://list",

			press : [

			         function ( oEvent ) {

			        	 $.sap.log.info ( "SAP SCL Unified Shell", "Logger Button handler " + oEvent.toString ( ), "SAPSCL" );

			        	 __handleLoggerLaunch__ ( );

			         }, this]

		} ) );
	}

	this.fnDoRefreshItem = function ( oEvent ) {
		var that = this;
		var sFilter = "$select=ReplicationStatus&$filter=(" + encodeURIComponent ( "UUID_1 eq " + "X" + "\'" + oSapSplUtils.base64ToHex ( oEvent.getSource ( ).getBindingContext ( ).getObject ( )["UUID_1"] ) + "\'" ) + ")";
		var oTempEvent = jQuery.extend ( true, {}, oEvent );
		oEvent.getSource ( ).getParent ( ).getParent ( ).setBusy ( true );
		oSapSplAjaxFactory.fireAjaxCall ( {
			url : oSapSplUtils.getFQServiceUrl ( "sap/spl/xs/app/services/appl.xsodata/" ) + "ReplicationEntities?&$format=json&" + sFilter,
			method : "GET",
			success : function ( oData ) {
				oTempEvent.getSource ( ).getParent ( ).getParent ( ).setBusy ( false );
				var oModelData = that.oNotificationsPopoverModel.getData ( );
				var modelLength = oModelData.length;
				for ( var i = 0 ; i < modelLength ; i++ ) {
					if ( oModelData[i]["UUID_1"] === oTempEvent.getSource ( ).getBindingContext ( ).getObject ( )["UUID_1"] ) {
						oModelData[i]["ReplicationStatus"] = oData.d.results[0].ReplicationStatus;
						that.oNotificationsPopoverModel.setData ( oModelData );
					}
				}
			},
			error : function ( data ) {
				$.sap.log.error ( "SAP SCL Shell", "Notifications fetch Error", "SAPSCL" );
			}
		} );
	};

	this.fnHandleNavigationFromNotification = function ( oEvent ) {

		oEvent.getSource ( ).getParent ( ).removeSelections ( );
		var navEntity = oEvent.getSource ( ).getBindingContext ( ).getObject ( ).Entity;
		var AppPathNavTo = oEvent.getSource ( ).getBindingContext ( ).getObject ( ).AppPath;

		function __navigationHandler__ ( ) {
			var oNavToViewPage = null;

			var oNavigationData = {};
			oNavigationData["FromApp"] = "Notifications";
			if ( navEntity === "vehicles" ) {
				oNavigationData["RegistrationNumber"] = oEvent.getSource ( ).getBindingContext ( ).getObject ( ).Desc_1;
				oNavigationData["Device_ID"] = oEvent.getSource ( ).getBindingContext ( ).getObject ( ).Desc_2;
			} else if ( navEntity === "myBusinessPartners" ) {
				oNavigationData["RegistrationNumber"] = oEvent.getSource ( ).getBindingContext ( ).getObject ( ).Desc_1;
				AppPathNavTo = "splView.profile.Profile";
			}
			oNavigationData["showBackButton"] = true;

			if ( !sap.ui.getCore ( ).byId ( "sapSplBaseApplication" ).getPage ( AppPathNavTo ) ) {

				oNavToViewPage = sap.ui.view ( {
					viewName : AppPathNavTo,
					id : AppPathNavTo,
					type : sap.ui.core.mvc.ViewType.XML
				} );

				/*
				 * setting model when company profile is launched for the first
				 * time from notifications shell header
				 */

				if ( AppPathNavTo === "splView.profile.Profile" ) {

					$.sap.log.info ( "SAP SCL Unified Shell", "Profile Button handler " + oEvent.toString ( ), "SAPSCL" );

					if ( oSplBaseApplication.getAppInstance ( ).getPage ( "splView.profile.Profile" ) === null ) {

						oNavToViewPage.addEventDelegate ( {
							onBeforeShow : function ( oEvent ) {
								if ( !oEvent.data || !oEvent.data.hasOwnProperty ( "cDetails" ) ) {

									oEvent.data.cDetails = oSapSplUtils.getCompanyDetails ( );

								}
								oNavToViewPage.getController ( ).updateBindings ( oEvent );

							}
						}, oNavToViewPage.getController ( ) );

						oSplBaseApplication.getAppInstance ( ).addPage ( oNavToViewPage );
					}
					oSplBaseApplication.getAppInstance ( ).to ( "splView.profile.Profile", {
						cDetails : oSapSplUtils.getCompanyDetails ( )
					} );
				} else {
					oNavToViewPage.addEventDelegate ( {
						onBeforeShow : jQuery.proxy ( oNavToViewPage.getController ( ).onBeforeShow, oNavToViewPage.getController ( ) )
					} );
				}

				sap.ui.getCore ( ).byId ( "sapSplBaseApplication" ).addPage ( oNavToViewPage );
			}
			if ( sap.ui.getCore ( ).byId ( "sapSplBaseApplication" ).getCurrentPage ( ).sId !== AppPathNavTo ) {
				oSplBaseApplication.getAppInstance ( ).to ( AppPathNavTo, "slide", oNavigationData );
			} else {
				if ( navEntity === "vehicles" && sap.ui.getCore ( ).byId ( "sapSplBaseApplication" ).getPage ( "splView.vehicles.VehicleMasterDetail" ) ) {
					sap.ui.getCore ( ).byId ( "sapSplBaseApplication" ).getPage ( "splView.vehicles.VehicleMasterDetail" ).byId ( "SapSplVehicleMasterDetailSplitApp" ).getMasterPages ( )[0].byId ( "sapSplVehicleSearch" ).setValue (
							oNavigationData["RegistrationNumber"] );
					sap.ui.getCore ( ).byId ( "sapSplBaseApplication" ).getPage ( "splView.vehicles.VehicleMasterDetail" ).byId ( "SapSplVehicleMasterDetailSplitApp" ).getMasterPages ( )[0].getController ( ).fnHandleNavigationSearch (
							oNavigationData["RegistrationNumber"] );
				}
			}
		}
		__navigationHandler__ ( );
	};

} ( window, oSplBaseApplication ));
