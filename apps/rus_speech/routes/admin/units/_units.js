var express = require('express');

var Model = require(__glob_root + '/models/main.js');

var Params = {
	locale: require('../_params/locale'),
	upload: require('../_params/upload'),
	helpers: require('../_params/helpers')
};

var units = {
	list: require('./list.js')(Model),
	add: require('./add.js')(Model, Params),
	edit: require('./edit.js')(Model, Params),
	remove: require('./remove.js')(Model)
};

module.exports = (function() {
	var router = express.Router();

	router.route('/')
		.get(units.list.index)
		.post(units.list.get_list);

	router.route('/add')
		.get(units.add.index)
		.post(units.add.form);

	router.route('/edit/:unit_id')
		.get(units.edit.index)
		.post(units.edit.form);

	router.route('/remove')
		.post(units.remove.index);

	return router;
})();