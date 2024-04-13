## Chatter backend with Apollo PubSub, is not intended for production

- For Production solution, such as Redis, please see the [list event-publishing system](https://www.apollographql.com/docs/apollo-server/data/subscriptions/#production-pubsub-libraries)
- In this solution, we are using [Redis PubSub](https://github.com/davidyaha/graphql-redis-subscriptions) for AWS Production server
- On Local server, we are still using the normal GraphQL PubSub comes with NESTJS. See `pubsub.module.ts`
- By default, Javascript objects are serialized using the JSON.stringify and JSON.parse methods. This means that not all objects - such as Date or Regexp objects - will deserialize correctly without a custom reviver, that work out of the box with the default in-memory implementation. In our case, ObjectId, Date in `MessageDocument` will need a custom reviver.
- Notes: The data we receive from Redis PubSub will need to be deserialized to JSON format in `message.service.ts`, before the resolvers can handle it. For this we are using [custom-reviver](https://github.com/davidyaha/graphql-redis-subscriptions?tab=readme-ov-file#using-a-custom-reviver)

## Install nest config and Mongo DB connection

NodeJS v20X
`npm i @nestjs/config @nestjs/mongoose mongoose`
`npm i joi`

### Installing local Mongo DB

<https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-os-x/>

`brew tap mongodb/brew`
`brew update`
`brew install mongodb-community@7.0`

### Using Mongo DB

- kill MongoDB process: <https://stackoverflow.com/questions/11774887/how-to-stop-mongo-db-in-one-command>
  `mkdir -p ~/data/db`
  `chmod 777 ~/data/db`
  `mongod --dbpath ~/data/db`

  - Normally MongoDb will be started on 127.0.0.1:27017
  - Connection string should be `mongodb://127.0.0.1:27017/chatter`

  - How to use [MongoDB Model](https://mongoosejs.com/docs/api/model.html)
  - How to use [MongoDb method](https://www.mongodb.com/docs/manual/reference/method/)
  - [MongoDB aggregate commands](https://www.mongodb.com/docs/manual/reference/operator/aggregation/sort/)

## NestJs GraphQL

- Installing: `npm i @nestjs/graphql @nestjs/apollo @apollo/server graphql`
- Playground GraphQL server, after starting backend: `http://localhost:3001/graphql`
- Understand NestJS GraphQL:
  <https://docs.nestjs.com/graphql/quick-start>

### Running MongoDB Compass to view the MongoDB

<https://www.mongodb.com/try/download/compass>
<https://www.mongodb.com/docs/compass/current/query/filter/?utm_source=compass&utm_medium=product>

### Using `migrate-mongo` package to manage DB migration

`npm i migrate-mongo`
`npm i --save-dev @types/migrate-mongo`

## Install auth module with @nest/passport

`nest g module auth`
`nest g service auth`

## Decoding the retrieved Authentication cookie from jwt.io

## Install common practices Field Validation and annotate email and password

`npm i --save class-validator class-transformer`
[ValidationPipe](https://docs.nestjs.com/techniques/validation)

## AWS Backend deployment with self-signed SSL certificate

- [Using self-signed SSL certificate (not recommended in production environment)](https://www.udemy.com/course/build-a-real-time-chat-app-with-react-nestjs-graphql/learn/lecture/41850348#overview)

```
openssl version
openssl genrsa 2048 > privatekey.pem
stat privatekey.pem
```

`openssl req -new -key privatekey.pem -out csr.pem`

```
Country Name (2 letter code) [AU]:US
State or Province Name (full name) [Some-State]:Washington
Locality Name (eg, city) []:Seattle
Organization Name (eg, company) [Internet Widgits Pty Ltd]:Example Corporation
Organizational Unit Name (eg, section) []:Marketing
Common Name (e.g. server FQDN or YOUR name) []:prod.eba-cnqkbmvr.us-west-2.elasticbeanstalk.com
Email Address []:thangtran3112@gmail.com

Please enter the following 'extra' attributes
to be sent with your certificate request
A challenge password []:sometestpassword
An optional company name []:
```

`openssl x509 -req -days 365 -in csr.pem -signkey privatekey.pem -out public.crt`

- Upload public.crt to AWS Beanstalk with [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)
  `brew install awscli`
  `aws --version`
  `aws configure`

```
AWS Access Key ID [None]: ************************
AWS Secret Access Key [None]: *************************************
Default region name [None]: us-west-2
Default output format [None]:
```

`aws iam upload-server-certificate --server-certificate-name elastic-beanstalk-x509 --certificate-body file://public.crt --private-key file://privatekey.pem`

## Enable CORS on NESTJS backend

- Enable CORS in `main.ts` through `app.enableCors();`
- Enable CORS for GraphQLModule inside `app.module.ts` through `cors: true`

## Backend Setting Cookie issue

- By default, AWS does not allow setting cookie with different CORS origin
