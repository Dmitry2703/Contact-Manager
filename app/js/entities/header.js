/**
 * @fileOverview Сущность Хедер
 */

'use strict';

ContactManager.module('Entities', function(Entities, ContactManager, Backbone, Marionette, $, _) {
  Entities.Header = Backbone.Model.extend({
    initialize: function() {
      // Плагин Backbone.Select следит за тем, чтобы в коллекции была только одна модель
      // с параметром selected
      Backbone.Select.Me.applyTo(this);
    }
  });

  Entities.HeaderCollection = Backbone.Collection.extend({
    model: Entities.Header,

    initialize: function(models, options) {
      Backbone.Select.One.applyTo(this, models, options);
    }
  });

  var initializeHeaders = function() {
    Entities.headers = new Entities.HeaderCollection([
      {
        name: 'Contacts',
        url: 'contacts',
        navigationTrigger: 'contacts:list'
      },
      {
        name: 'About',
        url: 'about',
        navigationTrigger: 'about:show'
      }
    ]);
  };

  var API = {
    getHeaders: function() {
      if (Entities.headers === undefined) {
        initializeHeaders();
      } else {
        return Entities.headers;
      }
    }
  };

  ContactManager.reqres.setHandler('header:entities', function() {
    return API.getHeaders();
  });
});
