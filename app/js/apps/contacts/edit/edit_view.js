/**
 * @fileOverview Подмодуль View субприложения для отображения формы редактирования контакта
 */

'use strict';

ContactManager.module('ContactsApp.Edit', function(Edit, ContactManager, Backbone, Marionette, $, _) {
  // расширяем методы класса Views.Form, определенные в файле common/views.js
  Edit.Contact = ContactManager.ContactsApp.Common.Views.Form.extend({
    initialize: function() {
      // Формируем заголовок формы редактирования контакта
      this.title = 'Edit ' + this.model.get('firstName') + ' ' + this.model.get('lastName');
    },

    // функция вызывается при рендеренге формы редактирования контакта
    onRender: function() {
      if (this.options.generateTitle) {
        var $title = $('<h1>', { text: this.title });
        this.$el.prepend($title);
      }
      this.$('.js-submit').text('Update contact');
    }
  });
});
