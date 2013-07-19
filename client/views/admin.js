Template.orderManagement.rendered = function() {
	$('table').tablecloth({
		theme: "paper",
		bordered: true,
		condensed: true,
		sortable: true,
		clean: true
	});
};

Template.orderManagement.helpers({
	orders: function() {
		return Order.find({
			status: {
				$not: 0
			}
		})
	},
	spreeName: function(_id) {
		var spree = Spree.findOne(_id);
		return spree.merchant + ' #' + spree.counter;
	},
	userEmail: function(_id) {
		return Meteor.users.findOne(_id).profile.email;
	},

	userName: function(_id) {
		return Meteor.users.findOne(_id).profile.name;
	},
	statusName: function(_id) {
		return statusList[_id];
	}
});

Template.orderManagement.events({
	'click a.status-dec': function() {
		Order.update(this._id, {
			$inc: {
				status: -1
			}
		})
	},
	'click a.status-inc': function() {
		Order.update(this._id, {
			$inc: {
				status: 1
			}
		})
	},
	'click a.email-update': function() {

		var subject = "";

		var body = "Dear Customer, <br>";

		switch (this.status) {
			case 3:
				subject += "[Payment Verified] status update from YantingSpree";
				body += "Your payment has been confirmed. We will now place orders on your behalf";
				break;
			case 4:
				subject += "[Order Placed] status update from YantingSpree";
				body += "We have successfully placed your orders";
				break;
			case 5:
				subject += "[Shipped from Merchant] status update from YantingSpree";
				body += "Your items have been shipped out by " + Spree.findOne(_id).merchant;
				break;

				//CASE 7

			case 6:
				subject += "[Shipment arrived] status update from YantingSpree";
				body += "Action required. Kindly go to www.yantingspree.com to submit your second payment." //TODO
				break;
			case 8:
				subject += "[Payment Verified] status update from YantingSpree";
				body += "Your payment has been confirmed. We will now package your items and ship it out within 48 hours.";
				break;
			case 9:
				subject += "[Order Complete] status update from YantingSpree";
				body += "Your package has been shipped out. You should receive it within the next few days."
		}

		body += "<br>Have a nice day, <br>Yan Ting";

		Meteor.call('sendMail', Meteor.users.findOne(this.user).profile.email, subject, body)
	}
});

Template.verifyPayment.helpers({
	payments: function() {
		return Payment.find({
			verified: false
		});
	}
});

Template.verifyPayment.events({
	'click a[name="verify-payment"]': function() {
		Payment.update(this._id, {
			verified: true
		});

		Order.update(this.order, {
			$inc: {
				status: 1
			}
		});
		console.log('Payment verified');
	},
	'click a[name="reject-payment"]': function() {
		Payment.remove(this._id);

		Order.update(this.order, {
			$inc: {
				status: -1
			}
		});
		console.log('Payment verified');
	}
});