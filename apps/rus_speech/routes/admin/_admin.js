var express = require('express');
var multer = require('multer');

var upload = multer({ dest: __glob_root + '/uploads/' });

var admin = {
	main: require('./main.js'),
	posts: require('./posts/_posts.js'),
	members: require('./members/_members.js'),
	categorys: require('./categorys/_categorys.js'),
	units: require('./units/_units.js'),
	cv: require('./cv.js'),
	users: require('./users/_users.js'),
	options: require('./options.js')
};

var checkAuth = function(req, res, next) {
	req.session.user_id
		? next()
		: res.redirect('/auth');
};

module.exports = (function() {
	var router = express.Router();

	router.route('/').get(checkAuth, admin.main.index);

	router.route('/cv')
		.get(checkAuth, admin.cv.edit)
		.post(checkAuth, admin.cv.edit_form);

	router.use('/posts', checkAuth, upload.fields([ { name: 'poster' } ]), admin.posts);
	router.use('/units', checkAuth, upload.fields([ { name: 'preview' }, { name: 'attach' } ]), admin.units);
	router.use('/members', checkAuth, upload.fields([ { name: 'photo' } ]), admin.members);
	router.use('/categorys', checkAuth, admin.categorys);
	router.use('/users', checkAuth, admin.users);

	router.post('/preview', checkAuth, upload.single('image'), admin.options.preview);

	return router;
})();