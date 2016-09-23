/**
 * @fileOverview Подмодуль Controller субприложения для отображения формы редактирования контакта
 */

'use strict';

ContactManager.module('ContactsApp.Edit', function(Edit, ContactManager, Backbone, Marionette) {
  Edit.Controller = {
    editContact: function(id) {

      var loadingView = new ContactManager.Common.Views.Loading({
        title: 'Contact Loading',
        message: 'Please wait while contact is loading'
      });
      ContactManager.mainRegion.show(loadingView);

      var promise = ContactManager.request('contact:entity', id);
      promise.then(function(contact) {
        var view;
        if (contact !== undefined) {
          view = new Edit.Contact({
            model: contact,
            generateTitle: true
          });

          view.on('form:submit', function(data) {
            if (contact.save(data)) {
              ContactManager.trigger('contact:show', contact.get('id'));
            } else {
              // если модель не обновилась, то вызываем слушателя, который слушает ошибки
              view.triggerMethod('form:data:invalid', contact.validationError);
            }
          });
        } else {
          view = new ContactManager.ContactsApp.Show.MissingContact();
        }

        ContactManager.mainRegion.show(view);
      });
    }
  };
});
