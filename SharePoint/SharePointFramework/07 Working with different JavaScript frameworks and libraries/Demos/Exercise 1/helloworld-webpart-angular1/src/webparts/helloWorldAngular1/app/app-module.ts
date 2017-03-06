import * as angular from 'angular';
import HomeController from './HomeController';
import DataService from './DataService';

const angularApp: angular.IModule = angular.module('angularApp', []);

angularApp
  .controller('HomeController', HomeController)
  .service('DataService', DataService);