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
	stageOne: function(status) {
		return (status === 1);
	},
	sumSGD: function() {
		if (this.items) {
			return _.reduce(this.items, function(memo, item) {
				return memo + item.SGD
			}, 0).toFixed(2);
		}
	}
});

Template.userCart.events({
	'click button.close': function(e) {
		//Delete
		e.preventDefault();

		var orderId = Order.findOne({
			'items._id': this._id
		})._id;

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
	'click #make-payment-one': function() {
		var payment = {
			amount: $('input[name="payment-one-amount"]').val(),
			transaction: $('input[name="payment-one-transaction-number"]').val(),
			verified: false,
			user: Meteor.userId(),
			order: this._id
		}

		console.log(payment);

		Payment.insert(payment);

		Order.update(this._id, {
			$set: {
				status: 2
			}
		});
	}
});

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
	}
});