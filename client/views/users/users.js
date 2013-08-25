Template.userProfile.events({
	'keyup #postalcode': function(event) {
		var form, unitnumber, address, postalcode = $(event.target).val();

		if (postalcode.length == 6) {
			form = $(event.target).parents('form');
			hiddenStreet = form.find('input[name=street]');
			unitnumber = form.find('input[name="unitnumber"]');
			address = form.find('textarea[name="address"]');

			Meteor.call('resolvePostalCode', postalcode, function(err, street) {
				if (!err) {
					var addressText = street + '\n';
					addressText += unitnumber.val() + '\n';
					addressText += postalcode + '\n';

					address.val(addressText);
					hiddenStreet.val(street);
				}
			});
		}
	},
	'keyup #unitnumber': function(event) {
		var form = $(event.target).parents('form'),
			addressText = form.find('input[name="street"]').val() + '\n';
		addressText += form.find('input[name="unitnumber"]').val() + '\n';
		addressText += form.find('input[name="postalcode"]').val();

		form.find('textarea[name="address"]').val(addressText);
	},
	'submit form': function(event) {
		event.preventDefault();

		var form = $(event.target),
			profile = {
				postalcode: form.find('input[name="postalcode"]').val(),
				unitnumber: form.find('input[name="unitnumber"]').val(),
				address: form.find('textarea[name="address"]').val(),
				phone: form.find('input[name="phone"]').val(),
				bank: form.find('input[name="bank"]').val(),
				email: form.find('input[name="profile-email"]').val(),
				name: form.find('input[name="profilename"]').val(),
			}

		profile = _.extend(Meteor.user().profile, profile);
		Meteor.users.update({
			_id: Meteor.user()._id
		}, {
			$set: {
				"profile": profile
			}
		});

		FlashMessages.sendSuccess('User Profile Saved');
	}
});

Template.userCart.helpers({
	orders: function() {
		return Order.find({
			user: Meteor.userId(),
			status: {
				$lt: 10
			}
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
	isPrepayment: function(status) {
		return (status === 0);
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
			FlashMessages.sendError("This order is currently in progress. You cannot delete it at this stage. For assistance, please email info@yantingspree.com")
		}
	}
});