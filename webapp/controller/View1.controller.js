sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Theming"
], function (Controller, JSONModel, Theming) {
    "use strict";

    const TASK_KEY = "todo.tasks";
    const THEME_KEY = "todo.theme";

    return Controller.extend("todolist.controller.View1", {

        onInit() {
            const tasks = JSON.parse(localStorage.getItem(TASK_KEY)) || [
                { title: "My first task", completed: false, isEditing: false }
            ];

            const theme = localStorage.getItem(THEME_KEY) || "sap_horizon";
            Theming.setTheme(theme);

            this.getView().setModel(new JSONModel({
                newTask: "",
                tasks: tasks,
                theme: theme
            }));
        },

        _save() {
            localStorage.setItem(
                TASK_KEY,
                JSON.stringify(this.getView().getModel().getProperty("/tasks"))
            );
        },

        onAdd() {
            const m = this.getView().getModel();
            const text = m.getProperty("/newTask");
            if (!text) return;

            m.getProperty("/tasks").push({
                title: text,
                completed: false,
                isEditing: false
            });

            m.setProperty("/newTask", "");
            m.refresh();
            this._save();
        },

        onEdit(e) {
            const path = e.getSource().getBindingContext().getPath();
            const m = this.getView().getModel();
            m.setProperty(path + "/isEditing", !m.getProperty(path + "/isEditing"));
            this._save();
        },

        onSaveEdit(e) {
            const path = e.getSource().getBindingContext().getPath();
            this.getView().getModel().setProperty(path + "/isEditing", false);
            this._save();
        },

        onToggle() {
            const m = this.getView().getModel();
            let t = m.getProperty("/tasks");

            t = [...t.filter(x => !x.completed), ...t.filter(x => x.completed)];
            m.setProperty("/tasks", t);
            this._save();
        },

        onDelete(e) {
            const m = this.getView().getModel();
            const i = e.getSource().getBindingContext().getPath().split("/")[2];
            m.getProperty("/tasks").splice(i, 1);
            m.refresh();
            this._save();
        },

        onToggleTheme() {
            const m = this.getView().getModel();
            const current = m.getProperty("/theme");
            const next = current === "sap_horizon"
                ? "sap_horizon_dark"
                : "sap_horizon";

            Theming.setTheme(next);
            m.setProperty("/theme", next);
            localStorage.setItem(THEME_KEY, next);
        }
    });
});
