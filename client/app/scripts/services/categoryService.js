/**
 * Created by guodont on 16/4/21.
 */
'use strict';

angular.module('clientApp')
  .service('categoryService', ['$http', '$cookies', function ( $http, $cookies) {

    var self = this;

    // 添加分类 type: 分类类型 parentId 父id 一级分类为0
    self.addCategory = function (params, success, error) {
      $http({
        method: 'POST',
        url: '/api/v1/category/'+params.type +'/' + params.parentId,
        headers: {authenticate: $cookies.token},
        data: {
          name: params.name,
          sort: params.sort,
          image: params.image
        }
      })
        .then(function (res) {
          if (typeof (success) === 'function') {
            success(res);
          }
        }, function (res) {
          if (typeof (error) === 'function') {
            error(res);
          }
        });
    };

    // 更新分类
    self.updateCategory = function (params, success, error) {
      $http({
        method: 'PUT',
        url: '/api/v1/category/' + params.categoryId,
        headers: {authenticate: $cookies.token},
        data: {
          name: params.name,
          sort: params.sort,
          image: params.image
        }
      })
        .then(function (res) {
          if (typeof (success) === 'function') {
            success(res);
          }
        }, function (res) {
          if (typeof (error) === 'function') {
            error(res);
          }
        });
    };

    // 获取所有分类
    self.getCategories = function (params, success, error) {
      $http({
        method: 'GET',
        url: '/api/v1/categories/' + params.type,
        headers: {authenticate: $cookies.token}
      })
        .then(function (res) {
          if (typeof (success) === 'function') {
            success(res);
          }
        }, function (res) {
          if (typeof (error) === 'function') {
            error(res);
          }
        });
    };

    return self;
  }]);