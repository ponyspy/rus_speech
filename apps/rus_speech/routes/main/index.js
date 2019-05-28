var pug = require('pug');

module.exports = function(Model) {
	var module = {};

	var Post = Model.Post;
	var Category = Model.Category;

	module.index = function(req, res) {
		Post.find().sort('-date').populate('categorys').exec(function(err, posts) {
			Post.find().where('status').ne('hidden').distinct('categorys').exec(function(err, c_ids) {
				Category.find().where('_id').in(c_ids).exec(function(err, categorys) {
					res.render('main/index.pug', { posts: posts, categorys: categorys });
				});
			});
		});
	};

	module.get_posts = function(req, res) {
		var post = req.body;
		var id = post.context.category;

		Category.findOne({ $or: [ { '_short_id': id || false }, { 'sym': id || false } ] }).where('status').ne('hidden').exec(function(err, category) {
			if (err) return res.send('end');

			var Query = id !== ''
				? Post.find({ 'categorys': category._id })
				: Post.find();

			Query.where('status').ne('hidden').populate('categorys').sort('-date').skip(+post.context.skip).limit(+post.context.limit).exec(function(err, posts) {
				var opts = {
					posts: posts,
					category: category,
					init: post.init,
					locale: req.locale,
					compileDebug: false, debug: false, cache: true, pretty: false
				};

				if (posts && posts.length > 0) {
					res.send(pug.renderFile(__app_root + '/views/main/_posts.pug', opts));
				} else {
					res.send('end');
				}
			});

		});
	};

	module.post = function(req, res) {
		var id = req.params.id;

		Post.findOne({ $or: [ { '_short_id': id }, { 'sym': id } ] }).where('status').ne('hidden').populate('categorys units').exec(function(err, post) {
			res.render('main/post.pug', { post: post });
		});
	};

	return module;
};