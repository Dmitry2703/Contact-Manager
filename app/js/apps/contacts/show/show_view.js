/**
 * @fileOverview Подмодуль View субприложения для отображения контакта на отдельной странице
 */

'use strict';

ContactManager.module('ContactsApp.Show', function(Show, ContactManager, Backbone, Marionette) {
  Show.Contact = Marionette.ItemView.extend({
    template: '#contact-view',
    events: {
      'click .js-edit': 'editClicked'
    },

    editClicked: function(e) {
      e.preventDefault();
      this.trigger('contact:edit', this.model);
    }
  });

  Show.MissingContact = Marionette.ItemView.extend({
    template: '#missing-contact-view'
  });
});
