/**
 * @fileOverview Подмодуль View субприложения для создания нового контакта
 */

'use strict';

ContactManager.module('ContactsApp.New', function(New, ContactManager, Backbone, Marionette, $, _) {
  // расширяем методы класса Views.Form, определенные в файле common/views.js
  New.Contact = ContactManager.ContactsApp.Common.Views.Form.extend({
    title: 'New Contact',

    onRender: function() {
      this.$('.js-submit').text('Create contact');
    }
  });
});
