// Proxino.key = "zLtTh21LnAkdc9JjxFX9DA";
// Proxino.track_errors();
Meteor.subscribe('all');

Accounts.ui.config({
	passwordSignupFields: 'USERNAME_AND_EMAIL'
});

Meteor.Router.add({
	'/': 'welcome',
	'/admin': 'admin',

	'/admin/payment': 'paymentManagement',
	'/admin/order': 'orderManagement',
	'/admin/spree': 'spreeManagement',
	'/admin/merchant': 'merchantManagement',
	'/admin/news': 'newsManagement',
	'/admin/user': 'userManagement',

	'/users/self': 'userProfile',
	'/users/cart': 'userCart',
	'/users/all': 'manageUsers',
	'/merchants/': 'merchantList',
	'/merchants/:_id': {
		to: 'merchantPage',
		and: function(id) {
			Session.set('currentMerchant', id);
			console.log(Session.get('currentMerchant'))
		}
	},
	'/*': {
		to: '404'
	}
});

Meteor.Router.filters({
	'checkLoggedIn': function(page) {
		if (Meteor.user()) {
			return page;
		} else {
			//Change URL TODO
			return 'welcome';
		}
	},
	'checkAdmin': function(page) {
		if (Roles.userIsInRole(Meteor.user(), ['admin'])) {
			return page;
		} else {
			//Change URL TODO
			return 'welcome'
		}
	}
});

Meteor.Router.filter('checkLoggedIn', {
	only: ['userProfile', 'userCart']
});

Meteor.Router.filter('checkAdmin', {
	only: ['admin', 'paymentManagement', 'orderManagement', 'spreeManagement', 'merchantManagement', 'userManagement', 'db_view', 'collection_view', 'document_view']
});

//Global Helpers
Template.sidebar.merchantsWithOpenSpree = function() {
	return Spree.find({
		'status': 'open'
	}, {
		transform: function(data) {
			return data.merchant;
		}
	});
};

Template.navbar.rendered = function() {
	$('#login-buttons').children().removeClass('nav-collapse collapse in');
};

// Template.sidebar.created = function() {
// 	var recalc = _.throttle(function() {
// 		console.log('recalc');
// 		$('#sidebar-left').trigger("sticky_kit:recalc");
// 	}, 1000);

// 	$('#sidebar-left .collapse').on('hide', recalc);

// 	_.delay(function() {
// 		$('#sidebar-left').stick_in_parent();
// 	}, 1000);
// };

Meteor.startup(function() {
	Hooks.init();

	Hooks.onLoggedIn = function() {
		var profile = Meteor.user().profile;
		if (!(profile && profile.email && profile.phone && profile.address)) {
			Meteor.Router.to('/users/self');
		}
	}

	Hooks.onLoggedOut = function() {
		Session.set('currentOrder', undefined);
		Meteor.Router.to('/');
	}

	Deps.autorun(function() {
		//Set Current Spree
		var spree = Spree.findOne({
			'merchant': Session.get('currentMerchant'),
			'status': 'open'
		}, {
			transform: function(data) {
				Session.set('currentSpree', data._id);
				console.log('set currentSpree: %s', data._id);
			}
		});
	});

	Deps.autorun(function() {
		//Set Current Order
		var id = Order.findOne({
			spree: Session.get('currentSpree'),
			user: Meteor.userId(),
			status: 0
		}, {
			transform: function(data) {
				Session.set('currentOrder', data._id);
				console.log('set currentOrder: %s', data._id);
				return data;
			}
		});

		if (!id) {
			console.log('No currentOrder');
			Session.set('currentOrder', undefined);
		}
	});

	//Uservoice 
	(function() {
		var uv = document.createElement('script');
		uv.type = 'text/javascript';
		uv.async = true;
		uv.src = '//widget.uservoice.com/OG7gbzHeWZA0aHl0Wkl7jg.js';
		var s = document.getElementsByTagName('script')[0];
		s.parentNode.insertBefore(uv, s)
	})();
});