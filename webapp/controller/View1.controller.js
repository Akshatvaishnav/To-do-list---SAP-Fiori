sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
], function (Controller, JSONModel) {
    "use strict";

    const STORAGE_KEY = "sap.todo.tasks";

    return Controller.extend("todo.controller.Todo", {

        onInit: function () {
            const aStoredTasks = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

            const oModel = new JSONModel({
                newTask: "",
                tasks: aStoredTasks
            });

            this.getView().setModel(oModel);
        },

        /* ================= SAVE TO LOCAL ================= */
        _saveToLocal: function () {
            const aTasks = this.getView().getModel().getProperty("/tasks");
            localStorage.setItem(STORAGE_KEY, JSON.stringify(aTasks));
        },

        /* ================= ADD ================= */
        onAddTask: function () {
            const oModel = this.getView().getModel();
            const sTask = oModel.getProperty("/newTask");
            if (!sTask) return;

            const aTasks = oModel.getProperty("/tasks");
            aTasks.push({
                title: sTask,
                completed: false,
                isEditing: false
            });

            oModel.setProperty("/newTask", "");
            oModel.refresh();
            this._saveToLocal();
        },

        /* ================= EDIT ================= */
        onStartEdit: function (oEvent) {
            const sPath = oEvent.getSource().getBindingContext().getPath();
            this.getView().getModel().setProperty(sPath + "/isEditing", true);
        },

        onSaveEdit: function (oEvent) {
            const sPath = oEvent.getSource().getBindingContext().getPath();
            this.getView().getModel().setProperty(sPath + "/isEditing", false);
            this._saveToLocal();
        },

        /* ================= CHECKBOX ================= */
        onToggleComplete: function () {
            const oModel = this.getView().getModel();
            let aTasks = oModel.getProperty("/tasks");

            // Move completed tasks down (Google Keep style)
            aTasks = [
                ...aTasks.filter(t => !t.completed),
                ...aTasks.filter(t => t.completed)
            ];

            oModel.setProperty("/tasks", aTasks);
            this._saveToLocal();
        },

        /* ================= DELETE ================= */
        onDeleteTask: function (oEvent) {
            const oModel = this.getView().getModel();
            const aTasks = oModel.getProperty("/tasks");

            const iIndex = oEvent.getSource()
                .getBindingContext()
                .getPath()
                .split("/")[2];

            aTasks.splice(iIndex, 1);
            oModel.refresh();
            this._saveToLocal();
        }
    });
});
