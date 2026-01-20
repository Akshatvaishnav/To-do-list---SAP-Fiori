/* global QUnit */
QUnit.config.autostart = false;

sap.ui.require(["todolist/test/integration/AllJourneys"
], function () {
	QUnit.start();
});
