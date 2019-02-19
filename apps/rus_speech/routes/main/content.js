module.exports = function(Model) {
	var module = {};

	var Member = Model.Member;

	module.about = function(req, res) {
		Member.find().populate('categorys').exec(function(err, members) {
			res.render('main/about.pug', { members: members });
		});
	};

	module.lessons = function(req, res) {
		res.render('main/lessons.pug');
	};

	return module;
};