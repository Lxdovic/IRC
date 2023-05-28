# SWAGGER

# AUTH

## /register (POST)

       {
          "username": "Ludovic",
          "password": "1234"
        }

returns:

        {
          "message": "Registered successfully."
        }

a

## /login (POST)

       {
          "email": "ludovic@gmail.com",
          "password": "1234"
        }

returns:

        {
          "message": "User logged in.",
          "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imx1ZG92aWNAZ21haWwuY29tIiwiaWF0IjoxNjcyNDEwMzM2LCJleHAiOjE2NzI0MTE1MzZ9.bN8b6ruDgnqMYlxfeZShNvUtARR9fn2GDsK1qCkVrF8",
          "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJsdWRvdmljQGdtYWlsLmNvbSIsInBhc3N3b3JkIjoiJDJiJDEwJFhlUU0weVdwNlp1L1FKRHFLdEtLUS5nblE2TFNGU00xM1BWUHcvSGxIZWNNTmNVUVlteTZLIiwiaWF0IjoxNjcyNDEwMzM2fQ.maa83ky7JYMet0zU6TYKz-feU98o9XwRMwLhuAfR3x4"
        }

## /refresh (GET)

    Bearer Auth

returns:

        {
          "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imx1ZG92aWNAZ21haWwuY29tIiwiaWF0IjoxNjcyNDExMjcxLCJleHAiOjE2NzI0MTI0NzF9.fLkqPcapL33WHqNIuTJP92Koou5nmb4JxnBHECToECU"
        }
