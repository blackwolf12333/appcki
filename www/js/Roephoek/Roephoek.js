angular
	.module('appcki.roephoek',[])
	.controller("appckiRoephoekOverview", ['$scope', '$ionicPopup', '$ionicScrollDelegate', 'RoephoekService', 'UserService', 'DateHelper',
		function( $scope, $ionicPopup, $ionicScrollDelegate, RoephoekService, UserService, DateHelper){
			var page = 0;
			$scope.last = false;
			var newestId;
			var oldestId = -1;
			

			$scope.items = [];

			$scope.doRefresh = function(){
				var items = [];
				RoephoekService.getNewer(newestId, function(data){
					newestId = data.content[0].id || newestId;
					for(var i = data.content.length; i > 0; i--)
					{
						var item = data.content[i-1];
						item.when = DateHelper.difference(item.timestamp);
						$scope.items.unshift(item);
					}
				},
				function(){
					$scope.$broadcast('scroll.refreshComplete');
				});
			}

			$scope.loadMoreData = function()
			{
				RoephoekService.getOlder(oldestId, function(data){
					$scope.last = data.last;
					
					newestId = newestId || data.content[0].id;
					oldestId = data.content[data.content.length - 1].id;

					for(var i = 0; i < data.content.length; i++) {
						var item = data.content[i];
						item.when = DateHelper.difference(item.timestamp);
						$scope.items.unshift(item);
					}
				}, function(){
					$scope.$broadcast('scroll.infiniteScrollComplete');
				});

			}

			$scope.openShout = function(){
				$scope.shout = {};
				$scope.shout.name = UserService.fullname();
			  $ionicPopup.show({
			     template: '<input type="text" ng-model="shout.name" placeholder="Naam" maxlength="26"/><textarea ng-model="shout.message" maxlength="161" style="height:80px;" placeholder="Bericht"> </textarea>',
			     title: 'WatRoepJeMeNou',
			     subTitle: '',
			     scope: $scope,
			     buttons: [
			       { text: 'Annuleren' },
			       {
			         text: '<b>Roep!</b>',
			         type: 'button-positive',
			         onTap: function(e) {
			             return $scope.shout;
			         }
			       },
			     ]
			   }).then(function(res) {
					RoephoekService.post($scope.shout.name, $scope.shout.message, function(d){
						$scope.doRefresh();
					}, function(d){
						var alertPopup = $ionicPopup.alert({
							title: 'Mislukt',
							template: 'Je roep kon niet worden verstuurd. Controleer of je alles hebt ingevuld en ga zitten balen, tot het we werkt!'
						});
					});
			   });			
			};
	}]);