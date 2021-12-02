generate keys and cert (you will have to provide some information)  
`openssl req -x509 -newkey rsa:2048 -keyout keytmp.pem -out cert.pem -days 365`

decrypt keys (using the password you created earlier)  
`openssl rsa -in keytmp.pem -out key.pem`


