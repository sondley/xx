"use strict";


module.exports = {
  sequelize: {
    database: process.env.DB_NAME || "sql10265064",
    password: process.env.DB_PASSWORD || "czlbkA6aYF",
    username: process.env.DB_USERNAME || "sql10265064",
    host: process.env.DB_HOST || "sql10.freemysqlhosting.net",
    port: process.env.DB_PORT || 3306,
    dialect: "mysql",
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
