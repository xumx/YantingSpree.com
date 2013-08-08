Template.admin.events({
	'click #dev': function() {

		el = $('table')[0];
		var body = document.body,
			range, sel;
		if (document.createRange && window.getSelection) {
			range = document.createRange();
			sel = window.getSelection();
			sel.removeAllRanges();
			try {
				range.selectNodeContents(el);
				sel.addRange(range);
			} catch (e) {
				range.selectNode(el);
				sel.addRange(range);
			}
		} else if (body.createTextRange) {
			range = body.createTextRange();
			range.moveToElementText(el);
			range.select();
		}
	}
});


Template.verifyPayment.helpers({
	payments: function() {
		return Payment.find({
			verified: false
		});
	},
	userName: function(_id) {
		return Meteor.users.findOne(_id).profile.name;
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
	},
	'click a[name="reject-payment"]': function() {
		Payment.remove(this._id);

		Order.update(this.order, {
			$inc: {
				status: -1
			}
		});
	}
});

Template.orderManagement.rendered = function() {
	_.defer(function function_name(argument) {
		$('table').tablecloth({
			theme: "paper",
			bordered: true,
			condensed: true,
			sortable: true,
			clean: true
		});
	});
};

Template.orderManagement.helpers({
	orders: function() {
		return Order.find({
			status: {
				$not: 10
			}
		})
	},
	selectedOrder: function() {
		return Order.findOne(Session.get('selectedOrder'));
	},
	itemStatusIcon: function(stage) {
		if (this.status >= stage) {
			return 'label-success';
		}
	},
	spreeName: function(_id) {
		var spree = Spree.findOne(_id);
		if (spree) {
			return spree.merchant + ' #' + spree.counter;
		} else {
			return "Error: Floating Order with no Spree attached: Likely cause (Deleted Spree from Data View";
		}
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
		});
	},
	'click a.status-inc': function() {
		Order.update(this._id, {
			$inc: {
				status: 1
			}
		});
	},
	'click a.email-update': function() {
		var subject = "",
			body = "Dear Customer, <br>",
			that = this;

		if (this.status == 8) {
			bootbox.prompt('Tracking Number?', function(tracking) {
				createBody(tracking);
			});
		} else {
			createBody();
		}

		function createBody(tracking) {
			switch (that.status) {
				case 2:
					subject += "[Payment Verified] status update from YantingSpree";
					body += "Your payment has been confirmed. We will now place orders on your behalf";
					break;
				case 3:
					subject += "[Order Placed] status update from YantingSpree";
					body += "We have successfully placed your orders";
					break;
				case 4:
					subject += "[Shipped from Merchant] status update from YantingSpree";
					body += "Your items have been shipped out by " + Spree.findOne(that._id).merchant;
					break;
				case 5:


					subject += "[Shipment arrived] status update from YantingSpree";
					body += "Action required. Kindly go to www.yantingspree.com to submit your second payment." //TODO
					//CASE 7
					break;
				case 6:
					subject += "[Payment Verified] status update from YantingSpree";
					body += "Your payment has been confirmed. We will now package your items and ship it out within 48 hours.";
					break;
				case 8:
					subject += "[Order Complete] status update from YantingSpree";
					body += "Your package has been shipped out. You should receive it within the next few days."
					if (tracking.length > 0) {
						body += "<br><br>Your Tracking number is <b>" + tracking + "</b>";
					}
					break;
			}

			body += "<br><br>Have a nice day, <br>Yan Ting";

			bootbox.confirm(body, function(result) {
				if (result) {
					Meteor.call('sendMail', Meteor.users.findOne(that.user).profile.email, subject, body);
					Meteor.Messages.sendSuccess('Email Sent!');
				}
			});
		}
	},
	'click a.select-order': function() {
		Session.set('selectedOrder', this._id);
	},
	'click span.item-status-icon': function(event) {
		var orderId = Session.get('selectedOrder');

		var index = _.indexOf(_.pluck(Order.findOne(orderId).items, '_id'), this._id);
		var modifier = {
			$set: {}
		};
		var value = parseInt($(event.target).attr('name'));
		modifier.$set['items.' + index + '.status'] = value;

		Order.update(orderId, modifier);
	}
});


Template.spreeManagement.helpers({
	allSpree: function() {
		return Spree.find({});
	},
	numberOfOrders: function() {
		return Order.find({
			spree: this._id
		}).count();
	},
	open: function () {
		return (this.status === 'open');
	}
});

Template.spreeManagement.events({
	'click a[name=reopen]': function(event) {
		Merchant.update(this.merchant, {
			$set: {
				open: true
			}
		});

		//Default end date is 7 days later, 11pm
		var endDate = moment(new Date().addDays(7)).format('Do MMMM') + ' 11:00PM';

		Spree.update(this._id, {
			$set: {
				status: 'open',
				endDate: endDate
			}
		});
	},
	'click a[name=close]': function(event) {
		Merchant.update(this.merchant, {
			$set: {
				open: false
			}
		});

		Spree.update(this._id, {
			$set: {
				status: 'close'
			}
		});
	}
});


Template.merchantManagement.helpers({
	allMerchants: function() {
		return Merchant.find({}, {
			sort: {
				open: -1,
				_id: 1
			}
		});
	}
});

Template.merchantManagement.events({
	'click a[name=open]': function(event) {
		Merchant.update(this._id, {
			$set: {
				open: true
			}
		});

		var nextSequenceNo = Spree.findOne({
			merchant: this._id
		}, {
			sort: {
				counter: -1
			},
			transform: function(data) {
				return data.counter + 1;
			}
		}) || 1;

		//Default end date is 7 days later, 11pm
		var endDate = moment(new Date().addDays(7)).format('Do MMMM') + ' 11:00PM';

		Spree.insert({
			merchant: this._id,
			status: 'open',
			startDate: new Date(),
			endDate: endDate,
			counter: nextSequenceNo,
		});
	},
	'click a[name=close]': function(event) {
		Merchant.update(this._id, {
			$set: {
				open: false
			}
		});

		var spree = Spree.findOne({
			'merchant': this._id,
			'status': 'open'
		});

		if (spree) {
			Spree.update(spree._id, {
				$set: {
					status: 'close'
				}
			});
		}
	},
	'click a[name=update]': function(event) {
		var id = this._id,
			form = $(event.target).parents('form');

		this._id = form.find('[name=_id]').val();
		this.url = form.find('[name=url]').val();
		this.banner = form.find('[name=banner]').val();
		this.thumbnail = form.find('[name=thumbnail]').val();
		this.speed = form.find('[name=speed]').val();
		this.shipping = form.find('[name=shipping]').val();
		this.currency = form.find('[name=currency]').val();
		this.cap = form.find('[name=cap]').val();
		this.remarks = form.find('[name=remarks]').val();

		console.log(this);
		Merchant.update(id, this);
	},
	'click a[name=delete]': function(event) {
		if (confirm("Confirm Delete Merchant")) {
			Merchant.update(this._id, {
				$set: {
					open: false
				}
			});

			var spree = Spree.findOne({
				'merchant': this._id,
				'status': 'open'
			});

			if (spree) {
				Spree.update(spree._id, {
					$set: {
						status: 'close'
					}
				});
			}

			Merchant.remove(this._id);
		}
	}
});