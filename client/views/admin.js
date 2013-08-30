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

Template.paymentManagement.created = function() {
	var that = this
	_.defer(function() {
		$(that.find('table')).tablecloth({
			theme: "paper",
			bordered: true,
			condensed: true,
			sortable: true,
			clean: true
		});
	});
};

Template.paymentManagement.rendered = function() {
	$(this.find('table')).trigger('update');
};

Template.paymentManagement.helpers({
	payments: function() {
		return Payment.find({
			verified: false
		});
	},
	userName: function(_id) {
		return Meteor.users.findOne(_id).profile.name;
	}
});

Template.paymentManagement.events({
	'click a[name="verify-payment"]': function() {
		Payment.update(this._id, {
			$set: {
				verified: true
			}
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
	var that = this
	_.defer(function() {
		var table = $(that.findAll('table')).tablecloth({
			theme: "paper",
			bordered: true,
			condensed: true,
			sortable: true,
			clean: true
		});

		if (table) table.trigger('update');
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
	orderStatusIcon: function(stage) {
		if ((this.status == 1 || this.status == 4 || this.status == 6) && this.status == stage) {
			return 'label-warning';
		} else if (this.status >= stage) {
			return 'label-success';
		} else {
			return 'hidden';
		}
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
	},
	address: function(order) {
		if (order.useAlternateShippingAddress) {
			return order.alternateShippingAddress;
		} else {
			return Meteor.users.findOne(order.user).profile.address;
		}
	},
	cost: function() {
		if (this.items) {
			return _.reduce(this.items, function(memo, item) {
				return memo + item.SGD
			}, 0).toFixed(2);
		}
	},
	total: function(cost) {
		var total = 0;

		total = this.shippingcost + this.postagecost + this.handlingfee + parseFloat(cost);

		if (this.bubble) {
			total += 1;
		}

		if (this.box) {
			total += 1.2;
		}

		if (this.shippingMethod == 'Registered Mail') {
			total += 2.14
		} else if (this.shippingMethod == 'TA-Q-BIN') {
			total += 1.14
		} else if (this.shippingMethod == 'Normal Mail') {
			total += 1.14
		}

		return (Math.ceil(total * 100) / 100).toFixed(2);
	},
	paid: function() {
		var verifiedPayments = Payment.find({
			order: this._id,
			verified: true
		}).fetch();

		var total = _.reduce(verifiedPayments, function(memo, data) {
			return memo + parseFloat(data.amount);;
		}, 0).toFixed(2);;

		return total;
	},
	topup: function(cost, paid) {
		var total = 0;

		total = this.shippingcost + this.postagecost + this.handlingfee + parseFloat(cost) - parseFloat(paid);

		if (this.bubble) {
			total += 1;
		}

		if (this.box) {
			total += 1.2;
		}

		if (this.shippingMethod == 'Registered Mail') {
			total += 2.14
		} else if (this.shippingMethod == 'TA-Q-BIN') {
			total += 1.14
		} else if (this.shippingMethod == 'Normal Mail') {
			total += 1.14
		}

		return (Math.ceil(total * 100) / 100).toFixed(2);
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
					FlashMessages.sendSuccess('Email Sent!');
				}
			});
		}
	},
	'click a.alt-address': function() {
		bootbox.alert(this.alternateShippingAddress);
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
	},
	'change input[name=shippingunit]': function(event) {
		var value = parseFloat($(event.target).val());
		Order.update(this._id, {
			$set: {
				shippingunit: value
			}
		});
	},
	'change input[name=shippingcost]': function(event) {
		var value = parseFloat($(event.target).val());
		Order.update(this._id, {
			$set: {
				shippingcost: value
			}
		});
	},
	'change input[name=postagecost]': function(event) {
		var value = parseFloat($(event.target).val());
		Order.update(this._id, {
			$set: {
				postagecost: value
			}
		});
	}
});

Template.spreeManagement.created = function() {
	var that = this
	_.defer(function() {
		$(that.find('table')).tablecloth({
			theme: "paper",
			bordered: true,
			condensed: true,
			sortable: true,
			clean: true
		});
	});
};

Template.spreeManagement.rendered = function() {
	$(this.find('table')).trigger('update');
};

Template.spreeManagement.helpers({
	allSpree: function() {
		return Spree.find({}, {
			sort: {
				merchant: 1,
				counter: 1
			}
		});
	},
	numberOfOrders: function() {
		return Order.find({
			spree: this._id
		}).count();
	},
	open: function() {
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
		var form = $(event.target).parents('form');

		var data = {};

		data.url = form.find('[name=url]').val();
		data.banner = form.find('[name=banner]').val();
		data.thumbnail = form.find('[name=thumbnail]').val();
		data.speed = form.find('[name=speed]').val();
		data.shipping = form.find('[name=shipping]').val();
		data.currency = form.find('[name=currency]').val();
		data.cap = form.find('[name=cap]').val();
		data.remarks = form.find('[name=remarks]').val();

		console.log(data);
		Merchant.update(this._id, {
			$set: data
		});
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

Template.userManagement.created = function() {
	var that = this
	_.defer(function() {
		$(that.find('table')).tablecloth({
			theme: "paper",
			bordered: true,
			condensed: true,
			sortable: true,
			clean: true
		});
	});
};

Template.userManagement.rendered = function() {
	$(this.find('table')).trigger('update');
};

Template.userManagement.helpers({
	users: function() {
		return Meteor.users.find();
	}
});

Template.userManagement.events({
	'click a[name=impostor]': function() {
		console.log(this._id);
	}
});

Template.newsManagement.events({
	'submit form': function(event) {
		event.preventDefault();

		var article = {
			link: $(event.target).find('[name=link]').val(),
			linkText: $(event.target).find('[name=linkText]').val(),
			thumbnail: $(event.target).find('[name=thumbnail]').val(),
			description: $(event.target).find('[name=description]').val(),
			date: new Date()
		}

		News.insert(article);

		$(event.target).parent('form').get(0).reset();
	}
});