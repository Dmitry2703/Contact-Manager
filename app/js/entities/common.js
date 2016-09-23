/**
 * @fileOverview Файл с расширением сущностей приложения
 */

'use strict';

ContactManager.module('Entities', function(Entities, ContactManager, Backbone, Marionette, $, _) {
  Entities.FilteredCollection = function(options) {
    // оригинальная коллекция сущностей
    var original = options.collection;

    // отфильтрованная коллекция сущностей
    var filtered = new original.constructor();
    filtered.add(original.models);
    filtered.filterFunction = options.filterFunction;

    // функция, отвечающая за обработку фильтров
    // в зависимости от того, какая filterStrategy будет передана
    var applyFilter = function(filterCriterion, filterStrategy, collection) {
      var collection = collection || original;
      var criterion;
      if (filterStrategy === 'filter') {
        // jQuery-функция, убирающая лишние пробелы в начале и конце строки
        criterion = filterCriterion.trim();
      } else {
        criterion = filterCriterion;
      }

      var items = [];
      if (criterion) {
        if (filterStrategy == 'filter') {
          if(!filtered.filterFunction) {
            throw('Attempted to use "filter" function, but none was defined');
          }
          var filterFunction = filtered.filterFunction(criterion);
          items = collection.filter(filterFunction);
        } else {
          // метод Backbone
          items = collection.where(criterion);
        }
      } else {
        items = collection.models;
      }

      filtered._currentCriterion = criterion;

      return items;
    };

    filtered.filter = function(filterCriterion) {
      filtered._currentFilter = 'filter';
      var items = applyFilter(filterCriterion, 'filter');
      filtered.reset(items); // обновляем коллекцию
      return filtered;
    };

    filtered.where = function(filterCriterion) {
      filtered._currentFilter = 'where';
      var items = applyFilter(filterCriterion, 'where');
      filtered.reset(items); // обновляем коллекцию
      return filtered;
    };

    // фильтр должен отработать на новых моделях, если коллекция
    // инициализирует метод reset
    original.on('reset', function() {
      var items = applyFilter(filtered._currentCriterion, filtered._currentFilter);
      filtered.reset(items);
    });

    // хук на добавление нового контакта
    original.on('add', function(models) {
      var coll = new original.constructor();
      coll.add(models);
      var items = applyFilter(filtered._currentCriterion, filtered._currentFilter, coll);
      filtered.add(items);
    });

    return filtered;
  };
});
