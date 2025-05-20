# kaas-stack


```shell
# 0. fluxcd 설치 ( 검토 후 )
# 1. postgres-operator 설치
# 2. keycloak 설치
# 3. keycloak-operator 설치
# 4. keycloak-configure 설치

kubectl create ns cocktail-auth
cat > acornstack.yaml <<\EOT
apiVersion: v1
data:
  extra-keycloak-redirect-uri-for-dashboard: http://127.0.0.1:8080/oauth2/callback/*,http://localhost:8080/oauth2/callback/*
  oidc-enabled: "true"
  root-host: 148.113.178.80
  image-registry: 15.235.66.168
kind: ConfigMap
metadata:
  name: acornstack
  namespace: cocktail-auth
EOT

kubectl apply -f /Users/bangikho/go/src/github.com/runapps/kaas-stack/console-cluster/acornstack.yaml
# 프로메테우스 알림 삭제 ( 버젼 검토 ) #

helm install -n cocktail-system postgres-operator postgres-operator
helm install -n cocktail-system postgres-operator cocktail/acorn-postgres-operator

# 인그레스 이름 자동 적 
kubectl annotate ns cocktail-system namespace.cocktailcloud.io/ingress=nginx

helm install -n cocktail-auth keycloak keycloak
helm install -n cocktail-auth keycloak cocktail/acorn-keycloak
# keycloak 접속을 위한 인그레스 인증서 작업 ( web-tls => secret)

helm install -n cocktail-auth keycloak-operator keycloak-operator
helm install -n cocktail-auth keycloak-operator cocktail/acorn-keycloak-operator


helm install -n cocktail-auth keycloak-configure keycloak-configure
helm install -n cocktail-auth keycloak-configure cocktail/acorn-keycloak-configure


```