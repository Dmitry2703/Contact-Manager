/**
 * @fileOverview Подмодуль Controller субприложения для отображения контакта на отдельной странице
 */

'use strict';

ContactManager.module('ContactsApp.Show', function(Show, ContactManager, Backbone, Marionette) {
  Show.Controller = {
    showContact: function(id) {

      var loadingView = new ContactManager.Common.Views.Loading({
        title: 'Contact Loading',
        message: 'Please wait while contact is loading'
      });
      ContactManager.mainRegion.show(loadingView);

      var promise = ContactManager.request('contact:entity', id);
      promise.then(function(contact) {
        var contactView;
        if (contact !== undefined) {
          contactView = new Show.Contact({
            model: contact
          });

          contactView.on('contact:edit', function(contact) {
            ContactManager.trigger('contact:edit', contact.get('id'));
          });
        } else {
          contactView = new Show.MissingContact();
        }

        ContactManager.mainRegion.show(contactView);
      });
    }
  };
});
