#!/bin/bash

NC='\033[0m' # No Color
RED='\033[0;31m'     && error ()   { echo -e "${RED}$@${NC}"    ; }
ORANGE='\033[0;33m'  && warning () { echo -e "${ORANGE}$@${NC}" ; }
PURPLE='\033[0;35m'  && notice ()  { echo -e "${PURPLE}$@${NC}" ; }
CYAN='\033[0;36m'    && info ()    { echo -e "${CYAN}$@${NC}"   ; }
GREEN='\033[0;32m'   && success () { echo -e "${GREEN}$@${NC}"  ; }
BLUE='\033[0;34m'    && debug ()   { echo -e "${BLUE}$@${NC}"   ; }


pong=$(curl -XGET "http://{{consul_ip}}:8500/v1/kv/ping?raw=true&token={{consul_client_token}}")
if [ ${pong} != "pong" ] ; 
  then error "can't join Consul KV" && exit 1 ; else success "can join Consul KV ($pong)" ;
fi


while getopts "tc" option; do
case ${option} in

    t) 
      notice "update configuration from templates"
    
      # update NGINX redirect configuration files
      consul-template -template "/etc/nginx/templates/redirect.conf:/etc/nginx/conf.d/redirect.conf" -consul-addr "http://{{consul_ip}}:8500" -consul-token={{consul_client_token}} -once
      success "redirect.conf template processed"

      # update NGINX redirect configuration files
      consul-template -template "/etc/nginx/templates/upstream.conf:/etc/nginx/conf.d/upstream.conf" -consul-addr "http://{{consul_ip}}:8500" -consul-token={{consul_client_token}} -once
      success "upstream.conf template processed"

      # update NGINX services configuration files
      consul-template -template "/etc/nginx/templates/test.conf:/etc/nginx/conf.d/test.conf" -consul-addr "http://{{consul_ip}}:8500" -consul-token={{consul_client_token}} -once
      success "test.conf template processed"

      # update NGINX services configuration files
      consul-template -template "/etc/nginx/templates/maps.conf:/etc/nginx/conf.d/maps.conf" -consul-addr "http://{{consul_ip}}:8500" -consul-token={{consul_client_token}} -once
      success "maps.conf template processed"

      # update NGINX services configuration files
      consul-template -template "/etc/nginx/templates/s3.conf:/etc/nginx/conf.d/s3.conf" -consul-addr "http://{{consul_ip}}:8500" -consul-token={{consul_client_token}} -once
      success "s3.conf template processed"

    ;;

    c) 

      notice "update certificates"

      # update NGINX main configuration file
      consul-template -template "/etc/nginx/templates/nginx.conf:/etc/nginx/nginx.conf" -log-level=debug -consul-addr "http://{{consul_ip}}:8500" -consul-token={{consul_client_token}} -once
      success "nginx.conf template processed"

      # download latest recommended SSL params
      curl -s https://raw.githubusercontent.com/certbot/certbot/master/certbot-nginx/certbot_nginx/_internal/tls_configs/options-ssl-nginx.conf > "/etc/letsencrypt/options-ssl-nginx.conf"
      curl -s https://raw.githubusercontent.com/certbot/certbot/master/certbot/certbot/ssl-dhparams.pem > "/etc/letsencrypt/ssl-dhparams.pem"


      email=$(curl -XGET "http://{{consul_ip}}:8500/v1/kv/edge/certbot/email?raw=true&token={{consul_client_token}}")
      size=$(curl -XGET "http://{{consul_ip}}:8500/v1/kv/edge/certbot/rsa-key-size?raw=true&token={{consul_client_token}}")
      get_certificate () {
          debug "certbot --nginx -n --agree-tos -m $email --rsa-key-size $size --redirect -d $1" 
          certbot --nginx -n --agree-tos -m $email --rsa-key-size $size --redirect -d $1
      }

      # get certificates for all hosts
      hosts=$(curl -XGET "http://{{consul_ip}}:8500/v1/kv/edge/hosts?raw=true&token={{consul_client_token}}")
      for host in ${hosts} 
      do :
        info "get certificate for $host"
        get_certificate $host
      done

    ;;

    *) error "unknown command" ;;
    
    esac

done


cp /etc/nginx/nginx.conf /debug/nginx.conf
cp /etc/nginx/conf.d/redirect.conf /debug/redirect.conf
cp /etc/nginx/conf.d/upstream.conf /debug/upstream.conf
cp /etc/nginx/conf.d/test.conf /debug/test.conf
cp /etc/nginx/conf.d/maps.conf /debug/maps.conf
cp /etc/nginx/conf.d/s3.conf /debug/s3.conf



# reload NGINX configuration
notice "reload NGINX configuration"
nginx -s reload


