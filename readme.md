# La aplicacion se inicia mediante el comando npm start ejecutado en la carpeta raiz

El puerto es el 8080

Las rutas de la api  son las siguientes
POST localhost:8080/api/auth/login
GET localhost:8080/api/auth/logout
POST localhost:8080/api/users/signup
POST localhost:8080/api/users/signup
POST localhost:8080/api/users/signup
POST localhost:8080/api/users/password

GET localhost:8080/api/posts
GET localhost:8080/api/posts
POST localhost:8080/api/posts
PUT localhost:8080/api/posts/:postId
DELETE localhost:8080/api/posts/:postId

GET localhost:8080/api/posts/:postId/comments
POST localhost:8080/api/posts/:postId/comments
PUT localhost:8080/api/posts/:postId/comments/:commentId
DELETE localhost:8080/api/posts/:postId/comments/:commentId

Las rutas de la interfaz web:
localhost:8080/
localhost:8080/signup
localhost:8080/posts
localhost:8080/posts/my-posts
localhost:8080/api/my-profile

La aplicación usa JWT como medida de seguridad que se envía en las respuesta en la cookie

Se adjunta script para la creación de la base de datos.
Sin embargo, ya que se implementó con Sequelize, se puede sincronizar para que las
tablas se creen y se sincronizen con el modelo.
Solo se debería crear el esquema en la BD.

