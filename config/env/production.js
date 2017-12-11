"use strict";


module.exports = {
  sequelize: {
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    username: process.env.DB_USERNAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "postgres",
    logging: true
  },
  auth: {
    expirationPeriod: {
      short: '10m',
      medium: '30m',
      long: '4h'
    },
    jwt: {
      sign: {
        expiresIn: '2 days'
      },
      secret: process.env.JWT_SECRET,
      verify: null
    }
  },
  email: {
    defaultMailer: 'mandrill',
    from: 'Fluttr <info@fluttr.com>',
    replyTo: 'Fluttr <info@fluttr.com>',
    sendgrid: {
      key: null
    },
    mandrill: {
      username: null,
      key: null
    },
    smtp: {
      host: null,
      port: null,
      secure: true,
      auth: {
        user: null,
        pass: process.env.SMTP_PASSWORD
      }
    }
  },
  app: {
    name: "Fluttr API"
  },
  socketServer: {
    port: process.env.SOCKET_PORT
  }
}
