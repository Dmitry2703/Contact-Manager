/**
 * @fileOverview Подмодуль View субприложения для отображения страницы About
 */

'use strict';

ContactManager.module('AboutApp.Show', function(Show, ContactManager, Backbone, Marionette) {
  Show.Message = Marionette.ItemView.extend({
    template: '#about-view'
  });
});
