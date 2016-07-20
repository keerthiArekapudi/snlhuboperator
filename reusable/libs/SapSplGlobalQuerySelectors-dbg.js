/*
 * Copyright (C) 2009-2015 SAP SE or an SAP affiliate company. All rights reserved.
 */
$.sap.declare("splReusable.libs.SapSplGlobalQuerySelectors");
$.sap.require("splReusable.libs.Utils");
$.sap.require("splReusable.libs.SapSplModelFormatters");

var oSapSplQuerySelectors = (function (window) {

	var oQueryInstance,
	sBackButtonTooltip = null,
	sHeaderUserNameTooltip = null;

	var createInstance = function () {

		oQueryInstance = {};

		return {

			/**
			 * @description Setter for the back button in master/detail apps
			 * @since 1.0
			 * @returns void
			 */
			setBackButtonTooltip: function () {

				sBackButtonTooltip = oSapSplUtils.getBundle().getText("BACK_BUTTON_TOOLTIP");

				$(".sapMBtnBack").attr("title", sBackButtonTooltip);

			},

			/**
			 * @description Returns if tooltip is set on the back button or not
			 * @returns {Boolean}
			 * @since 1.0
			 */
			hasTooltip: function () {

				return (sBackButtonTooltip !== null);

			},

			/**
			 * @description Returns Back button tooltip set on Master/Detail pages
			 * @returns sBackButtonTooltip {String} The back button tooltip
			 * @since 1.0
			 */
			getBackButtonTooltip: function () {

				return sBackButtonTooltip;

			},

			/**
			 * @description Setter for the UnifiedShell header user object (Deprecated since 1.0.1. Not needed since tooltip is set on the UnifiedShell creator
			 * @since 1.0
			 * @returns void
			 * @deprecated
			 */
			setHeaderUserNameTooltip: function () {

				/*HOTFIX At the time UnifiedShell is added, the user item is still being rendered. Hence the tooltip on hover
				 * on the user name will not appear. Hence wait for the document to be ready and once this is done, wait for
				 * a specific time before setting the title of the anchor tag */

				$(document).ready(function () {
					window.setTimeout(function () {
						$(".sapUiUfdShellHeadUsrItmName").hover(function () {
							$(this).attr("title", sap.ui.getCore().getModel("loggedOnUserModel").getData()["profile"]["CommunicationInfo_EmailAddress"]);
						});
					}, 1000);

				});


			},

			/**
			 * @description Returns if tooltip is set on the Shell Header User object
			 * @returns {Boolean}
			 * @since 1.0
			 */
			hasHeaderUserNameTooltip: function () {

				return (sHeaderUserNameTooltip !== null);

			},

			/**
			 * @description Returns UnifiedShell Header User object tooltip
			 * @returns sBackButtonTooltip {String} The Header object tooltip
			 * @since 1.0
			 */
			getHeaderUserNameTooltip: function () {

				return sHeaderUserNameTooltip;

			},


			/**
			 * @description Changes unified shell background color on navigate and after navigate
			 * @param bApply {Boolean} true/false
			 * @returns void
			 * @since 1.0
			 */
			changeUnifiedShellStyle: function (bApply) {
				if (bApply) {

					if (oSapSplUtils.isInHCBMode()) {
						/* IE10 Consumer Preview */

						$(".sapMGlobalBackgroundColor").css("background-color", "#000000");
					} else {
						/* IE10 Consumer Preview */
						$(".sapMGlobalBackgroundColor").css("background-image", "-ms-linear-gradient(top, #2DABB3 0%, #178299 50%, #1A4D80 100%)");

						/* Mozilla Firefox */
						$(".sapMGlobalBackgroundColor").css("background", "-moz-linear-gradient(top, #2DABB3 0%, #178299 50%, #1A4D80 100%)");

						/* Opera */
						$(".sapMGlobalBackgroundColor").css("background-image", "-o-linear-gradient(top, #2DABB3 0%, #178299 50%, #1A4D80 100%)");

						/* Webkit (Safari/Chrome 10) */
						$(".sapMGlobalBackgroundColor").css("background-image", "-webkit-gradient(linear, left top, left bottom, color-stop(0, #2DABB3), color-stop(0.5, #178299), color-stop(1, #1A4D80)");

						/* Webkit (Chrome 11+) */
						$(".sapMGlobalBackgroundColor").css("background-image", "-webkit-linear-gradient(top, #2DABB3 0%, #178299 50%, #1A4D80 100%)");

						/* W3C Markup, IE10 Release Preview */
						$(".sapMGlobalBackgroundColor").css("background-image", "linear-gradient(to bottom, #2DABB3 0%, #178299 50%, #1A4D80 100%)");
					}



				} else {

					if (oSapSplUtils.isInHCBMode()) {
						/* IE10 Consumer Preview */

						$(".sapMGlobalBackgroundColor").css("background-color", "#000000");
					} else {
						/* IE10 Consumer Preview */
						$(".sapMGlobalBackgroundColor").css("background-image", "-ms-linear-gradient(top, #E0F2F4 0%, #DCECF0 50%, #DDE4EC 100%)");

						/* Mozilla Firefox */
						$(".sapMGlobalBackgroundColor").css("background", "-moz-linear-gradient(top, #E0F2F4 0%, #DCECF0 50%, #DDE4EC 100%)");

						/* Opera */
						$(".sapMGlobalBackgroundColor").css("background-image", "-o-linear-gradient(top, #E0F2F4 0%, #DCECF0 50%, #DDE4EC 100%)");

						/* Webkit (Safari/Chrome 10) */
						$(".sapMGlobalBackgroundColor").css("background-image", "-webkit-gradient(linear, left top, left bottom, color-stop(0, #E0F2F4), color-stop(0.5, #DCECF0), color-stop(1, #DDE4EC))");

						/* Webkit (Chrome 11+) */
						$(".sapMGlobalBackgroundColor").css("background-image", "-webkit-linear-gradient(top, #E0F2F4 0%, #DCECF0 50%, #DDE4EC 100%)");

						/* W3C Markup, IE10 Release Preview */
						$(".sapMGlobalBackgroundColor").css("background-image", "linear-gradient(to bottom, #E0F2F4 0%, #DCECF0 50%, #DDE4EC 100%)");
					}
				}
			},

			/**
			 * @description Sets unified shell header search placeholder
			 * @since 1.0
			 * @returns void
			 */
			setGlobalHeaderSearchPlaceholder: function () {

				$("#sapSplHeaderSearchField-cb-input").attr("placeholder", oSapSplUtils.getBundle().getText("GLOBAL_SEARCH", ["..."]));

			}

		};

	};

	return {

		/**
		 * @description Returns singleton instance of the SapSplGlobalQuerySelectors
		 * @returns {Object} Singleton instance of SapSplGlobalQuerySelectors
		 */
		getInstance: function () {

			if (!oQueryInstance || oQueryInstance === null) {

				oQueryInstance = createInstance();

			}

			return oQueryInstance;

		}
	};

}(window));
