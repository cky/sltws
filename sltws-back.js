/*
 * Copyright © 2007 Chris K. Jester-Young.
 *
 * This file is part of Scriptlet Workshop.
 *
 * Scriptlet Workshop is free software: you can redistribute it and/or
 * modify it under the terms of the GNU General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Scriptlet Workshop is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along
 * with Scriptlet Workshop.  If not, see <http://www.gnu.org/licenses/>.
 */

var Backend = function () {
    this.init = this.bootstrap_init;
};

Backend.prototype.method_sigs = {
    init: ['applet'],
    start: ['applet'],
    paint: ['applet', 'g'],
    stop: ['applet'],
    destroy: ['applet']
};

Backend.prototype.invoke_method = function (method, func, args) {
    try {
        func.apply(this, args);
        return true;
    } catch (ex) {
        delete this[method];
        window.alert("Error running method " + method + ":" + ex.lineNumber
                     + ": " + ex.message);
        return false;
    }
};

Backend.prototype.install_method = function (method, script) {
    var func;
    try {
        func = Function.apply(null, this.method_sigs[method].concat(script));
        this[method] = function () {return this.invoke_method(method, func,
                                                              arguments)};
        return true;
    } catch (ex) {
        window.alert("Error compiling method " + method + ":" + ex.lineNumber
                     + ": " + ex.message);
        return false;
    }
};

Backend.prototype.install_applet_method = function (method, applet) {
    var id = applet.getParameter(method);
    if (!id)
        return true;

    var script = window.document.getElementById(id).value;
    if (!script)
        return true;
    return this.install_method(method, script);
};

Backend.prototype.uninstall_methods = function () {
    for (var method in this.method_sigs)
        delete this[method];
};

Backend.prototype.install_applet_methods = function (applet) {
    var status = true;
    for (var method in this.method_sigs)
        status &= this.install_applet_method(method, applet);
    if (!status)
        this.uninstall_methods();
    return status;
};

Backend.prototype.bootstrap_init = function (applet) {
    delete this.init;
    if (this.install_applet_methods(applet) && this.init) {
        if (!this.init(applet)) {
            this.uninstall_methods();
            return false;
        }
    }
    return true;
};

var backend = new Backend();
