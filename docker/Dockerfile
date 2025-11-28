FROM registry.cn-hangzhou.aliyuncs.com/dockerhub_mirror/nginx

COPY ../apps/admin/dist /data/admin
COPY ../apps/editor/dist /data/editor


RUN rm /etc/nginx/conf.d/default.conf

ADD quick-admin.conf /etc/nginx/conf.d/default.conf

RUN /bin/bash -c 'echo init ok'
