var gulp 			= require("gulp"); // Padrão para utilizar as tasks
var sass 			= require("gulp-sass"); // Compilar o Sass para Css
var htmlmin 		= require("gulp-htmlmin"); // Minificar html
var notify 			= require("gulp-notify"); // Notificar sobre erros
var concat 			= require("gulp-concat"); // Plugin para Concatenar arquivos
var uglify 			= require("gulp-uglify"); // Minificar arquivos JS
// browserSync (plugin real-time), enquanto é feito o trabalho, a página vai atualizando automaticamente
var browserSync 	= require("browser-sync").create(); // .create() para já dar start ao BrowserSync
var del 			= require("del"); // Plugin exclusivo para deletar arquivos


/* -------------------------------------------------------------------------------------------------------
	Tasks Cache
	-> Utilizando o plugin Del para fazer uma limpa inicial nos arquivos
------------------------------------------------------------------------------------------------------- */
gulp.task("cache:css", function() {
	del("./dist/css/style.css")
});

gulp.task("cache:js", function() {
	del("./dist/js/app.js")
});

/* -------------------------------------------------------------------------------------------------------
	Tasks Sass
	- Antes de executar a task Sass, é chamada a task cache para limpar o arquivos css do .dist
	- Faz a busca do arquivo Style.scss, faz compressão e manda para a pasta ./dist
	- Após tudo feito, o BrowserSync atualiza a página
------------------------------------------------------------------------------------------------------- */
gulp.task("sass", ['cache:css'], function() {
	return gulp.src("./src/scss/style.scss")
				.pipe(sass({outPutStyle: 'compressed'}))
				.on('error', notify.onError({title: "erro scss", message: "<%= error.message %>"}))
				.pipe(gulp.dest("./dist/css"))
				.pipe(browserSync.stream());
});

/* -------------------------------------------------------------------------------------------------------
	Tasks Minify Html
	- Faz a busca do arquivo index.html, faz a minificação e manda para a pasta ./dist
	- Após tudo feito, o BrowserSync atualiza a página
------------------------------------------------------------------------------------------------------- */
gulp.task("html", function() {
	return gulp.src("./src/index.html")
				.pipe(htmlmin({collapseWhitespace: true}))
				.pipe(gulp.dest("./dist"))
				.pipe(browserSync.stream());
});

/* -------------------------------------------------------------------------------------------------------
	Tasks JS
	- Antes de executar a task JS, é chamada a task cache para limpar o arquivos JS do .dist
	- Faz a busca do arquivo app.js, faz a minificação e manda para a pasta ./dist
	- Após tudo feito, o BrowserSync atualiza a página
------------------------------------------------------------------------------------------------------- */
gulp.task("js", ['cache:js'], function() {
	return gulp.src("./src/js/app.js")
				.pipe(uglify())
				.pipe(gulp.dest("./dist/js"))
				.pipe(browserSync.stream());
});

/* -------------------------------------------------------------------------------------------------------
	Tasks Concat JS
	- Faz a busca dos arquivos e concatena em um arquivo main.js
	- Após tudo feito, é enviado para a pasta ./dist/js
------------------------------------------------------------------------------------------------------- */
gulp.task("concat-js", function() {
	return gulp.src([
					'./src/components/jquery/dist/jquery.js',
					'./src/components/tether/dist/js/tether.js',
					'./src/components/bootstrap/dist/js/bootstrap.js'
				])
				.pipe(concat("main.js"))
				.pipe(gulp.dest("./dist/js"))

});

/* -------------------------------------------------------------------------------------------------------
	Tasks Move Fonts
	- Faz a busca dos arquivos e envia para a pasta ./dist/fonts
------------------------------------------------------------------------------------------------------- */
gulp.task("move-fonts", function(){
	return gulp.src('./src/components/components-font-awesome/fonts/**')
		.pipe(gulp.dest("./dist/fonts"))
});

/* -------------------------------------------------------------------------------------------------------
	Tasks Server
	- Inicializa o BrowserSync, recebendo um argumento server que vai abrir um segundo argumento que
	vai buscar a index no ./dist

	*Watch*
	- Ficar visualizando as pastas e caso alguma mudança seja realizada é ativada uma Task para
	tratar da mudança.
------------------------------------------------------------------------------------------------------- */
gulp.task("server", function() {
	browserSync.init({
		server: {
			baseDir: "./dist"
		}
	});

	/* Watch */
	gulp.watch("./src/scss/**/*.scss", ['sass']);
	gulp.watch("./src/components/bootstrap/scss/**/*.scss", ['sass']);
	gulp.watch("./src/js/**/*.js", ['js']);
	gulp.watch("./src/index.html", ['html']);
});

/* -------------------------------------------------------------------------------------------------------
	Tasks default
	- Roda uma sequencia de tasks em ordem planejada
------------------------------------------------------------------------------------------------------- */
gulp.task("default", ["sass", "html", "js", "concat-js", "server"]);












