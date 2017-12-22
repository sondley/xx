"use strict";


module.exports = {
  sequelize: {
    database: 'd893j70dphfpjb' || process.env.DB_NAME,
    password: '69f185494c7941cbb7650468f86049679db132beef3d46d0954ab5162bd753f3' || process.env.DB_PASSWORD,
    username: 'lvrnxokppfmjns' || process.env.DB_USERNAME,
    host: 'ec2-184-72-228-128.compute-1.amazonaws.com' || process.env.DB_HOST,
    port: 5432 || process.env.DB_PORT,
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
  amazon: {
    s3: {
      buckets: {
        videos: 'fluttr-dev'
      },
      accessKeyId: 'AKIAIVZKXB3KSZ3JVZWQ',
      secretAccessKey: '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'
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
