Template.userProfile.events({
	'keyup #postalcode': function(event) {
		var postalcode = $(event.target).val();

		if (postalcode.length == 6) {
			Meteor.call('resolvePostalCode', postalcode, function(err, street) {
				if (!err) {
					var addressText = postalcode + '\n';
					addressText += street + ', ';
					addressText += $('input[name="unitnumber"]').val();

					$('textarea[name="address"]').val(addressText);
				}
			});
		}
	},
	'keyup #unitnumber': function() {
		var addressText = $('input[name="postalcode"]').val() + '\n';
		addressText += $('input[name="street"]').val() + ', ';
		addressText += $('input[name="unitnumber"]').val();

		$('textarea[name="address"]').text(addressText);
	},
	'submit form': function(event) {
		event.preventDefault();

		var profile = {
			postalcode: $('input[name="postalcode"]').val(),
			unitnumber: $('input[name="unitnumber"]').val(),
			address: $('textarea[name="address"]').val(),
			phone: $('input[name="phone"]').val(),
			bank: $('input[name="bank"]').val(),
			email: $('input[name="profile-email"]').val(),
			name: $('input[name="profilename"]').val(),
		}

		profile = _.extend(Meteor.user().profile, profile);
		Meteor.users.update({
			_id: Meteor.user()._id
		}, {
			$set: {
				"profile": profile
			}
		});

		Meteor.Messages.sendSuccess('User Profile Saved');
	}
});

Template.userCart.helpers({
	orders: function() {
		return Order.find({
			user: Meteor.userId()
			//TODO Check Status
		});
	},
	getStatus: function() {
		return statusList[this.status];
	},
	getSpree: function(_id, options) {
		return options.fn(Spree.findOne(_id));
	},
	stage: function(s) {
		return (this.status === s);
	},
	sumSGD: function() {
		if (this.items) {
			return _.reduce(this.items, function(memo, item) {
				if (typeof item.SGD != 'number') {
					return 0;
				}
				return memo + item.SGD
			}, 0).toFixed(2);
		}
	}
});

Template.userCart.events({
	'click .box-header': function(e) {
		$(e.target).next().slideToggle();
	},
	'click a.delete-item': function(e) {
		//Delete
		e.preventDefault();

		var order = Order.findOne({
			'items._id': this._id
		});

		if (order.status === 1) {
			var orderId = order._id;

			Order.update(orderId, {
				$pull: {
					items: {
						'_id': this._id
					}
				}
			});

			//If item list is empty, delete order
			if (Order.findOne(orderId).items.length === 0) {
				Order.remove(orderId);
				Session.set('currentOrder', undefined);
			} else {
				Order.update(orderId, {
					$set: {
						lastUpdate: new Date()
					}
				});
			}
		} else {
			Meteor.Messages.sendError("This order is currently in progress. You cannot delete any item at this stage. For assistance, please email info@yantingspree.com")
		}
	},
	'click button.close': function(e) {
		var orderId = this._id;

		e.preventDefault();

		if (this.status === 1) {
			bootbox.confirm('Are you sure you want to delete this order?', function(a) {
				if (a) {
					Order.remove(orderId);
				}
			});
		} else {
			Meteor.Messages.sendError("This order is currently in progress. You cannot delete it at this stage. For assistance, please email info@yantingspree.com")
		}
	}
});