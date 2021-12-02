generate keys and cert (you will have to provide some information)  
```console
openssl req -x509 -newkey rsa:2048 -keyout keytmp.pem -out cert.pem -days 365
```

decrypt keys (using the password you created earlier)  
```console
openssl rsa -in keytmp.pem -out key.pem
```

convert .pem to .crt
```console
openssl x509 -outform der -in cert.pem -out cert.crt
```
