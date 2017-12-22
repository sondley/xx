"use strict";


module.exports = {
  sequelize: {
    database: process.env.DB_NAME || "fluttr",
    password: process.env.DB_PASSWORD || "123",
    username: process.env.DB_USERNAME || "postgres",
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 5432,
    dialect: "postgres",
    logging: false,
    // force: true,
    // sync: true
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
      secret: process.env.JWT_SECRET || '1234',
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
        pass: process.env.SMTP_PASSWORD || null
      }
    }
  },
  app: {
    name: "Fluttr API"
  },
  socketServer: {
    port: process.env.SOCKET_PORT || 3001
  }
}
