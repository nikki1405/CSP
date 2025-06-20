import firebase_admin
from firebase_admin import credentials, firestore

# Initialize Firebase Admin
cred = credentials.Certificate({
   "type": "service_account",
  "project_id": "aharsetu-d0904",
  "private_key_id": "8a13a4aede615b438e160424256618f2f678c59e",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDAtDQovO7EAI6P\nIYFRu80tCoh+EKTTIyY0/hIwdBU6HqeiB+Lu3PZwWc4CrCpJc3n1pevCW8Z4VpIq\n17Adq+Dg/NMlrbcCFGIjN+Y5Bc10xN3nE/goCUimwCBNGVxwhYFUE71ouud6Zidt\n5oYuLsAdAkxd2yS7gZc0TLaFPnoDA9qCUWWXpRq/1Zp5zIrAdiEoXM23hMi0Aazq\njuAZYfAGHAiiPK+UdjgsDcJuTto/mlDXsbYbYOS7YGAmRinhQ3QsraK7Fu7o26s/\nDiYVW0UMAbcWJeRnv0JvKVBuNtpXQNYVX9Tp6ZXyzOLpP24KHRBGQ3iCKoea4itD\nB39JUTfTAgMBAAECggEAETEihCM9mU6ZaVXqZSHVmg1ErxvfW0IusESd18/Lba4l\nc3ReVRlxLQXTYMlTqSORv7jSnI+L2IQ/XG4gtWJLrkGFZD5Sw5nmRXvBC4Oj2E/l\n94MrEltTAs7E3aFZGLrNwR6qY8kPn2EKEdPNUxpy+O48ZOqI+jzYrLROsPrUGiea\ncT0eA3Sot5KjteG7aRy/3l2Hs8igjEDwS9fmg+qb4utJ2P72CoBnjipA+e9lk0HT\nzGi1Q5am7sFTcAAKvsEO7htMgQan/L2OgpmjDNUu7a22PFiex+bqB1HpftzW6JJt\nOjZcw0TcDp/R+lpQ6MgSmgSyy5tHS928ju9IdnB3qQKBgQD6VKuEJXrCUR0jc+od\nVYK6XyWxYmQIWhDOjua7OiFmcm1z1v/6BQhPV0uAf3L9rb4B4mV2ray2tcARdzjU\nB6q/aHcu9ZXltwYVD4RXUKcvpXSdJqg3mJbTz92R35dD9g55ewCet2qi/gH+YkEG\nWKkE6VEawBUQcygOlATzvVO5iwKBgQDFEW8B/TlvqiCuZunHFnRaypWWTVWg3keg\nCl6qWXiEX2NxXf8Fz7bpANBzvJ8u6+SRD/C7F4K5cVxnaF7Saw6ND7dVgnLTyh8t\nX6TD1pRDRzAoegfwyJMOs8og9xBMZwyVp8Bc8NBfrG38K60FMiiFfQNRpyr15bh5\nMyh9H+7z2QKBgEYkEUbepY3q4mo7oV6ExjNoU4xnUDYS3mCyI65UNGWbLFXn6SNp\n45EvmYUwsMypsPKgN+PP9/Pd6yo5qJ+oYkxtfe+Xel+6L6cZCPDaNW4hQxKBcWLa\ni3Bf7upfpuew+w9IyryuEeAHohFgAG5By2IH6eS/62cHjTLAgL62zs3PAoGBAMPH\n9yXdwjMarM83NOfyefQ9MXGaMQjZ7ASmaLgKnT29WpklThgi7U/83BsveGHwPyqS\n0JG+4MOFSMz/Fr0rWNBxna0ZJSUdt+2nCJT7WF6imciMu9jOG7NOkPBBI/MTqaAA\ngY6UPB/guX/+kC0KUNGVijeTwY18BNJ8Laxpjka5AoGBAOfZp2EtsDpLxjROet6T\nqj7dMy7GNiQr3VJ4SFK5z6olHh/vGd6JMC5RG2hVMwtMsJMYIB6nuo6RaIYqP3TW\nr3EERzvYOadrDwmLAvQwSa01JS8QKBIRn88fgTvfCk9rzVibC/hYfWTjSa3WeCj2\n0llzNjpPMr3q8ybw3RbkBBbh\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-fbsvc@aharsetu-d0904.iam.gserviceaccount.com",
  "client_id": "101847727209211910453",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40aharsetu-d0904.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
})

# Initialize Firebase app
firebase_app = firebase_admin.initialize_app(cred)

# Get Firestore client
db = firestore.client()
