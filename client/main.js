Meteor.subscribe('all');

Accounts.ui.config({
	passwordSignupFields: 'USERNAME_AND_OPTIONAL_EMAIL'
});

Meteor.Router.add({
	'/': 'welcome',
	'/admin': {
		to: 'admin',
		and: function() {
			Session.set('isAdmin', true);
		}
	},
	'/merchants/:_id': {
		to: 'merchantPage',
		and: function(id) {
			Session.set('currentMerchant', id);
		}
	},
	'/*': {
		to: '404'
	}
});

//Global Helpers
Handlebars.registerHelper('merchants', function() {
	return Merchant.find();
});

Template.merchantList.helpers({
	merchantsWithOpenSpree: function() {
		return Spree.find({
			'status': 'open'
		}, {
			transform: function(data) {
				return data.merchant;
			}
		});
	}
});

Template.merchantPage.helpers({
	merchant: function() {
		return Merchant.findOne(Session.get('currentMerchant'));
	},
	openSpree: function() {
		return Spree.findOne({
			'merchant': Session.get('currentMerchant'),
			'status': 'open'
		});
	},
	formatDate: function(date) {
		return date.toLocaleDateString();
	},
	history: function(limit) {

	}
});


Template.spreeList.helpers({
	sprees: function() {
		return Spree.find();
	},
	isAdmin: function() {
		return Session.get('isAdmin');
	},
	getMerchant: function(id, options) {
		return options.fn(Merchant.findOne(id));
	}
});



Deps.autorun(function() {
	//Set Current Spree
	Spree.findOne({
		'merchant': Session.get('currentMerchant'),
		'status': 'open'
	}, {
		transform: function(data) {
			Session.set('currentSpree', data._id);
			console.log('set currentOrder: %s', data._id);
		}
	});
});

Deps.autorun(function() {
	//Set Current Order
	Order.findOne({
		spree: Session.get('currentSpree'),
		user: '122'
	}, {
		transform: function(data) {
			Session.set('currentOrder', data._id);
		}
	})
});