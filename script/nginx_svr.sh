docker run -d -p 80:80 -p 2020:2020 --name nginx -v /opt/resource/nginx/conf.d/:/etc/nginx/conf.d/  -v /opt/resource/nginx/www:/usr/share/nginx/html -v /opt/resource/nginx/conf/nginx.conf:/etc/nginx/nginx.conf -v /opt/resource/nginx/logs:/var/log/nginx nginx